import { InvalidSlugFormat } from "../exceptions/invalid-slug-format.exception";

export class PostSlug {
  private value: string;

  constructor(input: string) {
    this.validate(input);
    this.value = input;
    
  }

  private validate(input: string) {
    if (input.length === 0) {
      throw new Error('Slugs cannot be empty');
    }

    const slugRegex = /^[a-z0-9-]+$/;

    if (!slugRegex.test(input)) {
      throw new InvalidSlugFormat()
    }

  }

  public toString() {
    return this.value;
  }
}
