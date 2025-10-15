"use client";
import { useRef, useState } from 'react';

export default function ChatLab() {
  const [messages, setMessages] = useState<Array<{role:'user'|'assistant', content:string}>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement|null>(null);

  async function onSend() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    const next = [...messages, { role: 'user' as const, content: text }, { role: 'assistant' as const, content: '' }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role:'user', content:text }] }) });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', content: (copy[copy.length - 1]?.content ?? '') + chunk };
          return copy;
        });
      }
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Chat Lab</h1>
      <div className="space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`rounded-xl p-3 ${m.role==='user' ? 'bg-blue-50' : 'bg-gray-50'}`}>
            <div className="text-xs text-gray-500">{m.role}</div>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl glass p-4 space-y-2">
        <textarea ref={textareaRef} value={input} onChange={(e)=>setInput(e.target.value)} rows={3} className="w-full rounded-md border p-2" placeholder="Ask anything..." />
        <div className="flex justify-end">
          <button disabled={loading} onClick={onSend} className="rounded-md bg-primary px-3 py-2 text-white btn-glow">{loading?'Sending…':'Send'}</button>
        </div>
      </div>
    </main>
  );
}
