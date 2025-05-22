import { S3Client, PutObjectCommand, S3ServiceException, GetObjectCommand, NoSuchKey, paginateListObjectsV2} from "@aws-sdk/client-s3"

const client = new S3Client({
  region: process.env.AWS_REGION!,
  maxAttempts:3,
  credentials: {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
},});

export const uploadFile = async (key:string, body:Buffer) => {

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: body,
    });
  
    try {
      const response = await client.send(command); //PutObjectCommandOutputオブジェクトが返ってくる
      return response;
    } catch (caught) {
        throw caught;
      }
    };

export const listFiles = async (pageSize:string)=>{

  const objects = [];

  try {
    const paginator = paginateListObjectsV2(
      { client, pageSize: Number.parseInt(pageSize) },
      { Bucket: process.env.AWS_BUCKET_NAME! },
    );

    for await (const page of paginator) {
      objects.push(page.Contents.map((o) => o.Key));
    }
    return objects;
  } catch (caught) {
      throw caught;
    }
  };


  