import { App } from 'aws-cdk-lib';
import { BabylonLambdaStack } from './BabylonLambdaStack';

const app = new App();
new BabylonLambdaStack(app, 'BabylonLambdaStack');
