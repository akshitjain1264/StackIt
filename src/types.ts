export interface Question {
  id: number;
  title: string;
  description: string;
  username: string;
  answers: number;
  views: number;
  votes: number;
  tags: string[];
  timeAgo: string;
  hasAcceptedAnswer?: boolean;
}

export type Answer = {
  id: number;
  text: string;
  votes: number;
  votedByUser: boolean;
};

export interface Notification {
  id: number;
  type: 'answer' | 'comment' | 'mention';
  title: string;
  message: string;
  username: string;
  timeAgo: string;
  isRead: boolean;
  questionTitle?: string;
}
