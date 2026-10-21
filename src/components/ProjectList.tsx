import React, { useState } from 'react';
import { Project } from '../types/pmo';
import { 
  FolderPlus, 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Copy, 
  Building2, 
  User, 
  Layers, 
  Search,
  Plus
} from 'lucide-react';
import { DEFAULT_PROJECT_CHARTER, DEFAULT_WBS_TREE, DEFAULT_CPM_TASKS } from '../data/defaultData';
import { INITIAL_READINESS_CHECKLIST } from '../data/readinessChecklistData';

interface ProjectListProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onCreateProject: (newProject: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New project form state
  const [projectName, setProjectName] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [projectSponsor, setProjectSponsor] = useState('');
  const [templateType, setTemplateType] = useState<'earthworks' | 'it' | 'blank'>('earthworks');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const newId = `proj-${Date.now()}`;
    const code = projectCode.trim() || `PMO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    let initialCharter = { ...DEFAULT_PROJECT_CHARTER, projectName: projectName.trim(), projectCode: code };
    let initialWbs = DEFAULT_WBS_TREE;
    let initialCpm = DEFAULT_CPM_TASKS;

    if (projectManager.trim()) initialCharter.projectManager = projectManager.trim();
    if (projectSponsor.trim()) initialCharter.projectSponsor = projectSponsor.trim();

    if (templateType === 'it') {
      initialCharter.selectedScopeCategories = ["Software & Architecture", "Cloud & Infra", "Quality Assurance"];
      initialCharter.scopeObjectives = "Implementasi solusi digital dan otomasi proses PMO.";
    } else if (templateType === 'blank') {
      initialCharter.scopeObjectives = "";
      initialCharter.inScopeDeliverables = "";
      initialCharter.outOfScopeExclusions = "";
      initialWbs = [{
        id: `wbs-root-${Date.now()}`,
        code: "1",
        level: 1,
        name: projectName.trim(),
        durationDays: 30,
        assignedRole: "Project Manager",
        children: []
      }];
      initialCpm = [
        { id: "A", name: "Inisiasi Proyek", duration: 5, predecessors: [] },
        { id: "B", name: "Perencanaan Lingkup", duration: 10, predecessors: ["A"] }
      ];
    }

    const newProj: Project = {
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      charter: initialCharter,
      wbsTree: initialWbs,
      cpmTasks: initialCpm,
      checklistItems: INITIAL_READINESS_CHECKLIST.map(item => ({ ...item, isCompleted: false, completedAt: undefined }))
    };

    onCreateProject(newProj);
    setIsCreateModalOpen(false);
    setProjectName('');
    setProjectCode('');
    setProjectManager('');
    setProjectSponsor('');
    onSelectProject(newProj.id);
  };

  const filteredProjects = projects.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.charter.projectName.toLowerCase().includes(q) ||
      p.charter.projectCode.toLowerCase().includes(q) ||
      p.charter.projectManager.toLowerCase().includes(q) ||
      p.charter.projectSponsor.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[11px] font-bold bg-slate-900 text-white rounded">PMO SUITE</span>
            <span className="text-xs text-slate-500">Multi-Project Management</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Daftar Proyek Pre-Project</h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Pilih proyek untuk mengelola Project Charter, WBS Bertahap, Analisis CPM (Jalur Kritis), dan 40 Checklist Kesiapan Proyek.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Proyek Baru</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3 border border-slate-200 rounded-lg shadow-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama proyek, PM, sponsor, atau kode..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total: {projects.length} Proyek
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map(project => {
          const completedCount = project.checklistItems.filter(i => i.isCompleted).length;
          const totalChecklist = project.checklistItems.length || 40;
          const readinessPercent = Math.round((completedCount / totalChecklist) * 100);

          return (
            <div
              key={project.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-400 hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {project.charter.projectCode || "PMO-CODE"}
                  </span>
                  <div className="flex items-center gap-1">
                    {projects.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Hapus proyek "${project.charter.projectName}"?`)) {
                            onDeleteProject(project.id);
                          }
                        }}
                        className="text-slate-400 hover:text-red-600 p-1 rounded"
                        title="Hapus Proyek"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-900 transition-colors">
                  {project.charter.projectName || "Proyek Tanpa Nama"}
                </h3>

                {/* Meta details */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-500">PM:</span>
                    <span className="font-medium text-slate-800 truncate">{project.charter.projectManager || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-500">Sponsor:</span>
                    <span className="font-medium text-slate-800 truncate">{project.charter.projectSponsor || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-slate-500">Periode:</span>
                    <span className="text-slate-700 text-[11px] font-mono">
                      {project.charter.startDate || "TBD"} s/d {project.charter.targetEndDate || "TBD"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Progress & Enter Button */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                {/* Readiness status */}
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Status Kesiapan (Readiness):</span>
                    <span className="font-bold text-slate-900">{completedCount}/{totalChecklist} ({readinessPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-900 h-full rounded-full transition-all"
                      style={{ width: `${readinessPercent}%` }}
                    />
                  </div>
                </div>

                {/* Enter Button */}
                <button
                  type="button"
                  onClick={() => onSelectProject(project.id)}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 rounded text-xs font-semibold text-slate-800 transition flex items-center justify-center gap-1.5"
                >
                  <span>Buka Proyek</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE NEW PROJECT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Buat Proyek Pre-Project Baru</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Proyek <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="e.g. Proyek Pembangunan Jetty & Fasilitas Dermaga"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kode Proyek (Opsional)
                  </label>
                  <input
                    type="text"
                    value={projectCode}
                    onChange={e => setProjectCode(e.target.value)}
                    placeholder="e.g. PMO-2026-095"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Template Awal
                  </label>
                  <select
                    value={templateType}
                    onChange={e => setTemplateType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="earthworks">Pekerjaan Sipil & Pengerukan</option>
                    <option value="it">Implementasi IT & Sistem</option>
                    <option value="blank">Kosong (Mulai dari Nol)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Project Manager (PM)
                  </label>
                  <input
                    type="text"
                    value={projectManager}
                    onChange={e => setProjectManager(e.target.value)}
                    placeholder="Nama PM"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Project Sponsor
                  </label>
                  <input
                    type="text"
                    value={projectSponsor}
                    onChange={e => setProjectSponsor(e.target.value)}
                    placeholder="Nama Sponsor / Direksi"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium shadow-xs"
                >
                  Simpan & Buka Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
