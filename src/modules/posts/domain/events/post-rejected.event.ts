export const PostRejectedEvent = 'post.rejected';

export type PostedRejectedEventPayload = {
  postTitle: string,
  userId: string,
  postId: string
};
