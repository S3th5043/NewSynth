export default function ProgressSteps({ current, total, className = '' }: { current: number; total: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, i) => i + 1).map((i) => (
        <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= current ? 'bg-primary' : 'bg-gray-200'}`} />
      ))}
      <span className="ml-2 text-xs text-gray-500">Step {current} of {total}</span>
    </div>
  );
}
