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
Log in to AWS with your IAM profile and generate Access Keys.
Save these to the `~/.aws/credentials` file under a custom profile name by running the following command:
```
aws configure --profile planet-builder
```
The system will prompt you for the following information:
```
AWS Access Key ID: %YOUR_ACCESS_KEY_ID%
AWS Secret Access Key: %YOUR_ACCESS_KEY%
Default region name: us-east-1
Default output format: json
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
3) Apply the terraform configuration to build the services
    ```
    terraform apply
    ```
4) This is only needed if you are hosting the root app at a subdomain, like in the example of planetbuilder.apphosting.link. If you are using a normal second-level domain you can skip this step. You will need to do this while terraform is working, it may hang at validating the cert.
    - In the AWS console, go to the Route53 hosted zone that was created for your subdomain, `planetbuilder.apphosting.link`
    - Copy the value of the `NS` record that was created. It will be 4 nameservers
    - Go to the Route53 hosted zone you aleady have for your domain, `apphosting.link`
    - Create a new `NS` record with the values that you copied from the subdomain. You are now delegating that route to the subdomain.

## Setting up the app
1) Create the schema
    - In the console, go to Secrets Manager and copy the ARN for the DB secret that was created
    - Go to the RDS cluster and access the query editor
    - Use the secret ARN and the database name in `db.tf` -> `rds-aurora.database_name`
    ```sql
    create table planet (
      id serial PRIMARY KEY,
      name text NOT NULL,
      icon_url text NOT NULL
    );
    ```
2) Seed some initial data
    ```sql
    insert into planet (name, icon_url) values
	    ('Earth', 'https://cdn.mos.cms.futurecdn.net/yCPyoZDQBBcXikqxkeW2jJ-1200-80.jpg'),
      ('Mars', 'https://cdn.mos.cms.futurecdn.net/kCbvedK262UGLXCLFeW5oS.jpg');
    ```
3) Create a Cognito user
    - In the console go to the Cognito user pool that was created
    - Create a user with a username and password
4) Update the Angular environment variables to point to the new services. Both `client/src/environments/environment.ts` and `client/src/environments/environment.prod.ts`
    - `userPoolClientId` -> Cognito App integration Client ID
    - `apiUrl` -> API Gateway Invoke URL
5) Deploy the Angular app manually
    - in `client/` run `ng build`. This will create the app bundle in `client/dist/`
    - $ `aws s3 sync ./dist/planet-builder s3://planetbuilder.apphosting.link`

# Teardown
To remove all infrastructure created:
```
terraform destroy
```

Note: If you want to teardown and rebuild rapidly, you need to increment some values. For example, secrets take 7 days to delete and the names must be unique.
- `db.rds-aurora.final_snapshot_identifier_prefix`
- `db.secrets-manager.secrets.planet-builder-rds`
  - `api.lambda.environment_variables.SECRET_ARN`
  - `api.aws_iam_policy_document.statement.resources`

# Routes

## URLs
- [planetbuilder.apphosting.link](https://www.planetbuilder.apphosting.link/)
- [Cognito sign-in URL - Prod](https://planetbuilder.auth.us-east-1.amazoncognito.com/login?client_id=fo65f9mfsft0phc90kuefck1p&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fwww.planetbuilder.apphosting.link%2F)
- [Cognito sign-in URL - Local](https://planetbuilder.auth.us-east-1.amazoncognito.com/login?client_id=fo65f9mfsft0phc90kuefck1p&response_type=code&scope=email+openid&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2F)

## API route
GET https://dremalvl71.execute-api.us-east-1.amazonaws.com  
### Curl
```
curl -H "Authorization: id_token" https://dremalvl71.execute-api.us-east-1.amazonaws.com
```
id_token is the JWT returned from cognito when logging in
### Lambda
When triggering the lambda directly, use this as the Event JSON for the test event
```json
{"httpMethod": "GET"}
```

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
