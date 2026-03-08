import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class PostTagAssociationNotFoundException extends DomainException {
  constructor() {
    super(
      'There is no link between this post and tag',
      'POST_TAG_LINK_NOT_FOUND',
    );
  }
}
