export const PostAcceptedEvent = 'post.accepted';

export type PostedAcceptedEventPayload = {
  postTitle: string,
  userId: string,
  postId: string
};
