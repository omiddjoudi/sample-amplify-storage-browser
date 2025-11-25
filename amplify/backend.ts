import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { Bucket } from "aws-cdk-lib/aws-s3";

// import { storage, secondaryStorage } from './storage/resource';


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
// defineBackend({
//   auth,
//   storage, 
//   secondaryStorage
// });

const backend = defineBackend({
	  auth,
});


const customBucketStack = backend.createStack("custom_bucket_stack");

// Import existing bucket
const bucket1 = Bucket.fromBucketAttributes(customBucketStack, "bucket1", {
  bucketArn: "arn:aws:s3:::consumerspace-temp1",
  region: "eu-west-1"
});
const bucket2 = Bucket.fromBucketAttributes(customBucketStack, "bucket2", {
  bucketArn: "arn:aws:s3:::consumerspace-temp2",
  region: "eu-west-1"
});

backend.addOutput({
	storage: {
		buckets: [
			{
				aws_region: bucket1.env.region,
				bucket_name: bucket1.bucketName,
				name: bucket1.bucketName
			},
			{
				aws_region: bucket2.env.region,
				bucket_name: bucket2.bucketName,
				name: bucket2.bucketName
			}
		],
	}
})

