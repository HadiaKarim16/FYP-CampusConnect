export default function StepItem({ number, title, description }) {
  return (
    <div className="group flex items-start gap-5 mt-6 first:mt-0 p-4 -ml-4 rounded-xl hover:bg-[#161b22] transition-colors duration-300">
      <div className="relative flex-shrink-0 w-8 h-8 rounded-full bg-[#0d1117] border border-[#30363d] group-hover:border-[#238636] group-hover:shadow-[0_0_12px_rgba(35,134,54,0.3)] flex items-center justify-center text-[#238636] group-hover:text-[#2ea043] text-sm font-bold transition-all duration-300 z-10">
        {number}
      </div>
      <div className="flex flex-col gap-1.5 pt-1">
        <h2 className="text-[#e6edf3] text-base font-bold leading-tight group-hover:text-white transition-colors duration-300">
          {title}
        </h2>
        <p className="text-[#8b949e] text-sm font-normal leading-relaxed md:pr-10">
          {description}
        </p>
      </div>
    </div>
  );
}
