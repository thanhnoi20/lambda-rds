provider "aws" {
  region = "us-west-2"
  # assume_role {
  #   role_arn = var.provider_role_arn
# }
}
module "lambda_function" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-lambda.git?ref=v2.18.0"
  function_name = "lambda-function-rds-alert"
  description   = "Lambda function is using for gcms alert"
  handler       = "index.handler"
  runtime       = "nodejs12.x"
  create_role   = false
  lambda_role   = aws_iam_role.iam_for_lambda.arn
  create_layer  = false
  # layers        = ["arn:aws:lambda:eu-central-1:472820313408:layer:pyodbc:3"]
  source_path   = "./src/lambda-function-nodejs"
  vpc_subnet_ids         = var.vpc_subnet_ids
  vpc_security_group_ids = var.vpc_security_group_ids
  attach_network_policy = true
  environment_variables = {
    RDS_HOST     = "pg-dev-euc1-db-mssql-se-encrypted-03.cd2dkrwx130d.eu-central-1.rds.amazonaws.com"
    RDS_USERNAME = "primera-gcms"
    RDS_DB_NAME  = "gcms"
    SECRET_NAME  = "arn:aws:secretsmanager:eu-central-1:472820313408:secret:pg-dev-dbpass-gcms-2Uhl6s"
    SNS_TOPIC_ARN    = "gcms-sns-notification"
  }
  tags = {
    Name = "lambda-function-rds-alert"
  }
}

module "sns" {
  source = "git::https://github.com/terraform-aws-modules/terraform-aws-sns.git?ref=v3.2.0"
  name    = "gcms-sns-notification"
}