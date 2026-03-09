import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class SlugAlreadyTaken extends DomainException {
  constructor() {
    super(
      'Another post already uses this slug',
      'SLUG_DUPLICATE',
    );
  }
}
