import { CPMTask, CPMCalculationResult, CrashingRecommendation } from '../types/pmo';

export function calculateCPM(inputTasks: CPMTask[], targetDurationInput?: number): CPMCalculationResult {
  if (!inputTasks || inputTasks.length === 0) {
    return {
      tasks: [],
      criticalPath: [],
      totalDuration: 0,
      targetDuration: targetDurationInput || 0,
      durationVariance: 0,
      criticalTasksCount: 0,
      nonCriticalTasksCount: 0,
      averageSlack: 0,
      crashingRecommendations: [],
      hasCycle: false,
    };
  }

  // Clone tasks
  const taskMap = new Map<string, CPMTask>();
  const inDegree = new Map<string, number>();
  const successorsMap = new Map<string, string[]>();

  inputTasks.forEach(task => {
    taskMap.set(task.id, {
      ...task,
      duration: Math.max(0, Number(task.duration) || 0),
      predecessors: Array.isArray(task.predecessors) ? task.predecessors.filter(p => p && p !== task.id) : [],
      es: 0,
      ef: 0,
      ls: 0,
      lf: 0,
      slack: 0,
      freeSlack: 0,
      isCritical: false,
    });
    inDegree.set(task.id, 0);
    successorsMap.set(task.id, []);
  });

  // Filter valid predecessors that exist in taskMap
  taskMap.forEach(task => {
    task.predecessors = task.predecessors.filter(pId => taskMap.has(pId));
    task.predecessors.forEach(predId => {
      const currentSuccessors = successorsMap.get(predId) || [];
      currentSuccessors.push(task.id);
      successorsMap.set(predId, currentSuccessors);
    });
  });

  taskMap.forEach(task => {
    inDegree.set(task.id, task.predecessors.length);
  });

  // Kahn's algorithm for topological sorting
  const queue: string[] = [];
  inDegree.forEach((degree, taskId) => {
    if (degree === 0) {
      queue.push(taskId);
    }
  });

  const topoOrder: string[] = [];
  const inDegreeCopy = new Map(inDegree);

  while (queue.length > 0) {
    const current = queue.shift()!;
    topoOrder.push(current);

    const succs = successorsMap.get(current) || [];
    succs.forEach(succId => {
      const count = (inDegreeCopy.get(succId) || 0) - 1;
      inDegreeCopy.set(succId, count);
      if (count === 0) {
        queue.push(succId);
      }
    });
  }

  const hasCycle = topoOrder.length !== taskMap.size;
  if (hasCycle) {
    return {
      tasks: Array.from(taskMap.values()),
      criticalPath: [],
      totalDuration: 0,
      targetDuration: targetDurationInput || 0,
      durationVariance: 0,
      criticalTasksCount: 0,
      nonCriticalTasksCount: 0,
      averageSlack: 0,
      crashingRecommendations: [],
      hasCycle: true,
    };
  }

  // 1. FORWARD PASS (in Weeks)
  topoOrder.forEach(taskId => {
    const task = taskMap.get(taskId)!;
    if (task.predecessors.length === 0) {
      task.es = 0;
    } else {
      let maxPredecessorEF = 0;
      task.predecessors.forEach(pId => {
        const pred = taskMap.get(pId);
        if (pred && (pred.ef || 0) > maxPredecessorEF) {
          maxPredecessorEF = pred.ef || 0;
        }
      });
      task.es = maxPredecessorEF;
    }
    task.ef = (task.es || 0) + task.duration;
  });

  // Total project duration is maximum EF
  let calculatedDuration = 0;
  taskMap.forEach(task => {
    if ((task.ef || 0) > calculatedDuration) {
      calculatedDuration = task.ef || 0;
    }
  });

  // Use target duration if specified by user and >= 1, otherwise use calculated duration
  const targetDuration = (targetDurationInput && targetDurationInput > 0)
    ? targetDurationInput
    : calculatedDuration;

  const durationVariance = targetDuration - calculatedDuration;

  // 2. BACKWARD PASS (in reverse topological order)
  const reversedTopo = [...topoOrder].reverse();
  reversedTopo.forEach(taskId => {
    const task = taskMap.get(taskId)!;
    const succs = successorsMap.get(taskId) || [];

    if (succs.length === 0) {
      task.lf = targetDuration;
    } else {
      let minSuccessorLS = Infinity;
      succs.forEach(sId => {
        const succ = taskMap.get(sId);
        if (succ && (succ.ls ?? Infinity) < minSuccessorLS) {
          minSuccessorLS = succ.ls!;
        }
      });
      task.lf = minSuccessorLS === Infinity ? targetDuration : minSuccessorLS;
    }
    task.ls = (task.lf || 0) - task.duration;

    // Total Float (Slack in Weeks)
    task.slack = (task.ls || 0) - (task.es || 0);

    // Free Float: min(ES of successors) - EF
    if (succs.length === 0) {
      task.freeSlack = Math.max(0, targetDuration - (task.ef || 0));
    } else {
      let minSuccES = Infinity;
      succs.forEach(sId => {
        const succ = taskMap.get(sId);
        if (succ && (succ.es ?? Infinity) < minSuccES) {
          minSuccES = succ.es!;
        }
      });
      task.freeSlack = Math.max(0, (minSuccES === Infinity ? targetDuration : minSuccES) - (task.ef || 0));
    }

    // Critical check: task on critical path has minimal slack (slack <= variance or slack == minSlack)
    // When targetDuration == calculatedDuration, slack == 0
    task.isCritical = Math.abs(task.slack - Math.min(0, durationVariance)) < 0.001 || (durationVariance >= 0 && Math.abs(task.slack - durationVariance) < 0.001 && task.duration > 0);
  });

  // Find min slack across all tasks to reliably identify critical path
  let minSlack = Infinity;
  taskMap.forEach(t => {
    if ((t.slack ?? 0) < minSlack) minSlack = t.slack ?? 0;
  });
  taskMap.forEach(t => {
    if (Math.abs((t.slack ?? 0) - minSlack) < 0.001) {
      t.isCritical = true;
    } else {
      t.isCritical = false;
    }
  });

  const criticalTasks = topoOrder
    .map(id => taskMap.get(id)!)
    .filter(t => t.isCritical);

  const criticalPathIds = criticalTasks.map(t => t.id);

  const nonCritical = Array.from(taskMap.values()).filter(t => !t.isCritical);
  const totalSlackSum = nonCritical.reduce((acc, t) => acc + (t.slack || 0), 0);
  const averageSlack = nonCritical.length > 0 ? Math.round((totalSlackSum / nonCritical.length) * 10) / 10 : 0;

  // Crashing recommendations in WEEKS
  const crashingRecommendations: CrashingRecommendation[] = [];
  criticalTasks.forEach(task => {
    if (task.duration >= 2) {
      const maxReduction = Math.max(1, Math.floor(task.duration * 0.4));
      crashingRecommendations.push({
        taskId: task.id,
        taskName: task.name,
        currentDuration: task.duration,
        recommendedMaxReduction: maxReduction,
        rationale: `Aktivitas kritis pada jalur utama. Mempercepat 1-${maxReduction} minggu (tambah tim/alat) langsung memajukan jadwal akhir proyek.`,
        priority: task.duration >= 6 ? 'Tinggi' : task.duration >= 3 ? 'Sedang' : 'Rendah'
      });
    }
  });

  crashingRecommendations.sort((a, b) => b.currentDuration - a.currentDuration);

  return {
    tasks: topoOrder.map(id => taskMap.get(id)!),
    criticalPath: criticalPathIds,
    totalDuration: calculatedDuration,
    targetDuration,
    durationVariance,
    criticalTasksCount: criticalTasks.length,
    nonCriticalTasksCount: nonCritical.length,
    averageSlack,
    crashingRecommendations,
    hasCycle: false,
  };
}
