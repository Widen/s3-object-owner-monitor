# S3 Object Owner Monitor
AWS Lambda function triggered by S3 Object Put events that monitors the owner of newly created object and modifies them if necessary.

# Common Use Case
When serving private S3 content via Cloudfront, and [origin accesss idenity](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html), all objects must be *__owned__* by the primary account. However, files written by other accounts, even when granting `bucket-owner-full-control` canned ACL, are not *__owned__* by the primary account. This script corrects the problem by re-writeing the file under the primary account.

This script is particularly useful if using [cloudfront-auth](https://github.com/Widen/cloudfront-auth).

# Setup
1. Create AWS Lambda function and upload/copy index.js
1. Add IAM policy with the following permissions
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetBucket*",
                "s3:GetObject*",
                "s3:DeleteObject*",
                "s3:PutObject*"
            ],
            "Resource": "arn:aws:s3:::{YOUR_S3_BUCKET_NAME}/*"
        }
    ]
}
```
1. Under configuration, add an S3 trigger
    1. Select your bucket (same as specified in the IAM policy)
    1. Under event type, select PUT
    1. Create trigger and save
1. Function will now be activated when objects are added to the specified bucket with a PUT event.
