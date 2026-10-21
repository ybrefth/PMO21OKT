import React, { useState } from 'react';
import { ProjectCharterData, MilestoneItem, StakeholderItem } from '../types/pmo';
import { 
  Check, 
  Download, 
  Eye, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Calendar, 
  Printer, 
  X, 
  FileText, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  ShieldCheck, 
  Edit3 
} from 'lucide-react';
import { DEFAULT_PROJECT_CHARTER } from '../data/defaultData';

interface ProjectCharterProps {
  charter: ProjectCharterData;
  onSave: (data: ProjectCharterData) => void;
  onExportPdf: () => void;
}

export const ProjectCharter: React.FC<ProjectCharterProps> = ({
  charter: initialCharter,
  onSave,
  onExportPdf,
}) => {
  const [formData, setFormData] = useState<ProjectCharterData>(initialCharter);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Form input change
  const handleTextChange = (field: keyof ProjectCharterData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Helper to add/remove string array items
  const handleAddListItem = (field: 'projectObjectives' | 'inScope' | 'outOfScope' | 'keyDeliverables' | 'topRisks' | 'successCriteria', defaultText: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultText]
    }));
  };

  const handleUpdateListItem = (field: 'projectObjectives' | 'inScope' | 'outOfScope' | 'keyDeliverables' | 'topRisks' | 'successCriteria', index: number, value: string) => {
    setFormData(prev => {
      const arr = [...(prev[field] || [])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const handleRemoveListItem = (field: 'projectObjectives' | 'inScope' | 'outOfScope' | 'keyDeliverables' | 'topRisks' | 'successCriteria', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, idx) => idx !== index)
    }));
  };

  // Milestone helpers
  const handleAddMilestone = () => {
    const nextNo = (formData.keyMilestones?.length || 0) + 1;
    const newM: MilestoneItem = {
      id: `m-${Date.now()}`,
      no: nextNo,
      milestone: "Milestone Baru",
      targetDate: "TBD 2026"
    };
    setFormData(prev => ({
      ...prev,
      keyMilestones: [...(prev.keyMilestones || []), newM]
    }));
  };

  const handleUpdateMilestone = (index: number, field: keyof MilestoneItem, value: any) => {
    setFormData(prev => {
      const arr = [...(prev.keyMilestones || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, keyMilestones: arr };
    });
  };

  const handleRemoveMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyMilestones: (prev.keyMilestones || []).filter((_, idx) => idx !== index).map((m, i) => ({ ...m, no: i + 1 }))
    }));
  };

  // Stakeholder helpers
  const handleAddStakeholder = () => {
    const newS: StakeholderItem = {
      id: `s-${Date.now()}`,
      role: "Stakeholder Baru",
      name: "Nama PIC",
      interest: "Peran dan kepentingan dalam proyek"
    };
    setFormData(prev => ({
      ...prev,
      stakeholders: [...(prev.stakeholders || []), newS]
    }));
  };

  const handleUpdateStakeholder = (index: number, field: keyof StakeholderItem, value: string) => {
    setFormData(prev => {
      const arr = [...(prev.stakeholders || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, stakeholders: arr };
    });
  };

  const handleRemoveStakeholder = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stakeholders: (prev.stakeholders || []).filter((_, idx) => idx !== index)
    }));
  };

  const handleSave = () => {
    const updated = { ...formData, lastSaved: new Date().toLocaleTimeString() };
    setFormData(updated);
    onSave(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    if (confirm("Reset form Project Charter ke template standar (seperti attachment)?")) {
      setFormData(DEFAULT_PROJECT_CHARTER);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Project Charter</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumentasi mandat resmi proyek dengan tata letak ringkas 2 halaman sesuai standar PMO.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded inline-flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Tersimpan
            </span>
          )}
          <button
            type="button"
            onClick={handleResetDefaults}
            title="Reset ke contoh standar"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200 text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Tombol Lihat PDF */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Lihat PDF</span>
          </button>

          {/* Tombol Download PDF */}
          <button
            type="button"
            onClick={onExportPdf}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {/* Tombol Simpan */}
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* EDITABLE FORM CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
        
        {/* TOP METADATA 5-COLUMN COMPACT STRIP (Matching Attachment 1) */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
            Informasi Ringkasan Proyek (Header Metadata)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            {/* 1. PROJECT NAME */}
            <div className="md:col-span-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                PROJECT NAME <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.projectName}
                onChange={e => handleTextChange('projectName', e.target.value)}
                placeholder="Nama proyek lengkap"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* 2. PROJECT SPONSOR */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                PROJECT SPONSOR
              </label>
              <input
                type="text"
                value={formData.projectSponsor}
                onChange={e => handleTextChange('projectSponsor', e.target.value)}
                placeholder="e.g. General Manager Operations"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* 3. PROJECT MANAGER */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                PROJECT MANAGER
              </label>
              <input
                type="text"
                value={formData.projectManager}
                onChange={e => handleTextChange('projectManager', e.target.value)}
                placeholder="e.g. Ahmad Fauzi"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* 4. DURATION */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                DURATION
              </label>
              <input
                type="text"
                value={formData.durationText}
                onChange={e => handleTextChange('durationText', e.target.value)}
                placeholder="e.g. 6 Bulan (1 Ags 2026 - 31 Jan 2027)"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* 5. BUDGET (with Rp) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                BUDGET (Rp / IDR)
              </label>
              <div className="flex items-center">
                <span className="px-2 py-1.5 bg-slate-200 border border-r-0 border-slate-300 rounded-l text-xs font-bold text-slate-700">
                  Rp
                </span>
                <input
                  type="text"
                  value={formData.budgetEstimated}
                  onChange={e => handleTextChange('budgetEstimated', e.target.value)}
                  placeholder="e.g. 15 Miliar"
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-r bg-white font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN SECTION GRID: SECTIONS 1 to 6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. BUSINESS NEED */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center">1</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">BUSINESS NEED</h4>
            </div>
            <textarea
              rows={4}
              value={formData.businessNeed}
              onChange={e => handleTextChange('businessNeed', e.target.value)}
              placeholder="Uraikan latar belakang kebutuhan bisnis..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
            />
          </div>

          {/* 2. PROJECT OBJECTIVES */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">PROJECT OBJECTIVES</h4>
              </div>
              <button
                type="button"
                onClick={() => handleAddListItem('projectObjectives', 'Sasaran proyek baru')}
                className="text-[11px] text-blue-700 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Tambah
              </button>
            </div>
            <div className="space-y-1.5">
              {(formData.projectObjectives || []).map((obj, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <input
                    type="text"
                    value={obj}
                    onChange={e => handleUpdateListItem('projectObjectives', i, e.target.value)}
                    className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded focus:outline-none focus:border-slate-800"
                  />
                  <button type="button" onClick={() => handleRemoveListItem('projectObjectives', i)} className="text-slate-300 hover:text-red-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. SCOPE (IN SCOPE vs OUT OF SCOPE) */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center">3</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">SCOPE</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* IN SCOPE */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase">IN SCOPE</span>
                  <button type="button" onClick={() => handleAddListItem('inScope', 'Pekerjaan in-scope')} className="text-[10px] text-emerald-800 hover:underline">+ Item</button>
                </div>
                <div className="space-y-1">
                  {(formData.inScope || []).map((sc, i) => (
                    <div key={i} className="flex items-center gap-1 text-[11px]">
                      <span className="text-emerald-600 text-xs">❖</span>
                      <input
                        type="text"
                        value={sc}
                        onChange={e => handleUpdateListItem('inScope', i, e.target.value)}
                        className="flex-1 text-[11px] px-1.5 py-0.5 border border-slate-200 rounded"
                      />
                      <button type="button" onClick={() => handleRemoveListItem('inScope', i)} className="text-slate-300 hover:text-red-500">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* OUT OF SCOPE */}
              <div className="border-l border-slate-200 pl-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-rose-700 uppercase">OUT OF SCOPE</span>
                  <button type="button" onClick={() => handleAddListItem('outOfScope', 'Pekerjaan out-of-scope')} className="text-[10px] text-rose-800 hover:underline">+ Item</button>
                </div>
                <div className="space-y-1">
                  {(formData.outOfScope || []).map((sc, i) => (
                    <div key={i} className="flex items-center gap-1 text-[11px]">
                      <span className="text-rose-500 text-xs">➢</span>
                      <input
                        type="text"
                        value={sc}
                        onChange={e => handleUpdateListItem('outOfScope', i, e.target.value)}
                        className="flex-1 text-[11px] px-1.5 py-0.5 border border-slate-200 rounded"
                      />
                      <button type="button" onClick={() => handleRemoveListItem('outOfScope', i)} className="text-slate-300 hover:text-red-500">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. KEY DELIVERABLES */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center">4</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">KEY DELIVERABLES</h4>
              </div>
              <button
                type="button"
                onClick={() => handleAddListItem('keyDeliverables', 'Deliverable penting')}
                className="text-[11px] text-blue-700 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Tambah
              </button>
            </div>
            <div className="space-y-1.5">
              {(formData.keyDeliverables || []).map((del, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <input
                    type="text"
                    value={del}
                    onChange={e => handleUpdateListItem('keyDeliverables', i, e.target.value)}
                    className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded focus:outline-none"
                  />
                  <button type="button" onClick={() => handleRemoveListItem('keyDeliverables', i)} className="text-slate-300 hover:text-red-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5. TOP RISKS */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center">5</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">TOP RISKS</h4>
              </div>
              <button
                type="button"
                onClick={() => handleAddListItem('topRisks', 'Identifikasi risiko baru')}
                className="text-[11px] text-blue-700 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Tambah
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(formData.topRisks || []).map((risk, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <input
                    type="text"
                    value={risk}
                    onChange={e => handleUpdateListItem('topRisks', i, e.target.value)}
                    className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded"
                  />
                  <button type="button" onClick={() => handleRemoveListItem('topRisks', i)} className="text-slate-300 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 6. SUCCESS CRITERIA */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center">6</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">SUCCESS CRITERIA</h4>
              </div>
              <button
                type="button"
                onClick={() => handleAddListItem('successCriteria', 'Kriteria sukses baru')}
                className="text-[11px] text-blue-700 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Tambah
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(formData.successCriteria || []).map((crit, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={crit}
                    onChange={e => handleUpdateListItem('successCriteria', i, e.target.value)}
                    className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded"
                  />
                  <button type="button" onClick={() => handleRemoveListItem('successCriteria', i)} className="text-slate-300 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PAGE 2 SECTIONS: 7, 8, 9 */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 7. KEY MILESTONES TABLE */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center">7</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">KEY MILESTONE</h4>
                </div>
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="text-[11px] text-blue-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Tambah Milestone
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B3B60] text-white text-[11px]">
                    <tr>
                      <th className="py-2 px-2.5 w-10 text-center">No.</th>
                      <th className="py-2 px-2.5">Milestone</th>
                      <th className="py-2 px-2.5 w-32">Target Date</th>
                      <th className="py-2 px-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(formData.keyMilestones || []).map((m, idx) => (
                      <tr key={m.id || idx}>
                        <td className="py-1.5 px-2 text-center font-mono">{idx + 1}</td>
                        <td className="py-1.5 px-2">
                          <input
                            type="text"
                            value={m.milestone}
                            onChange={e => handleUpdateMilestone(idx, 'milestone', e.target.value)}
                            className="w-full text-xs border border-transparent hover:border-slate-300 focus:border-slate-800 rounded px-1"
                          />
                        </td>
                        <td className="py-1.5 px-2">
                          <input
                            type="text"
                            value={m.targetDate}
                            onChange={e => handleUpdateMilestone(idx, 'targetDate', e.target.value)}
                            className="w-full text-xs font-mono border border-transparent hover:border-slate-300 focus:border-slate-800 rounded px-1"
                          />
                        </td>
                        <td className="py-1.5 px-1 text-center">
                          <button type="button" onClick={() => handleRemoveMilestone(idx)} className="text-slate-300 hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 8. KEY STAKEHOLDERS TABLE */}
            <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center">8</span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">KEY STAKEHOLDERS</h4>
                </div>
                <button
                  type="button"
                  onClick={handleAddStakeholder}
                  className="text-[11px] text-blue-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Tambah Stakeholder
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded max-h-[220px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B3B60] text-white text-[11px] sticky top-0">
                    <tr>
                      <th className="py-2 px-2.5 w-36">Stakeholder</th>
                      <th className="py-2 px-2.5">Peran / Kepentingan</th>
                      <th className="py-2 px-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(formData.stakeholders || []).map((s, idx) => (
                      <tr key={s.id || idx}>
                        <td className="py-1.5 px-2 font-medium">
                          <input
                            type="text"
                            value={s.name}
                            onChange={e => handleUpdateStakeholder(idx, 'name', e.target.value)}
                            className="w-full text-xs border border-transparent hover:border-slate-300 focus:border-slate-800 rounded px-1"
                          />
                        </td>
                        <td className="py-1.5 px-2 text-slate-600">
                          <input
                            type="text"
                            value={s.interest}
                            onChange={e => handleUpdateStakeholder(idx, 'interest', e.target.value)}
                            className="w-full text-xs border border-transparent hover:border-slate-300 focus:border-slate-800 rounded px-1"
                          />
                        </td>
                        <td className="py-1.5 px-1 text-center">
                          <button type="button" onClick={() => handleRemoveStakeholder(idx)} className="text-slate-300 hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 9. APPROVAL SIGN-OFF BLOCK */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-blue-900 text-white text-[11px] font-bold flex items-center justify-center">9</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">APPROVAL</h4>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-2">
              <div className="text-center p-3 border border-slate-200 rounded bg-white">
                <p className="font-bold text-xs text-slate-900 mb-8">Project Manager</p>
                <p className="font-bold text-xs text-slate-800 underline">({formData.projectManager || "Ahmad Fauzi"})</p>
                <p className="text-[11px] text-slate-500 mt-1">Tanggal: ___________________</p>
              </div>

              <div className="text-center p-3 border border-slate-200 rounded bg-white">
                <p className="font-bold text-xs text-slate-900 mb-8">Project Sponsor</p>
                <p className="font-bold text-xs text-slate-800 underline">({formData.projectSponsor || "General Manager Operations"})</p>
                <p className="text-[11px] text-slate-500 mt-1">Tanggal: ___________________</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* PRINT-ONLY VIEW (Hidden on screen, rendered cleanly on window.print()) */}
      <div className="hidden print-only printable-document">
        {/* PAGE 1 PRINTABLE */}
        <div className="print-page print-page-1 p-5 text-slate-800 text-[8pt] leading-tight space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-[#0B3B60]">
            <div>
              <span className="text-[7pt] font-bold text-slate-400 block font-mono">Halaman 1/2 • [FILLED EXAMPLE]</span>
              <h1 className="text-xl font-black text-[#0B3B60] tracking-wide">PROJECT CHARTER</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#0B3B60] tracking-wider">MOYA</span>
              <span className="px-1.5 py-0.5 bg-[#034078] text-white rounded text-[8pt] font-bold">eNetwoQ</span>
            </div>
          </div>

          {/* 5-Column Metadata Box matching Attachment 1 */}
          <div className="grid grid-cols-5 border border-slate-300 rounded text-[7.5pt] divide-x divide-slate-300">
            <div className="p-1.5 col-span-1">
              <span className="text-[6.5pt] font-bold text-slate-500 uppercase block">PROJECT NAME</span>
              <span className="font-bold text-slate-900 leading-tight block mt-0.5">{formData.projectName}</span>
            </div>
            <div className="p-1.5">
              <span className="text-[6.5pt] font-bold text-slate-500 uppercase block">PROJECT SPONSOR</span>
              <span className="font-semibold text-slate-800 block mt-0.5">{formData.projectSponsor}</span>
            </div>
            <div className="p-1.5">
              <span className="text-[6.5pt] font-bold text-slate-500 uppercase block">PROJECT MANAGER</span>
              <span className="font-semibold text-slate-800 block mt-0.5">{formData.projectManager}</span>
            </div>
            <div className="p-1.5">
              <span className="text-[6.5pt] font-bold text-slate-500 uppercase block">DURATION</span>
              <span className="font-semibold text-slate-800 block mt-0.5 font-mono text-[7pt]">{formData.durationText}</span>
            </div>
            <div className="p-1.5">
              <span className="text-[6.5pt] font-bold text-slate-500 uppercase block">BUDGET</span>
              <span className="font-black text-[#0B3B60] block mt-0.5 text-[8.5pt]">
                Rp {formData.budgetEstimated.replace(/^Rp\s*/i, '').replace(/^IDR\s*/i, '')}
              </span>
            </div>
          </div>

          {/* 2-Column Grid (Sections 1-6) */}
          <div className="grid grid-cols-2 gap-2.5 text-[7.5pt]">
            {/* Left Column: 1, 3, 5 */}
            <div className="space-y-2.5">
              {/* 1. BUSINESS NEED */}
              <div className="border border-slate-300 rounded p-2 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-[8pt]">
                  <span className="w-3.5 h-3.5 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[7pt]">1</span>
                  <span>BUSINESS NEED</span>
                </div>
                <p className="text-slate-800 leading-relaxed text-[7.5pt]">{formData.businessNeed}</p>
              </div>

              {/* 3. SCOPE */}
              <div className="border border-slate-300 rounded p-2 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-[8pt]">
                  <span className="w-3.5 h-3.5 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[7pt]">3</span>
                  <span>SCOPE</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[7.5pt]">
                  <div>
                    <span className="text-[7pt] font-bold text-emerald-800 block mb-0.5">IN SCOPE</span>
                    <ul className="space-y-0.5">
                      {formData.inScope?.map((item, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-emerald-700 font-bold shrink-0">❖</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-l border-slate-300 pl-1.5">
                    <span className="text-[7pt] font-bold text-rose-800 block mb-0.5">OUT OF SCOPE</span>
                    <ul className="space-y-0.5">
                      {formData.outOfScope?.map((item, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-rose-600 font-bold shrink-0">➢</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 5. TOP RISKS */}
              <div className="border border-slate-300 rounded p-2 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-[8pt]">
                  <span className="w-3.5 h-3.5 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[7pt]">5</span>
                  <span>TOP RISKS</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[7pt]">
                  {formData.topRisks?.map((item, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className="text-amber-600 font-bold shrink-0">▲</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: 2, 4, 6 */}
            <div className="space-y-2.5">
              {/* 2. PROJECT OBJECTIVES */}
              <div className="border border-slate-300 rounded p-2 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-[8pt]">
                  <span className="w-3.5 h-3.5 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[7pt]">2</span>
                  <span>PROJECT OBJECTIVES</span>
                </div>
                <ul className="space-y-0.5 text-[7.5pt] text-slate-800">
                  {formData.projectObjectives?.map((item, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-blue-700 font-bold shrink-0">✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. KEY DELIVERABLES */}
              <div className="border border-slate-300 rounded p-2 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-[8pt]">
                  <span className="w-3.5 h-3.5 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[7pt]">4</span>
                  <span>KEY DELIVERABLES</span>
                </div>
                <ul className="space-y-0.5 text-[7.5pt]">
                  {formData.keyDeliverables?.map((item, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-blue-600 shrink-0">📍</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 6. SUCCESS CRITERIA */}
              <div className="border border-slate-300 rounded p-2 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-[8pt]">
                  <span className="w-3.5 h-3.5 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[7pt]">6</span>
                  <span>SUCCESS CRITERIA</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[7pt]">
                  {formData.successCriteria?.map((item, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className="text-emerald-600 font-bold shrink-0">✔</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-[6.5pt] text-slate-400 text-right pt-1">
            Halaman 1 dari 2 • Dokumen Mandat & Tata Kelola Proyek PMO
          </div>
        </div>

        {/* PAGE 2 PRINTABLE (Break cleanly to next page) */}
        <div className="print-page print-page-2 p-5 text-slate-800 text-[8pt] leading-tight space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-[#0B3B60]">
            <div>
              <span className="text-[7pt] font-bold text-slate-400 block font-mono">Halaman 2/2 • [FILLED EXAMPLE]</span>
              <h1 className="text-xl font-black text-[#0B3B60] tracking-wide">PROJECT CHARTER</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#0B3B60] tracking-wider">MOYA</span>
              <span className="px-1.5 py-0.5 bg-[#034078] text-white rounded text-[8pt] font-bold">eNetwoQ</span>
            </div>
          </div>

          {/* Sections 7 & 8 side by side */}
          <div className="grid grid-cols-2 gap-2.5 text-[7.5pt]">
            {/* 7. KEY MILESTONE */}
            <div className="border border-slate-300 rounded p-2">
              <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-[8pt] mb-1.5">
                <span className="w-3.5 h-3.5 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[7pt]">7</span>
                <span>KEY MILESTONE</span>
              </div>
              <table className="w-full text-left text-[7.5pt] border border-slate-300">
                <thead className="bg-[#0B3B60] text-white">
                  <tr>
                    <th className="p-1 w-6 text-center">No.</th>
                    <th className="p-1">Milestone</th>
                    <th className="p-1 w-24">Target Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {formData.keyMilestones?.map((m, idx) => (
                    <tr key={idx}>
                      <td className="p-1 text-center font-mono">{idx + 1}</td>
                      <td className="p-1 font-medium">{m.milestone}</td>
                      <td className="p-1 font-mono text-[7pt]">{m.targetDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 8. KEY STAKEHOLDERS */}
            <div className="border border-slate-300 rounded p-2">
              <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-[8pt] mb-1.5">
                <span className="w-3.5 h-3.5 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[7pt]">8</span>
                <span>KEY STAKEHOLDERS</span>
              </div>
              <table className="w-full text-left text-[7.5pt] border border-slate-300">
                <thead className="bg-[#0B3B60] text-white">
                  <tr>
                    <th className="p-1 w-28">Stakeholder</th>
                    <th className="p-1">Peran / Kepentingan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {formData.stakeholders?.map((s, idx) => (
                    <tr key={idx}>
                      <td className="p-1 font-bold text-slate-900">{s.name}</td>
                      <td className="p-1 text-slate-700">{s.interest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 9. APPROVAL SIGNATURE BLOCK (Grounded and completely visible) */}
          <div className="border border-slate-300 rounded p-3 text-[7.5pt] approval-section">
            <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-[8pt] mb-2">
              <span className="w-3.5 h-3.5 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[7pt]">9</span>
              <span>APPROVAL</span>
            </div>
            <div className="grid grid-cols-2 gap-10 text-center pt-1">
              <div>
                <p className="font-bold text-slate-900 mb-8">Project Manager</p>
                <div className="w-48 mx-auto border-b border-slate-800"></div>
                <p className="font-bold text-slate-900 mt-1">({formData.projectManager || "Ahmad Fauzi"})</p>
                <p className="text-[7pt] text-slate-500 mt-0.5">Tanggal: ___________________</p>
              </div>
              <div>
                <p className="font-bold text-slate-900 mb-8">Project Sponsor</p>
                <div className="w-48 mx-auto border-b border-slate-800"></div>
                <p className="font-bold text-slate-900 mt-1">({formData.projectSponsor || "General Manager Operations"})</p>
                <p className="text-[7pt] text-slate-500 mt-0.5">Tanggal: ___________________</p>
              </div>
            </div>
          </div>

          <div className="text-[6.5pt] text-slate-400 text-right pt-1">
            Halaman 2 dari 2 • Dokumen Resmi Terotorisasi & Sah Pengesahannya
          </div>
        </div>
      </div>

      {/* MODAL: LIHAT PDF (PREVIEW PDF MODAL / VIEWER) */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 backdrop-blur-xs animate-fadeIn modal-backdrop">
          <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col border border-slate-300 overflow-hidden" role="dialog">
            {/* Modal Header */}
            <div className="px-5 py-3 bg-[#0B3B60] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-300" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide">
                    Pratinjau Dokumen Project Charter (Sesuai Lampiran Attachment 1)
                  </h3>
                  <p className="text-[10px] text-cyan-100">
                    Dokumen 2 halaman lengkap — Halaman 1 (Ringkasan & Lingkup) & Halaman 2 (Milestone, Stakeholder & Lembar Pengesahan)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onExportPdf}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1 rounded text-slate-300 hover:text-white cursor-pointer"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body displaying 2 pages cleanly */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/90 space-y-6">
              
              {/* PAGE 1 PREVIEW CARD */}
              <div className="bg-white w-full max-w-4xl mx-auto p-6 sm:p-7 rounded shadow-md border border-slate-300 space-y-3.5 text-xs text-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b-2 border-[#0B3B60]">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block font-mono">Halaman 1/2 • [FILLED EXAMPLE]</span>
                    <h1 className="text-2xl font-black text-[#0B3B60] tracking-wide">PROJECT CHARTER</h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-[#0B3B60] tracking-wider">MOYA</span>
                    <span className="px-2 py-0.5 bg-[#034078] text-white rounded text-xs font-bold">eNetwoQ</span>
                  </div>
                </div>

                {/* 5-Column Metadata Box matching Attachment 1 */}
                <div className="grid grid-cols-2 md:grid-cols-5 border border-slate-300 rounded text-xs divide-y md:divide-y-0 md:divide-x divide-slate-300">
                  <div className="p-2.5 col-span-2 md:col-span-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">PROJECT NAME</span>
                    <span className="font-bold text-slate-900 leading-tight block mt-0.5">{formData.projectName}</span>
                  </div>
                  <div className="p-2.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">PROJECT SPONSOR</span>
                    <span className="font-semibold text-slate-800 block mt-0.5">{formData.projectSponsor}</span>
                  </div>
                  <div className="p-2.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">PROJECT MANAGER</span>
                    <span className="font-semibold text-slate-800 block mt-0.5">{formData.projectManager}</span>
                  </div>
                  <div className="p-2.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">DURATION</span>
                    <span className="font-semibold text-slate-800 block mt-0.5 font-mono text-[11px]">{formData.durationText}</span>
                  </div>
                  <div className="p-2.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">BUDGET</span>
                    <span className="font-black text-[#0B3B60] block mt-0.5 text-sm">
                      Rp {formData.budgetEstimated.replace(/^Rp\s*/i, '').replace(/^IDR\s*/i, '')}
                    </span>
                  </div>
                </div>

                {/* Sections 1 to 6 in 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Left Column: 1, 3, 5 */}
                  <div className="space-y-3">
                    {/* 1. Business Need */}
                    <div className="border border-slate-300 rounded p-2.5 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-xs">
                        <span className="w-4 h-4 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[10px]">1</span>
                        <span>BUSINESS NEED</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed text-[11px]">{formData.businessNeed}</p>
                    </div>

                    {/* 3. Scope */}
                    <div className="border border-slate-300 rounded p-2.5 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-xs">
                        <span className="w-4 h-4 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[10px]">3</span>
                        <span>SCOPE</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">IN SCOPE</span>
                          <ul className="space-y-0.5">
                            {formData.inScope?.map((item, i) => (
                              <li key={i} className="flex items-start gap-1 text-[10px]">
                                <span className="text-emerald-700 font-bold">❖</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="border-l border-slate-200 pl-2">
                          <span className="text-[10px] font-bold text-rose-800 uppercase block mb-1">OUT OF SCOPE</span>
                          <ul className="space-y-0.5">
                            {formData.outOfScope?.map((item, i) => (
                              <li key={i} className="flex items-start gap-1 text-[10px]">
                                <span className="text-rose-600 font-bold">➢</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 5. Top Risks */}
                    <div className="border border-slate-300 rounded p-2.5 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-xs">
                        <span className="w-4 h-4 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[10px]">5</span>
                        <span>TOP RISKS</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                        {formData.topRisks?.map((item, i) => (
                          <div key={i} className="flex items-start gap-1">
                            <span className="text-amber-600 font-bold">▲</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: 2, 4, 6 */}
                  <div className="space-y-3">
                    {/* 2. Project Objectives */}
                    <div className="border border-slate-300 rounded p-2.5 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-xs">
                        <span className="w-4 h-4 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[10px]">2</span>
                        <span>PROJECT OBJECTIVES</span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-800">
                        {formData.projectObjectives?.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 4. Key Deliverables */}
                    <div className="border border-slate-300 rounded p-2.5 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-xs">
                        <span className="w-4 h-4 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[10px]">4</span>
                        <span>KEY DELIVERABLES</span>
                      </div>
                      <ul className="space-y-0.5 text-[11px]">
                        {formData.keyDeliverables?.map((item, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 6. Success Criteria */}
                    <div className="border border-slate-300 rounded p-2.5 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-xs">
                        <span className="w-4 h-4 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[10px]">6</span>
                        <span>SUCCESS CRITERIA</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                        {formData.successCriteria?.map((item, i) => (
                          <div key={i} className="flex items-start gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-right pt-2 border-t border-slate-100">
                  Halaman 1 dari 2
                </div>
              </div>

              {/* PAGE 2 PREVIEW CARD */}
              <div className="bg-white w-full max-w-4xl mx-auto p-6 sm:p-7 rounded shadow-md border border-slate-300 space-y-3.5 text-xs text-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b-2 border-[#0B3B60]">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block font-mono">Halaman 2/2 • [FILLED EXAMPLE]</span>
                    <h1 className="text-2xl font-black text-[#0B3B60] tracking-wide">PROJECT CHARTER</h1>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-[#0B3B60] tracking-wider">MOYA</span>
                    <span className="px-2 py-0.5 bg-[#034078] text-white rounded text-xs font-bold">eNetwoQ</span>
                  </div>
                </div>

                {/* 7 & 8 Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* 7. Key Milestone */}
                  <div className="border border-slate-300 rounded p-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-xs mb-2">
                      <span className="w-4 h-4 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[10px]">7</span>
                      <span>KEY MILESTONE</span>
                    </div>
                    <table className="w-full text-left text-[11px] border border-slate-300">
                      <thead className="bg-[#0B3B60] text-white">
                        <tr>
                          <th className="p-1.5 w-8 text-center">No.</th>
                          <th className="p-1.5">Milestone</th>
                          <th className="p-1.5 w-32">Target Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {formData.keyMilestones?.map((m, idx) => (
                          <tr key={idx}>
                            <td className="p-1.5 text-center font-mono">{idx + 1}</td>
                            <td className="p-1.5 font-medium">{m.milestone}</td>
                            <td className="p-1.5 font-mono text-[10px]">{m.targetDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 8. Key Stakeholders */}
                  <div className="border border-slate-300 rounded p-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-xs mb-2">
                      <span className="w-4 h-4 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[10px]">8</span>
                      <span>KEY STAKEHOLDERS</span>
                    </div>
                    <table className="w-full text-left text-[11px] border border-slate-300">
                      <thead className="bg-[#0B3B60] text-white">
                        <tr>
                          <th className="p-1.5 w-36">Stakeholder</th>
                          <th className="p-1.5">Peran / Kepentingan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {formData.stakeholders?.map((s, idx) => (
                          <tr key={idx}>
                            <td className="p-1.5 font-bold text-slate-900">{s.name}</td>
                            <td className="p-1.5 text-slate-700">{s.interest}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 9. Approval Section (Completely visible, grounded at bottom, never cut off!) */}
                <div className="border border-slate-300 rounded p-3.5 text-xs bg-slate-50/50">
                  <div className="flex items-center gap-1.5 font-bold text-[#0B3B60] text-xs mb-3">
                    <span className="w-4 h-4 rounded bg-[#0B3B60] text-white flex items-center justify-center text-[10px]">9</span>
                    <span>APPROVAL</span>
                  </div>
                  <div className="grid grid-cols-2 gap-12 text-center pt-1">
                    <div>
                      <p className="font-bold text-slate-900 mb-10">Project Manager</p>
                      <div className="w-56 mx-auto border-b border-slate-800"></div>
                      <p className="font-bold text-slate-900 mt-1">({formData.projectManager || "Ahmad Fauzi"})</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Tanggal: ___________________</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 mb-10">Project Sponsor</p>
                      <div className="w-56 mx-auto border-b border-slate-800"></div>
                      <p className="font-bold text-slate-900 mt-1">({formData.projectSponsor || "General Manager Operations"})</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Tanggal: ___________________</p>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-right pt-2 border-t border-slate-100">
                  Halaman 2 dari 2 • Pengesahan Resmi Selesai
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-600 font-medium">
                ✓ 2 Halaman lengkap dengan tabel dan tanda tangan pengesahan (Approval) di bagian bawah.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={onExportPdf}
                  className="px-4 py-1.5 bg-[#0B3B60] hover:bg-[#034078] text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Download PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
