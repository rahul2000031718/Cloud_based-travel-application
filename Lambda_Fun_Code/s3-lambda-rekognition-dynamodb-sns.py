import json
import boto3

print('Travel O Cloud')

def lambda_handler(event, context):

    s3_client= boto3.client('s3')
    rekognition_client = boto3.client('rekognition')
    dynamodb_client = boto3.resource('dynamodb')
    sns = boto3.client('sns')
    
    bucket =  event['Records'][0]['s3']['bucket']['name'] 
    key =    event['Records'][0]['s3']['object']['key'] 
    eventname = event['Records'][0]['eventName']
    
    print(bucket)
    print(key)
    print(eventname)

    fileObject = s3_client.get_object(Bucket=bucket, Key=key) 
    file_content = fileObject["Body"].read()
    response = rekognition_client.detect_labels(Image = {"S3Object":{"Bucket":bucket,"Name":key}}, MaxLabels=5)
    
    print(response)
    print(response['Labels'][0]['Name'])
    print(response['Labels'][1]['Name'])
    print(response['Labels'][2]['Name'])
    print(response['Labels'][3]['Name'])
    print(response['Labels'][4]['Name'])
    
    arr= key.split('/')
    print(arr[0])   
    print(arr[1])
    print(arr[2])
    
    table = dynamodb_client.Table('travel-o-cloud-ddb')
    dbresponse = table.put_item(
       Item={
            'filename': arr[2],
            'user': arr[0],
            'trip': arr[1],
            'label0': response['Labels'][0]['Name'],
            'label1': response['Labels'][1]['Name'],
            'label2': response['Labels'][2]['Name'],
            'label3': response['Labels'][3]['Name'],
            'label4': response['Labels'][4]['Name'],
        
        }
    )
    print(dbresponse)
    
    sns_message = str("Hello, \n\n Mail from Travel O Cloud \n\n Bucket Name: "+ bucket +"\n\n File Name: " + key + "\n\n Action: " + eventname + "\n\nTrip: " + arr[1] +"\n\nBy User: "+arr[0])
    try:
        print(eventname)
        if eventname == "ObjectRemoved:Delete":
            print("File is being Deleted")
            sns_message += str("File Deleted")
        else:
            response = s3_client.get_object(Bucket=bucket, Key=key)
            sns_message += str("File content type: " + str(response['ContentType']))
            print("CONTENT TYPE: " + response['ContentType'])
        print(str(sns_message))
		
        subject= "Travel O Cloud"
        print(subject)
		
        sns_response = sns.publish(
        
		TargetArn='arn:aws:sns:us-west-2:930136857958:travel-o-cloud-sns',
        
		Message= str(sns_message),
        Subject= str(subject)
        )
        
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        raise e

    return {
        'statusCode': 200,
        'body': json.dumps('its working!!')
    }
