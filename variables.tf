variable "vpc_subnet_ids" {
  description = "List of subnet ids when Lambda Function should run in the VPC. Usually private or intra subnets."
  type        = list(string)
  default     = ["subnet-0b617badaf700f0e5", "subnet-00f8c212768c61825"]
}

variable "vpc_security_group_ids" {
  description = "List of security group ids when Lambda Function should run in the VPC."
  type        = list(string)
  default     = ["sg-0d2e84c8379e14350"]
}

variable provider_role_arn {
  type        = string
  default     = "arn:aws:iam::472820313408:role/pg-role-appl-gitlab-automation"
  description = "provider_role_arn"
}

variable secret_arn {
  type        = string
  default     = "arn:aws:secretsmanager:eu-central-1:472820313408:secret:pg-dev-dbpass-gcms-2Uhl6s"
  description = "secret_arn"
}
