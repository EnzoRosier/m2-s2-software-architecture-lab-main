import { PostEntity } from '../../../posts/domain/entities/post.entity';
import { UserRole } from '../entities/user.entity';

export class CommentPermissions {
  constructor(
    private readonly userId: string,
    private readonly role: UserRole,
  ) {}

  public canCreate(post: PostEntity): boolean {
    return post.status === 'accepted';
  }

}
