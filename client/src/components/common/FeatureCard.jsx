export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="group flex flex-col gap-3 p-6 rounded-xl border border-[#30363d] bg-[#161b22] hover:bg-[#1a2027] hover:border-[#238636]/50 hover:shadow-[0_4px_24px_rgba(35,134,54,0.15)] transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#238636]/10 text-[#2ea043] text-3xl group-hover:bg-[#238636]/20 transition-colors duration-300">
        {icon}
      </div>
      <h2 className="text-[#e6edf3] text-lg font-bold leading-tight group-hover:text-white transition-colors">
        {title}
      </h2>
      <p className="text-[#8b949e] text-sm font-normal leading-relaxed">
        {description}
      </p>
    </div>
  );
}
