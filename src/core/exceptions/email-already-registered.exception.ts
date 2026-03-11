import { ConflictException } from '@nestjs/common';

export class EmailAlreadyRegisteredException extends ConflictException {
    constructor() {
        super('Email is already registered.');
    }
}
