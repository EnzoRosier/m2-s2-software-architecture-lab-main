import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class UserCannotUpdatePostTagsException extends DomainException {
  constructor() {
    super(
      'You do not have permission to update this post tags',
      'USER_CANNOT_UPDATE_POST_TAGS',
    );
  }
}
