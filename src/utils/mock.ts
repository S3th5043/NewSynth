export type SimulationCategory = 'generate' | 'upload' | 'export' | 'analysis' | 'save';

const CATEGORY_WINDOWS: Record<SimulationCategory, [number, number]> = {
  generate: [30_000, 60_000],
  upload: [2_000, 10_000],
  export: [15_000, 30_000],
  analysis: [45_000, 90_000],
  save: [1_000, 3_000],
};

export type ProgressEvent = {
  progress: number; // 0..100
  message?: string;
};

export type SimulationOptions = {
  category: SimulationCategory;
  messages?: string[];
  errorRate?: number; // 0..1
  onProgress?: (evt: ProgressEvent) => void;
  signal?: AbortSignal;
};

export async function simulateTask<T = void>(opts: SimulationOptions, compute?: () => T | Promise<T>): Promise<T> {
  const [minMs, maxMs] = CATEGORY_WINDOWS[opts.category];
  const total = Math.floor(minMs + Math.random() * (maxMs - minMs));
  const start = Date.now();
  const errorRate = opts.errorRate ?? 0.08;
  const steps = opts.messages ?? [];
  let stepIndex = 0;

  return new Promise<T>((resolve, reject) => {
    const tick = () => {
      if (opts.signal?.aborted) {
        reject(new Error('cancelled'));
        return;
      }
      const elapsed = Date.now() - start;
      let progress = Math.min(100, Math.round((elapsed / total) * 100));
      if (progress >= 100) progress = 99; // reserve finalization jump

      const message = steps.length > 0 ? steps[Math.min(stepIndex, steps.length - 1)] : undefined;
      if (opts.onProgress) opts.onProgress({ progress, message });

      // advance step approximately evenly
      if (steps.length > 0) {
        const stepEvery = total / steps.length;
        if (elapsed >= (stepIndex + 1) * stepEvery && stepIndex < steps.length - 1) stepIndex += 1;
      }

      if (elapsed < total) {
        setTimeout(tick, 400 + Math.random() * 400);
      } else {
        // maybe error
        if (Math.random() < errorRate) {
          reject(new Error('A transient error occurred. Please try again.'));
          return;
        }
        Promise.resolve(compute ? compute() : (undefined as unknown as T))
          .then((result) => {
            if (opts.onProgress) opts.onProgress({ progress: 100, message: 'Done' });
            resolve(result);
          })
          .catch(reject);
      }
    };
    tick();
  });
}

export function generateMarkdownParagraphs(topic: string, min = 3, max = 6): string {
  const count = Math.max(min, Math.min(max, Math.floor(min + Math.random() * (max - min + 1))));
  const paras: string[] = [];
  const openers = [
    `In this chapter, we dive into ${topic.toLowerCase()} and set a clear path forward.`,
    `To get value from ${topic.toLowerCase()}, we need a practical approach — not theory.`,
    `Most teams struggle with ${topic.toLowerCase()}; this chapter makes it concrete and achievable.`,
  ];
  for (let i = 0; i < count; i++) {
    const opener = openers[Math.floor(Math.random() * openers.length)];
    const body = `We break the work into small, repeatable steps, supported by checklists and templates. Along the way, you will see examples, learn common pitfalls, and get a measuring method to ensure you're making steady progress.`;
    paras.push(`${opener}\n\n${body}`);
  }
  return paras.join('\n\n');
}
