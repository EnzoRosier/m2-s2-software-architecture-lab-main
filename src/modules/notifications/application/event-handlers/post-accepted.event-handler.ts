import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../../infrastructure/services/notification.service';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { PostAcceptedEvent, type PostedAcceptedEventPayload } from 'src/modules/posts/domain/events/post-accepted.event';

@Injectable()
export class NotificationPostAcceptedEventHandler {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent(PostAcceptedEvent)
  public handle(payload: PostedAcceptedEventPayload) {
    const notification = NotificationEntity.create(
      'POST_ACCEPTED',
      'Your post was accepted',
      `A moderator accepted your post "${payload.postTitle}"`,
      `/posts/${payload.postId}`,
      payload.userId,
    );
    this.notificationService.createNotification(notification);
  }
}
