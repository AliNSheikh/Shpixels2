import { useState } from 'react';
import { Globe, Mail, Phone, MessageSquare, Instagram, Youtube, Linkedin, ExternalLink, Save, Check } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export function LinkManager() {
  const { content, updateContent } = useContent();

  const [contactLinks, setContactLinks] = useState({ ...content.contact });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent({
      contact: contactLinks
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2b2b2b]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#f1f2ed] font-quicksand uppercase">
            Centralized Social & Contact Links
          </h2>
          <p className="text-xs text-[#a8a6a1]">
            Configure official studio channels, messaging endpoints, and telephone numbers across all public templates.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-xs font-semibold uppercase tracking-wider text-white transition-all shadow-md self-start sm:self-auto"
        >
          {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Links Saved!' : 'Save All Links'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Direct Contact Endpoints */}
        <div className="p-6 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-[#f1f2ed] uppercase font-quicksand pb-2 border-b border-[#232323]">
            Direct Communication Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Inquiry Email Address</span>
              </label>
              <input
                type="email"
                required
                value={contactLinks.email}
                onChange={(e) => setContactLinks({ ...contactLinks, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Studio Direct Telephone</span>
              </label>
              <input
                type="text"
                value={contactLinks.phone}
                onChange={(e) => setContactLinks({ ...contactLinks, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>WhatsApp Direct URL</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={contactLinks.whatsapp}
                  onChange={(e) => setContactLinks({ ...contactLinks, whatsapp: e.target.value })}
                  placeholder="https://wa.me/..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none font-mono"
                />
                <a
                  href={contactLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#232323] text-[#a8a6a1] hover:text-white"
                  title="Test Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                Studio Location / Regional Availability
              </label>
              <input
                type="text"
                value={contactLinks.location}
                onChange={(e) => setContactLinks({ ...contactLinks, location: e.target.value })}
                placeholder="e.g. Worldwide & Middle East / Europe"
                className="w-full px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Media Channels */}
        <div className="p-6 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-[#f1f2ed] uppercase font-quicksand pb-2 border-b border-[#232323]">
            Official Social Media URLs
          </h3>

          <div className="space-y-4">
            {/* Instagram */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>Instagram Profile URL</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={contactLinks.instagram}
                  onChange={(e) => setContactLinks({ ...contactLinks, instagram: e.target.value })}
                  placeholder="https://instagram.com/shpixels"
                  className="flex-1 px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none font-mono"
                />
                <a
                  href={contactLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#232323] text-[#a8a6a1] hover:text-white"
                  title="Test Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* YouTube */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>YouTube Channel URL</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={contactLinks.youtube}
                  onChange={(e) => setContactLinks({ ...contactLinks, youtube: e.target.value })}
                  placeholder="https://youtube.com/@shpixels"
                  className="flex-1 px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none font-mono"
                />
                <a
                  href={contactLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#232323] text-[#a8a6a1] hover:text-white"
                  title="Test Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>LinkedIn URL</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={contactLinks.linkedin}
                  onChange={(e) => setContactLinks({ ...contactLinks, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#232323] border border-[#2b2b2b] text-xs text-[#f1f2ed] focus:border-[#2563eb] focus:outline-none font-mono"
                />
                <a
                  href={contactLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#232323] text-[#a8a6a1] hover:text-white"
                  title="Test Link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
