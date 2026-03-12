import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from 'src/modules/shared/auth/infrastructure/guards/jwt-auth.guard';
import { GetNotificationUseCase } from '../../application/use-cases/get-notification.use-case';
import { ReadAllNotificationsUseCase } from '../../application/use-cases/read-all-notifications.use-case';
import { ReadSingleNotificationUseCase } from '../../application/use-cases/read-single-notification.use-case';
import { NotificationController } from './notification.controller';

@Injectable()
class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = {
      id: 'user-1',
      permissions: {
        comments: { canCreate: () => true },
      },
    };
    return true;
  }
}
@Injectable()
class UnauthenticatedGuard implements CanActivate {
  canActivate(): boolean {
    throw new UnauthorizedException();
  }
}

describe('NotificationController', () => {
  let authenticatedApp: any;
  let unauthenticatedApp: any;
  const mockGetNotificationUseCase = {
    execute: jest.fn().mockResolvedValue(undefined),
  };

  const mockReadAllNotificationsUseCase = {
    execute: jest.fn().mockResolvedValue(undefined),
  };

  const mockReadSingleNotificationUseCase = {
    execute: jest.fn().mockResolvedValue(undefined),
  };
  beforeEach(async () => {
    const buildModule = (guard: any): Promise<TestingModule> =>
      Test.createTestingModule({
        controllers: [NotificationController],
        providers: [
          { provide: GetNotificationUseCase, useValue: mockGetNotificationUseCase },
          { provide: ReadAllNotificationsUseCase, useValue: mockReadAllNotificationsUseCase },
          { provide: ReadSingleNotificationUseCase, useValue: mockReadSingleNotificationUseCase },
        ],
      })
        .overrideGuard(JwtAuthGuard)
        .useClass(guard)
        .compile();
    const authenticatedModule = await buildModule(AuthenticatedGuard);
    authenticatedApp = authenticatedModule.createNestApplication();
    await authenticatedApp.init();
    const unauthenticatedModule = await buildModule(UnauthenticatedGuard);
    unauthenticatedApp = unauthenticatedModule.createNestApplication();
    await unauthenticatedApp.init();
  });
  afterEach(async () => {
    await authenticatedApp.close();
    await unauthenticatedApp.close();
    jest.clearAllMocks();
  });

  it('Get /notifications should return 200 when user is authenticated', async () => {
    // Act & Assert
    await request(authenticatedApp.getHttpServer())
      .get('/notifications')
      .expect(200);
    expect(mockGetNotificationUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('Get /notifications should return 404 when user is not authenticated', async () => {
    // Act & Assert
    await request(unauthenticatedApp.getHttpServer())
      .get('/notifications')
      .expect(401);
    expect(mockGetNotificationUseCase.execute).not.toHaveBeenCalled();
  });

  it('patch /notifications/id/read should return 200 when user is authenticated', async () => {
    // Act & Assert
    await request(authenticatedApp.getHttpServer())
      .patch('/notifications/id/read')
      .expect(200);
    expect(mockReadSingleNotificationUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('Patch /notifications/id/read should return 404 when user is not authenticated', async () => {
    // Act & Assert
    await request(unauthenticatedApp.getHttpServer())
      .patch('/notifications/id/read')
      .expect(401);
    expect(mockReadSingleNotificationUseCase.execute).not.toHaveBeenCalled();
  });

  it('Patch /notifications/mark-all-read should return 200 when user is authenticated', async () => {
    // Act & Assert
    await request(authenticatedApp.getHttpServer())
      .patch('/notifications/mark-all-read')
      .expect(200);
    expect(mockReadAllNotificationsUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('Patch /notifications/mark-all-read should return 404 when user is not authenticated', async () => {
    // Act & Assert
    await request(unauthenticatedApp.getHttpServer())
      .patch('/notifications/mark-all-read')
      .expect(401);
    expect(mockReadAllNotificationsUseCase.execute).not.toHaveBeenCalled();
  });

});
