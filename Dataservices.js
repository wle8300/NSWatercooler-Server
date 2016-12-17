var serviceId = require('./env').dbg.serviceId

var Request = require('superagent')

var translateDBGAPIServer = function (server) {
	
	if (server === 'genudine') return 'ps2ps4us'
	if (server === 'ceres') return 'ps2ps4eu'
	if (server === 'pc') return 'ps2'
}

module.exports = {
	dbg: {
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
		getOutfitMembers: function (server, _Outfit_, filterOnlineCharacters) {

			return new Promise ((resolve, reject) => {
				
				Request
				.get('http://census.daybreakgames.com/s:' +serviceId+ '/get/' +translateDBGAPIServer(server)+ ':v2/outfit?outfit_id=' +_Outfit_+ '&c:resolve=leader_name,member_character_name,member_online_status')
				.end((err, response) => {

					if (err || response.body.error) return reject('There was an error with your request')

					if (filterOnlineCharacters) return resolve(response.body.outfit_list[0].members.filter((member) => member.online_status === '1000'))
					if (!filterOnlineCharacters) return resolve(response.body.outfit_list[0].members)
				})
			})
		}
	}
}