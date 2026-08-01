export type ErrorSolution = {
  title: string;
  detail: string;
};

export type ErrorEntry = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  causes: string[];
  solutions: ErrorSolution[];
  affected: string[];
  tags: string[];
};
