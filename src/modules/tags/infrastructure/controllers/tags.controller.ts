import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { GetTagsUseCase } from '../../application/use-cases/get-tags.use-case';
import { CreateTagDto } from '../../application/dtos/create-tags.dto';
import { CreateTagUseCase } from '../../application/use-cases/create-tag.use-case';
import { UpdateTagDto } from '../../application/dtos/update-tags.dto';
import { UpdateTagsUseCase } from '../../application/use-cases/update-tags.use-case';
import { DeleteTagsUseCase } from '../../application/use-cases/delete-tags.use-case';



@Controller('tags')
export class TagsController {
  constructor(
    private readonly createTagsUseCase: CreateTagUseCase,
    private readonly getTagsUseCase: GetTagsUseCase,
    private readonly updateTagsUseCase: UpdateTagsUseCase,
    private readonly deleteTagsUseCase: DeleteTagsUseCase,

  ) {}

  @Get()
  public async getTags() {
    const tags = await this.getTagsUseCase.execute();

    return tags;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createTag(
    @Requester() user: UserEntity,
    @Body() input: CreateTagDto,
  ) {
    return this.createTagsUseCase.execute(
      input,
      user,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateTag(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() input: UpdateTagDto,
  ) {
    return this.updateTagsUseCase.execute(id, input, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteTag(
    @Requester() user: UserEntity,
    @Param('id') id: string) {
    return this.deleteTagsUseCase.execute(id, user);
  }
}
