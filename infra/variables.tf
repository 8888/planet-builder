variable "db_secret_arn" {
  type        = string
  description = "ARN of the secrets manager secret for DB credentials"
  default     = "arn:aws:secretsmanager:us-east-1:410489852199:secret:rds-db-credentials/cluster-5XORZSBECM5PMDTQAGE6ZFNLQE/root/1668545788518-QiJPnl"
}
