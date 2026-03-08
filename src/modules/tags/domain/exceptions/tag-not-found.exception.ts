import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class TagNotFoundException extends DomainException {
  constructor() {
    super(
      'the tag doesn\'t exist',
      'TAG_NOT_FOUND',
    );
  }
}
