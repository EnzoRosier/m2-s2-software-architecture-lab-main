import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class UserCannotUpdateCommentException extends DomainException {
  constructor() {
    super(
      'you cannot update this comment',
      'USER_CANNOT_UPDATE_COMMENT',
    );
  }
}
