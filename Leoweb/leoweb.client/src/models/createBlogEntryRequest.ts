export interface CreateBlogEntryRequest {
  title: string;
  description: string;
  category: string;
  content: {
    text: string;
    links: string[];
    images: string[];
  };
  commentsAllowed: boolean;
}

