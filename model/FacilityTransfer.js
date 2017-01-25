var env = require('../env')

var T = require('thinky')(env.rdb)
var TTypes = T.type


var FacilityTransfer = T.createModel('FacilityTransfer', {
	id: TTypes.string(),
	server: TTypes.string(),
	time: TTypes.date(),
	_Facility_: TTypes.string(),
	_Outfit_: TTypes.string()
})

FacilityTransfer.ensureIndex('world')
FacilityTransfer.ensureIndex('_Outfit_')
FacilityTransfer.ensureIndex('time')
FacilityTransfer.ensureIndex('world_time', (doc) => [doc('world'), doc('time')])
FacilityTransfer.ensureIndex('_Outfit_Time', (doc) => [doc('_Outfit_'), doc('time')])

module.exports = FacilityTransfer