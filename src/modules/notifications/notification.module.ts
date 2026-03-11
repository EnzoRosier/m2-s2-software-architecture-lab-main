import { Module } from '@nestjs/common';
import { AuthModule } from '../shared/auth/auth.module';
// import { InMemoryPostRepository } from './infrastructure/repositories/post.in-memory.repository';

import { NotificationRepository } from './domain/repositories/notification.repository';
import { NotificationService } from './infrastructure/services/notification.service';
import { SQLiteNotificationRepository } from './infrastructure/repositories/notification.sqlite.repository';
import { NotificationCommentCreatedEventHandler } from './application/event-handlers/notification-comment-created.event-handler';
import { PostRejectedEvent } from '../posts/domain/events/post-rejected.event';
import { NotificationPostAcceptedEventHandler } from './application/event-handlers/post-accepted.event-handler';
import { NotificationPostDeletedEventHandler } from './application/event-handlers/post-deleted.event-handler';
import { NotificationPostRejectedEventHandler } from './application/event-handlers/post-rejected.event-handler';
import { UserService } from '../users/infrastructure/services/user.service';
import { UserModule } from '../users/user.module';
import { NotificationPostPendingEventHandler } from './application/event-handlers/post-pending.event-handler';
import { NewPostPendingEventHandler } from './application/event-handlers/new-post.event-handler';
import { FollowModule } from '../follows/follows.module';
import { NotificationController } from './infrastructure/controllers/notification.controller';
import { GetNotificationUseCase } from './application/use-cases/get-notification.use-case';
import { ReadSingleNotificationUseCase } from './application/use-cases/read-single-notification.use-case';
import { ReadAllNotificationsUseCase } from './application/use-cases/read-all-notifications.use-case';

@Module({
  imports: [AuthModule, UserModule, FollowModule],
  controllers: [NotificationController],
  providers: [
    {
      provide: NotificationRepository,
      useClass: SQLiteNotificationRepository,
    },
    NotificationService,
    NotificationCommentCreatedEventHandler,
    NotificationPostRejectedEventHandler,
    NotificationPostAcceptedEventHandler,
    NotificationPostDeletedEventHandler,
    NotificationPostPendingEventHandler,
    NewPostPendingEventHandler,
    GetNotificationUseCase,
    ReadSingleNotificationUseCase,
    ReadAllNotificationsUseCase,
  ],
})
export class NotificationModule {}
