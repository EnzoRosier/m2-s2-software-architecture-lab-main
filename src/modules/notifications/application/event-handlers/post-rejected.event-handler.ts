import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../../infrastructure/services/notification.service';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { type PostedRejectedEventPayload, PostRejectedEvent } from 'src/modules/posts/domain/events/post-rejected.event';

@Injectable()
export class NotificationPostRejectedEventHandler {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent(PostRejectedEvent)
  public handle(payload: PostedRejectedEventPayload) {
    const notification = NotificationEntity.create(
      'POST_REJECTED',
      'Your post was rejected',
      `A moderator rejected your post "${payload.postTitle}"`,
      `/posts/${payload.postId}`,
      payload.userId,
    );
    this.notificationService.createNotification(notification);
  }
}
