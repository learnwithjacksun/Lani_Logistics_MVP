import { useState, useEffect } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  fallback?: string;
}

const Image = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  fallback = '/placeholder.png',
}: ImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    setImgSrc(fallback);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative inline-block">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        width={width}
        height={height}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default Image; 