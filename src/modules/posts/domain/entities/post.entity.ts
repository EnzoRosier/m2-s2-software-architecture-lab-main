import { v4 } from 'uuid';
import { PostContent } from '../value-objects/post-content.value-object';
import { PostTitle } from '../value-objects/post-title.value-object';
import { TagEntity } from 'src/modules/tags/domain/entities/tags.entity';
import { SQLiteTagEntity } from 'src/modules/tags/infrastructure/entities/tags.sqlite.entity';

export type PostStatus = 'draft' | 'waiting' | 'accepted' | 'rejected';
const ALL_STATUS: PostStatus[] = ['draft', 'waiting', 'accepted', 'rejected'];

export class PostEntity {
  private _title: PostTitle;
  private _content: PostContent;
  private _authorId: string;
  private _status: PostStatus;
  private _tags: TagEntity[];

  private constructor(
    readonly id: string,
    title: PostTitle,
    content: PostContent,
    authorId: string,
    status: PostStatus,
    tags: TagEntity[],
  ) {
    this._title = title;
    this._content = content;
    this._authorId = authorId;
    this._status = status;
    this._tags = tags;
  }

  public get status() {
    return this._status;
  }

  public get authorId() {
    return this._authorId;
  }

  public get tags() {
    return this._tags
  }

  public static reconstitute(input: Record<string, unknown>) {
    var tags: TagEntity[] = [];
    if (input.tags) {
      (input.tags as SQLiteTagEntity[]).forEach((element) => {
        tags.push(TagEntity.reconstitute({ ...element }));
      });
    }
    return new PostEntity(
      input.id as string,
      new PostTitle(input.title as string),
      new PostContent(input.content as string),
      input.authorId as string,
      input.status as PostStatus,
      tags as TagEntity[],
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this._title.toString(),
      content: this._content.toString(),
      status: this._status,
      authorId: this._authorId,
      tags: this._tags,
    };
  }

  public static create(
    title: string,
    content: string,
    authorId: string,
  ): PostEntity {
    return new PostEntity(
      v4(),
      new PostTitle(title),
      new PostContent(content),
      authorId,
      'draft',
      [],
    );
  }

  public update(title?: string, content?: string, status? : string) {
    if (title) {
      this._title = new PostTitle(title);
    }

    if (content) {
      this._content = new PostContent(content);
    }

    if (status) {
      if (ALL_STATUS.includes(status as PostStatus)) {
        this._status = status as PostStatus
      }
    }
  }
}
