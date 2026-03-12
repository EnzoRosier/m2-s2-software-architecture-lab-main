import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import request from 'supertest';
import { UpdateCommentUseCase } from '../../application/use-cases/update-comment.use-case';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { DeleteCommentUseCase } from '../../application/use-cases/delete-comment.use-case';
import { JwtAuthGuard } from 'src/modules/shared/auth/infrastructure/guards/jwt-auth.guard';

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

describe('CommentController', () => {
  let authenticatedApp: any;
  let unauthenticatedApp: any;
  let updateCommentUseCase: jest.Mocked<UpdateCommentUseCase>;
  const mockUpdateCommentUseCase = {
    execute: jest.fn().mockResolvedValue(undefined),
  };

  const mockDeleteCommentUseCase = {
    execute: jest.fn().mockResolvedValue(undefined),
  };
  beforeEach(async () => {
    const buildModule = (guard: any): Promise<TestingModule> =>
      Test.createTestingModule({
        controllers: [CommentController],
        providers: [
          { provide: UpdateCommentUseCase, useValue: mockUpdateCommentUseCase },
          { provide: DeleteCommentUseCase, useValue: mockDeleteCommentUseCase },
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

  it('Patch /patch should return 200 when user is authenticated', async () => {
    // Arrange
    const body = {
      content: 'Hello world',
    };
    // Act & Assert
    await request(authenticatedApp.getHttpServer())
      .patch('/comments/id')
      .send(body)
      .expect(200);
    expect(mockUpdateCommentUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('Patch /patch should return 401 when user is not authenticated', async () => {
    // Arrange
    const body = {
      content: 'Hello world',
    };
    // Act & Assert
    await request(unauthenticatedApp.getHttpServer())
      .patch('/comments/id')
      .send(body)
      .expect(401);
    expect(mockUpdateCommentUseCase.execute).not.toHaveBeenCalled();
  });

  it('Delete /patch should return 200 when user is authenticated', async () => {

    // Act & Assert
    await request(authenticatedApp.getHttpServer())
      .delete('/comments/id')
      .expect(200);
    expect(mockDeleteCommentUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('Delete /patch should return 401 when user is not authenticated', async () => {
    // Act & Assert
    await request(unauthenticatedApp.getHttpServer())
      .delete('/comments/id')
      .expect(401);
    expect(mockDeleteCommentUseCase.execute).not.toHaveBeenCalled();
  });

});
