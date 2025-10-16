import { Queue, Worker, QueueEvents, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://127.0.0.1:6379');

export const jobQueue = new Queue('jobs', { connection });
export const jobEvents = new QueueEvents('jobs', { connection });

export function registerWorker() {
  const worker = new Worker(
    'jobs',
    async (job) => {
      // basic demo worker; extend per job.type
      if (job.name === 'ingest') {
        // do ingestion
      }
      return {};
    },
    { connection }
  );
  worker.on('failed', (job, err) => {
    // eslint-disable-next-line no-console
    console.error('Job failed', job?.id, err);
  });
}

export async function enqueue(name: string, data: any, opts?: JobsOptions) {
  await jobQueue.add(name, data, opts);
}
