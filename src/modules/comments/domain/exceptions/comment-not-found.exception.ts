import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class CommentNotFoundException extends DomainException {
  constructor() {
    super(
      'Cannot find this comment',
      'COMMENT_NOT_FOUND',
    );
  }
}
