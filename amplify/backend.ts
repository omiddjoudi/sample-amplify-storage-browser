import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { storage, secondaryStorage } from './storage/resource';


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  auth,
  storage, 
  secondaryStorage
});

// Using a specific bucket names for the storages
const { cfnBucket: defaultBucket } = backend.storage.resources.cfnResources
defaultBucket.bucketName = 'consumerspace-tmp-primary'

const { cfnBucket: secondary } = backend.secondaryStorage.resources.cfnResources
secondry.bucketName = 'consumerspace-tmp-secondary'
