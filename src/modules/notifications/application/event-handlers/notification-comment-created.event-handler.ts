import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  CommentCreatedEvent,
  type CommentPostedEventPayload,
} from 'src/modules/posts/domain/events/comment-posted.event';
import { NotificationService } from '../../infrastructure/services/notification.service';
import { NotificationEntity } from '../../domain/entities/notification.entity';

@Injectable()
export class NotificationCommentCreatedEventHandler {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent(CommentCreatedEvent)
  public handle(payload: CommentPostedEventPayload) {
    const notification = NotificationEntity.create(
      'NEW_COMMENT',
      'New comment',
      `${payload.commentAuthor} posted a comment on your post "${payload.postTitle}"`,
      `/posts/${payload.postId}/comments`,
      payload.userId,
    );
    this.notificationService.createNotification(notification);
  }
}
