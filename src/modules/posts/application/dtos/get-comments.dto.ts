import { CommentEntity } from "src/modules/comments/domain/entities/comment.entity";
import { AddCommentDto } from "./add-comment.dto";

export class  GetCommentsDto {
  comments: AddCommentDto[];
}
