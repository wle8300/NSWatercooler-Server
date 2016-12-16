var env = require('../env')

var T = require('thinky')(env.rdb)
var TTypes = T.type


var Outfit = T.createModel('Outfit', {
	id: TTypes.string(),
	name: TTypes.string()
})

Outfit.ensureIndex('name')
Outfit.ensureIndex('region')

module.exports = Outfit