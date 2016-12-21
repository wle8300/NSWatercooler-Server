var W3CWebSocket = require('websocket').w3cwebsocket
 
// var client = new W3CWebSocket('wss://push.planetside2.com/streaming?environment=ps2ps4us&service-id=s:asdf')
// var client = new W3CWebSocket('wss://push.planetside2.com/streaming?environment=ps2ps4eu&service-id=s:asdf')
var client = new W3CWebSocket('wss://push.planetside2.com/streaming?environment=ps2&service-id=s:asdf')


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
	// e.data::::
	// payload: {
	// 	event_name: 'PlayerLogin',
	// 	character_id: <String>,
	// 	timestamp: <Date>,
	// 	world_id: ''
	// },
	// service: 'event',
	// type: 'serviceMessage'
		
	//IGNORE THESE!
	if (JSON.parse(e.data).type === 'heartbeat') return

	// Here's where you would find all their
	// subscribers and dispatch notifications
	console.log(JSON.parse(e.data))
}

// probz won't need to do this... EVER
client.onclose = function() {
  console.log('Client Closed.')
}