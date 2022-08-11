import aws from 'aws-sdk';
import { Stream } from 'stream';
import { AWS_REGION, S3_BUCKET_NAME } from '../../config';

aws.config.region = AWS_REGION;

const uploadCsvToS3 = async (stream: Stream, filename: string) => {
  const s3 = new aws.S3();

  const key = `exports/${filename}.csv`;

  const params = {
    Key: key,
    Bucket: S3_BUCKET_NAME,
    Body: stream,
    ContentType: 'text/csv',
    ACL: 'public-read',
  };

  try {
    await s3.upload(params).promise();
  } catch (e) {
    console.error('S3 Upload failed: ', e);
    throw e;
  }

  return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/` + key;
};

export { uploadCsvToS3 };
