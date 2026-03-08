import { v4 } from 'uuid';
import { TagEntity } from 'src/modules/tags/domain/entities/tags.entity';
import { SQLiteTagEntity } from 'src/modules/tags/infrastructure/entities/tags.sqlite.entity';
import { CommentContent } from '../value-objects/comment-content.value-object';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

export class CommentEntity {
  private _content: CommentContent;
  private _postId: string;
  private _author: UserEntity;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    readonly id: string,
    content: CommentContent,
    author: UserEntity,
    postId: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._content = content;
    this._author = author;
    this._postId = postId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public get postId() {
    return this._postId;
  }

  public get author() {
    return this._author;
  }

  public get content() {
    return this._content;
  }

  public static reconstitute(input: Record<string, unknown>) {
    var tags: TagEntity[] = [];
    if (input.tags) {
      (input.tags as SQLiteTagEntity[]).forEach((element) => {
        tags.push(TagEntity.reconstitute({ ...element }));
      });
    }

    return new CommentEntity(
      input.id as string,
      new CommentContent(input.content as string),
      input.author as UserEntity,
      input.postId as string,
      input.createdAt as Date,
      input.updatedAt as Date,
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      content: this._content.toString(),
      author: this._author,
      postId: this._postId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  public static create(
    content: string,
    author: UserEntity,
    postId: string,
  ): CommentEntity {
    return new CommentEntity(
      v4(),
      new CommentContent(content),
      author,
      postId,
      new Date(Date.now()),
      new Date(Date.now()),
    );
  }

  public update(content: string) {

    if (content) {
      this._content = new CommentContent(content);
    }

  }
}
