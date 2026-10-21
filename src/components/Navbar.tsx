import React from 'react';
import { 
  FileText, 
  Layers, 
  Network, 
  ListChecks, 
  ArrowLeft, 
  FolderKanban 
} from 'lucide-react';

export type ActiveTab = 'charter' | 'wbs' | 'cpm' | 'checklist';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onBackToProjectList: () => void;
  projectName: string;
  projectCode: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onBackToProjectList,
  projectName,
  projectCode,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'charter',
      label: '1. Project Charter',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'wbs',
      label: '2. WBS Generator',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'cpm',
      label: '3. CPM Analysis',
      icon: <Network className="w-4 h-4" />,
    },
    {
      id: 'checklist',
      label: '4. Readiness Checklist',
      icon: <ListChecks className="w-4 h-4" />,
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-2">
          
          {/* Back to Project List button & Active Project Info */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBackToProjectList}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded transition flex items-center gap-1.5 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Daftar Proyek</span>
            </button>

            <span className="h-4 w-px bg-slate-200 shrink-0"></span>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.2 rounded">
                  {projectCode || "PMO"}
                </span>
                <h1 className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[320px]" title={projectName}>
                  {projectName || "Proyek"}
                </h1>
              </div>
            </div>
          </div>

          {/* 4 Main Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>
      </div>
    </header>
  );
};
