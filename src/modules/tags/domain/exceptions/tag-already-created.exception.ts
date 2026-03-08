import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class TagAlreadyCreatedException extends DomainException {
  constructor() {
    super(
      'A tag with the same name was already created',
      'TAG_DUPLICATED',
    );
  }
}
