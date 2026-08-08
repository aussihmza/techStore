import { useState } from "react";
import ProductImage from "@/user/components/ui/ProductImage";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-8 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.25)] sm:p-12">
        <ProductImage
          src={main}
          alt={alt}
          fit="contain"
          className="h-full w-full transition-opacity duration-300"
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            aria-label={`View image ${i + 1}`}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
            className={`aspect-square overflow-hidden rounded-xl border bg-white p-2 transition-all ${
              active === i
                ? "border-brand ring-2 ring-brand/30"
                : "border-slate-200 hover:border-brand/40"
            }`}
          >
            <ProductImage src={src} alt={`${alt} thumbnail ${i + 1}`} fit="contain" className="h-full w-full" />
          </button>
        ))}
      </div>
    </div>
  );
}
