import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../../infrastructure/services/notification.service';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { PostDeletedEvent, type PostDeletedEventPayload } from 'src/modules/posts/domain/events/post-deleted.event';

@Injectable()
export class NotificationPostDeletedEventHandler {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent(PostDeletedEvent)
  public handle(payload: PostDeletedEventPayload) {
    const notification = NotificationEntity.create(
      'POST_DELETED',
      'Your post was deleted',
      `A moderator deleted your post "${payload.title}"`,
      `/posts`,
      payload.userId,
    );
    this.notificationService.createNotification(notification);
  }
}
