import { main } from './screenshots.js';

import { fromSSO } from '@aws-sdk/credential-providers';
import { AssumeRoleCommand, GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';

const client = new STSClient({
    credentials: fromSSO({ profile: 'sso' }),
    // For some reason fromSSO doesn't set the region
    region: 'us-west-2',
});

const identity = await client.send(new GetCallerIdentityCommand({}));

const assumedRole = await client.send(new AssumeRoleCommand({
    RoleArn: `arn:aws:iam::${identity.Account}:role/BabylonLambdaRole`,
    RoleSessionName: 'LocalTesting',
    DurationSeconds: 900,
}));

process.env['AWS_ACCESS_KEY_ID'] = assumedRole.Credentials?.AccessKeyId;
process.env['AWS_SECRET_ACCESS_KEY'] = assumedRole.Credentials?.SecretAccessKey;
process.env['AWS_SESSION_TOKEN'] = assumedRole.Credentials?.SessionToken;
process.env['SCREENSHOT_BUCKET_NAME'] = `babylon-recorder-screenshots-${identity.Account}`;

await main();
