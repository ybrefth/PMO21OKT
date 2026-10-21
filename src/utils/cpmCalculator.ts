import { CPMTask, CPMCalculationResult, CrashingRecommendation } from '../types/pmo';

export function calculateCPM(inputTasks: CPMTask[]): CPMCalculationResult {
  if (!inputTasks || inputTasks.length === 0) {
    return {
      tasks: [],
      criticalPath: [],
      totalDuration: 0,
      criticalTasksCount: 0,
      nonCriticalTasksCount: 0,
      averageSlack: 0,
      crashingRecommendations: [],
      hasCycle: false,
    };
  }

  // Clone tasks to avoid mutating props directly
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

  // Kahn's algorithm for topological sorting and cycle detection
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
      criticalTasksCount: 0,
      nonCriticalTasksCount: 0,
      averageSlack: 0,
      crashingRecommendations: [],
      hasCycle: true,
    };
  }

  // 1. FORWARD PASS
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
  let totalDuration = 0;
  taskMap.forEach(task => {
    if ((task.ef || 0) > totalDuration) {
      totalDuration = task.ef || 0;
    }
  });

  // 2. BACKWARD PASS (in reverse topological order)
  const reversedTopo = [...topoOrder].reverse();
  reversedTopo.forEach(taskId => {
    const task = taskMap.get(taskId)!;
    const succs = successorsMap.get(taskId) || [];

    if (succs.length === 0) {
      task.lf = totalDuration;
    } else {
      let minSuccessorLS = Infinity;
      succs.forEach(sId => {
        const succ = taskMap.get(sId);
        if (succ && (succ.ls ?? Infinity) < minSuccessorLS) {
          minSuccessorLS = succ.ls!;
        }
      });
      task.lf = minSuccessorLS === Infinity ? totalDuration : minSuccessorLS;
    }
    task.ls = (task.lf || 0) - task.duration;

    // Total Float (Slack)
    task.slack = Math.max(0, (task.ls || 0) - (task.es || 0));

    // Free Float: min(ES of successors) - EF
    if (succs.length === 0) {
      task.freeSlack = Math.max(0, totalDuration - (task.ef || 0));
    } else {
      let minSuccES = Infinity;
      succs.forEach(sId => {
        const succ = taskMap.get(sId);
        if (succ && (succ.es ?? Infinity) < minSuccES) {
          minSuccES = succ.es!;
        }
      });
      task.freeSlack = Math.max(0, (minSuccES === Infinity ? totalDuration : minSuccES) - (task.ef || 0));
    }

    // Critical check
    task.isCritical = Math.abs(task.slack) < 0.001;
  });

  // Find critical path sequence
  // Follow critical path from start node to end
  const criticalTasks = topoOrder
    .map(id => taskMap.get(id)!)
    .filter(t => t.isCritical);

  const criticalPathIds = criticalTasks.map(t => t.id);

  // Statistics
  const nonCritical = Array.from(taskMap.values()).filter(t => !t.isCritical);
  const totalSlackSum = nonCritical.reduce((acc, t) => acc + (t.slack || 0), 0);
  const averageSlack = nonCritical.length > 0 ? Math.round((totalSlackSum / nonCritical.length) * 10) / 10 : 0;

  // Crashing recommendations (Activities on critical path that can be shortened)
  const crashingRecommendations: CrashingRecommendation[] = [];

  criticalTasks.forEach(task => {
    // Activities with duration > 2 days can be realistically crashed
    if (task.duration > 2) {
      const maxReduction = Math.max(1, Math.floor(task.duration * 0.4)); // e.g. up to 40%
      crashingRecommendations.push({
        taskId: task.id,
        taskName: task.name,
        currentDuration: task.duration,
        recommendedMaxReduction: maxReduction,
        rationale: `Bottleneck activity on critical path. Compressing by 1-${maxReduction} days (via extra resource/shift) directly advances the overall project schedule.`,
        priority: task.duration >= 10 ? 'High' : task.duration >= 5 ? 'Medium' : 'Low'
      });
    }
  });

  // Sort crashing recommendation by duration descending (biggest potential time savings first)
  crashingRecommendations.sort((a, b) => b.currentDuration - a.currentDuration);

  return {
    tasks: topoOrder.map(id => taskMap.get(id)!),
    criticalPath: criticalPathIds,
    totalDuration,
    criticalTasksCount: criticalTasks.length,
    nonCriticalTasksCount: nonCritical.length,
    averageSlack,
    crashingRecommendations,
    hasCycle: false,
  };
}
