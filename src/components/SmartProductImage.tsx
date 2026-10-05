import React, { useState } from 'react';
import { ProductArtwork } from './ProductArtwork';

interface SmartProductImageProps {
  src?: string;
  alt: string;
  type: string;
  className?: string;
  imageClassName?: string;
}

export const SmartProductImage: React.FC<SmartProductImageProps> = ({
  src,
  alt,
  type,
  className = '',
  imageClassName = 'w-full h-full object-cover',
}) => {
  const [loadError, setLoadError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If no source is provided or loading errored, show styled artwork fallback
  if (!src || loadError) {
    return <ProductArtwork type={type} title={alt} className={className} />;
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[var(--color-surface-subtle)] ${className}`}>
      {/* Soft shimmer skeleton while image is loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      )}

      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setLoadError(true)}
        className={`${imageClassName} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
