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



@Controller('comments')
export class CommentController {
  constructor(
    private readonly updateCommentUseCase: UpdateCommentUseCase,

  ) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  public async updateComment(
    @Requester() user: UserEntity,
    @Param('id') id: string,
    @Body() input: CreateCommentDto,
  ) {
    return this.updateCommentUseCase.execute(id, input, user);
  }

}
