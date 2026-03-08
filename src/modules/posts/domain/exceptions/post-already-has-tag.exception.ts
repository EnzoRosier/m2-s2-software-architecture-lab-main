import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class PostAlreadyhasTagException extends DomainException {
  constructor() {
    super(
      'This post already has this tag',
      'TAG_ON_POST_DUPLICATE',
    );
  }
}
