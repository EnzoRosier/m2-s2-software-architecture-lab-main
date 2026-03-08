import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class PostNotFoundException extends DomainException {
  constructor() {
    super(
      'This post doesn\'t exist',
      'POST_NOT_FOUND',
    );
  }
}
