import { Module } from '@nestjs/common';
import { LoggingModule } from '../shared/logging/logging.module';
import { AuthModule } from '../shared/auth/auth.module';
import { CommentService } from './infrastructure/services/comment.service';
import { CommentRepository } from './domain/repositories/Comment.repository';
import { SQLiteCommentRepository } from './infrastructure/repositories/post.sqlite.repository';

@Module({
  imports: [AuthModule, LoggingModule],
    providers: [
      {
        provide: CommentRepository,
        useClass: SQLiteCommentRepository,
      },
  
      CommentService
    ],
    exports: [CommentService]
})
export class CommentModule {}
