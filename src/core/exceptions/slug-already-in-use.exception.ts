import { ConflictException } from '@nestjs/common';

export class SlugAlreadyInUseException extends ConflictException {
    constructor() {
        super('This slug is already in use. Please choose a different name for your church.');
    }
}
