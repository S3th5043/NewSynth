"use client";
import { useEffect, useMemo, useState } from 'react';
import { listProducts, seedProductsIfEmpty, deleteProduct, createProduct, duplicateProduct, exportProductPdf, Product } from '@/utils/products';
import { Grid, List as ListIcon, Search, MoreVertical, Trash2, Copy, FileDown, Plus } from 'lucide-react';

export default function ProductsPage() {
  const [view, setView] = useState<'grid'|'list'>('grid');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => { setProducts(seedProductsIfEmpty()); }, []);
  useEffect(() => { setProducts(listProducts()); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter((p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
  }, [products, query]);

  function refresh() { setProducts(listProducts()); }

  function onDelete(id: string) { deleteProduct(id); refresh(); }
  function onDuplicate(id: string) { duplicateProduct(id); refresh(); }
  function onExport(p: Product) { exportProductPdf(p); }
  function onCreate() { createProduct({ title: 'New Product' }); refresh(); }

  const bulkIds = Object.keys(selected).filter((k) => selected[k]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">My Products</h1>
        <button onClick={onCreate} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-white btn-glow"><Plus className="h-4 w-4"/> New Product</button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="w-full rounded-md border px-3 py-2 pl-9" />
          <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="ml-4 inline-flex rounded-md border">
          <button onClick={() => setView('grid')} className={`px-3 py-2 ${view==='grid'?'bg-gray-100':''}`} aria-pressed={view==='grid'}><Grid className="h-4 w-4"/></button>
          <button onClick={() => setView('list')} className={`px-3 py-2 ${view==='list'?'bg-gray-100':''}`} aria-pressed={view==='list'}><ListIcon className="h-4 w-4"/></button>
        </div>
      </div>

      {bulkIds.length > 0 && (
        <div className="mt-3 rounded-md border bg-gray-50 p-3 text-sm text-gray-700">{bulkIds.length} selected — bulk actions coming soon</div>
      )}

      {view === 'grid' ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="rounded-xl glass p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={!!selected[p.id]} onChange={(e) => setSelected({ ...selected, [p.id]: e.target.checked })} />
                  <div>
                    <h3 className="font-medium text-gray-900">{p.title}</h3>
                    <p className="text-sm text-gray-600">{p.status} • {new Date(p.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-md p-2 hover:bg-gray-100" onClick={() => onDuplicate(p.id)} aria-label="Duplicate"><Copy className="h-4 w-4"/></button>
                  <button className="rounded-md p-2 hover:bg-gray-100" onClick={() => onExport(p)} aria-label="Export"><FileDown className="h-4 w-4"/></button>
                  <button className="rounded-md p-2 hover:bg-gray-100" onClick={() => onDelete(p.id)} aria-label="Delete"><Trash2 className="h-4 w-4"/></button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-700">
                <div className="rounded-md border p-2 text-center"><div className="text-gray-400">Views</div><div className="font-medium">{p.views}</div></div>
                <div className="rounded-md border p-2 text-center"><div className="text-gray-400">Downloads</div><div className="font-medium">{p.downloads}</div></div>
                <div className="rounded-md border p-2 text-center"><div className="text-gray-400">Score</div><div className="font-medium">{p.engagementScore ?? 0}%</div></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 divide-y rounded-xl glass">
          {filtered.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={!!selected[p.id]} onChange={(e) => setSelected({ ...selected, [p.id]: e.target.checked })} />
                <div>
                  <h3 className="font-medium text-gray-900">{p.title}</h3>
                  <p className="text-sm text-gray-600">{p.status} • Created {new Date(p.createdAt).toLocaleDateString()} • Updated {new Date(p.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-md p-2 hover:bg-gray-100" onClick={() => onDuplicate(p.id)} aria-label="Duplicate"><Copy className="h-4 w-4"/></button>
                <button className="rounded-md p-2 hover:bg-gray-100" onClick={() => onExport(p)} aria-label="Export"><FileDown className="h-4 w-4"/></button>
                <button className="rounded-md p-2 hover:bg-gray-100" onClick={() => onDelete(p.id)} aria-label="Delete"><Trash2 className="h-4 w-4"/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
