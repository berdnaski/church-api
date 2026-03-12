export interface UploadProps {
    buffer: Buffer;
    filename: string;
    mimetype: string;
    folder?: string;
}

export interface UploadResult {
    path: string;
    filename: string;
    mimetype: string;
    folder?: string;
}

export interface Upload {
    upload(props: UploadProps): Promise<UploadResult>;
    getUrl(key: string): Promise<{ signedUrl: string }>;
    delete(key: string): Promise<void>;
}
