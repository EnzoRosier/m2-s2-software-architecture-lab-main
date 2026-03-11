import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../../infrastructure/services/notification.service';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import {
  type PostedPendingEventPayload,
  PostPendingEvent,
} from 'src/modules/posts/domain/events/post-pending.event';
import { UserService } from 'src/modules/users/infrastructure/services/user.service';

@Injectable()
export class NotificationPostPendingEventHandler {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {}

  @OnEvent(PostPendingEvent)
  public async handle(payload: PostedPendingEventPayload) {
    const targets = await this.userService.getModsAdmins();
    for (const target of targets) {
      const notification = NotificationEntity.create(
        'POST_PENDING_REVIEW',
        'A post is waiting for a review',
        `The post "${payload.postTitle}" is waiting for a review`,
        `/posts/${payload.postId}`,
        target.id,
      );

      await this.notificationService.createNotification(notification);
    }
  }
}
