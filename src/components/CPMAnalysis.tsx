import React, { useState, useMemo } from 'react';
import { CPMTask } from '../types/pmo';
import { calculateCPM } from '../utils/cpmCalculator';
import { DEFAULT_CPM_TASKS } from '../data/defaultData';
import { 
  Network, 
  GitCommit, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Sliders, 
  CheckCircle2, 
  BarChart2, 
  Flame, 
  HelpCircle, 
  ArrowRight, 
  ShieldAlert, 
  Check, 
  Target, 
  CalendarDays 
} from 'lucide-react';

interface CPMAnalysisProps {
  tasks: CPMTask[];
  onUpdateTasks: (tasks: CPMTask[]) => void;
  targetDurationWeeks?: number;
  onUpdateTargetDuration?: (weeks: number) => void;
}

export const CPMAnalysis: React.FC<CPMAnalysisProps> = ({
  tasks,
  onUpdateTasks,
  targetDurationWeeks: initialTargetWeeks = 24,
  onUpdateTargetDuration,
}) => {
  const [activeView, setActiveView] = useState<'network' | 'gantt' | 'table'>('network');
  const [targetWeeks, setTargetWeeks] = useState<number>(initialTargetWeeks || 24);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDuration, setNewTaskDuration] = useState(2); // in weeks
  const [newTaskPredecessors, setNewTaskPredecessors] = useState<string[]>([]);
  const [showConceptGuide, setShowConceptGuide] = useState(true);

  // Background CPM Calculation using target duration in weeks
  const cpmResult = useMemo(() => {
    return calculateCPM(tasks, targetWeeks);
  }, [tasks, targetWeeks]);

  const {
    tasks: calculatedTasks,
    criticalPath,
    totalDuration,
    targetDuration,
    durationVariance,
    criticalTasksCount,
    nonCriticalTasksCount,
    averageSlack,
    crashingRecommendations,
    hasCycle,
  } = cpmResult;

  const handleTargetWeeksChange = (val: number) => {
    const valid = Math.max(1, val || 1);
    setTargetWeeks(valid);
    if (onUpdateTargetDuration) {
      onUpdateTargetDuration(valid);
    }
  };

  // Task field changes
  const handleUpdateTaskField = (id: string, field: keyof CPMTask, value: any) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        return { ...t, [field]: value };
      }
      return t;
    });
    onUpdateTasks(updated);
  };

  // Predecessor toggle
  const togglePredecessor = (taskId: string, predId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const exists = task.predecessors.includes(predId);
    const updatedPreds = exists
      ? task.predecessors.filter(p => p !== predId)
      : [...task.predecessors, predId];
    handleUpdateTaskField(taskId, 'predecessors', updatedPreds);
  };

  // Add new task
  const handleAddTask = () => {
    if (!newTaskName.trim()) return;

    const existingIds = new Set(tasks.map(t => t.id));
    let nextId = 'A';
    for (let i = 0; i < 26; i++) {
      const candidate = String.fromCharCode(65 + i);
      if (!existingIds.has(candidate)) {
        nextId = candidate;
        break;
      }
    }
    if (existingIds.has(nextId)) {
      nextId = `T${tasks.length + 1}`;
    }

    const newTask: CPMTask = {
      id: nextId,
      name: newTaskName.trim(),
      duration: Math.max(1, newTaskDuration),
      predecessors: [...newTaskPredecessors],
    };

    onUpdateTasks([...tasks, newTask]);
    setNewTaskName('');
    setNewTaskDuration(2);
    setNewTaskPredecessors([]);
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    const remaining = tasks
      .filter(t => t.id !== id)
      .map(t => ({
        ...t,
        predecessors: t.predecessors.filter(p => p !== id),
      }));
    onUpdateTasks(remaining);
  };

  // SVG Coordinates Layout for Network Diagram (arranged in Weeks)
  const nodeLayout = useMemo(() => {
    if (hasCycle || calculatedTasks.length === 0) return { nodesWithPos: [], edges: [], width: 900, height: 400 };

    const columnMap = new Map<number, typeof calculatedTasks>();
    const distinctES = Array.from(new Set(calculatedTasks.map(t => t.es || 0))).sort((a, b) => a - b);
    const esToCol = new Map<number, number>();
    distinctES.forEach((es, idx) => esToCol.set(es, idx));

    calculatedTasks.forEach(task => {
      const col = esToCol.get(task.es || 0) || 0;
      if (!columnMap.has(col)) {
        columnMap.set(col, []);
      }
      columnMap.get(col)!.push(task);
    });

    const nodeWidth = 160;
    const nodeHeight = 88;
    const colGap = 90;
    const rowGap = 35;
    const paddingX = 50;
    const paddingY = 40;

    let maxColIndex = 0;
    let maxRowSize = 1;

    columnMap.forEach((tasksInCol, col) => {
      if (col > maxColIndex) maxColIndex = col;
      if (tasksInCol.length > maxRowSize) maxRowSize = tasksInCol.length;
    });

    const totalSvgWidth = Math.max(860, (maxColIndex + 1) * (nodeWidth + colGap) + paddingX * 2);
    const totalSvgHeight = Math.max(380, maxRowSize * (nodeHeight + rowGap) + paddingY * 2);

    const positions = new Map<string, { x: number; y: number; task: CPMTask }>();

    columnMap.forEach((tasksInCol, col) => {
      const x = paddingX + col * (nodeWidth + colGap);
      const totalColHeight = tasksInCol.length * nodeHeight + (tasksInCol.length - 1) * rowGap;
      const startY = Math.max(paddingY, (totalSvgHeight - totalColHeight) / 2);

      tasksInCol.forEach((task, rowIdx) => {
        const y = startY + rowIdx * (nodeHeight + rowGap);
        positions.set(task.id, { x, y, task });
      });
    });

    // Edges
    const edges: {
      fromId: string;
      toId: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      isCritical: boolean;
    }[] = [];

    calculatedTasks.forEach(task => {
      const toPos = positions.get(task.id);
      if (!toPos) return;

      task.predecessors.forEach(predId => {
        const fromPos = positions.get(predId);
        if (!fromPos) return;

        const isCriticalEdge = Boolean(
          fromPos.task.isCritical && 
          toPos.task.isCritical && 
          (fromPos.task.ef === toPos.task.es)
        );

        edges.push({
          fromId: predId,
          toId: task.id,
          x1: fromPos.x + nodeWidth,
          y1: fromPos.y + nodeHeight / 2,
          x2: toPos.x,
          y2: toPos.y + nodeHeight / 2,
          isCritical: isCriticalEdge,
        });
      });
    });

    return {
      nodesWithPos: Array.from(positions.values()),
      edges,
      width: totalSvgWidth,
      height: totalSvgHeight,
      nodeWidth,
      nodeHeight,
    };
  }, [calculatedTasks, hasCycle]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Analisis CPM & Jalur Kritis</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Durasi dalam satuan <strong>Minggu</strong>, perhitungan instan ES, EF, LS, LF, dan penetapan Target Total Durasi Proyek di awal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center border border-slate-200 rounded p-0.5 bg-slate-50 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveView('network')}
              className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
                activeView === 'network'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Diagram CPM</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('gantt')}
              className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
                activeView === 'gantt'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Jadwal Gantt</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('table')}
              className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
                activeView === 'table'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Input Tabel</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm("Reset tugas CPM ke data contoh standar?")) {
                onUpdateTasks(DEFAULT_CPM_TASKS);
              }
            }}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200 text-xs flex items-center gap-1"
            title="Reset data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* TARGET DURASI PROYEK DI AWAL (BAR BARU DI ATAS) */}
      <div className="bg-[#0B3B60] text-white rounded-lg p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-white/10 text-cyan-300">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide">Target Total Durasi Proyek (Ditentukan di Awal)</h3>
            <p className="text-xs text-cyan-200 mt-0.5">
              Masukkan target durasi proyek untuk langsung menjalankan backward pass (LF/LS) dan melihat sisa cadangan waktu (slack).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto bg-white/10 p-2 rounded border border-white/20">
          <span className="text-xs font-semibold text-white">Target Proyek:</span>
          <div className="flex items-center gap-1 bg-white rounded px-2.5 py-1 text-slate-900">
            <input
              type="number"
              min={1}
              value={targetWeeks}
              onChange={e => handleTargetWeeksChange(parseInt(e.target.value) || 1)}
              className="w-14 text-sm font-bold font-mono focus:outline-none text-center"
            />
            <span className="text-xs font-bold text-slate-600">Minggu</span>
          </div>

          {/* Variance Badge */}
          <div className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
            durationVariance >= 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}>
            {durationVariance >= 0 ? `+${durationVariance} mg Buffer` : `${durationVariance} mg Terlambat`}
          </div>
        </div>
      </div>

      {/* PANDUAN ISTILAH CPM (BAHASA SEDERHANA) */}
      {showConceptGuide && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 text-xs text-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Panduan Rumus & Istilah CPM (Satuan Minggu):
            </span>
            <button
              type="button"
              onClick={() => setShowConceptGuide(false)}
              className="text-[11px] text-blue-700 hover:underline"
            >
              Sembunyikan Panduan
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1 text-[11px]">
            <div className="bg-white p-2.5 rounded border border-blue-100 shadow-2xs">
              <strong className="text-slate-900 block font-semibold mb-0.5">Predecessors (Pendahulu):</strong>
              Pekerjaan yang wajib selesai sebelum pekerjaan ini dapat dimulai.
            </div>
            <div className="bg-white p-2.5 rounded border border-blue-100 shadow-2xs">
              <strong className="text-slate-900 block font-semibold mb-0.5">ES / EF (Minggu):</strong>
              Jadwal paling cepat pekerjaan bisa dimulai (ES) dan diselesaikan (EF).
            </div>
            <div className="bg-white p-2.5 rounded border border-blue-100 shadow-2xs">
              <strong className="text-slate-900 block font-semibold mb-0.5">LS / LF (Minggu):</strong>
              Batas paling lambat pekerjaan bisa dimulai (LS) & selesai (LF) tanpa membuat target molor.
            </div>
            <div className="bg-white p-2.5 rounded border border-blue-100 shadow-2xs">
              <strong className="text-slate-900 block font-semibold mb-0.5">Slack / Buffer (Minggu):</strong>
              Waktu toleransi aman (LF - EF atau LS - ES). Jika Slack = 0, pekerjaan tersebut KRITIS!
            </div>
          </div>
        </div>
      )}

      {/* Cycle Alert */}
      {hasCycle && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-xs text-red-800">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Terjadi Ketergantungan Melingkar (Circular Loop)!</p>
            <p className="text-red-700 mt-0.5">
              Ada pekerjaan yang saling mendahului (misal: A membutuhkan B, dan B membutuhkan A). Mohon perbaiki Predecessor pada tabel di bawah.
            </p>
          </div>
        </div>
      )}

      {/* RINGKASAN OTOMATIS (KPI UTAMA DALAM MINGGU) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Durasi Terhitung (Jalur Kritis) */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Durasi Jalur Kritis</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{totalDuration}</span>
            <span className="text-xs text-slate-600 font-semibold">Minggu</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Waktu tercepat seluruh proyek bisa selesai
          </p>
        </div>

        {/* Jalur Kritis (0 Hari/Minggu Buffer) */}
        <div className="bg-red-50/50 border border-red-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-red-800 mb-1">
            <span className="font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              Jalur Kritis (Tidak Boleh Terlambat)
            </span>
          </div>
          <div className="text-xs font-bold font-mono text-red-700 truncate tracking-wide mt-1">
            {criticalPath.length > 0 ? criticalPath.join(' → ') : 'Tidak Ada'}
          </div>
          <p className="text-[11px] text-red-700 mt-1">
            <strong>{criticalTasksCount} Pekerjaan Kritis:</strong> Setiap keterlambatan 1 minggu akan memundurkan proyek!
          </p>
        </div>

        {/* Buffer Aman Proyek */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Cadangan Waktu (Buffer)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-3xl font-bold tracking-tight ${
              durationVariance >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}>
              {durationVariance >= 0 ? `+${durationVariance}` : durationVariance}
            </span>
            <span className="text-xs text-slate-600 font-semibold">Minggu</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {durationVariance >= 0 ? 'Proyek selesai sebelum target deadline' : 'Proyek melewati batas target!'}
          </p>
        </div>

        {/* Crashing Potential */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Peluang Percepatan (Crashing)</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{crashingRecommendations.length}</span>
            <span className="text-xs text-slate-600 font-semibold">Pekerjaan</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Aktivitas jalur kritis yang siap dipersingkat
          </p>
        </div>
      </div>

      {/* DIAGRAM CPM ALUR NODE & PANAH DALAM MINGGU */}
      {activeView === 'network' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Diagram CPM Alur Node & Panah (Satuan Minggu)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Node dan panah berwarna <strong className="text-red-600 font-bold">MERAH TEBAL</strong> adalah <strong>Jalur Kritis</strong>. Node putih/abu memiliki cadangan waktu (slack).
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded">
              <span className="flex items-center gap-1.5 font-bold text-red-700">
                <span className="w-3 h-3 bg-red-600 rounded-xs"></span>
                <span>Jalur Kritis (0 mg Slack)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 bg-white border border-slate-400 rounded-xs"></span>
                <span>Non-Kritis (Ada Buffer)</span>
              </span>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="overflow-x-auto p-4 bg-slate-50/60 rounded-lg border border-slate-100 min-h-[380px]">
            <svg
              width={nodeLayout.width}
              height={nodeLayout.height}
              className="mx-auto block"
              style={{ minWidth: '100%' }}
            >
              <defs>
                <marker
                  id="arrow-regular"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <polygon points="0 1, 7 4, 0 7" fill="#94a3b8" />
                </marker>
                <marker
                  id="arrow-critical"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="4"
                  orient="auto"
                >
                  <polygon points="0 0.5, 9 4, 0 7.5" fill="#dc2626" />
                </marker>
              </defs>

              {/* Edge Connecting Lines */}
              {nodeLayout.edges.map((edge, idx) => {
                const midX = (edge.x1 + edge.x2) / 2;
                const pathD = `M ${edge.x1} ${edge.y1} C ${midX} ${edge.y1}, ${midX} ${edge.y2}, ${edge.x2} ${edge.y2}`;
                return (
                  <path
                    key={`edge-${idx}`}
                    d={pathD}
                    fill="none"
                    stroke={edge.isCritical ? '#dc2626' : '#cbd5e1'}
                    strokeWidth={edge.isCritical ? 3 : 1.5}
                    markerEnd={edge.isCritical ? 'url(#arrow-critical)' : 'url(#arrow-regular)'}
                  />
                );
              })}

              {/* Task Nodes */}
              {nodeLayout.nodesWithPos.map(({ x, y, task }) => {
                const isCrit = task.isCritical;
                return (
                  <g key={`node-${task.id}`} transform={`translate(${x}, ${y})`}>
                    <rect
                      width={nodeLayout.nodeWidth}
                      height={nodeLayout.nodeHeight}
                      rx="6"
                      fill={isCrit ? '#fef2f2' : '#ffffff'}
                      stroke={isCrit ? '#dc2626' : '#cbd5e1'}
                      strokeWidth={isCrit ? 2.5 : 1.5}
                      className="shadow-xs"
                    />

                    {/* Top Row: ES | Durasi | EF */}
                    <rect
                      x="0"
                      y="0"
                      width={nodeLayout.nodeWidth}
                      height="22"
                      rx="6"
                      fill={isCrit ? '#fee2e2' : '#f1f5f9'}
                    />
                    <line x1="0" y1="22" x2={nodeLayout.nodeWidth} y2="22" stroke={isCrit ? '#fca5a5' : '#e2e8f0'} strokeWidth="1" />
                    <line x1="48" y1="0" x2="48" y2="22" stroke={isCrit ? '#fca5a5' : '#e2e8f0'} strokeWidth="1" />
                    <line x1="112" y1="0" x2="112" y2="22" stroke={isCrit ? '#fca5a5' : '#e2e8f0'} strokeWidth="1" />

                    <text x="24" y="15" textAnchor="middle" fontSize="10" fontWeight="600" fill={isCrit ? '#991b1b' : '#334155'}>
                      ES: {task.es}
                    </text>
                    <text x="80" y="15" textAnchor="middle" fontSize="10" fontWeight="bold" fill={isCrit ? '#991b1b' : '#1e293b'}>
                      {task.duration} mg
                    </text>
                    <text x="136" y="15" textAnchor="middle" fontSize="10" fontWeight="600" fill={isCrit ? '#991b1b' : '#334155'}>
                      EF: {task.ef}
                    </text>

                    {/* Middle: ID & Activity Name */}
                    <text x="14" y="45" fontSize="14" fontWeight="bold" fill={isCrit ? '#b91c1c' : '#0f172a'}>
                      {task.id}
                    </text>
                    <text
                      x="34"
                      y="45"
                      fontSize="10"
                      fontWeight="600"
                      fill="#1e293b"
                    >
                      {task.name.length > 18 ? `${task.name.substring(0, 17)}…` : task.name}
                    </text>

                    {/* Bottom Row: LS | Buffer/Slack | LF */}
                    <line x1="0" y1="65" x2={nodeLayout.nodeWidth} y2="65" stroke={isCrit ? '#fca5a5' : '#e2e8f0'} strokeWidth="1" />
                    <line x1="48" y1="65" x2="48" y2="88" stroke={isCrit ? '#fca5a5' : '#e2e8f0'} strokeWidth="1" />
                    <line x1="112" y1="65" x2="112" y2="88" stroke={isCrit ? '#fca5a5' : '#e2e8f0'} strokeWidth="1" />

                    <text x="24" y="80" textAnchor="middle" fontSize="9.5" fill={isCrit ? '#991b1b' : '#64748b'}>
                      LS: {task.ls}
                    </text>
                    <text
                      x="80"
                      y="80"
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="bold"
                      fill={isCrit ? '#dc2626' : '#059669'}
                    >
                      {isCrit ? 'KRITIS' : `Sisa: ${task.slack} mg`}
                    </text>
                    <text x="136" y="80" textAnchor="middle" fontSize="9.5" fill={isCrit ? '#991b1b' : '#64748b'}>
                      LF: {task.lf}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* JADWAL GANTT TIMELINE DALAM MINGGU */}
      {activeView === 'gantt' && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Jadwal Timeline Gantt Chart (Skala Minggu)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Skala waktu dari Minggu 0 hingga batas Target Proyek ({targetWeeks} Minggu).
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <div className="min-w-[700px] p-4 space-y-3">
              <div className="flex items-center text-[10px] text-slate-400 font-mono pb-2 border-b border-slate-200">
                <div className="w-52 shrink-0 font-semibold text-slate-600">Aktivitas</div>
                <div className="w-20 shrink-0 text-center">Durasi</div>
                <div className="flex-1 flex justify-between px-1">
                  <span>M-0</span>
                  <span>M-{Math.round(targetWeeks * 0.25)}</span>
                  <span>M-{Math.round(targetWeeks * 0.5)}</span>
                  <span>M-{Math.round(targetWeeks * 0.75)}</span>
                  <span className="font-bold text-slate-900">M-{targetWeeks} (Target)</span>
                </div>
              </div>

              {calculatedTasks.map(task => {
                const totalScale = Math.max(1, targetWeeks, totalDuration);
                const startPercent = ((task.es || 0) / totalScale) * 100;
                const durationPercent = (task.duration / totalScale) * 100;
                const slackPercent = ((task.slack || 0) / totalScale) * 100;

                return (
                  <div key={task.id} className="flex items-center text-xs">
                    <div className="w-52 shrink-0 truncate pr-2 font-medium flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded text-[11px] font-mono flex items-center justify-center shrink-0 ${
                        task.isCritical ? 'bg-red-600 text-white font-bold' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {task.id}
                      </span>
                      <span className="truncate text-slate-800" title={task.name}>{task.name}</span>
                    </div>

                    <div className="w-20 shrink-0 text-center font-mono text-[11px] text-slate-600">
                      {task.duration} Minggu
                    </div>

                    <div className="flex-1 relative h-6 bg-slate-50 rounded flex items-center px-1">
                      <div
                        className={`absolute h-4 rounded text-[10px] text-white flex items-center justify-center font-mono font-medium shadow-xs ${
                          task.isCritical ? 'bg-red-600 font-bold' : 'bg-slate-700'
                        }`}
                        style={{
                          left: `${startPercent}%`,
                          width: `${Math.max(durationPercent, 2)}%`,
                        }}
                      >
                        {task.duration >= 2 ? `${task.duration} mg` : ''}
                      </div>

                      {Boolean(task.slack && task.slack > 0) && (
                        <div
                          className="absolute h-4 rounded border border-dashed border-slate-400 bg-slate-200/70 text-[9px] text-slate-600 flex items-center justify-center font-mono"
                          style={{
                            left: `${startPercent + durationPercent}%`,
                            width: `${slackPercent}%`,
                          }}
                        >
                          {(task.slack ?? 0) >= 2 ? `+${task.slack} mg` : ''}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* INPUT SEDERHANA: NAMA, DURASI (MINGGU), PREDECESSORS */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Input Aktivitas & Perhitungan ES, EF, LS, LF (Satuan Minggu)
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Semua perhitungan ES, EF, LS, LF, dan Slack berjalan seketika saat durasi atau predecessor diubah.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {calculatedTasks.length} Aktivitas
          </span>
        </div>

        {/* Tabel Input */}
        <div className="overflow-x-auto border border-slate-200 rounded">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B3B60] text-white text-[11px]">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">ID</th>
                <th className="py-2.5 px-3">Nama Aktivitas Pekerjaan</th>
                <th className="py-2.5 px-3 w-32">Durasi (Minggu)</th>
                <th className="py-2.5 px-3 w-56">Predecessors (Pendahulu)</th>
                <th className="py-2.5 px-2 w-16 text-center">ES (mg)</th>
                <th className="py-2.5 px-2 w-16 text-center">EF (mg)</th>
                <th className="py-2.5 px-2 w-16 text-center">LS (mg)</th>
                <th className="py-2.5 px-2 w-16 text-center">LF (mg)</th>
                <th className="py-2.5 px-2 w-24 text-center">Slack Buffer</th>
                <th className="py-2.5 px-3 w-28 text-center">Status</th>
                <th className="py-2.5 px-2 w-10 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {calculatedTasks.map(task => (
                <tr
                  key={task.id}
                  className={`hover:bg-slate-50/70 ${
                    task.isCritical ? 'bg-red-50/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 text-center font-bold font-mono">
                    <span className={`inline-block w-6 h-6 rounded flex items-center justify-center text-xs ${
                      task.isCritical ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {task.id}
                    </span>
                  </td>

                  <td className="py-2.5 px-3">
                    <input
                      type="text"
                      value={task.name}
                      onChange={e => handleUpdateTaskField(task.id, 'name', e.target.value)}
                      className="w-full text-xs bg-transparent border border-transparent hover:border-slate-300 focus:border-slate-800 rounded px-1.5 py-1 focus:bg-white focus:outline-none"
                    />
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={0}
                        value={task.duration}
                        onChange={e =>
                          handleUpdateTaskField(task.id, 'duration', Math.max(0, parseInt(e.target.value) || 0))
                        }
                        className="w-16 text-xs font-mono font-bold border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                      <span className="text-[11px] text-slate-500 font-semibold">mg</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-3">
                    <div className="flex flex-wrap items-center gap-1">
                      {tasks
                        .filter(t => t.id !== task.id)
                        .map(candidate => {
                          const isSelected = task.predecessors.includes(candidate.id);
                          return (
                            <button
                              key={candidate.id}
                              type="button"
                              onClick={() => togglePredecessor(task.id, candidate.id)}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                                isSelected
                                  ? 'bg-slate-900 text-white font-bold'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                              title={`Tergantung pada: ${candidate.name}`}
                            >
                              {candidate.id}
                            </button>
                          );
                        })}
                    </div>
                  </td>

                  <td className="py-2.5 px-2 text-center font-mono text-slate-700">{task.es}</td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-700">{task.ef}</td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-700">{task.ls}</td>
                  <td className="py-2.5 px-2 text-center font-mono text-slate-700">{task.lf}</td>

                  <td className={`py-2.5 px-2 text-center font-mono font-bold ${
                    task.isCritical ? 'text-red-600' : 'text-emerald-700'
                  }`}>
                    {task.slack} mg
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    {task.isCritical ? (
                      <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 rounded text-[10px] font-bold">
                        KRITIS
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-medium">
                        Ada Slack
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Add Form in Weeks */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
          <p className="font-semibold text-slate-700">Tambah Aktivitas Baru (Satuan Minggu):</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={newTaskName}
              onChange={e => setNewTaskName(e.target.value)}
              placeholder="Nama Aktivitas (misal: Uji Hydrotest Jaringan)"
              className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <div className="flex items-center gap-1 border border-slate-300 rounded px-2 py-1.5 bg-white">
              <span className="text-[11px] text-slate-500 font-medium">Durasi:</span>
              <input
                type="number"
                min={1}
                value={newTaskDuration}
                onChange={e => setNewTaskDuration(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-xs font-mono font-bold focus:outline-none"
              />
              <span className="text-[11px] text-slate-600 font-semibold">minggu</span>
            </div>

            <button
              type="button"
              onClick={handleAddTask}
              className="px-3.5 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>
        </div>
      </div>

      {/* REKOMENDASI PERCEPATAN DALAM MINGGU */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Rekomendasi Percepatan Proyek (Crashing Paths dalam Minggu)
            </h3>
            <p className="text-[11px] text-slate-500">
              Mempercepat aktivitas kritis berikut akan langsung memajukan tanggal target penyelesaian proyek.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {crashingRecommendations.map(rec => (
            <div
              key={rec.taskId}
              className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 hover:bg-white transition flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                    Tugas {rec.taskId}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Prioritas {rec.priority}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1">{rec.taskName}</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Durasi saat ini <strong>{rec.currentDuration} minggu</strong>. Rekomendasi crashing hingga <strong>{rec.recommendedMaxReduction} minggu</strong> lebih cepat.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] flex items-center justify-between text-slate-700">
                <span>Durasi: <strong>{rec.currentDuration} mg</strong></span>
                <span className="text-emerald-700 font-bold">
                  Bisa Dipotong: {rec.recommendedMaxReduction} mg
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
