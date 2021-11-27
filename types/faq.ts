export type FAQContentType = 'plain_text' | 'html';

export interface FAQContent {
  content: string;
  type: FAQContentType;
}

export interface FAQData {
  id: string;
  question: FAQContent;
  answer?: Partial<FAQContent>;
  tags?: string[];
}
