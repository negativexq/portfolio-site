export type ArticleFrontmatter = {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  category?: string;
  tags: readonly string[];
  featured: boolean;
  relatedProjects: readonly string[];
  relatedLearning: readonly string[];
  relatedWriting: readonly string[];
  draft: boolean;
  seoTitle?: string;
};

export type WritingArticle = ArticleFrontmatter & {
  body: string;
  readingTime: number;
};

export type WritingArticleSummary = Omit<WritingArticle, "body">;

export type WritingTopic = {
  slug: string;
  title: string;
  description: string;
};
