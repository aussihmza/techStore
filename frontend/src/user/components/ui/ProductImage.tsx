import { useEffect, useState } from "react";
import { ImagePlaceholderIcon } from "@/user/components/ui/icons";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fit?: "contain" | "cover";
}

export default function ProductImage({ src, alt, className, fit = "contain" }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-slate-100 text-slate-300 ${className ?? ""}`}>
        <ImagePlaceholderIcon className="h-10 w-10" />
        <span className="text-[10px] font-medium text-slate-400">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`${fit === "cover" ? "object-cover" : "object-contain"} ${className ?? ""}`}
    />
  );
}
