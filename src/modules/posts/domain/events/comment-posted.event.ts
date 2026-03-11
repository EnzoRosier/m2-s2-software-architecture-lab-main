export const CommentCreatedEvent = 'comment.created';

export type CommentPostedEventPayload = {
  postTitle: string,
  commentAuthor: string,
  postId: string,
  userId: string,
};
