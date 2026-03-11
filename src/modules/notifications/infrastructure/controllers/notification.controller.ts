import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreateCommentDto } from 'src/modules/posts/application/dtos/create-tags.dto';
import { GetNotificationUseCase } from '../../application/use-cases/get-notification.use-case';
import { ReadSingleNotificationUseCase } from '../../application/use-cases/read-single-notification.use-case';
import { ReadAllNotificationsUseCase } from '../../application/use-cases/read-all-notifications.use-case';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly getNotificationUseCase: GetNotificationUseCase,
    private readonly readSingleNotificationUseCase: ReadSingleNotificationUseCase,
    private readonly readAllNotificationsUseCase: ReadAllNotificationsUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async updateComment(
    @Requester() user: UserEntity,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('isRead') isRead: string = 'all',
  ) {
    return this.getNotificationUseCase.execute(user.id, page, pageSize, isRead);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  public async ReadSingleNotification(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    return this.readSingleNotificationUseCase.execute(user, id);
  }

  @Patch('mark-all-read')
  @UseGuards(JwtAuthGuard)
  public async ReadAllNotification(
    @Requester() user: UserEntity,
  ) {
    return this.readAllNotificationsUseCase.execute(user);
  }
}
