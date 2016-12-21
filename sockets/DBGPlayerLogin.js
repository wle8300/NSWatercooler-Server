var util = require('../util')

var CharacterSubscription = require('../model/CharacterSubscription')
var User = require('../model/User')

var Async = require('async')
var W3CWebSocket = require('websocket').w3cwebsocket
 
var client = new W3CWebSocket('wss://push.planetside2.com/streaming?environment=ps2ps4us&service-id=s:asdf')
// var client = new W3CWebSocket('wss://push.planetside2.com/streaming?environment=ps2ps4eu&service-id=s:asdf')
// var client = new W3CWebSocket('wss://push.planetside2.com/streaming?environment=ps2&service-id=s:asdf')

client.onerror = function(error) {
  console.log('Websocket client error:', error)
}
 
client.onopen = function(e) {
	
  console.log('WebSocket client connected')
	
	//initiate subscription
	client.send(JSON.stringify({
		service: 'event',
		action: 'subscribe',
		characters: ['all'],
		worlds: ['all'],
		eventNames: ['PlayerLogin']
	}))
}
 
client.onmessage = function(e) {
	
	const DBGdata = JSON.parse(e.data)

	//IGNORE THESE!
	if (DBGdata.type !== 'serviceMessage' || DBGdata.payload.event_name !== 'PlayerLogin') return
	
	CharacterSubscription
	.getAll(DBGdata.payload.character_id, {index: '_Character_'})
	.then((characterSubscriptions) => {
	
		if (!characterSubscriptions.length) return
	
	
		Async.eachSeries(
		
			characterSubscriptions,
		
			(characterSubscription, callback) => {
			
				User
				.get(characterSubscription._User_)
				.then((user) => {
					//this will be replaced with native notifications
					util.sendEmail(user.email, characterSubscription.characterName+ ' is online', callback)
				})
				.catch(() => {
					//for now ignore errors
					callback()
				})
			},
		
			//for now ignore errors
		  (err) => console.log('All notifications sent for:', characterSubscription.characterName)
		)
	})
	.catch(console.error)
}

client.onclose = function() {
  console.log('Client Closed.')
}