import { UserRole } from '../entities/user.entity';
import { CommentPermissions } from './comment-permissions';
import { PostPermissions } from './post-permissions';
import { TagsPermissions } from './tags-permissions';

export class Permissions {
  public readonly posts: PostPermissions;
  public readonly tags: TagsPermissions;
  public readonly comments: CommentPermissions;

  constructor(userId: string, role: UserRole) {
    this.posts = new PostPermissions(userId, role);
    this.tags = new TagsPermissions(userId, role);
    this.comments = new CommentPermissions(userId, role);
  }
}
