import { Injectable } from '@nestjs/common';
import { GetNotificationDto } from '../dtos/get-notification.dto';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { NotificationNotFoundException } from '../../domain/exceptions/notification-not-found.exception';
import { CannotReadNotificationException } from '../../domain/exceptions/cannot-read-notification.exception';
import { ReadAllNotificationDto } from '../dtos/read-all-notifications.dto';

@Injectable()
export class ReadAllNotificationsUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(user: UserEntity): Promise<ReadAllNotificationDto> {
    const notifications = await this.notificationRepository.getAllNotifications(
      user.id,
    );
    let count = 0;
    for (const notification of notifications) {
      if (!notification.isRead) {
        notification.update(true);
        await this.notificationRepository.updateNotification(
          notification.id,
          notification,
        );
        count++;
      }
    }
    let res = new ReadAllNotificationDto()
    res.markedCount = count;
    return res;
  }
}
