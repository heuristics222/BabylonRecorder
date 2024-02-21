## Setup

npm install

## Building
npm run cdk -- synth

## Permission setup
You'll need to set up IAM Identity center in your account for sso.  Once you have an account enabled, run

```
aws configure sso
```

```
SSO start URL [None]: https://d-9267521077.awsapps.com/start
SSO Region [None]: us-west-2
...
CLI default client Region [None]: us-west-2
CLI default output format [None]: json
CLI profile name [...]: sso
```

Now your aws cli has a `sso` profile that can be used for access.  Daily access is achieved by running
```
aws sso login --profile sso
```

Now you can run `cdk` operations that require account access like below

`npm -w babylon-recorder-infra run cdk  -- diff`

 * `cdk ls`          list all stacks in the app
 * `cdk deploy`      deploy this stack to your sso AWS account/region
 * `cdk diff`        compare deployed stack with current state

## Running Local

* `npm -w babylon-recorder-lambdas run build` - build the lambdas
* `npm -w babylon-server run build` - build the server js (served by express js to the headless puppeteer browser)
* `npx tsx -- packages/lambdas/src/testLambda.ts` - runs the lambda locally

## Pull down screenshots and create a video

`aws s3 sync s3://babylon-recorder-screenshots-{account}/screenshots/ screenshots/ --profile sso`

`ffmpeg -framerate 60 -i "screenshots/%04d.png" -c:v libx264 -pix_fmt yuv420p screenshots/out.mp4`
