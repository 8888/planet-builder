terraform {
  required_version = ">= 1.2.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  backend "s3" {
    key    = "planet-builder"
    bucket = "lee-terraform-state"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
  profile = "planet-builder"
}
