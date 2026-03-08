import { v4 } from 'uuid';
import { TagsName } from '../value-objects/tags-name.value-object';

export type PostStatus = 'draft' | 'waiting' | 'accepted' | 'rejected';

export class TagEntity {
  private _name: TagsName;
  private _createdAt: Date;

  private constructor(
    readonly id: string,
    name: TagsName,
    createdAt: Date,
  ) {
    this._name = name;
    this._createdAt = createdAt;
  }

  public static reconstitute(input: Record<string, unknown>) {
    return new TagEntity(
      input.id as string,
      new TagsName(input.name as string),
      input.createdAt as Date,
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this._name.toString(),
      createdAt: this._createdAt.toString(),
    };
  }

  public static create(
    title: string,
    createdAt: Date,
  ): TagEntity {
    return new TagEntity(
      v4(),
      new TagsName(title),
      createdAt,
    );
  }

  public update(name?: string) {
    if (name) {
      this._name = new TagsName(name);
    }

  }
}
