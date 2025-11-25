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
		aws_region: bucket1.env.region,
		bucket_name: bucket1.bucketName,
		buckets: [
			{
				aws_region: bucket1.env.region,
			  	bucket_name: bucket1.bucketName,
				name: bucket1.bucketName,
				paths: {
					"public/*": {
						guest: ["get", "list"],
						authenticated: ["get", "list", "write", "delete"]
					}
				}
			}
		]
	}
});

const authPolicy = new Policy(backend.stack, "customBucketAuthPolicy", {
	statements: [
		new PolicyStatement({
			effect: Effect.ALLOW,
			actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
			resources: [`${bucket1.bucketArn}/public/*`,]
		}),
		new PolicyStatement({
			effect: Effect.ALLOW,
			actions: ["s3:ListBucket"],
			resources: [
				`${bucket1.bucketArn}`,
				`${bucket1.bucketArn}/*`
			],
			conditions: {
				StringLike: {
					"s3:prefix": ["public/*", "public/"],},
			},
		}),
	],
});

// Add the policies to the authenticated user role
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(authPolicy);


