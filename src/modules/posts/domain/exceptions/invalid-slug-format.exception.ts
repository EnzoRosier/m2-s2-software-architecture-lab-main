import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class InvalidSlugFormat extends DomainException {
  constructor() {
    super(
      'Invalid slug format',
      'INVALID_SLUG_FORMAT',
    );
  }
}
