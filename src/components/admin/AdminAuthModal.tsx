import React, { useState } from 'react';
import { 
  Film, ArrowRight, ShieldCheck, Lock, Eye, EyeOff, 
  AlertCircle, KeyRound, CheckCircle2, RefreshCw 
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';

export function AdminAuthModal() {
  const { loginAdmin, setIsAdminView } = useContent();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;
    if (!password.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال كلمة المرور' : 'Please enter your password');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const res = await loginAdmin(password);
      if (!res.success) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);

        if (nextAttempts >= 5) {
          setLockoutSeconds(60);
          setErrorMsg(
            isAr 
              ? 'تم حظر المحاولات مؤقتاً لمدة دقيقة لحماية اللوحة من الهجمات.' 
              : 'Too many attempts. Locked out for 60 seconds.'
          );
          const interval = setInterval(() => {
            setLockoutSeconds((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                setFailedAttempts(0);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          setErrorMsg(
            res.error || (isAr ? 'كلمة المرور غير صحيحة. يرجى المحاولة ثانية.' : 'Incorrect password. Access denied.')
          );
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4 selection:bg-[#2563eb] selection:text-white">
      <div className="max-w-md w-full rounded-2xl bg-[#171717] border border-[#2b2b2b] p-7 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#2563eb]/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#38bdf8]/10 blur-3xl pointer-events-none rounded-full" />

        {/* Header Icon & Title */}
        <div className="space-y-3 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#2563eb]/25 border border-[#3b82f6]/40">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#f1f2ed] tracking-wider uppercase font-quicksand">
            {isAr ? 'لوحة تحكم SHPIXELS' : 'SHPIXELS CMS'}
          </h2>
          <p className="text-xs text-[#a8a6a1] font-mono">
            {isAr ? 'تسجيل دخول آمن ومشفّر (SHA-256)' : 'Encrypted Administrator Authentication'}
          </p>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/50 text-red-300 text-xs font-mono flex items-center gap-2 text-left animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Security Info Notice */}
        <div className="p-3.5 rounded-xl bg-[#1d1d1d] border border-[#2b2b2b] text-left space-y-2 text-xs text-[#a8a6a1]">
          <div className="flex items-center justify-between text-emerald-400 font-mono font-semibold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'حماية مشفرة ببصمة ملحية' : 'Salted Hash Encryption Active'}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setPassword('mografix2026');
                setErrorMsg(null);
                setLockoutSeconds(0);
                setFailedAttempts(0);
              }}
              className="text-[10px] text-[#38bdf8] hover:underline cursor-pointer font-sans"
            >
              {isAr ? 'ملء كلمة المرور الافتراضية' : 'Fill default password'}
            </button>
          </div>
          <p className="text-[11px] text-[#706e6a] leading-relaxed">
            {isAr 
              ? 'كلمة المرور الافتراضية الأولية هي: mografix2026 ويمكن تغييرها في أي وقت من تبويب الإعدادات.' 
              : 'Initial master password is: mografix2026 (You can update this anytime inside Site Settings).'}
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left relative z-10">
          <div>
            <label className="block text-xs font-mono uppercase text-[#a8a6a1] mb-2 flex items-center justify-between">
              <span>{isAr ? 'كلمة المرور' : 'Admin Password'}</span>
              {lockoutSeconds > 0 && (
                <span className="text-amber-400 font-bold">
                  {isAr ? `حظر: ${lockoutSeconds} ثانية` : `Locked: ${lockoutSeconds}s`}
                </span>
              )}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#706e6a]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                autoFocus
                disabled={lockoutSeconds > 0 || isVerifying}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isAr ? 'أدخل كلمة المرور...' : 'Enter your password...'}
                className="w-full pl-10 pr-12 py-3 rounded-xl bg-[#232323] border border-[#2b2b2b] focus:border-[#2563eb] text-sm text-[#f1f2ed] placeholder-[#706e6a] focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#706e6a] hover:text-[#f1f2ed] transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            disabled={isVerifying || lockoutSeconds > 0}
            className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider text-white bg-[#2563eb] hover:bg-[#3b82f6] disabled:opacity-50 transition-all shadow-xl shadow-[#2563eb]/20 flex items-center justify-center gap-2 border border-[#3b82f6]/40 cursor-pointer"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>{isAr ? 'جارِ التحقق...' : 'Authenticating...'}</span>
              </>
            ) : (
              <>
                <span>{isAr ? 'الدخول إلى لوحة التحكم' : 'Enter Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-[#232323] flex items-center justify-between text-xs text-[#706e6a] relative z-10">
          <div className="flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-[#2563eb]" />
            <span>SHPIXELS Studio</span>
          </div>
          <button
            onClick={() => setIsAdminView(false)}
            className="hover:text-[#f1f2ed] underline transition-colors cursor-pointer"
          >
            {isAr ? 'العودة للموقع العام' : 'Back to Public Site'}
          </button>
        </div>
      </div>
    </div>
  );
}
