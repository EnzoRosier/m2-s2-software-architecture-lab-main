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
import { CreateCommentUseCase } from '../../application/use-cases/create-comment.use-case';
import { CreateCommentDto } from '../../application/dtos/create-tags.dto';
import { GetPostCommentUseCase } from '../../application/use-cases/get-post-comment.use-case';
import { GetCommentCountUseCase } from '../../application/use-cases/get-comment-count.use-case';
import { ChangeSlugDto } from '../../application/dtos/change-slug-post.dot';
import { ChangeSlugPostUseCase } from '../../application/use-cases/change-slug-post.use-case';
import { AddCommentDto } from '../../application/dtos/add-comment.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

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
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly getPostCommentuseCase: GetPostCommentUseCase,
    private readonly getPostCommentCountUseCase: GetCommentCountUseCase,
    private readonly changeSlugPostUseCase: ChangeSlugPostUseCase,
  ) {}

  @ApiOperation({ summary: 'Get posts.' })
  @ApiResponse({ status: 200, description: 'Successfull.' })
  @Get()
  @UseGuards(JwtOPtionalAuthGuard)
  public async getPosts(
    @Requester() user: UserEntity,
    @Query('tags') tags?: string,
  ) {
    var tagsArray = tags ? tags.split(',') : [];
    const posts = await this.getPostsUseCase.execute(tagsArray, user);

    return posts.map((p) => p.toJSON());
  }

  @ApiOperation({ summary: 'Get post with id or slug.' })
  @ApiResponse({ status: 200, description: 'Successfull.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @Get(':id')
  @UseGuards(JwtOPtionalAuthGuard)
  public async getPostById(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    const post = await this.getPostByIdUseCase.execute(id, user);

    return post?.toJSON();
  }

  @ApiOperation({ summary: 'Create post.' })
  @ApiResponse({ status: 200, description: 'Successfull.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 401, description: 'Unnauthorized.' })
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

  @ApiOperation({ summary: 'Update slug.' })
  @ApiResponse({ status: 200, description: 'Successfull.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 409, description: 'Conflict.' })
  @Patch(':id/slug')
  @UseGuards(JwtAuthGuard)
  public async changeSlug(
    @Requester() user: UserEntity,
    @Body() input: ChangeSlugDto,
    @Param('id') id: string,
  ) {
    return this.changeSlugPostUseCase.execute(id, input, user);
  }

  @ApiOperation({ summary: 'Update status.' })
  @ApiResponse({ status: 200, description: 'Successfull.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @Patch('/status/:id')
  @UseGuards(JwtAuthGuard)
  public async changeStatus(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() input: ChangeStatusPostDto,
  ) {
    return this.changeSatusPostUseCase.execute(id, input, user);
  }

  @ApiOperation({ summary: 'Get comment count.' })
  @ApiResponse({ status: 200, description: 'Successfull.' })

  @Get(':id/comments/count')
  public async GetCommentCount(@Param('id') id: string) {
    return this.getPostCommentCountUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Create a comment.' })
  @ApiResponse({ status: 201, description: 'Successfull.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @Post(':postId/comments')
  @UseGuards(JwtAuthGuard)
  public async AddComment(
    @Requester() user: UserEntity,
    @Body() input: CreateCommentDto,
    @Param('postId') postId: string,
  ) {
    const comment = await this.createCommentUseCase.execute(
      input,
      user,
      postId,
    );
    let res: AddCommentDto = {
      id: comment.id,
      postId: comment.postId,
      content: comment.content.toString(),
      author: {
        id: comment.author.id,
        username: comment.author.username.toString(),
      },
      createdAt: comment.createdAt.toString(),
      updatedAt: comment.updatedAt.toString(),
    };

    return res;
  }

  @ApiOperation({ summary: 'Get Comments.' })
  @ApiResponse({ status: 200, description: 'Successfull.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @Get(':postId/comments')
  public async getComments(
    @Param('postId') postId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('order') order: string = 'desc',
  ) {
    return this.getPostCommentuseCase.execute(
      postId,
      page,
      pageSize,
      sortBy,
      order,
    );
  }

  @ApiOperation({ summary: 'Create tag.' })
  @ApiResponse({ status: 201, description: 'Successfull.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 409, description: 'Conflict.' })
  @Post(':postId/tags/:tagId')
  @UseGuards(JwtAuthGuard)
  public async AddTag(
    @Requester() user: UserEntity,
    @Param('postId') idPost: string,
    @Param('tagId') idTag: string,
  ) {
    return this.addTagPostUseCase.execute(idPost, idTag, user);
  }

  @ApiOperation({ summary: 'Delete tag.' })
  @ApiResponse({ status: 204, description: 'Successfull.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
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

  @ApiOperation({ summary: 'Update post.' })
  @ApiResponse({ status: 200, description: 'Successfull.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @Patch(':id')
  public async updatePost(
    @Param('id') id: string,
    @Body() input: UpdatePostDto,
  ) {
    return this.updatePostUseCase.execute(id, input);
  }

  @ApiOperation({ summary: 'Update post.' })
  @ApiResponse({ status: 202, description: 'Successfull.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @Delete(':id')
  public async deletePost(@Param('id') id: string) {
    return this.deletePostUseCase.execute(id);
  }
}
