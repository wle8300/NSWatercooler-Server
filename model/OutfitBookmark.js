var env = require('../env')

var T = require('thinky')(env.rdb)
var TTypes = T.type


var OutfitBookmark = T.createModel('OutfitBookmark', {
	id: TTypes.string(),
	_User_: TTypes.string(),
	_Outfit_: TTypes.string(),
	outfitAlias: TTypes.string()
})

OutfitBookmark.ensureIndex('_User_')

module.exports = OutfitBookmark