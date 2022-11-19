# Terraform IaC for a full-stack web app
Terraform code to establish the basic services needed for a full stack, cloud-hosted, serverless web app using AWS. App functionality is minimal to validate that the cloud services are connected. The stack consists of:
- Cognito user identity management
- Angular frontend
- S3 and CloudFront hosting
- Route53 DNS to connect a custom domain name to the CloudFront distribution
- API connecting a Node Lambda
- Aurora PostgreSQL serverless RDS cluster

# Setup
## CLI tools needed:
- [Terraform](https://formulae.brew.sh/formula/terraform): `brew install terraform`
- [Angular](https://angular.io/guide/setup-local#install-the-angular-cli): `npm install -g @angular/cli`
- [AWS](https://formulae.brew.sh/formula/awscli): `brew install awscli`  
_note:_ Python is a dependecy of one of the terraform modules used for bundling.

## Configure AWS credentials
Create `~/.aws/credentials` add the credentials for your AWS account:
```
aws_access_key_id=
aws_secret_access_key=
```

## Building the infrastructure
1) Establish a [Terraform backend](https://developer.hashicorp.com/terraform/language/settings/backends/configuration) to store its state files. This is only needed if this is the first Terraform project you are running in this AWS account. It's an S3 bucket, shared for all terraform projects, that all developers can pull state from. This isn't version controlled because it contains sensitive information. Make sure the bucket is not public.
    ```
    aws s3api create-bucket --bucket some-bucket-name

    aws s3api put-public-access-block \
        --bucket some-bucket-name \
        --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
    ```
    In `backend.tf`, change the value of `terraform.backend.bucket` to the name of the bucket you just created.
2) Initialize terraform state and install modules
    ```
    terraform init
    ```

# Teardown
To remove all infrastructure created:
1) Manually remove all objects from the logging bucket
2) Run `terraform destroy`  

Note: If you want to teardown and rebuild rapidly, you need to increment some values. For example, secrets take 7 days to delete and the names must be unique.
- `vpc.final_snapshot_identifier_prefix`
- `secrets-manager.secrets.planet-builder-rds`
  - `lambda.environment_variables.SECRET_ARN`
  - `aws_iam_policy_document.statement.resources`

# Routes

## URLs
- [planetbuilder.apphosting.link](https://www.planetbuilder.apphosting.link/)
- [Cognito sign-in URL - Prod](https://planetbuilder.auth.us-east-1.amazoncognito.com/login?client_id=7o5fj2vu3r2qti8j4iq8b57em0&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fwww.planetbuilder.apphosting.link%2F)
- [Cognito sign-in URL - Local](https://planetbuilder.auth.us-east-1.amazoncognito.com/login?client_id=7o5fj2vu3r2qti8j4iq8b57em0&response_type=code&scope=email+openid&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2F)

## API route
GET https://3cdlo8gk90.execute-api.us-east-1.amazonaws.com/planets  
Example:
```
curl -H "Authorization: id_token" https://3cdlo8gk90.execute-api.us-east-1.amazonaws.com/planets
```
id_token is the JWT returned from cognito when logging in

# Documentation resources

## Terraform modules used
- [s3-static-website](https://registry.terraform.io/modules/cn-terraform/s3-static-website/aws/latest)
  - Only manual step was adding the bundle to S3 through the console. This should be automated by a pipeline later.
- [cognito-user-pool](https://registry.terraform.io/modules/lgallard/cognito-user-pool/aws/latest)
  - [AWS Cognito API docs](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_CreateUserPoolClient.html) were useful for determining the values for the fields
  - Manually provisioned a user through the cognito console
- [lambda](https://registry.terraform.io/modules/terraform-aws-modules/lambda/aws/latest)
- [apigateway-v2](https://registry.terraform.io/modules/terraform-aws-modules/apigateway-v2/aws/latest)
- [rds-aurora](https://registry.terraform.io/modules/terraform-aws-modules/rds-aurora/aws/latest)
- [vpc](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest)
- [secretsmanager_secret](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/secretsmanager_secret)

## DB setup
Using the simplest schema possible to just validate connectivity.
```sql
create table planet (
  id serial PRIMARY KEY,
  name text NOT NULL,
  icon_url text NOT NULL
);
```
Seeded some sample data
