import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class NotAlreadyFollowingException extends DomainException {
  constructor() {
    super(
      'You don\'t follow this user',
      'USER_NOT_FOLLOWED',
    );
  }
}
