var https = require('https');
function handler(event, context) {
    var postMessage;
    postMessage.text = event.Records[0].Sns.Message;
    var body = JSON.stringify(postMessage);
    var options = {
        hostname: 'hooks.slack.com',
        port: 443,
        method: 'POST',
        path: '',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length
        }
    };
    var req = https.request(options, function (res) {
        res.on('end', function () {
            context.succeed();
        });
    });
    req.on('error', function (e) {
        context.fail(e.message);
    });
    req.write(body);
    req.end();
}
exports.handler = handler;
