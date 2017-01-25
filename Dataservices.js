const util = require('./util')
const serviceId = require('./env').dbg.serviceId

const genericErrorMessage = 'There was an error with your request'

const Request = require('superagent')

/*
This is where 3rd party data is accessed

Currently none of the JSON is conformed
to the DAKKACLUB style (only slightly where it
was desperately needed)

DAYBREAK has a really convoluted style. It's just passed
on to the client (mostly) as-is.

In the future you'll want to change this
*/


module.exports = {
	dbg: {
		searchCharacters: function (server, searchTerm, limit) {
			
			return new Promise ((resolve, reject) => {

				Request
				.get('http://census.daybreakgames.com/s:' +serviceId+ '/get/' +util.translateToPlatformString(server)+ ':v2/character_name?name.first_lower=^' +searchTerm+ '&c:limit=' +limit+ '&c:show=name.first,character_id&c:sort=name.first')
				.end((err, response) => {

					if (err || response.body.error) return reject(genericErrorMessage)
						
					return resolve(response.body.character_name_list)
				})
			})
		},
		getCharacterById: function (server, _Character_) {
			
			return new Promise ((resolve, reject) => {
				
				Request
				.get('http://census.daybreakgames.com/s:' +serviceId+ '/get/' +util.translateToPlatformString(server)+ ':v2/character?character_id=' +_Character_+ '&c:resolve=online_status,stat,outfit_member_extended,faction,profile,stat_by_faction,stat_history,weapon_stat,weapon_stat_by_faction,')
				.end((err, response) => {
					
					if (err || response.body.error) return reject(genericErrorMessage)
						
					return resolve(response.body.character_list[0])
				})
			})
		},
		searchOutfits: function (server, searchTerm) {
		
			return new Promise ((resolve, reject) => {

				Request
				.get('http://census.daybreakgames.com/s:' +serviceId+ '/get/' +util.translateToPlatformString(server)+ ':v2/outfit?alias_lower=^' +searchTerm)
				.end((err, response) => {

					if (err || response.body.error) return reject(genericErrorMessage)
						
					return resolve(response.body.outfit_list)
				})
			})
		},
		getOutfitById: function (server, _Outfit_) {
			
			return new Promise ((resolve, reject) => {
				
				Request
				.get('http://census.daybreakgames.com/s:' +serviceId+ '/get/' +util.translateToPlatformString(server)+ ':v2/outfit?outfit_id=' +_Outfit_)
				.end((err, response) => {
					
					if (err || response.body.error) return reject(genericErrorMessage)
						
					return resolve(response.body.outfit_list[0])
				})
			})
		},
		getOutfitMembers: function (server, _Outfit_, filterOnline) {

			return new Promise ((resolve, reject) => {
				
				Request
				.get('http://census.daybreakgames.com/s:' +serviceId+ '/get/' +util.translateToPlatformString(server)+ ':v2/outfit_member?outfit_id=' +_Outfit_+ '&c:resolve=online_status,character&c:limit=1000000000')
				.end((err, response) => {

					if (err || response.body.error) return reject(genericErrorMessage)

					if (filterOnline) return resolve(response.body.outfit_member_list.filter((member) => member.online_status !== '0'))
					if (!filterOnline) return resolve(response.body.outfit_member_list)
				})
			})
		},
		getAlerts: function (server) {
		
			return new Promise ((resolve, reject) => {
				
				Request
				.get('http://census.daybreakgames.com/s:' +serviceId+ '/get/' +util.translateToPlatformString(server)+ ':v2/world_event?type=METAGAME')
				.end((err, response) => {
					
					if (err) return reject(genericErrorMessage)
						
					return resolve(response.body.world_event_list)
				})
			})
		}
	},
	fisu: {
		getCensus: function (server) {
			
			//http://ps4us.ps2.fisu.pw/api/population/?world=1000
			
			return new Promise ((resolve, reject) => {
				
				Request
				.get('http://ps4us.ps2.fisu.pw/api/population/?world=' +util.translateToWorldUUID(server))
				.end((err, response) => {
					
					if (err) return reject(genericErrorMessage)
						
					return resolve(response.body.result[0])
				})
			})
		},
		getContinentControlMetadata: function (server) {
			
			//http://ps4us.ps2.fisu.pw/api/territory/?world=1000&continent=0

			return new Promise ((resolve, reject) => {
				
				Request
				.get('http://' +util.translateToFisuSubdomain(server)+ '.ps2.fisu.pw/api/territory/?world=' +util.translateToWorldUUID(server)+ '&continent=0')
				.end((err, response) => {
					
					if (err) return reject(genericErrorMessage)
						
					return resolve(response.body.result[0])
				})
			})
		}
	}
}