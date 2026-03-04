export interface BlogAuthor {
  userId: string;
  username: string;
  firstname: string;
  lastname: string;
}

export interface BlogContent {
  text: string;
  links: string[];
  images: string[];  // base64-encoded images
}

export interface BlogEntry {
  id: string;
  title: string;
  author: BlogAuthor;
  description: string;
  category: string;
  creationDate: string;
  editDates: string[];
  impressionCount: number;
  content: BlogContent;
  commentsAllowed: boolean;
}

