import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class UserCannotCommentException extends DomainException {
  constructor() {
    super(
      'You can\'t comment on this post',
      'USER_CANNOT_COMMENT',
    );
  }
}
