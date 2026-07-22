import { StarIcon } from "@/components/ui/icons";

interface RatingProps {
  value: number;
  reviews?: number;
}

export default function Rating({ value, reviews }: RatingProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < Math.round(value) ? "text-amber-400" : "text-slate-200"}`}
          />
        ))}
      </div>
      {reviews !== undefined && <span className="text-sm text-slate-400">({reviews})</span>}
    </div>
  );
}
