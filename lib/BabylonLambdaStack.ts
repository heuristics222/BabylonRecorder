import { Stack, type StackProps } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

import { type Construct } from 'constructs';

export class BabylonLambdaStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new NodejsFunction(this, 'BabylonLambda', {
            entry: 'lambdas/test.ts',
            handler: 'main',
            bundling: {
                externalModules: ['aws-sdk'],
            },
        });
    }
}
