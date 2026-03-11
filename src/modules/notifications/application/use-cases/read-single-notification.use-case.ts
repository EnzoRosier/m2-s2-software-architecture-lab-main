import { Injectable } from '@nestjs/common';
import { GetNotificationDto } from '../dtos/get-notification.dto';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import {  NotificationNotFoundException } from '../../domain/exceptions/notification-not-found.exception';
import { CannotReadNotificationException } from '../../domain/exceptions/cannot-read-notification.exception';


@Injectable()
export class ReadSingleNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(
    user: UserEntity,
    idNotification: string
  ): Promise<NotificationEntity> {
    

    const notification = await this.notificationRepository.getNotificationById(idNotification);

    if (!notification) {
      throw new NotificationNotFoundException
    }

    if (!user.permissions.notification.canRead(notification.userId)) {
      throw new CannotReadNotificationException()
    }
    notification.update(true);
    await this.notificationRepository.updateNotification(notification.id, notification)

    return notification
  }
}
