import sys
# import pymysql
import pyodbc
import boto3
import botocore
import json
import random
import time
import os
from botocore.exceptions import ClientError

# rds settings
rds_host = os.environ['RDS_HOST']
name = os.environ['RDS_USERNAME']
db_name = os.environ['RDS_DB_NAME']
# helperFunctionARN = os.environ['HELPER_FUNCTION_ARN']

secret_name = os.environ['SECRET_NAME']
my_session = boto3.session.Session()
region_name = my_session.region_name
conn = None

# Get the service resource.
lambdaClient = boto3.client('lambda')



# Some other example server values are
# server = 'localhost\sqlexpress' # for a named instance
# server = 'myserver,port' # to specify an alternate port
server = 'tcp:myserver.database.windows.net' 
database = 'mydb' 
username = 'myusername' 
password = 'mypassword' 
cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+ password)
cursor = cnxn.cursor()


def openConnection():
    print("In Open connection")
    global conn
    password = "None"
    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )
    
    # In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    # See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    # We rethrow the exception by default.
    
    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
        print(get_secret_value_response)
    except ClientError as e:
        print(e)
        if e.response['Error']['Code'] == 'DecryptionFailureException':
            # Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InternalServiceErrorException':
            # An error occurred on the server side.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidParameterException':
            # You provided an invalid value for a parameter.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidRequestException':
            # You provided a parameter value that is not valid for the current state of the resource.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'ResourceNotFoundException':
            # We can't find the resource that you asked for.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
    else:
        # Decrypts secret using the associated KMS CMK.
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
            j = json.loads(secret)
            password = j['password']
        else:
            decoded_binary_secret = base64.b64decode(get_secret_value_response['SecretBinary'])
            print("password binary:" + decoded_binary_secret)
            password = decoded_binary_secret.password    
    
    try:
        if(conn is None):
            conn = pymysql.connect(
                rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
        elif (not conn.open):
            # print(conn.open)
            conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER='+rds_host+';DATABASE='+db_name+';UID='+name+';PWD='+ password)
            # conn = pymysql.connect(
            #     rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)

    except Exception as e:
        print (e)
        print("ERROR: Unexpected error: Could not connect to MySql instance.")
        raise e


def lambda_handler(event, context):

    try:
        openConnection()
        # Introducing artificial random delay to mimic actual DB query time. Remove this code for actual use.
        with conn.cursor() as cur:
            cur.execute("select * from sys.databases")
            body = cur.fetchall()
    except Exception as e:
        # Error while opening connection or processing
        print(e)
    finally:
        print("Closing Connection")
        if(conn is not None and conn.open):
            conn.close()
    response = {
        "statusCode": 200,
        "body": body,
        "headers": {
            'Content-Type': 'text/html',
        }
    }
    return response        