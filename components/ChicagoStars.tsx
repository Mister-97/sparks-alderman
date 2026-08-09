const STAR_PATH =
  "M50,0 L60.75,31.38 L93.3,25 L71.5,50 L93.3,75 L60.75,68.62 L50,100 L39.25,68.62 L6.7,75 L28.5,50 L6.7,25 L39.25,31.38 Z";

/** Single six-pointed star from the Chicago flag. */
export function ChicagoStar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={`shrink-0 fill-brand-red ${className}`}
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

/** Row of stars — four, as on the Chicago flag. */
export default function ChicagoStars({
  count = 4,
  className = "",
  starClassName = "w-6 h-6 md:w-7 md:h-7",
}: {
  count?: number;
  className?: string;
  starClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-2 md:gap-3 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <ChicagoStar key={i} className={starClassName} />
      ))}
    </div>
  );
}
