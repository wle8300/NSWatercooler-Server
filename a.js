var CharacterSubscription = require('./model/CharacterSubscription')

var Async = require('async')


Async.eachSeries(
	
	require('./fixtures/characters'),
	
	(_Character_, callback) => {
		
		CharacterSubscription
		({
			_User_: 'acc77a90-2471-4354-aa48-ce16b653ed79',
			_Character_: _Character_,
			characterName: _Character_
		})
		.save()
		.then(() => {callback()})
		.catch(console.error)
	},
	
	console.error
)
