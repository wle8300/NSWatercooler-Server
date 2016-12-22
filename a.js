var Dataservices = require('./Dataservices')
var CharacterSubscription = require('./model/CharacterSubscription')

var Async = require('async')


// Async.eachSeries(
//
// 	require('./fixtures/characters'),
//
// 	(_Character_, callback) => {
//
// 		CharacterSubscription
// 		({
// 			_User_: 'acc77a90-2471-4354-aa48-ce16b653ed79',
// 			_Character_: _Character_,
// 			characterName: _Character_
// 		})
// 		.save()
// 		.then(() => {callback()})
// 		.catch(console.error)
// 	},
//
// 	console.error
// )

CharacterSubscription
.getAll('acc77a90-2471-4354-aa48-ce16b653ed79', {index: '_User_'})
.then((characterSubscriptions) => {
	
	Async.eachSeries(
		
		characterSubscriptions,
		
		(characterSubscription, callback) => {
			
			Dataservices.dbg.getCharacterById('genudine', characterSubscription._Character_)
			.then((character) => {
				
				if (!character) return callback()
					
				CharacterSubscription
				.get(characterSubscription.id)
				.update({characterName: character.name.first})
				.then((result) => {console.log(0, result);callback()})
				.catch(console.error)
			})
			.catch(console.error)
		},
		
		(err, result) => {console.log(1, result)}
	)
})
.catch(console.error)