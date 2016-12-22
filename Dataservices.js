var serviceId = require('./env').dbg.serviceId

var Request = require('superagent')

var translateDBGAPIServer = function (server) {
	
	if (server === 'genudine') return 'ps2ps4us'
	if (server === 'ceres') return 'ps2ps4eu'
	if (server === 'pc') return 'ps2'
}

module.exports = {
	dbg: {
		searchCharacters: function (server, searchTerm, limit) {
			
			return new Promise ((resolve, reject) => {

				Request
				.get('http://census.daybreakgames.com/s:' +serviceId+ '/get/' +translateDBGAPIServer(server)+ ':v2/character_name?name.first_lower=^' +searchTerm+ '&c:limit=' +limit+ '&c:show=name.first,character_id&c:sort=name.first')
				.end((err, response) => {

					if (err || response.body.error) return reject('There was an error with your request')
						
					return resolve(response.body.character_name_list)
				})
			})
		},
		getCharacterById: function (server, _Character_) {
			
			return new Promise ((resolve, reject) => {
				
				//docs: https://census.daybreakgames.com/s:asdf/get/ps2ps4us:v2
				Request
				.get('http://census.daybreakgames.com/s:' +serviceId+ '/get/' +translateDBGAPIServer(server)+ ':v2/character?character_id=' +_Character_+ '&c:resolve=online_status,outfit_member_extended')
				.end((err, response) => {
					
					if (err || response.body.error) return reject('There was an error with your request')
						
					return resolve(response.body.character_list[0])
				})
			})
		},
		searchOutfits: function (server, searchTerm) {
		
			return new Promise ((resolve, reject) => {

				Request
				.get('http://census.daybreakgames.com/s:' +serviceId+ '/get/' +translateDBGAPIServer(server)+ ':v2/outfit?alias_lower=^' +searchTerm)
				.end((err, response) => {

					if (err || response.body.error) return reject('There was an error with your request')
						
					return resolve(response.body.outfit_list)
				})
			})
		},
		getOutfitById: function (server, _Outfit_) {
			
			return new Promise ((resolve, reject) => {
				
				Request
				.get('http://census.daybreakgames.com/s:' +serviceId+ '/get/' +translateDBGAPIServer(server)+ ':v2/outfit?outfit_id=' +_Outfit_)
				.end((err, response) => {
					
					if (err || response.body.error) return reject('There was an error with your request')
						
					return resolve(response.body.outfit_list[0])
				})
			})
		},
		getOutfitMembers: function (server, _Outfit_, filterOnline) {

			return new Promise ((resolve, reject) => {
				//ALTERNATIVE http://census.daybreakgames.com/s:asdf/get/ps2ps4us:v2/outfit_member?outfit_id=37531502290403332&c:resolve=online_status&c:limit=1000000000
				Request
				.get('http://census.daybreakgames.com/s:' +serviceId+ '/get/' +translateDBGAPIServer(server)+ ':v2/outfit?outfit_id=' +_Outfit_+ '&c:resolve=leader_name,member_character_name,member_online_status')
				.end((err, response) => {

					if (err || response.body.error) return reject('There was an error with your request')

					if (filterOnline) return resolve(response.body.outfit_list[0].members.filter((member) => member.online_status !== '0'))
					if (!filterOnline) return resolve(response.body.outfit_list[0].members)
				})
			})
		}
	}
}