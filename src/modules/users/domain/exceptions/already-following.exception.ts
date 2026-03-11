import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class AlreadyFollowingException extends DomainException {
  constructor() {
    super(
      'You are already following this user',
      'ALREADY_FOLLOWING',
    );
  }
}
