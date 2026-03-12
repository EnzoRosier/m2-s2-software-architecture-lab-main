export class AddCommentDto {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}
