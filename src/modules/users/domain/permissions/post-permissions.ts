import { PostEntity } from '../../../posts/domain/entities/post.entity';
import { UserRole } from '../entities/user.entity';

export class PostPermissions {
  constructor(
    private readonly userId: string,
    private readonly role: UserRole,
  ) {}

  public canCreate(): boolean {
    return this.role === 'writer';
  }

  public canUpdateContent(post: PostEntity): boolean {
    return post.status === 'draft' && post.authorId === this.userId;
  }

  public canReadPost(post: PostEntity): boolean {
    if (post.authorId === this.userId) return true;
    if (this.role === 'admin' || this.role === 'moderator') return true;

    return post.status === 'accepted';
  }

  public canReadAllPosts(): boolean {
    if (this.role === 'admin' || this.role === 'moderator') return true;
    return false
  }

  public canUpdatePostTags(post: PostEntity): boolean {
    if (post.authorId === this.userId) return true;
    return (this.role === 'admin');

  }

  public canSetToWaiting(post: PostEntity): boolean {
    if (post.authorId === this.userId && (post.status === 'draft' || post.status === 'waiting')) return true;
    
    return false
  }

  public canModeratePost(post: PostEntity): boolean {
    if (this.role === 'admin' || this.role === 'moderator') return true;
    return false
  }

  public canChangePostSlug(post: PostEntity): boolean {
    if (this.role === 'admin') return true;
    return post.authorId === this.userId
  }
}
