"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { readFromStorage, writeToStorage } from '@/utils/storage';
import { motion } from 'framer-motion';
import { Trash2, FileDown, Link2, Upload } from 'lucide-react';

export type KBItem = {
  id: string;
  type: 'file' | 'url' | 'text';
  name: string;
  size?: number;
  content?: string;
  tags?: string[];
  folder?: string;
  createdAt: number;
  status: 'ready' | 'processing' | 'error';
};

const KEY = 'kb:items';

export default function KnowledgeBaseManager() {
  const [items, setItems] = useState<KBItem[]>([]);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setItems(readFromStorage<KBItem[]>(KEY, []));
  }, []);

  useEffect(() => {
    writeToStorage(KEY, items);
  }, [items]);

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return items.filter((i) => i.name.toLowerCase().includes(q) || (i.tags ?? []).some((t) => t.toLowerCase().includes(q)));
  }, [items, filter]);

  function addItem(item: KBItem) {
    setItems((prev) => [item, ...prev]);
  }

  async function onFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      const id = crypto.randomUUID();
      addItem({ id, type: 'file', name: file.name, size: file.size, createdAt: Date.now(), status: 'processing' });
      // simulate processing
      setTimeout(() => {
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'ready', content: `Processed content of ${file.name}` } : x)));
      }, 800);
    }
    if (fileRef.current) fileRef.current.value = '';
  }

  async function onScrapeUrl() {
    if (!url) return;
    const id = crypto.randomUUID();
    addItem({ id, type: 'url', name: url, createdAt: Date.now(), status: 'processing' });
    setUrl('');
    setTimeout(() => {
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, status: 'ready', content: `Scraped content from ${x.name}` } : x)));
    }, 900);
  }

  function onAddText() {
    if (!text.trim()) return;
    const id = crypto.randomUUID();
    addItem({ id, type: 'text', name: text.slice(0, 24) + '…', content: text, createdAt: Date.now(), status: 'ready' });
    setText('');
  }

  function onDelete(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl glass p-4">
          <h3 className="font-medium text-gray-900">Upload files</h3>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onFilesSelected(e.dataTransfer.files); }}
            className="mt-3 flex h-28 items-center justify-center rounded-md border-2 border-dashed text-gray-500"
          >
            Drag & drop files here
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input ref={fileRef} type="file" multiple onChange={(e) => onFilesSelected(e.target.files)} className="block" />
            <button className="inline-flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-gray-50"><Upload className="h-4 w-4"/> Browse</button>
          </div>
        </div>

        <div className="rounded-xl glass p-4">
          <h3 className="font-medium text-gray-900">Scrape URL</h3>
          <div className="mt-3 flex gap-2">
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/article" className="w-full rounded-md border px-3 py-2" />
            <button onClick={onScrapeUrl} className="rounded-md bg-primary px-3 py-2 text-white btn-glow">Scrape</button>
          </div>
        </div>

        <div className="sm:col-span-2 rounded-xl glass p-4">
          <h3 className="font-medium text-gray-900">Paste text</h3>
          <textarea value={text} onChange={(e) => setText(e.target.value)} className="mt-2 w-full rounded-md border p-2 h-32" placeholder="Paste notes or references…" />
          <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
            <span>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
            <button onClick={onAddText} className="rounded-md border px-3 py-1.5 hover:bg-gray-50">Save snippet</button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Knowledge base</h3>
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search…" className="rounded-md border px-3 py-1.5" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((i) => (
          <motion.div key={i.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{i.name}</p>
                <p className="text-xs text-gray-500">{i.type} • {i.size ? `${(i.size/1024).toFixed(1)} KB` : '—'}</p>
              </div>
              <button className="rounded-md p-1 hover:bg-gray-100" onClick={() => onDelete(i.id)} aria-label="Delete"><Trash2 className="h-4 w-4"/></button>
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-gray-600">{i.content ?? 'Processing…'}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span className={`rounded px-1.5 py-0.5 ${i.status === 'ready' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{i.status}</span>
              <button className="inline-flex items-center gap-1 rounded-md border px-2 py-1 hover:bg-gray-50"><FileDown className="h-3.5 w-3.5"/> Export</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
