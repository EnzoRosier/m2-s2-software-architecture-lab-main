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
  Query,
  UseGuards,
} from '@nestjs/common';
import { Requester } from '../../../shared/auth/infrastructure/decorators/requester.decorator';
import { JwtAuthGuard } from '../../../shared/auth/infrastructure/guards/jwt-auth.guard';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { CreatePostDto } from '../../application/dtos/create-post.dto';
import { UpdatePostDto } from '../../application/dtos/update-post.dto';
import { CreatePostUseCase } from '../../application/use-cases/create-post.use-case';
import { DeletePostUseCase } from '../../application/use-cases/delete-post.use-case';
import { GetPostByIdUseCase } from '../../application/use-cases/get-post-by-id.use-case';
import { GetPostsUseCase } from '../../application/use-cases/get-posts.use-case';
import { UpdatePostUseCase } from '../../application/use-cases/update-post.use-case';
import { AddTagPostUseCase } from '../../application/use-cases/add-tag-post.use-case';
import { RemoveTagPostUseCase } from '../../application/use-cases/remove-tag-post.use-case';
import { JwtOPtionalAuthGuard } from 'src/modules/shared/auth/infrastructure/guards/jwt-optional-auth.guard';
import { ChangeStatusPostDto } from '../../application/dtos/change-status-post.dot';
import { ChangeSatusPostUseCase } from '../../application/use-cases/change-status-post.use-case';

@Controller('posts')
export class PostController {
  constructor(
    private readonly addTagPostUseCase: AddTagPostUseCase,
    private readonly removeTagPostUseCase: RemoveTagPostUseCase,
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly getPostByIdUseCase: GetPostByIdUseCase,
    private readonly changeSatusPostUseCase: ChangeSatusPostUseCase,
  ) {}

  @Get()
  @UseGuards(JwtOPtionalAuthGuard)
  public async getPosts(
    @Requester() user: UserEntity,
    @Query('tags') tags?: string) {
    var tagsArray = tags ? tags.split(',') : []
    const posts = await this.getPostsUseCase.execute(tagsArray, user);
    
    return posts.map((p) => p.toJSON());
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getPostById(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    const post = await this.getPostByIdUseCase.execute(id, user);

    return post?.toJSON();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async createPost(
    @Requester() user: UserEntity,
    @Body() input: Omit<CreatePostDto, 'authorId'>,
  ) {
    return this.createPostUseCase.execute(
      { ...input, authorId: user.id },
      user,
    );
  }

  @Patch('/status/:id')
  @UseGuards(JwtAuthGuard)
  public async changeStatus(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() input: ChangeStatusPostDto,
  ) {
    return this.changeSatusPostUseCase.execute(id, input, user);
  }

  @Post(':postId/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  public async AddTag(
    @Requester() user: UserEntity,
    @Param('postId') idPost: string,
    @Param('tagId') idTag: string,
  ) {
    return this.addTagPostUseCase.execute(idPost, idTag, user);
  }

  @Delete(':postId/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async RemoveTag(
    @Requester() user: UserEntity,
    @Param('postId') idPost: string,
    @Param('tagId') idTag: string,
  ) {
    return this.removeTagPostUseCase.execute(idPost, idTag, user);
  }

  @Patch(':id')
  public async updatePost(
    @Param('id') id: string,
    @Body() input: UpdatePostDto,
  ) {
    return this.updatePostUseCase.execute(id, input);
  }

  

  @Delete(':id')
  public async deletePost(@Param('id') id: string) {
    return this.deletePostUseCase.execute(id);
  }
}
