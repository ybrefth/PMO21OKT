import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { ProjectList } from './components/ProjectList';
import { ProjectCharter } from './components/ProjectCharter';
import { WBSBuilder } from './components/WBSBuilder';
import { CPMAnalysis } from './components/CPMAnalysis';
import { ReadinessChecklist } from './components/ReadinessChecklist';
import { Project, ProjectCharterData, WBSNode, CPMTask, ReadinessChecklistItem } from './types/pmo';
import { DEFAULT_PROJECTS } from './data/defaultData';

const STORAGE_KEY = 'pmo_multi_projects_v2';

export default function App() {
  // All projects list
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    } catch (e) {
      return DEFAULT_PROJECTS;
    }
  });

  // Current selected project ID (null = Home / Project List Page)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Active Tab inside Project Detail
  const [activeTab, setActiveTab] = useState<ActiveTab>('charter');

  // Save projects to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      // ignore
    }
  }, [projects]);

  // Current active project
  const currentProject = projects.find(p => p.id === selectedProjectId);

  // Project management handlers
  const handleCreateProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    setActiveTab('charter');
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
  };

  const handleUpdateCharter = (updatedCharter: ProjectCharterData) => {
    if (!selectedProjectId) return;
    setProjects(prev => prev.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          updatedAt: new Date().toISOString().split('T')[0],
          charter: updatedCharter,
        };
      }
      return p;
    }));
  };

  const handleUpdateWBS = (updatedTree: WBSNode[]) => {
    if (!selectedProjectId) return;
    setProjects(prev => prev.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          updatedAt: new Date().toISOString().split('T')[0],
          wbsTree: updatedTree,
        };
      }
      return p;
    }));
  };

  const handleUpdateCPM = (updatedTasks: CPMTask[]) => {
    if (!selectedProjectId) return;
    setProjects(prev => prev.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          updatedAt: new Date().toISOString().split('T')[0],
          cpmTasks: updatedTasks,
        };
      }
      return p;
    }));
  };

  const handleUpdateChecklist = (updatedChecklist: ReadinessChecklistItem[]) => {
    if (!selectedProjectId) return;
    setProjects(prev => prev.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          updatedAt: new Date().toISOString().split('T')[0],
          checklistItems: updatedChecklist,
        };
      }
      return p;
    }));
  };

  const handleSyncWbsToCpm = (newCpmTasks: CPMTask[]) => {
    handleUpdateCPM(newCpmTasks);
    setActiveTab('cpm');
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* If a project is selected, show Project Navbar */}
      {currentProject ? (
        <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onBackToProjectList={() => setSelectedProjectId(null)}
          projectName={currentProject.charter.projectName}
          projectCode={currentProject.charter.projectCode}
        />
      ) : (
        /* Minimalist top bar for Home / Project List */
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  PMO
                </div>
                <div>
                  <h1 className="text-xs font-bold text-slate-900 leading-tight">Pre-Project Hub</h1>
                  <p className="text-[10px] text-slate-500 font-mono leading-tight">Documentation & Readiness</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 font-medium hidden sm:block">
                Standard PMO Pre-Project Governance
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!selectedProjectId || !currentProject ? (
          /* 1. Home / Project List Page */
          <ProjectList
            projects={projects}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setActiveTab('charter');
            }}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
          />
        ) : (
          /* 2. Project Detail View with 4 Core Modules */
          <>
            {activeTab === 'charter' && (
              <ProjectCharter
                charter={currentProject.charter}
                onSave={handleUpdateCharter}
                onExportPdf={handleExportPdf}
              />
            )}

            {activeTab === 'wbs' && (
              <WBSBuilder
                wbsTree={currentProject.wbsTree}
                onUpdateWBS={handleUpdateWBS}
                onSyncToCPM={handleSyncWbsToCpm}
                projectName={currentProject.charter.projectName}
              />
            )}

            {activeTab === 'cpm' && (
              <CPMAnalysis
                tasks={currentProject.cpmTasks}
                onUpdateTasks={handleUpdateCPM}
              />
            )}

            {activeTab === 'checklist' && (
              <ReadinessChecklist
                items={currentProject.checklistItems}
                onUpdateItems={handleUpdateChecklist}
              />
            )}
          </>
        )}
      </main>

      {/* Minimalist Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            PMO Pre-Project Documentation Hub • Multi-Project Support
          </p>
          <p className="font-mono text-[11px] text-slate-400">
            {currentProject ? currentProject.charter.projectName : `${projects.length} Active Projects`}
          </p>
        </div>
      </footer>
    </div>
  );
}
