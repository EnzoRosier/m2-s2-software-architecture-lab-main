import { PostEntity } from '../../../posts/domain/entities/post.entity';
import { UserRole } from '../entities/user.entity';

export class NotificationPermissions {
  constructor(
    private readonly userId: string,
    private readonly role: UserRole,
  ) {}

  public canRead(notifId: string): boolean {
    return (this.userId === notifId);
  }
}
