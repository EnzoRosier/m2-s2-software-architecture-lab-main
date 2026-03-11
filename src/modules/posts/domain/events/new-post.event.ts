export const NewPostEvent = 'post.new';

export type NewPostEventPayload = {
  postTitle: string,
  authorId: string,
  postId: string
};
