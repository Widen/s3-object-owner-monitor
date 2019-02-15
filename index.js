var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

exports.handler = (event, context, callback) => {
    var bucket = event.Records[0].s3.bucket.name;
    var key = event.Records[0].s3.object.key.replace(/\+/g, " ");

    var params = {
      Bucket: bucket,
      Key: key
    };
    s3.getObjectAcl(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log(data);
        processAcl(bucket, key, data.Owner.DisplayName, callback);
      }
    });
};

/**
 * Processes getObjectAcl request on newly added object. Checks owner
 * against process.env.OWNER variable.
 * @param {string} bucket Name of S3 bucket containing object to change.
 * @param {string} key Key of S3 object whose owner must be checked.
 * @param {string} owner Owner display name of S3 object that was created.
 * @param {function} callback Callback function provided by AWS Lambda.
 */
function processAcl(bucket, key, owner, callback) {
  if (owner != process.env.OWNER) {
    console.log('Switch needed');
    changeOwner(bucket, key, callback);
  } else {
    console.log('No switch needed');
    callback(null, 'Success');
  }
}

/**
 * Changes the owner of the given key within the given bucket by
 * copying/overwriting the existing object under the account of
 * this function.
 * @param {string} bucket Name of S3 bucket containing object to change.
 * @param {string} key Key of S3 object whose owner will change.
 * @param {function} callback Callback function provided by AWS Lambda.
 */
function changeOwner(bucket, key, callback) {
  var params = {
    Bucket: bucket,
    CopySource: bucket + '/' + key,
    Key: key,
    ACL: 'private',
    StorageClass: 'STANDARD'
  };
  s3.copyObject(params, function(err, data) {
    if (err) {
        console.log(err, err.stack);
        callback(err);
    } else {
        console.log(data);
        callback(null, 'Success');
    }
  });
  callback(null, 'Success');
}
