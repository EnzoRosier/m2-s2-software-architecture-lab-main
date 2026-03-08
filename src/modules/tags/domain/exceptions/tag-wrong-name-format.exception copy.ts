import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class WrongTagNameFormatException extends DomainException {
  constructor() {
    super(
      'A tag must be between 2 and 50 characters, lowercase, alphanumeric and may contains hyphens',
      'TAG_WRONG_NAME_FORMAT',
    );
  }
}
