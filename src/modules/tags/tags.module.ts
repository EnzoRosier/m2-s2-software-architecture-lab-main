import { Module } from '@nestjs/common';
import { LoggingModule } from '../shared/logging/logging.module';
import { TagsController } from './infrastructure/controllers/tags.controller';
import { TagsRepository } from './domain/repositories/tags.repository';
import { SQLiteTagsRepository } from './infrastructure/repositories/tags.sqlite.repository';
import { CreateTagUseCase } from './application/use-cases/create-tag.use-case';
import { GetTagsUseCase } from './application/use-cases/get-tags.use-case';
import { AuthModule } from '../shared/auth/auth.module';
import { UpdateTagsUseCase } from './application/use-cases/update-tags.use-case';
import { DeleteTagsUseCase } from './application/use-cases/delete-tags.use-case';
import { TagService } from './infrastructure/services/tag.service';

@Module({
  imports: [AuthModule, LoggingModule],
  controllers: [TagsController],
    providers: [
      {
        provide: TagsRepository,
        useClass: SQLiteTagsRepository,
      },
  
      CreateTagUseCase,
      GetTagsUseCase,
      UpdateTagsUseCase,
      DeleteTagsUseCase,
      TagService,
    ],
    exports: [TagService]
})
export class TagsModule {}
