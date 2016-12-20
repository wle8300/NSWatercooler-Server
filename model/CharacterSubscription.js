var env = require('../env')

var T = require('thinky')(env.rdb)
var TTypes = T.type


var CharacterSubscription = T.createModel('CharacterSubscription', {
	id: TTypes.string(),
	_User_: TTypes.string(),
	_Character_: TTypes.string(),
	characterName: TTypes.string()
})

CharacterSubscription.ensureIndex('_User_')
CharacterSubscription.ensureIndex('_Character_')

module.exports = CharacterSubscription