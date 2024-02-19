import { Duration, RemovalPolicy, Stack, type StackProps } from 'aws-cdk-lib';
import { AccountPrincipal, CompositePrincipal, ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Architecture, Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';

import { type Construct } from 'constructs';

export class BabylonLambdaStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const bucketName = `babylon-recorder-screenshots-${this.account}`;

        const bucket = new Bucket(this, 'ScreenshotBucket', {
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            bucketName: bucketName,
            encryption: BucketEncryption.S3_MANAGED,
            enforceSSL: true,
            removalPolicy: RemovalPolicy.RETAIN,
            versioned: false,
        });

        const lambdaRole = new Role(this, 'BabylonLambdaRole', {
            roleName: 'BabylonLambdaRole',
            assumedBy: new CompositePrincipal(
                new ServicePrincipal('lambda.amazonaws.com'),
                // Give this account permission to assume the lambda role for running local.
                new AccountPrincipal(this.account),
            ),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'),
                ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
            ],
        });

        bucket.grantReadWrite(lambdaRole);

        const layer = new LayerVersion(this, 'ChromiumLayer', {
            layerVersionName: 'ChromiumLayer',
            removalPolicy: RemovalPolicy.DESTROY,
            code: Code.fromAsset('node_modules/@sparticuz/chromium/bin'),
            compatibleArchitectures: [Architecture.X86_64],
            compatibleRuntimes: [Runtime.NODEJS_18_X],
        });

        new NodejsFunction(this, 'BabylonLambda', {
            entry: 'lambdas/lambdaEntry.ts',
            handler: 'main',
            bundling: {
                externalModules: ['aws-sdk'],
                sourceMap: true,
            },
            environment: {
                SCREENSHOT_BUCKET_NAME: bucketName,
            },
            role: lambdaRole,
            runtime: Runtime.NODEJS_18_X,
            layers: [layer],
            timeout: Duration.seconds(60),
            memorySize: 1024,
        });
    }
}
