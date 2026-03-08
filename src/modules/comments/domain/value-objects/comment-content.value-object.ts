import { WrongContentFormatException } from "../exceptions/comment-wrong-content-format.exception copy";

export class CommentContent {
  private value: string;

  constructor(input: string) {
    this.validate(input);
    this.value = input;
  }

  private validate(input: string) {
    if (input.length <= 1 || input.length > 1000 || input.trim().length === 0) {
      throw new WrongContentFormatException();
    }
  }

  public toString() {
    return this.value;
  }
}
