import { StarIcon } from "@/user/components/ui/icons";

interface RatingProps {
  value: number;
  reviews?: number;
}

export default function Rating({ value, reviews }: RatingProps) {
  const hasReviews = (reviews ?? 0) > 0;

  return (
    <div className="flex items-center gap-1">
      <div className="flex text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${
              hasReviews && i < Math.round(value) ? "text-amber-400" : "text-slate-200"
            }`}
          />
        ))}
      </div>
      {reviews !== undefined && (
        <span className="text-sm text-slate-400">
          {hasReviews ? `(${reviews})` : "No reviews"}
        </span>
      )}
    </div>
  );
}
