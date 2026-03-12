import { Injectable } from '@nestjs/common';
import { Module } from '@nestjs/common';
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { StorageService, UploadProps, UploadResult } from '../../domain/services/storage.service';

@Injectable()
export class CloudflareStorageService implements StorageService {
    private readonly s3: S3Client;
    private readonly bucket: string;

    constructor() {
        this.s3 = new S3Client({
            endpoint: process.env.CLOUDFLARE_ENDPOINT!,
            credentials: {
                accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
                secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
            },
            region: 'auto',
        });
        this.bucket = process.env.CLOUDFLARE_BUCKET!;
    }

    async upload(props: UploadProps): Promise<UploadResult> {
        const { buffer, filename, mimetype, folder } = props;

        const randomName = `${uuidv4()}-${filename}`;
        const path = folder ? `${folder}/${randomName}` : randomName;

        await this.s3.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: path,
            Body: buffer,
            ContentType: mimetype,
        }));

        return { path, filename, mimetype, folder };
    }

    async getUrl(key: string): Promise<{ signedUrl: string }> {
        const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
        const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
        return { signedUrl };
    }

    async delete(key: string): Promise<void> {
        await this.s3.send(new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        })).catch((err) => {
            console.warn(`Could not delete file ${key} from R2:`, err);
        });
    }
}
