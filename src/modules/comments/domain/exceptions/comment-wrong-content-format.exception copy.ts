import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class WrongContentFormatException extends DomainException {
  constructor() {
    super(
      'A comment must be between 1 and 1000 characaters and cannot be empty or only whitespaces',
      'COMMENT_WRONG_CONTENT_FORMAT',
    );
  }
}
