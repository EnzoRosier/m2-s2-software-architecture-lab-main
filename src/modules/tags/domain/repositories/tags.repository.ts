
// export type PostModel = {
//   id: string;
//   title: string;
//   content: string;
//   status: 'draft' | 'waiting_validation' | 'accepted' | 'rejected';
//   authorId: string;
// };

import { TagEntity } from "../entities/tags.entity";
import { TagsName } from "../value-objects/tags-name.value-object";

export type CreateTagsModel = {
  name: TagsName;
  createdAt: Date;
};

export type UpdateTagModel = {
  name: TagsName;
};

export abstract class TagsRepository {
  public abstract getTags(): TagEntity[] | Promise<TagEntity[]>;

  public abstract getTagById(
    id: string,
  ): TagEntity | undefined | Promise<TagEntity | undefined>;

  public abstract getTagByName(
    name: string,
  ): TagEntity | undefined | Promise<TagEntity | undefined>;

  public abstract createTag(input: TagEntity): void | Promise<void>;

  public abstract updateTag(
    id: string,
    input: TagEntity,
  ): void | Promise<void>;

  public abstract deleteTag(id: string): void | Promise<void>;
}
