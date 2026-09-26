import { useState } from 'react';
import { Download, Upload, Copy, Check, RotateCcw, AlertTriangle, FileJson, CheckCircle2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { ConfirmModal } from '../common/ConfirmModal';

export function ExportManager() {
  const { content, exportJson, importJson, resetToDefaults } = useContent();

  const [copied, setCopied] = useState(false);
  const [pasteJsonText, setPasteJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleCopyClipboard = async () => {
    try {
      const dataStr = JSON.stringify(content, null, 2);
      await navigator.clipboard.writeText(dataStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setImportStatus('Failed to copy to clipboard.');
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const ok = importJson(result);
        if (ok) {
          setImportStatus('Successfully imported configuration file!');
        } else {
          setImportStatus('Invalid JSON file. Please check schema.');
        }
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const handlePasteImport = () => {
    if (!pasteJsonText.trim()) return;
    const ok = importJson(pasteJsonText);
    if (ok) {
      setImportStatus('Successfully imported JSON from paste!');
      setPasteJsonText('');
    } else {
      setImportStatus('Invalid JSON content. Parse failed.');
    }
    setTimeout(() => setImportStatus(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-[#2b2b2b]">
        <h2 className="text-xl sm:text-2xl font-black text-[#f1f2ed] font-quicksand uppercase">
          GitHub Pages Export, Import & Backup
        </h2>
        <p className="text-xs text-[#a8a6a1]">
          Download a complete `content.json` snapshot to commit to your GitHub repository, backup your settings, or load new content schemas.
        </p>
      </div>

      {importStatus && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Export Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#f1f2ed] uppercase font-quicksand">
              Download content.json
            </h3>
            <p className="text-xs text-[#a8a6a1] leading-relaxed">
              Downloads your complete current state (all projects, videos, images, branding, and copy) as an optimized JSON file suitable for static GitHub Pages hosting.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-[#232323]">
            <button
              onClick={exportJson}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-xs font-semibold uppercase tracking-wider text-white transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON File</span>
            </button>
            <button
              onClick={handleCopyClipboard}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] text-xs font-semibold text-[#f1f2ed] border border-[#2b2b2b] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
        </div>

        {/* Upload File Section */}
        <div className="p-6 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#232323] text-[#3b82f6] flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#f1f2ed] uppercase font-quicksand">
              Upload / Restore JSON File
            </h3>
            <p className="text-xs text-[#a8a6a1] leading-relaxed">
              Upload a previously downloaded `content.json` file. This immediately applies all data to the CMS and public website.
            </p>
          </div>

          <div className="pt-4 border-t border-[#232323]">
            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] text-xs font-semibold uppercase tracking-wider text-[#f1f2ed] border border-[#2b2b2b] cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-[#2563eb]" />
              <span>Select File (*.json)</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Paste Raw JSON */}
      <div className="p-6 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <FileJson className="w-4 h-4 text-[#2563eb]" />
          <h3 className="text-base font-bold text-[#f1f2ed] uppercase font-quicksand">
            Direct JSON Import / Paste
          </h3>
        </div>

        <textarea
          rows={5}
          value={pasteJsonText}
          onChange={(e) => setPasteJsonText(e.target.value)}
          placeholder="Paste raw JSON content here..."
          className="w-full px-4 py-3 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] font-mono focus:border-[#2563eb] focus:outline-none"
        />

        <button
          onClick={handlePasteImport}
          disabled={!pasteJsonText.trim()}
          className="px-5 py-2.5 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] disabled:opacity-30 text-xs font-semibold uppercase tracking-wider text-[#f1f2ed] border border-[#2b2b2b] transition-colors"
        >
          Import Pasted JSON
        </button>
      </div>

      {/* Danger Zone: Reset to seed */}
      <div className="p-6 rounded-2xl bg-[#1d1d1d] border border-red-950/40 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <h3 className="text-base font-bold uppercase font-quicksand">
            Danger Zone
          </h3>
        </div>

        <p className="text-xs text-[#a8a6a1] leading-relaxed max-w-xl">
          Reset all website content back to the default SHPIXELS seed data (including default project showreels, Sharif Abs biography, and service categories).
        </p>

        <button
          onClick={() => setResetConfirmOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-xs font-semibold text-red-300 border border-red-800/40 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Content to Seed Defaults</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={resetConfirmOpen}
        title="Reset All Content to Defaults"
        message="Are you sure you want to reset all content back to factory initial state? All custom edits will be reverted."
        confirmLabel="Reset Everything"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          resetToDefaults();
          setResetConfirmOpen(false);
        }}
        onCancel={() => setResetConfirmOpen(false)}
      />
    </div>
  );
}
