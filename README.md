# S3 Object Owner Monitor
AWS Lambda function triggered by S3 Object Put events that monitors the owner of newly created object and modifies them if necessary.

## Setup
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
