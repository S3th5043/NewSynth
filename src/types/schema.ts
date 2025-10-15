// Draft schema plan for future database integration
export type User = {
  id: string;
  email: string;
  createdAt: string;
};

export type Project = {
  id: string;
  userId: string;
  title: string;
  uvzScore?: number;
  createdAt: string;
};

export type Charter = {
  id: string;
  projectId: string;
  vision: string;
  pillars: string[];
  steps: Array<{ title: string; description: string }>;
};

export type Progress = {
  projectId: string;
  completedStepIds: string[];
  lastUpdated: string;
};
