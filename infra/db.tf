module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "3.18.1"
  name    = "planet-builder-vpc"

  azs              = ["us-east-1a", "us-east-1b"]
  cidr             = "10.0.0.0/16"
  database_subnets = ["10.0.7.0/24", "10.0.8.0/24"]
}

module "rds-aurora" {
  source  = "terraform-aws-modules/rds-aurora/aws"
  version = "7.6.0"
  name    = "planet-builder-db"

  database_name = "planetbuilder"
  vpc_id        = module.vpc.vpc_id
  subnets       = module.vpc.database_subnets

  engine               = "aurora-postgresql"
  engine_mode          = "serverless"
  enable_http_endpoint = true
}
