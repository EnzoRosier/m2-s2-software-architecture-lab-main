import { DomainException } from '../../../shared/errors/domain/exceptions/domain.exception';

export class CannotReadNotificationException extends DomainException {
  constructor() {
    super(
      'Cannot read notification',
      'CANNOT_READ_NOTIFICATION',
    );
  }
}
