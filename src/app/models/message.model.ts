export interface IMessage {
  id: string;
  messageText: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
  };
}
