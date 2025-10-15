import { readFromStorage, writeToStorage } from '@/utils/storage';

export type ProductStatus = 'Draft' | 'Complete' | 'Published';

export type Product = {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  status: ProductStatus;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  views: number;
  downloads: number;
  revenueUsd?: number;
  engagementScore?: number; // 0 - 100
  completionRate?: number; // 0 - 100
};

const KEY = 'products:list';

export function listProducts(): Product[] {
  return readFromStorage<Product[]>(KEY, []);
}

function saveProducts(products: Product[]) {
  writeToStorage(KEY, products);
}

export function seedProductsIfEmpty(): Product[] {
  const existing = listProducts();
  if (existing.length > 0) return existing;
  const now = Date.now();
  const seeded: Product[] = [
    {
      id: crypto.randomUUID(),
      title: 'AI Course Charter',
      description: 'Outcome-driven program for busy professionals',
      status: 'Draft',
      createdAt: now - 1000 * 60 * 60 * 24 * 5,
      updatedAt: now - 1000 * 60 * 60 * 6,
      tags: ['education', 'ai'],
      views: 324,
      downloads: 48,
      revenueUsd: 0,
      engagementScore: 72,
      completionRate: 64,
    },
    {
      id: crypto.randomUUID(),
      title: 'Coaching Pro Workbook',
      description: 'Step-by-step workbook template',
      status: 'Complete',
      createdAt: now - 1000 * 60 * 60 * 24 * 12,
      updatedAt: now - 1000 * 60 * 60 * 48,
      tags: ['coaching', 'template'],
      views: 1022,
      downloads: 230,
      revenueUsd: 0,
      engagementScore: 80,
      completionRate: 71,
    },
    {
      id: crypto.randomUUID(),
      title: 'Content Engine Guide',
      description: 'Notion + AI content operating system',
      status: 'Published',
      createdAt: now - 1000 * 60 * 60 * 24 * 30,
      updatedAt: now - 1000 * 60 * 60 * 12,
      tags: ['marketing'],
      views: 4801,
      downloads: 933,
      revenueUsd: 12970,
      engagementScore: 88,
      completionRate: 76,
    },
  ];
  saveProducts(seeded);
  return seeded;
}

export function createProduct(partial: Partial<Product>): Product {
  const products = listProducts();
  const now = Date.now();
  const product: Product = {
    id: crypto.randomUUID(),
    title: partial.title ?? 'Untitled product',
    description: partial.description ?? '',
    thumbnailUrl: partial.thumbnailUrl,
    status: partial.status ?? 'Draft',
    createdAt: now,
    updatedAt: now,
    tags: partial.tags ?? [],
    views: Math.floor(Math.random() * 100),
    downloads: Math.floor(Math.random() * 10),
    revenueUsd: partial.revenueUsd ?? 0,
    engagementScore: Math.floor(60 + Math.random() * 40),
    completionRate: Math.floor(50 + Math.random() * 50),
  };
  products.unshift(product);
  saveProducts(products);
  return product;
}

export function getProductById(id: string): Product | undefined {
  return listProducts().find((p) => p.id === id);
}

export function updateProduct(id: string, changes: Partial<Product>): Product | undefined {
  const products = listProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  const updated: Product = { ...products[idx], ...changes, updatedAt: Date.now() };
  products[idx] = updated;
  saveProducts(products);
  return updated;
}

export function deleteProduct(id: string): void {
  const products = listProducts().filter((p) => p.id !== id);
  saveProducts(products);
}

export function duplicateProduct(id: string): Product | undefined {
  const product = getProductById(id);
  if (!product) return undefined;
  return createProduct({
    title: product.title + ' (Copy)',
    description: product.description,
    thumbnailUrl: product.thumbnailUrl,
    status: 'Draft',
    tags: product.tags,
  });
}

export type SeriesPoint = { date: string; value: number };

export function getPerformanceSeries(productId: string, days = 14): { views: SeriesPoint[]; downloads: SeriesPoint[] } {
  // deterministic pseudo-random based on id
  let seed = [...productId].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const today = new Date();
  const make = (base: number) =>
    Array.from({ length: days }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (days - 1 - i));
      return { date: d.toISOString().slice(0, 10), value: Math.max(0, Math.round(base * (0.6 + rand())) ) };
    });
  return {
    views: make(100),
    downloads: make(20),
  };
}

// Exports
export async function exportProductPdf(product: Product) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  doc.setFontSize(18);
  doc.text(product.title, 40, 60);
  doc.setFontSize(12);
  doc.text(`Status: ${product.status}`, 40, 90);
  if (product.description) doc.text(doc.splitTextToSize(product.description, 515), 40, 120);
  doc.save(`${product.title.replace(/\s+/g, '_')}.pdf`);
}
