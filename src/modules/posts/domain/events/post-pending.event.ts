export const PostPendingEvent = 'post.pending';

export type PostedPendingEventPayload = {
  postTitle: string,
  username: string,
  postId: string
};
