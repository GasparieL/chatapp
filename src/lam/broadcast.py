import json
import urllib3
import boto3
import os

client = boto3.client('apigatewaymanagementapi', endpoint_url=os.getenv('CALLBACK_URL_MYSTAGE'))

def lambda_handler(event, context):
    
    #Extract connectionId and desired message to send from input
    connectionId = event["connectionId"]
    message = event["message"]
    
    #Form response and post back to provided connectionId
    response = client.post_to_connection(ConnectionId=connectionId, Data=json.dumps(message).encode('utf-8'))
    print(response)
    