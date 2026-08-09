const COLORS = [
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#6366f1",
  "#14b8a6",
  "#a855f7",
  "#64748b",
];

export type ProductOrderSlice = {
  productSlug: string;
  name: string;
  quantity: number;
};

type Props = {
  slices: ProductOrderSlice[];
};

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeSlice(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export default function ProductOrdersPieChart({ slices }: Props) {
  const total = slices.reduce((sum, s) => sum + s.quantity, 0);

  if (total === 0) {
    return (
      <p className="px-5 py-10 text-center text-sm text-slate-400">
        No order items yet — place some orders to see product share.
      </p>
    );
  }

  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = 132;
  let angle = 0;

  const arcs = slices.map((slice, index) => {
    const portion = (slice.quantity / total) * 360;
    const startAngle = angle;
    const endAngle = angle + portion;
    angle = endAngle;
    const mid = startAngle + portion / 2;
    // Full circle: use a circle element instead of a zero-width arc
    const path =
      portion >= 359.99
        ? undefined
        : describeSlice(cx, cy, r, startAngle, endAngle);
    return {
      ...slice,
      color: COLORS[index % COLORS.length],
      percent: (slice.quantity / total) * 100,
      path,
      fullCircle: portion >= 359.99,
      mid,
    };
  });

  return (
    <div className="flex flex-col items-center gap-8 px-5 py-5 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-72 w-72 shrink-0 drop-shadow-sm sm:h-80 sm:w-80"
        role="img"
        aria-label="Orders by product pie chart"
      >
        {arcs.map((arc) =>
          arc.fullCircle ? (
            <circle key={arc.productSlug} cx={cx} cy={cy} r={r} fill={arc.color} />
          ) : (
            <path
              key={arc.productSlug}
              d={arc.path}
              fill={arc.color}
              className="transition duration-200 hover:opacity-90"
            >
              <title>
                {arc.name}: {arc.quantity} units ({arc.percent.toFixed(1)}%)
              </title>
            </path>
          ),
        )}
        <circle cx={cx} cy={cy} r={70} fill="white" />
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          className="fill-slate-800 text-[32px] font-bold"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          className="fill-slate-400 text-[13px] font-medium"
        >
          units sold
        </text>
      </svg>

      <ul className="w-full max-w-sm space-y-2.5">
        {arcs.map((arc) => (
          <li
            key={arc.productSlug}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: arc.color }}
              />
              <span className="truncate font-medium text-slate-700" title={arc.name}>
                {arc.name}
              </span>
            </span>
            <span className="shrink-0 tabular-nums text-slate-500">
              {arc.quantity} · {arc.percent.toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
