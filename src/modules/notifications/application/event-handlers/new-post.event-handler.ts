import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../../infrastructure/services/notification.service';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { UserService } from 'src/modules/users/infrastructure/services/user.service';
import { NewPostEvent, type NewPostEventPayload } from 'src/modules/posts/domain/events/new-post.event';
import { FollowService } from 'src/modules/follows/infrastructure/services/follow.service';

@Injectable()
export class NewPostPendingEventHandler {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly followService: FollowService,
    private readonly userService: UserService,
  ) {}

  @OnEvent(NewPostEvent)
  public async handle(payload: NewPostEventPayload) {
    const user = await this.userService.getUser(payload.authorId);
    const targets = await this.followService.getUserFollowers(payload.authorId)
    for (const target of targets) {
      const notification = NotificationEntity.create(
        'NEW_POST_FROM_FOLLOWED',
        `${user.username} published a new post`,
        `${user.username} published a new post named "${payload.postTitle}"`,
        `/posts/${payload.postId}`,
        target.followerId,
      );

      await this.notificationService.createNotification(notification);
    }
  }
}
