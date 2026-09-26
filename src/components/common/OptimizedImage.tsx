import { useState, useRef, useEffect, ImgHTMLAttributes } from 'react';

export interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Generates responsive srcset breakpoints for Unsplash CDN or compatible image sources
 */
export function generateResponsiveSrcSet(src: string): string | undefined {
  if (!src || typeof src !== 'string') return undefined;

  // Support Unsplash URLs with dynamic width queries
  if (src.includes('images.unsplash.com')) {
    try {
      const url = new URL(src);
      const widths = [360, 540, 720, 960, 1200, 1600];
      return widths
        .map((w) => {
          const u = new URL(url.toString());
          u.searchParams.set('w', w.toString());
          u.searchParams.set('auto', 'format');
          u.searchParams.set('fit', 'crop');
          u.searchParams.set('q', '80');
          return `${u.toString()} ${w}w`;
        })
        .join(', ');
    } catch {
      return undefined;
    }
  }

  return undefined;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  sizes,
  priority = false,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const srcSet = generateResponsiveSrcSet(src);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      {...(priority ? { fetchPriority: 'high' } : {})}
      onLoad={(e) => {
        setIsLoaded(true);
        if (props.onLoad) props.onLoad(e);
      }}
      onError={(e) => {
        setHasError(true);
        if (onError) onError(e);
      }}
      className={`transition-opacity duration-500 ${
        isLoaded || hasError ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      {...props}
    />
  );
}
