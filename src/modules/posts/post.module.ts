import { Module } from '@nestjs/common';
import { AuthModule } from '../shared/auth/auth.module';
import { LoggingModule } from '../shared/logging/logging.module';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';
import { GetPostByIdUseCase } from './application/use-cases/get-post-by-id.use-case';
import { GetPostsUseCase } from './application/use-cases/get-posts.use-case';
import { UpdatePostUseCase } from './application/use-cases/update-post.use-case';
import { PostRepository } from './domain/repositories/post.repository';
import { PostController } from './infrastructure/controllers/post.controller';
// import { InMemoryPostRepository } from './infrastructure/repositories/post.in-memory.repository';
import { SQLitePostRepository } from './infrastructure/repositories/post.sqlite.repository';
import { TagsModule } from '../tags/tags.module';
import { AddTagPostUseCase } from './application/use-cases/add-tag-post.use-case';
import { RemoveTagPostUseCase } from './application/use-cases/remove-tag-post.use-case';
import { ChangeSatusPostUseCase } from './application/use-cases/change-status-post.use-case';
import { CommentModule } from '../comments/comment.module';
import { CreateCommentUseCase } from './application/use-cases/create-comment.use-case';
import { GetPostCommentUseCase } from './application/use-cases/get-post-comment.use-case';
import { GetCommentCountUseCase } from './application/use-cases/get-comment-count.use-case';
import { PostService } from './infrastructure/services/post.service';
import { ChangeSlugPostUseCase } from './application/use-cases/change-slug-post.use-case';

@Module({
  imports: [AuthModule, LoggingModule, TagsModule, CommentModule],
  controllers: [PostController],
  providers: [
    {
      provide: PostRepository,
      useClass: SQLitePostRepository,
    },
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,
    GetPostsUseCase,
    GetPostByIdUseCase,
    AddTagPostUseCase,
    RemoveTagPostUseCase,
    ChangeSatusPostUseCase,
    CreateCommentUseCase,
    GetPostCommentUseCase,
    GetCommentCountUseCase,
    ChangeSlugPostUseCase,
    PostService,
  ],
})
export class PostModule {}
