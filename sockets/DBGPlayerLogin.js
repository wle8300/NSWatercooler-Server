var util = require('../util')
var Dataservices = require('../Dataservices')

var CharacterSubscription = require('../model/CharacterSubscription')
var User = require('../model/User')
var Login = require('../model/Login')

var Async = require('async')
var W3CWebSocket = require('websocket').w3cwebsocket


var server = ['genudine']
var client = new W3CWebSocket('wss://push.planetside2.com/streaming?environment=' +util.translateToPlatformString(server[0])+ '&service-id=s:asdf')
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
		eventNames: ['PlayerLogin', 'MetagameEvent']
	}))
}
 
client.onmessage = function(e) {
	
	const DBGdata = JSON.parse(e.data)

	//IGNORE THESE!
	if (DBGdata.type !== 'serviceMessage') return console.log(DBGdata)
	
	if (DBGdata.payload.event_name === 'PlayerLogin') {
		
		saveLoginMetric(DBGdata.payload.character_id)
		.then(dispatchNotification)
		.then(() => {return})
		.catch(console.error)
	}
	
	if (DBGdata.payload.event_name === 'MetagameEvent') {
		console.log('ASF!', DBGdata);
	}
}

client.onclose = function() {
  console.log('Client Closed.')
}


/*
@param _Character_
@return _Character_
*/
function saveLoginMetric(_Character_) {
	
	return new Promise((resolve, reject) => {
		
		Dataservices.dbg.getCharacterById(server[0], _Character_)
		.then((character) => {
			
			Login({
				_Character_: _Character_,
				_Outfit_: character.outfit_member ? character.outfit_member.outfit_id : null,
				time: new Date
			})
			.save()
			.then(() => resolve(_Character_))
			.catch(console.error)
		})
		.catch(() => resolve(_Character_))
	})
}

/*
@param _Character_
@return _Character_
*/
function dispatchNotification (_Character_) {
	
	return new Promise((resolve, reject) => {
		
		CharacterSubscription
		.getAll(_Character_, {index: '_Character_'})
		.then((characterSubscriptions) => {
	
			if (!characterSubscriptions.length) return resolve(_Character_)
	
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
			  (err) => {
					resolve(_Character_)
			  }
			)
		})
		.catch(console.error)
	})
}