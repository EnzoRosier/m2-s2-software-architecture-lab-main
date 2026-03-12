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
import { CreateCommentDto } from 'src/modules/posts/application/dtos/create-tags.dto';
import { UpdateCommentUseCase } from '../../application/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from '../../application/use-cases/delete-comment.use-case';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
  ) {}

  @ApiOperation({ summary: 'Update comment.' })
  @ApiResponse({ status: 200, description: 'Successfull.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateComment(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() input: CreateCommentDto,
  ) {
    return this.updateCommentUseCase.execute(id, input, user);
  }

  @ApiOperation({ summary: 'Delete comment.' })
  @ApiResponse({ status: 204, description: 'Successfull.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteComment(
    @Requester() user: UserEntity,
    @Param('id') id: string,
  ) {
    return this.deleteCommentUseCase.execute(id, user);
  }
}
