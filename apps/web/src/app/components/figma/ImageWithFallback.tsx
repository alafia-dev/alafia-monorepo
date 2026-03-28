import type { ImgHTMLAttributes } from "react";

export type ImageWithFallbackProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  fallback: string;
  alt: string;
};

export default function ImageWithFallback({
  src,
  fallback,
  alt,
  ...props
}: ImageWithFallbackProps) {
  return (
    <img
      src={src}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallback;
      }}
      alt={alt}
      {...props}
    />
  );
}
