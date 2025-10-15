export type UVZInput = {
  audienceStruggles: string[];
  skills: string[];
  experienceYears: number;
};

export type UVZResult = {
  score: number; // 0-100
  explanation: string;
  intersections: Array<{ topic: string; weight: number }>;
};

export type CharterInput = {
  productName: string;
  audience: string;
  outcomes: string[];
};

export type CharterOutput = {
  vision: string;
  pillars: string[];
  steps: Array<{ title: string; description: string }>;
};

export type TemplateCategory = {
  id: string;
  name: string;
  templates: Template[];
};

export type Template = {
  id: string;
  title: string;
  summary: string;
  categoryId: string;
};
