/// <reference path="../typings/tsd.d.ts"/>
import http = require('http');
import https = require('https');

var slackServicePath : string = ''; // ex. /services/XXXXXXXXX/YYYYYYYYY/abcdef.......

module lambda {
	export interface Event {
		Records : 	[{
						Sns : {
							Message:string
						}
					}]
	}
	export interface Context {
		succeed() : void;
		fail(string) : void;
	}
}

interface SlackMessage {
	text : string
}

module http_additonal {
	export interface RequestError {
		message : string
	}
}

export function handler(event: lambda.Event, context: lambda.Context){

	var postMessage : SlackMessage;
	postMessage.text = event.Records[0].Sns.Message;
	
	var body : string = JSON.stringify(postMessage);
	var options : https.RequestOptions = {
		hostname : 'hooks.slack.com',
		port : 443,
		method : 'POST',
		path : slackServicePath,
		headers: {
			'Content-Type':'application/json',
			'Content-Length':body.length
		}
	}
	
	var req : http.ClientRequest = https.request(options, function(res : http.IncomingMessage){
		res.on('end', function(){
			context.succeed();
		});
	});
	
	req.on('error',function(e:http_additonal.RequestError) {
		context.fail(e.message)
	});
	
	req.write(body);
	req.end();
}