var env = require('../env')

var T = require('thinky')(env.rdb)
var TTypes = T.type


var Login = T.createModel('Login', {
	id: TTypes.string(),
	_Character_: TTypes.string(),
	_Outfit_: TTypes.string(),
	time: TTypes.date()
})

Login.ensureIndex('_Character_')
Login.ensureIndex('_Outfit_')
Login.ensureIndex('_Outfit_Time', (doc) => [doc('_Outfit_'), doc('time')])

module.exports = Login