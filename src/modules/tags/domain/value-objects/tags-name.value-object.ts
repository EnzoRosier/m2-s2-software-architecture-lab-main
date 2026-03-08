import { WrongTagNameFormatException } from "../exceptions/tag-wrong-name-format.exception copy";

export class TagsName {
  private readonly value: string;

  constructor(name: string) {
    this.validate(name);
    this.value = name.trim();
  }

  private validate(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }

    if (name.length > 50) {
      throw new WrongTagNameFormatException();
    }

    if (name.length < 2) {
      throw new WrongTagNameFormatException();
    }

    const regex = /^[a-z0-9-]+$/;
    if(!regex.test(name)) {
        throw new WrongTagNameFormatException();
    }
  }

  toString(): string {
    return this.value;
  }

  isValid(): boolean {
    return this.value.length >= 3;
  }
}
