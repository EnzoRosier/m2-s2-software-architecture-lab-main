import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class UserCannotChangeSlug extends DomainException {
  constructor() {
    super(
      'You cannot change this post slug',
      'USER_CANNOT_CHANGE_SLUG',
    );
  }
}
