import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import * as apigateway2 from '@aws-cdk/aws-apigatewayv2';
import * as httpPackage from '@aws-cdk/aws-apigatewayv2-integrations';
import { WebSocketLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';


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

    var connect_lambda = new lambda.Function(this, 'connect_lambda_function', {
      code: lambda.Code.fromAsset(path.join(__dirname, "../src/lam/")),
      handler: 'connect.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_9
    });

    var disconnect_lambda = new lambda.Function(this, 'disconnect_lambda_function', {
      code: lambda.Code.fromAsset(path.join(__dirname, "../src/lam/")),
      handler: 'disconnect.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_9
    });

    var sendmessage_lambda = new lambda.Function(this, 'sendmessage_lambda_function', {
      code: lambda.Code.fromAsset(path.join(__dirname, "../src/lam/")),
      handler: 'sendmessage.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_9
    });

    var broadcast_lambda = new lambda.Function(this, 'broadcast_lambda_function', {
      code: lambda.Code.fromAsset(path.join(__dirname, "../src/lam/")),
      handler: 'broadcast.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_9
    });


    const webSocketApi = new apigateway2.WebSocketApi(this, 'mywsapi', {
      connectRouteOptions: {integration: new WebSocketLambdaIntegration("connect_lambda_integration", connect_lambda)},
      disconnectRouteOptions: {integration: new WebSocketLambdaIntegration("disconnect_lambda_integration", disconnect_lambda)} 
    });
    webSocketApi.addRoute("sendmessage_route", 
         {integration: new WebSocketLambdaIntegration("sendmessage_lambda_integration", sendmessage_lambda) } )


    webSocketApi.addRoute("broadcast_route", 
         {integration: new WebSocketLambdaIntegration("broadcast_lambda_integration", broadcast_lambda) } )


    let mystage_websocket = new apigateway2.WebSocketStage(this, 'mystage', {
      webSocketApi,
      stageName: 'dev',
      autoDeploy: true,
    });

    sendmessage_lambda.addEnvironment("CALLBACK_URL_MYSTAGE", mystage_websocket.callbackUrl);
    webSocketApi.grantManageConnections(sendmessage_lambda);

    broadcast_lambda.addEnvironment("CALLBACK_URL_MYSTAGE", mystage_websocket.callbackUrl);
    webSocketApi.grantManageConnections(broadcast_lambda);


    // declare const messageHandler: lambda.Function;
    // webSocketApi.addRoute('sendmessage', {
    //   integration: new WebSocketLambdaIntegration('SendMessageIntegration', messageHandler),
    // });

    // httpApi.addRoutes({
    //   path: "/html_route", 
    //   methods:[apigateway2.HttpMethod.GET], 
    //   integration: new httpPackage.LambdaProxyIntegration({handler: first_html_var})
    // });
    new cdk.CfnOutput(this, 'gateway_url', {
        value: httpApi.url ? httpApi.url : "None"
    });
  }
}


// stack is the datastructure that contains the resources used by the application