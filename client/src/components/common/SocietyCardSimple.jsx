import Button from "./Button";

export default function SocietyCardSimple({
  name,
  category,
  members,
  description,
  head,
  onJoin,
  onLearnMore,
  joinLabel,
  joinLoading,
  joinDisabled,
  joinOutlined,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col gap-4 p-4 rounded-lg border border-[#30363d] bg-[#161b22] hover:bg-[#21262d] transition-colors ${className}`}
    >
      <div>
        <h2 className="text-[#e6edf3] text-lg font-bold leading-tight">
          {name}
        </h2>
        <p className="text-[#238636] text-sm font-semibold mt-1">
          {category}
        </p>
      </div>

      <p className="text-[#8b949e] text-sm font-normal leading-normal">
        {description}
      </p>

      <div className="flex flex-col gap-2 text-sm text-[#8b949e] border-t border-[#30363d] pt-3">
        <p>👥 {members} members</p>
        <p>🎯 Head: {head}</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={joinOutlined ? "secondary" : "primary"}
          className={`flex-1 h-8 px-3 text-xs flex items-center justify-center gap-2 ${joinOutlined ? "border-[#30363d] text-[#8b949e]" : ""}`}
          onClick={onJoin}
          disabled={joinDisabled}
        >
          {joinLoading ? <span className="material-symbols-outlined animate-spin text-sm">sync</span> : null}
          {joinLabel || "Join"}
        </Button>
        <Button
          variant="secondary"
          className="flex-1 h-8 px-3 text-xs"
          onClick={onLearnMore}
        >
          Learn More
        </Button>
      </div>
    </div>
  );
}
