import React, { useState } from 'react';
import { ProjectCharterData, StakeholderItem } from '../types/pmo';
import { 
  Check, 
  Download, 
  Eye, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Building2, 
  User, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Printer, 
  X, 
  FileText 
} from 'lucide-react';
import { DEFAULT_PROJECT_CHARTER } from '../data/defaultData';

interface ProjectCharterProps {
  charter: ProjectCharterData;
  onSave: (data: ProjectCharterData) => void;
  onExportPdf: () => void;
}

const AVAILABLE_SCOPE_OPTIONS = [
  "Pengerukan & Cut/Fill",
  "Survei Topografi & Geoteknik",
  "Dewatering & Shoring",
  "Disposal & Hauling Logistik",
  "Uji Pemadatan Subgrade",
  "HSE & Izin Lingkungan",
  "Struktur Pondasi & Bore Pile",
  "Sistem MEP & Utilitas",
  "Software & System Architecture",
  "Hardware Procurement & Cloud",
  "Legal, Perizinan & AMDAL"
];

const STAKEHOLDER_ROLES: StakeholderItem['role'][] = [
  'Sponsor',
  'Steering Committee',
  'PM',
  'Vendor',
  'End User',
  'Quality Lead',
  'Finance Lead'
];

export const ProjectCharter: React.FC<ProjectCharterProps> = ({
  charter: initialCharter,
  onSave,
  onExportPdf,
}) => {
  const [formData, setFormData] = useState<ProjectCharterData>(initialCharter);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [newScopeInput, setNewScopeInput] = useState('');
  const [newStakeholder, setNewStakeholder] = useState<Partial<StakeholderItem>>({
    role: 'Sponsor',
    name: '',
    title: '',
    email: '',
    department: '',
  });

  const handleInputChange = (field: keyof ProjectCharterData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleScopeCategory = (cat: string) => {
    setFormData(prev => {
      const exists = prev.selectedScopeCategories.includes(cat);
      return {
        ...prev,
        selectedScopeCategories: exists
          ? prev.selectedScopeCategories.filter(c => c !== cat)
          : [...prev.selectedScopeCategories, cat],
      };
    });
  };

  const addCustomScope = () => {
    if (!newScopeInput.trim()) return;
    if (!formData.selectedScopeCategories.includes(newScopeInput.trim())) {
      setFormData(prev => ({
        ...prev,
        selectedScopeCategories: [...prev.selectedScopeCategories, newScopeInput.trim()],
      }));
    }
    setNewScopeInput('');
  };

  const handleAddStakeholder = () => {
    if (!newStakeholder.name?.trim()) return;
    const item: StakeholderItem = {
      id: `sh-${Date.now()}`,
      role: (newStakeholder.role as any) || 'End User',
      name: newStakeholder.name.trim(),
      title: newStakeholder.title?.trim() || '',
      email: newStakeholder.email?.trim() || '',
      phone: newStakeholder.phone?.trim() || '',
      department: newStakeholder.department?.trim() || '',
    };
    setFormData(prev => ({
      ...prev,
      stakeholders: [...prev.stakeholders, item],
    }));
    setNewStakeholder({
      role: 'End User',
      name: '',
      title: '',
      email: '',
      department: '',
    });
  };

  const handleRemoveStakeholder = (id: string) => {
    setFormData(prev => ({
      ...prev,
      stakeholders: prev.stakeholders.filter(s => s.id !== id),
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
    if (confirm("Reset form charter ke data template standar?")) {
      setFormData(DEFAULT_PROJECT_CHARTER);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Project Charter</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumentasi mandat resmi proyek, penetapan lingkup kerja, dan daftar pemangku kepentingan (stakeholders).
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
            title="Reset ke template standar"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200 text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Tombol Lihat PDF (Preview Modal) */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded text-xs font-medium flex items-center gap-1.5 shadow-xs transition"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Lihat PDF</span>
          </button>

          {/* Tombol Download PDF */}
          <button
            type="button"
            onClick={onExportPdf}
            className="px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          {/* Tombol Simpan */}
          <button
            type="button"
            onClick={handleSave}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium flex items-center gap-1.5 shadow-xs transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6 printable-document">
        
        {/* Printable Formal PMO Header (visible during print) */}
        <div className="hidden print-only pb-6 border-b border-slate-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">PMO Pre-Project Governance</p>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">{formData.projectName || "Project Charter"}</h1>
              <p className="text-xs text-slate-600 mt-0.5">Reference Code: {formData.projectCode || "PMO-PRE-2026-001"}</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p className="font-semibold text-emerald-700 mt-1">STATUS: MANDATED & AUTHORIZED</p>
            </div>
          </div>
        </div>

        {/* SECTION 1: Informasi Dasar Proyek */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-semibold">1</span>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Informasi Dasar Proyek</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nama Proyek <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={e => handleInputChange('projectName', e.target.value)}
                placeholder="e.g. Proyek Pengerukan Tanah & Penyiapan Lahan"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kode / ID Proyek
              </label>
              <input
                type="text"
                value={formData.projectCode}
                onChange={e => handleInputChange('projectCode', e.target.value)}
                placeholder="e.g. PMO-PRE-2026-084"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Project Sponsor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.projectSponsor}
                  onChange={e => handleInputChange('projectSponsor', e.target.value)}
                  placeholder="e.g. Ir. Hendra Gunawan (Director)"
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Project Manager (PM) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.projectManager}
                  onChange={e => handleInputChange('projectManager', e.target.value)}
                  placeholder="e.g. Aubrey Fathur, PMP"
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tanggal Mulai
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => handleInputChange('startDate', e.target.value)}
                    className="w-full text-xs pl-7 pr-2 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Selesai
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.targetEndDate}
                    onChange={e => handleInputChange('targetEndDate', e.target.value)}
                    className="w-full text-xs pl-7 pr-2 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Estimasi Anggaran ({formData.currency})
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.budgetEstimated}
                  onChange={e => handleInputChange('budgetEstimated', e.target.value)}
                  placeholder="e.g. 14,500,000,000"
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <DollarSign className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* SECTION 2: Lingkup Proyek & Batasan */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-semibold">2</span>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Lingkup Kerja & Batasan (Scope)</h3>
          </div>

          <div className="space-y-4">
            {/* Multi-select category pills */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Pilar / Kategori Lingkup (Pilih yang sesuai atau tambahkan manual):
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {AVAILABLE_SCOPE_OPTIONS.map(opt => {
                  const selected = formData.selectedScopeCategories.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleScopeCategory(opt)}
                      className={`text-xs px-2.5 py-1 rounded border transition flex items-center gap-1.5 ${
                        selected
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-white" />}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add custom tag */}
              <div className="flex gap-2 max-w-md no-print">
                <input
                  type="text"
                  value={newScopeInput}
                  onChange={e => setNewScopeInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomScope();
                    }
                  }}
                  placeholder="Tambah kategori lingkup kustom..."
                  className="text-xs px-2.5 py-1.5 border border-slate-300 rounded flex-1 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={addCustomScope}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium border border-slate-200"
                >
                  Tambah
                </button>
              </div>
            </div>

            {/* Scope inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tujuan & Sasaran Proyek (Purpose & Objectives)
                </label>
                <textarea
                  rows={3}
                  value={formData.scopeObjectives}
                  onChange={e => handleInputChange('scopeObjectives', e.target.value)}
                  placeholder="Uraikan alasan strategis dan sasaran yang ingin dicapai proyek..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Deliverables Masuk Lingkup (In-Scope Deliverables)
                </label>
                <textarea
                  rows={3}
                  value={formData.inScopeDeliverables}
                  onChange={e => handleInputChange('inScopeDeliverables', e.target.value)}
                  placeholder="Daftar hasil kerja yang wajib diserahkan..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Di Luar Lingkup (Out-of-Scope Exclusions)
                </label>
                <textarea
                  rows={3}
                  value={formData.outOfScopeExclusions}
                  onChange={e => handleInputChange('outOfScopeExclusions', e.target.value)}
                  placeholder="Pekerjaan yang secara eksplisit TIDAK termasuk dalam proyek ini..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Asumsi Utama & Kendala (Assumptions & Constraints)
                </label>
                <textarea
                  rows={3}
                  value={formData.keyAssumptions}
                  onChange={e => handleInputChange('keyAssumptions', e.target.value)}
                  placeholder="Kondisi cuaca, izin eksternal, ketersediaan material..."
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* SECTION 3: Pemangku Kepentingan (Stakeholders) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-semibold">3</span>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Daftar Pemangku Kepentingan (Stakeholders)</h3>
            </div>
            <span className="text-xs text-slate-500 font-normal">
              {formData.stakeholders.length} Stakeholder Terdaftar
            </span>
          </div>

          {/* Stakeholders Table */}
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-2 px-3">Peran (Role)</th>
                  <th className="py-2 px-3">Nama Lengkap</th>
                  <th className="py-2 px-3">Jabatan / Posisi</th>
                  <th className="py-2 px-3">Divisi / Instansi</th>
                  <th className="py-2 px-3">Kontak Email</th>
                  <th className="py-2 px-3 w-10 text-right no-print"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.stakeholders.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                        s.role === 'Sponsor' ? 'bg-purple-100 text-purple-800' :
                        s.role === 'PM' ? 'bg-blue-100 text-blue-800' :
                        s.role === 'Steering Committee' ? 'bg-amber-100 text-amber-800' :
                        s.role === 'Vendor' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {s.role}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-900">{s.name}</td>
                    <td className="py-2 px-3 text-slate-600">{s.title || '-'}</td>
                    <td className="py-2 px-3 text-slate-600">{s.department || '-'}</td>
                    <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">{s.email || '-'}</td>
                    <td className="py-2 px-3 text-right no-print">
                      <button
                        type="button"
                        onClick={() => handleRemoveStakeholder(s.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Stakeholder Inline Form */}
          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded no-print">
            <p className="text-xs font-semibold text-slate-700 mb-2">Tambah Stakeholder Baru:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
              <select
                value={newStakeholder.role}
                onChange={e => setNewStakeholder(prev => ({ ...prev, role: e.target.value as any }))}
                className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {STAKEHOLDER_ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <input
                type="text"
                value={newStakeholder.name || ''}
                onChange={e => setNewStakeholder(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nama Lengkap *"
                className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <input
                type="text"
                value={newStakeholder.title || ''}
                onChange={e => setNewStakeholder(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Jabatan"
                className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <input
                type="email"
                value={newStakeholder.email || ''}
                onChange={e => setNewStakeholder(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={handleAddStakeholder}
                className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
          </div>
        </div>

        {/* Formal Sign-off Section for PDF / Print */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wide mb-4 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Pengesahan & Tanda Tangan Resmi (Charter Mandate)
          </h4>
          <div className="grid grid-cols-2 gap-8 text-xs">
            <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
              <p className="font-semibold text-slate-800">Disetujui oleh Project Sponsor:</p>
              <p className="text-slate-600 mt-0.5">{formData.projectSponsor || "[Nama Project Sponsor]"}</p>
              <div className="h-16 border-b border-dashed border-slate-300 my-2"></div>
              <p className="text-[11px] text-slate-400">Tanda Tangan & Tanggal</p>
            </div>
            <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
              <p className="font-semibold text-slate-800">Diterima oleh Project Manager:</p>
              <p className="text-slate-600 mt-0.5">{formData.projectManager || "[Nama Project Manager]"}</p>
              <div className="h-16 border-b border-dashed border-slate-300 my-2"></div>
              <p className="text-[11px] text-slate-400">Tanda Tangan & Tanggal</p>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: LIHAT PDF (PREVIEW PDF MODAL / VIEWER) */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-300 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wide">Pratinjau Dokumen Project Charter (PDF Preview)</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onExportPdf}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download / Print PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body formatted as genuine document */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-100 flex justify-center">
              <div className="bg-white w-full max-w-3xl p-8 rounded shadow-md border border-slate-200 text-xs text-slate-800 space-y-6">
                
                {/* Official Letterhead */}
                <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">PROJECT MANAGEMENT OFFICE (PMO)</span>
                    <h1 className="text-xl font-bold text-slate-900 mt-1">{formData.projectName || "PROJECT CHARTER"}</h1>
                    <p className="text-slate-600 font-mono text-[11px] mt-0.5">Kode Dokumen: {formData.projectCode || "PMO-PRE-2026-084"}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                      STATUS: AUTHORIZED
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Dicetak: {new Date().toLocaleDateString('id-ID')}</p>
                  </div>
                </div>

                {/* Metadata Summary Table */}
                <div className="border border-slate-200 rounded overflow-hidden">
                  <div className="grid grid-cols-2 divide-x divide-slate-200 bg-slate-50/60 p-3 text-[11px]">
                    <div>
                      <p className="text-slate-500">Project Sponsor:</p>
                      <p className="font-bold text-slate-900">{formData.projectSponsor || "-"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Project Manager:</p>
                      <p className="font-bold text-slate-900">{formData.projectManager || "-"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 p-3 text-[11px]">
                    <div>
                      <p className="text-slate-500">Tanggal Mulai:</p>
                      <p className="font-mono text-slate-800">{formData.startDate || "-"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Target Selesai:</p>
                      <p className="font-mono text-slate-800">{formData.targetEndDate || "-"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Estimasi Budget:</p>
                      <p className="font-bold text-slate-900">{formData.currency} {formData.budgetEstimated || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Scope Sections */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide border-b border-slate-200 pb-1 mb-1.5">
                      1. Tujuan & Sasaran Proyek (Purpose & Objectives)
                    </h4>
                    <p className="leading-relaxed text-slate-700 whitespace-pre-line">{formData.scopeObjectives || "Belum diisi"}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide border-b border-slate-200 pb-1 mb-1.5">
                      2. Deliverables Utama (In-Scope Deliverables)
                    </h4>
                    <p className="leading-relaxed text-slate-700 whitespace-pre-line">{formData.inScopeDeliverables || "Belum diisi"}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide border-b border-slate-200 pb-1 mb-1.5">
                      3. Batasan di Luar Lingkup (Out-of-Scope Exclusions)
                    </h4>
                    <p className="leading-relaxed text-slate-700 whitespace-pre-line">{formData.outOfScopeExclusions || "Belum diisi"}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide border-b border-slate-200 pb-1 mb-1.5">
                      4. Asumsi Utama & Kendala (Assumptions & Constraints)
                    </h4>
                    <p className="leading-relaxed text-slate-700 whitespace-pre-line">{formData.keyAssumptions || "Belum diisi"}</p>
                  </div>
                </div>

                {/* Stakeholders Table */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wide border-b border-slate-200 pb-1 mb-2">
                    5. Pemangku Kepentingan Utama (Key Stakeholders Register)
                  </h4>
                  <table className="w-full text-left border border-slate-200 text-[11px]">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="p-2 border-b">Peran</th>
                        <th className="p-2 border-b">Nama</th>
                        <th className="p-2 border-b">Jabatan</th>
                        <th className="p-2 border-b">Divisi</th>
                        <th className="p-2 border-b">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.stakeholders.map(s => (
                        <tr key={s.id}>
                          <td className="p-2 font-medium">{s.role}</td>
                          <td className="p-2 font-bold text-slate-900">{s.name}</td>
                          <td className="p-2 text-slate-600">{s.title || "-"}</td>
                          <td className="p-2 text-slate-600">{s.department || "-"}</td>
                          <td className="p-2 font-mono text-[10px] text-slate-500">{s.email || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Sign-off Boxes */}
                <div className="pt-6 border-t border-slate-300">
                  <div className="grid grid-cols-2 gap-8 text-[11px]">
                    <div className="border border-slate-300 p-4 rounded text-center">
                      <p className="font-bold text-slate-900">Project Sponsor</p>
                      <div className="h-14 border-b border-dashed border-slate-300 my-2"></div>
                      <p className="font-bold">{formData.projectSponsor || "-"}</p>
                      <p className="text-[10px] text-slate-400">Tanggal: ___________________</p>
                    </div>
                    <div className="border border-slate-300 p-4 rounded text-center">
                      <p className="font-bold text-slate-900">Project Manager</p>
                      <div className="h-14 border-b border-dashed border-slate-300 my-2"></div>
                      <p className="font-bold">{formData.projectManager || "-"}</p>
                      <p className="text-[10px] text-slate-400">Tanggal: ___________________</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Pratinjau tampilan format cetak resmi</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-50"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={onExportPdf}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs"
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
