import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class UserCannotReadPost extends DomainException {
  constructor() {
    super(
      'You cannot see this post',
      'USER_CANNOT_READ_POST',
    );
  }
}
