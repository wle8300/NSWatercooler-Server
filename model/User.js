var env = require('../env')

var T = require('thinky')(env.rdb)
var TTypes = T.type


var User = T.createModel('User', {
	id: TTypes.string(),
	email: TTypes.string().email(),
	password: TTypes.string()
})

User.ensureIndex('email')

module.exports = User