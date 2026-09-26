import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Link, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { compressImageFile } from '../../utils/imageCompressor';

interface ImageUploadDropzoneProps {
  value?: string;
  onChange?: (urlOrDataUrl: string) => void;
  onUploadSuccess?: (urlOrDataUrl: string) => void;
  label?: string;
  aspectRatio?: string;
  placeholder?: string;
  helperText?: string;
  previewFit?: 'contain' | 'cover';
  compact?: boolean;
}

export function ImageUploadDropzone({
  value = '',
  onChange,
  onUploadSuccess,
  label,
  aspectRatio = 'aspect-video',
  placeholder = 'https://...',
  helperText,
  previewFit = 'cover',
  compact = false
}: ImageUploadDropzoneProps) {
  const { language } = useLanguage();
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (url: string) => {
    if (onChange) onChange(url);
    if (onUploadSuccess) onUploadSuccess(url);
  };

  const processFile = (file: File) => {
    const isImageFile = 
      file.type.startsWith('image/') || 
      /\.(ico|svg|png|jpe?g|webp|gif|bmp|avif)$/i.test(file.name);

    if (!isImageFile) {
      setError(language === 'ar' ? 'يرجى اختيار ملف صورة صالح (SVG, PNG, ICO, JPG, WebP)' : 'Please select a valid image file (SVG, PNG, ICO, JPG, WebP)');
      return;
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError(language === 'ar' ? 'حجم الملف كبير جداً (الحد الأقصى 10 ميغابايت)' : 'File size exceeds 10MB limit.');
      return;
    }

    setError(null);
    compressImageFile(file)
      .then((compressedUrl) => {
        handleUpdate(compressedUrl);
      })
      .catch(() => {
        setError(language === 'ar' ? 'حدث خطأ أثناء قراءة الملف' : 'Failed to read image file');
      });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-mono uppercase text-[#a8a6a1]">
            {label}
          </label>
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-2 py-0.5 rounded transition-colors ${
                mode === 'upload' ? 'bg-[#2563eb] text-white' : 'text-[#706e6a] hover:text-[#f1f2ed]'
              }`}
            >
              {language === 'ar' ? 'رفع من الكمبيوتر' : 'Desktop Upload'}
            </button>
            <span className="text-[#333]">|</span>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-2 py-0.5 rounded transition-colors ${
                mode === 'url' ? 'bg-[#2563eb] text-white' : 'text-[#706e6a] hover:text-[#f1f2ed]'
              }`}
            >
              {language === 'ar' ? 'رابط URL' : 'Image URL'}
            </button>
          </div>
        </div>
      )}

      {/* Mode: Desktop Upload */}
      {mode === 'upload' ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all p-4 text-center ${
            isDragging
              ? 'border-[#2563eb] bg-[#2563eb]/10 scale-[1.01]'
              : value
              ? 'border-[#2b2b2b] bg-[#1d1d1d] hover:border-[#2563eb]/50'
              : 'border-[#2b2b2b] bg-[#232323] hover:border-[#2563eb] hover:bg-[#272727]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.ico,.svg"
            onChange={handleFileChange}
            className="hidden"
          />

          {value ? (
            <div className="space-y-3">
              <div className={`relative ${aspectRatio} ${compact ? 'max-h-28' : 'max-h-48'} mx-auto rounded-lg overflow-hidden border border-[#2b2b2b] bg-[#111111] flex items-center justify-center p-2`}>
                <img 
                  src={value} 
                  alt="Preview" 
                  className={`max-w-full max-h-full ${previewFit === 'contain' ? 'object-contain' : 'w-full h-full object-cover'}`} 
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate('');
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-red-400 hover:text-white hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-[#a8a6a1] font-mono">
                {language === 'ar' ? 'انقر أو اسحب صورة جديدة لتغييرها' : 'Click or drop a new image to replace'}
              </p>
            </div>
          ) : (
            <div className={`${compact ? 'py-2.5' : 'py-4'} space-y-2`}>
              <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-xl bg-[#2b2b2b] text-[#2563eb] flex items-center justify-center mx-auto`}>
                <Upload className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
              </div>
              <div className="text-xs text-[#f1f2ed] font-medium">
                {language === 'ar' ? 'اسحب وأفلت الصورة من جهازك، أو انقر للتصفح' : 'Drag & drop image from desktop, or click to browse'}
              </div>
              <p className="text-[10px] text-[#706e6a] font-mono">
                SVG, PNG, ICO, JPG, WEBP (Up to 10MB)
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Mode: Image URL Input */
        <div className="space-y-3">
          <div className="relative">
            <input
              type="url"
              value={value}
              onChange={(e) => {
                setError(null);
                handleUpdate(e.target.value);
              }}
              placeholder={placeholder}
              className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#232323] border border-[#2b2b2b] focus:border-[#2563eb] focus:outline-none text-xs text-[#f1f2ed] font-mono"
            />
            <Link className="w-4 h-4 text-[#706e6a] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {value && (
            <div className={`relative ${aspectRatio} ${compact ? 'max-h-28' : 'max-h-48'} rounded-lg overflow-hidden border border-[#2b2b2b] bg-[#111111] flex items-center justify-center p-2`}>
              <img 
                src={value} 
                alt="URL Preview" 
                className={`max-w-full max-h-full ${previewFit === 'contain' ? 'object-contain' : 'w-full h-full object-cover'}`} 
              />
              <button
                type="button"
                onClick={() => handleUpdate('')}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-red-400 hover:text-white hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 font-mono">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {helperText && (
        <p className="text-[10px] text-[#706e6a] font-mono">{helperText}</p>
      )}
    </div>
  );
}
