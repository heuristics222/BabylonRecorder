import { App } from 'aws-cdk-lib';
import { BabylonLambdaStack } from './BabylonLambdaStack.js';

const app = new App();
new BabylonLambdaStack(app, 'BabylonLambdaStack');
