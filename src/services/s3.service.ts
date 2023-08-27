import { PassThrough, Readable } from 'stream';
import { Upload } from '@aws-sdk/lib-storage';
import * as zlib from 'zlib';
import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import config from '../config';
import { APIError, logger } from '../common';

const s3bucket = new S3Client({
  credentials: {
    accessKeyId: config.AWS.accessKey,
    secretAccessKey: config.AWS.secretKey,
  },
  region: config.AWS.region,
});

export default class S3Service {
  static async UploadFileToS3(file: any, compress?: boolean) {
    const stream = new PassThrough();
    let readStream = Readable.from(file.buffer);
    const zip = zlib.createGzip();
    let key = `${Date.now()}-${file.originalname}`;
    try {
      if (compress) {
        readStream = readStream.pipe(zip);
        key = `${key}.gz`;
      }
      readStream.pipe(stream);

      const uploadToS3 = new Upload({
        client: s3bucket,
        queueSize: 4,
        partSize: 5 * 1024 * 1024,
        params: {
          Bucket: config.AWS.bucketName,
          Key: key,
          Body: stream,
        },
      });
      const res = await uploadToS3.done();
      return res;
    } catch (e) {
      logger.error(e);
      throw new APIError({ message: 'Problem occurred with file upload.', code: 400 });
    }
  }

  static async UpdateFile(file: any, key: string, compress?: boolean) {
    const stream = new PassThrough();
    let readStream = Readable.from(file.buffer);
    const zip = zlib.createGzip();
    try {
      if (compress) {
        readStream = readStream.pipe(zip);
      }
      readStream.pipe(stream);

      const uploadToS3 = new Upload({
        client: s3bucket,
        queueSize: 4,
        partSize: 5 * 1024 * 1024,
        params: {
          Bucket: config.AWS.bucketName,
          Key: key,
          Body: stream,
        },
      });
      const res = await uploadToS3.done();
      return res;
    } catch (e) {
      logger.error(e);
      throw new APIError({ message: 'Problem occurred with file upload.', code: 400 });
    }
  }

  static async DownloadFileFromS3(Key: string) {
    const command = new GetObjectCommand({
      Bucket: config.AWS.bucketName,
      Key,
    });
    try {
      const fileStream = await s3bucket.send(command);
      if (!fileStream.Body) {
        throw new APIError({ message: 'File not found.', code: 400 });
      }
      return {
        fileStream: fileStream.Body as Readable,
        fileSize: fileStream.ContentLength,
      };
    } catch (error) {
      logger.error(error);
      throw new APIError({ message: 'Problem occurred with file download.', code: 400 });
    }
  }

  static async DeleteFileFromS3(Key: string) {
    const command = new DeleteObjectCommand({
      Bucket: config.AWS.bucketName,
      Key,
    });
    try {
      const response = await s3bucket.send(command);
      logger.info(response);
    } catch (error) {
      logger.error(error);
      throw new APIError({ message: 'Problem occurred with file deletion.', code: 400 });
    }
  }
}
