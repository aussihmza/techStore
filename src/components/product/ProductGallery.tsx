import { useState } from "react";
import ProductImage from "@/components/ui/ProductImage";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-slate-100 p-8 sm:p-12">
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
            className={`aspect-square overflow-hidden rounded-xl bg-slate-100 p-2 transition-all ${
              active === i
                ? "ring-2 ring-brand ring-offset-2"
                : "hover:ring-1 hover:ring-slate-300"
            }`}
          >
            <ProductImage src={src} alt={`${alt} thumbnail ${i + 1}`} fit="contain" className="h-full w-full" />
          </button>
        ))}
      </div>
    </div>
  );
}
