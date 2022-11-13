Terraform IaC for a full-stack web app

## [planetbuilder.apphosting.link](https://www.planetbuilder.apphosting.link/)

## Functionality
- ✅ SPA hosted in S3 and served through CloudFront
- Cognito user management
- CodePipeline to build and deploy Angular app
- Lambda with an API gateway
- Codepipeline to deploy Lambda
- Aurora PSQL RDS instance

## Terraform modules used
- [s3-static-website](https://registry.terraform.io/modules/cn-terraform/s3-static-website/aws/latest)
