import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Instagram, Youtube, Linkedin, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';

export function Contact() {
  const { content } = useContent();
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const contact = content.contact;

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: 'Commercial & Brand Ads',
    budget: '$3k - $5k',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;
    setSubmitted(true);
  };

  const servicesList = isAr
    ? ['إعلانات تجارية', 'ذكاء اصطناعي وموشن', 'أعراس وفعاليات', 'تصوير رياضي', 'أفلام طبية']
    : ['Commercial & Brand Ads', 'AI & Motion Graphics', 'Luxury Weddings & Events', 'Sports Cinematography', 'Medical Films'];

  const budgetList = isAr
    ? ['أقل من 3 آلاف دولار', '3k$ - 5k$', '5k$ - 10k$', '10k$+ إنتاج سينمائي']
    : ['< $3,000', '$3,000 - $5,000', '$5,000 - $10,000', '$10,000+ Full Cinema'];

  return (
    <section id="contact" className="relative py-16 sm:py-24 bg-[#171717] border-t border-[#2b2b2b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column: Direct Links & Info */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d1d1d] border border-[#2b2b2b] text-[10px] sm:text-[11px] font-mono tracking-widest text-[#a8a6a1] uppercase">
                <MessageSquare className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>{isAr ? 'بدء التعاون الإبداعي' : 'INITIATE COLLABORATION'}</span>
              </div>
              <h2 className="text-2xl sm:text-5xl font-black text-[#f1f2ed] tracking-tight uppercase font-quicksand leading-tight">
                {contact.ctaHeading || (isAr ? 'لنصنع معاً عملاً بصرياً لا يُنسى' : "LET'S CREATE SOMETHING UNFORGETTABLE")}
              </h2>
              <div className="text-xs sm:text-base text-[#a8a6a1] leading-relaxed">
                <p>
                  {contact.ctaSubtitle || (isAr 
                    ? 'هل لديك حملة إعلانية، فيلم وثائقي، أو مناسبة استثنائية ترغب في توثيقها بأعلى معايير السينما؟ تواصل معنا لنناقش رؤيتك.'
                    : "Have a commercial campaign, wedding, film production, or creative concept? Share your vision and let's craft cinematic impact together.")}
                </p>
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] hover:border-[#2563eb]/60 transition-colors group"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#232323] text-[#38bdf8] group-hover:bg-[#2563eb] group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-[#706e6a]">
                    {isAr ? 'البريد الإلكتروني المباشر' : 'Email Directly'}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-[#f1f2ed] group-hover:text-white truncate">
                    {contact.email}
                  </p>
                </div>
              </a>

              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] hover:border-[#2563eb]/60 transition-colors group"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#232323] text-[#38bdf8] group-hover:bg-[#2563eb] group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-[#706e6a]">
                    {isAr ? 'الهاتف / واتساب' : 'Phone / WhatsApp'}
                  </p>
                  <div className="text-xs sm:text-sm font-semibold text-[#f1f2ed] group-hover:text-white" dir="ltr">
                    {contact.phone}
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b]">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#232323] text-[#706e6a] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-[#706e6a]">
                    {isAr ? 'الموقع واستوديوهات التصوير' : 'Base of Operation'}
                  </p>
                  <div className="text-xs sm:text-sm font-semibold text-[#f1f2ed]">
                    {contact.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Social channels */}
            <div className="pt-2">
              <p className="text-xs font-mono uppercase tracking-wider text-[#706e6a] mb-3">
                {isAr ? 'القنوات الرسمية' : 'Official Channels'}
              </p>
              <div className="flex items-center gap-2.5">
                {contact.instagram && (
                  <a
                    id="contact-instagram-btn"
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] hover:border-[#2563eb] text-[#a8a6a1] hover:text-white hover:bg-[#2563eb] transition-all"
                    title="Instagram @shpixels"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {contact.youtube && (
                  <a
                    id="contact-youtube-btn"
                    href={contact.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] hover:border-[#2563eb] text-[#a8a6a1] hover:text-white hover:bg-[#2563eb] transition-all"
                    title="YouTube @shpixels"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
                {contact.linkedin && (
                  <a
                    id="contact-linkedin-btn"
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] hover:border-[#2563eb] text-[#a8a6a1] hover:text-white hover:bg-[#2563eb] transition-all"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {contact.responseTimeNote && (
              <div className="flex items-center gap-2 text-xs text-[#a8a6a1] font-mono">
                <Clock className="w-3.5 h-3.5 text-[#2563eb]" />
                <span>{isAr ? 'الرد النموذجي: خلال 24 ساعة عمل' : contact.responseTimeNote}</span>
              </div>
            )}
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-8 rounded-2xl bg-[#1d1d1d] border border-[#2b2b2b] shadow-2xl relative">
              {submitted ? (
                <div className="py-12 sm:py-16 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-[#2563eb]/20 border border-[#2563eb] text-[#38bdf8] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 sm:w-8 h-7 sm:h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#f1f2ed] font-quicksand">
                    {isAr ? 'تم إرسال رسالتك بنجاح' : 'Message Dispatched Successfully'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#a8a6a1] max-w-md mx-auto">
                    {isAr 
                      ? 'شكراً لتواصلك. سيقوم المخرج شريف عبس بمراجعة تفاصيل المشروع والتواصل معك خلال 24 ساعة.'
                      : 'Thank you for reaching out. Sharif Abs will review your production request and respond within 24 business hours.'}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({
                        name: '',
                        email: '',
                        service: 'Commercial & Brand Ads',
                        budget: '$3k - $5k',
                        message: ''
                      });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#232323] hover:bg-[#2b2b2b] text-[#f1f2ed] transition-colors cursor-pointer"
                  >
                    {isAr ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                        {isAr ? 'الاسم بالكامل *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder={isAr ? 'مثال: أحمد المنصور' : 'e.g. Alexander Vance'}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#232323] border border-[#2b2b2b] focus:border-[#2563eb] focus:outline-none text-xs sm:text-sm text-[#f1f2ed]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                        {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#232323] border border-[#2b2b2b] focus:border-[#2563eb] focus:outline-none text-xs sm:text-sm text-[#f1f2ed]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-2">
                      {isAr ? 'نوع الإنتاج المطلوب' : 'Project Type'}
                    </label>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                      {servicesList.map((srv) => (
                        <button
                          key={srv}
                          type="button"
                          onClick={() => setFormState({ ...formState, service: srv })}
                          className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors text-center cursor-pointer truncate ${
                            formState.service === srv
                              ? 'bg-[#2563eb] text-white'
                              : 'bg-[#232323] text-[#a8a6a1] hover:text-[#f1f2ed] border border-[#2b2b2b]'
                          }`}
                        >
                          {srv}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-2">
                      {isAr ? 'الميزانية المتوقعة للإنتاج' : 'Estimated Production Budget'}
                    </label>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                      {budgetList.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setFormState({ ...formState, budget: b })}
                          className={`px-3 py-2 rounded-xl text-xs font-mono transition-colors text-center cursor-pointer truncate ${
                            formState.budget === b
                              ? 'bg-[#2563eb] text-white'
                              : 'bg-[#232323] text-[#a8a6a1] hover:text-[#f1f2ed] border border-[#2b2b2b]'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-1.5">
                      {isAr ? 'تفاصيل الفكرة والرؤية' : 'Project Brief & Vision'}
                    </label>
                    <textarea
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder={isAr ? 'صف أهداف الحملة، المدة المقترحة، المواعيد النهائية، أو شارك مراجع بصرية...' : 'Describe timeline, shoot locations, target audience, visual references...'}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#232323] border border-[#2b2b2b] focus:border-[#2563eb] focus:outline-none text-xs sm:text-sm text-[#f1f2ed] resize-none"
                    />
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    className="w-full py-3.5 sm:py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#2563eb] hover:bg-[#3b82f6] transition-all duration-200 shadow-xl flex items-center justify-center gap-2 border border-[#3b82f6]/40 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isAr ? 'إرسال تفاصيل المشروع' : 'Submit Production Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
