import { UserRole } from '../entities/user.entity';
import { CommentPermissions } from './comment-permissions';
import { NotificationPermissions } from './notification-permissions';
import { PostPermissions } from './post-permissions';
import { TagsPermissions } from './tags-permissions';
import { UserPermissions } from './user-permissions';

export class Permissions {
  public readonly posts: PostPermissions;
  public readonly tags: TagsPermissions;
  public readonly comments: CommentPermissions;
  public readonly user: UserPermissions;
  public readonly notification: NotificationPermissions;

  constructor(userId: string, role: UserRole) {
    this.posts = new PostPermissions(userId, role);
    this.tags = new TagsPermissions(userId, role);
    this.comments = new CommentPermissions(userId, role);
    this.user = new UserPermissions(userId, role)
    this.notification = new NotificationPermissions(userId, role)
  }
}
