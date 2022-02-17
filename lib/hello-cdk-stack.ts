import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import * as apigateway2 from '@aws-cdk/aws-apigatewayv2';
import * as httpPackage from '@aws-cdk/aws-apigatewayv2-integrations';


export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true
    });
    new lambda.Function(this, 'first_lambda', {
      code: lambda.Code.fromAsset(path.join(__dirname, "../src/lam/")),
      handler: 'python_lambda.function_lambda_1',
      runtime: lambda.Runtime.PYTHON_3_9
    });
    var first_html_var = new lambda.Function(this, 'first_html', {
      code: lambda.Code.fromAsset(path.join(__dirname, "../src/lam/")),
      handler: 'html_lambda.html_function',
      runtime: lambda.Runtime.PYTHON_3_9
    });
    var httpApi = new apigateway2.HttpApi(this, 'first_httpApi', {
      createDefaultStage: true
    });
    httpApi.addRoutes({
      path: "/html_route", 
      methods:[apigateway2.HttpMethod.GET], 
      integration: new httpPackage.LambdaProxyIntegration({handler: first_html_var})
    });
    new cdk.CfnOutput(this, 'gateway_url', {
        value: httpApi.url ? httpApi.url : "None"
    });
  }
}


// stack is the datastructure that contains the resources used by the application