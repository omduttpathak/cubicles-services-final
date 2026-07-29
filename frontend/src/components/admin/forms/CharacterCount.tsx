export default function CharacterCount({
  current,
  maximum,
}: {
  current: number
  maximum: number
}) {
  const isNearLimit = current >= maximum * 0.9

  return (
    <p
      className={[
        "mt-2 text-right text-xs font-semibold",
        isNearLimit ? "text-amber-600" : "text-slate-400",
      ].join(" ")}
    >
      {current}/{maximum}
    </p>
  )
}
