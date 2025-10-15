"use client";
import { useState } from 'react';

export default function RagLab() {
  const [projectId, setProjectId] = useState('default');
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{text:string; score:number}>>([]);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  async function ingest() {
    const docs = text.split(/\n\n+/).map((t) => ({ text: t.trim() })).filter((d) => d.text.length > 0);
    if (docs.length === 0) return;
    await fetch('/api/rag/ingest', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId, docs }) });
  }

  async function doSearch() {
    const res = await fetch('/api/rag/search', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId, query, topK:5 }) });
    const data = await res.json();
    setResults(data.results ?? []);
  }

  async function ask() {
    setLoading(true); setAnswer('');
    try {
      const res = await fetch('/api/rag/answer', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectId, query, topK:4 }) });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        setAnswer((prev) => prev + decoder.decode(value));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">RAG Lab</h1>

      <div className="rounded-xl glass p-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="text-sm">Project ID</label>
            <input value={projectId} onChange={(e)=>setProjectId(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
        </div>
        <label className="text-sm">Paste documents (blank line separates docs)</label>
        <textarea value={text} onChange={(e)=>setText(e.target.value)} rows={8} className="w-full rounded-md border p-2" placeholder="Doc 1...\n\nDoc 2..." />
        <div className="flex justify-end">
          <button onClick={ingest} className="rounded-md bg-primary px-3 py-2 text-white btn-glow">Ingest</button>
        </div>
      </div>

      <div className="rounded-xl glass p-4 space-y-3">
        <label className="text-sm">Query</label>
        <input value={query} onChange={(e)=>setQuery(e.target.value)} className="w-full rounded-md border px-3 py-2" />
        <div className="flex gap-2 justify-end">
          <button onClick={doSearch} className="rounded-md border px-3 py-2">Search</button>
          <button disabled={loading} onClick={ask} className="rounded-md bg-primary px-3 py-2 text-white btn-glow">{loading?'Asking…':'Ask with Context'}</button>
        </div>
        {results.length > 0 && (
          <div className="text-sm text-gray-700">
            <div className="font-medium">Top results</div>
            <ol className="list-decimal pl-5">
              {results.map((r, i) => (<li key={i} className="mt-1">{r.text} <span className="text-gray-400">({r.score.toFixed(3)})</span></li>))}
            </ol>
          </div>
        )}
        {answer && (
          <div className="mt-3">
            <div className="text-sm text-gray-500">Answer</div>
            <div className="whitespace-pre-wrap">{answer}</div>
          </div>
        )}
      </div>
    </main>
  );
}
