import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationEntity } from '../../domain/entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  public async createNotification(notification: NotificationEntity) {
    await this.notificationRepository.createNotification(notification)
  }

  public async createNotifications(notification: NotificationEntity[]) {
    await this.notificationRepository.createNotifications(notification)
  }
}
