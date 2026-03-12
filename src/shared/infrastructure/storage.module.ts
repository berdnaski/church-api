import { Module } from '@nestjs/common';
import { CloudflareStorageService } from './services/cloudflare-storage.service';
import { StorageService } from '../domain/services/storage.service';

@Module({
    providers: [
        {
            provide: StorageService,
            useClass: CloudflareStorageService,
        },
    ],
    exports: [StorageService],
})
export class StorageModule { }
