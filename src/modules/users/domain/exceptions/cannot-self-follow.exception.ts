import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class CannotSelfFollow extends DomainException {
  constructor() {
    super(
      'User cannot follow themselves',
      'CANNOT_SELF_FOLLOW',
    );
  }
}
