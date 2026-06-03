export interface Source {
  source: string;
  content: string;
  similarity?: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tools?: string[];
  sources?: Source[];
  streaming?: boolean;
}