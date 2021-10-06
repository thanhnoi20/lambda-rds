// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set region
AWS.config.update({region: 'us-west-2'});

// Create publish parameters
var params = {
  Message: 'MESSAGE_TEXT', /* required */
  TopicArn: 'arn:aws:sns:us-west-2:471536164341:gcms-sns-notification'
};

// Create promise and SNS service object
var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
exports.handler = function(event, context) {
// Handle promise's fulfilled/rejected states
publishTextPromise.then(
  function(data) {
    console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
    console.log("MessageID is " + data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });
}

// // Load the AWS SDK for Node.js
// var AWS = require('aws-sdk');
// // Set region
// AWS.config.update({region: 'eu-central-1'});

// // Create publish parameters
// var params = {
//   Message: 'MESSAGE_TEXT', /* required */
//   TopicArn: 'arn:aws:sns:us-west-2:471536164341:gcms-sns-notification'
// };

// // Create promise and SNS service object
// var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
// exports.handler = async(event, context) => {
// // Handle promise's fulfilled/rejected states
// publishTextPromise.then(
//   function(data) {
//     console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
//     console.log("MessageID is " + data.MessageId);
//   }).catch(
//     function(err) {
//     console.error(err, err.stack);
//   });
// }
// console.log('Loading function');

// var AWS = require('aws-sdk');  
// AWS.config.region = 'eu-central-1';
// exports.handler = async(event, context) =>  {  
//     console.log("\n\nLoading handler\n\n");
//     var sns = new AWS.SNS();
//     const result = await sns.publish({
//         Message: 'Test publish to SNS from Lambda',
//         TopicArn: 'arn:aws:sns:eu-central-1:472820313408:gcms-sns-notification'
//     }, function(err, data) {
//         if (err) {
//             console.log(err.stack);
//             return;
//         }
//         console.log('push sent');
//         console.log(data);
//         context.done(null, 'Function Finished!');  
//     });
// };


// var AWS = require("aws-sdk");

// exports.handler = async (event) => {
//   const param = {
//     Message: "This message sent form SNS",
//     PhoneNumber: "097434242424", 
//     TopicArn: 'arn:aws:sns:eu-central-1:472820313408:gcms-sns-notification'
//   };

// const sns = new AWS.SNS();
// sns.publish(param, (data,err) => {
//   if (data) {
//     console.log(data);
//   }
//   else {
//     console.log(err)
//   }
// })
// } 

// var AWS = require('aws-sdk');


// exports.handler = (event, context) => {

//     var sns = new AWS.SNS();
   
//     var message = {
//         "default": "This is a notification message",
//         "APNS_SANDBOX":"{\"aps\":{\"alert\":\"This is a notification message\"}}"
//         // Use "APNS" here to target production apps
//     };

//     var params = {
//         MessageStructure: "json",
//         Message: JSON.stringify(message),
//         TopicArn: "arn:aws:sns:eu-central-1:472820313408:gcms-sns-notification"
//     };
//     sns.publish(params, context.done);
// };