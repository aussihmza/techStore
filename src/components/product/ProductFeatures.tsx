import type { ProductFeature } from "@/types/product";
import {
  CameraIcon,
  HeadphonesIcon,
  LaptopIcon,
  MobileIcon,
  ShieldIcon,
  ZapIcon,
} from "@/components/ui/icons";

const toneStyles: Record<ProductFeature["tone"], string> = {
  light: "bg-slate-100 text-ink",
  dark: "bg-slate-800 text-white",
  accent: "bg-sky-100 text-ink",
  media: "bg-slate-100 text-ink",
};

function FeatureIcon({ icon, dark }: { icon?: ProductFeature["icon"]; dark?: boolean }) {
  const cls = `h-10 w-10 ${dark ? "text-brand" : "text-brand/40"}`;
  switch (icon) {
    case "shield":
      return <ShieldIcon className={cls} />;
    case "camera":
      return <CameraIcon className={cls} />;
    case "sound":
      return <HeadphonesIcon className={cls} />;
    case "display":
      return <LaptopIcon className={cls} />;
    case "battery":
    case "speed":
      return <ZapIcon className={cls} />;
    case "island":
      return (
        <div className="flex h-10 w-16 items-center justify-center">
          <div className={`h-4 w-14 rounded-full ${dark ? "bg-brand" : "bg-slate-800"}`} />
        </div>
      );
    case "chip":
    default:
      return <MobileIcon className={cls} />;
  }
}

export default function ProductFeatures({ features }: { features: ProductFeature[] }) {
  return (
    <section className="py-16">
      <h2 className="text-center text-2xl font-bold text-ink sm:text-3xl">
        Engineered for Performance
      </h2>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {features.map((feature, i) => {
          const dark = feature.tone === "dark";
          return (
            <article
              key={feature.title}
              className={`relative overflow-hidden rounded-2xl p-8 ${toneStyles[feature.tone]} ${
                i === 0 ? "sm:min-h-[220px]" : "sm:min-h-[200px]"
              }`}
            >
              <div className="relative z-10 max-w-md">
                <h3 className={`text-xl font-bold ${dark ? "text-white" : "text-ink"}`}>
                  {feature.title}
                </h3>
                <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-500"}`}>
                  {feature.description}
                </p>
              </div>
              <div className="absolute bottom-6 right-6 opacity-80">
                <FeatureIcon icon={feature.icon} dark={dark} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
