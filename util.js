const env = require('./env')
const package = require('./package.json');

const Nodemailer = require('nodemailer');
const Jwt = require('jsonwebtoken')


module.exports = {
	createNewJwt: function (payload) {
	
		delete payload.exp
		delete payload.iat
	
		return Jwt.sign(		
			payload,
			env.secret,
			{
		  	algorithm: 'HS256',
		  	expiresIn: "21d"
		  }
		)
	},
	sendEmail: function (emailTo, htmlMessage, callback) {
		
		const emailClient = Nodemailer.createTransport(
			'smtps://' +env.supportEmail.address+ ':' +env.supportEmail.password+ '@smtp.gmail.com'
		)
		
		emailClient.sendMail({
			from: env.supportEmail.address,
			to: emailTo,
			subject: '[' +package.name+ '] ' +new Date().toDateString(),
			html: htmlMessage
		}, (err, info) => {
			return callback()
		})
	},
	translateToPlatformString: function (server) {
		
		if (server === 'genudine') return 'ps2ps4us'
		if (server === 'ceres') return 'ps2ps4eu'
		if (server === 'pc') return 'ps2'
	},
	translateToWorldUUID: function (server) {
		
		if (server === 'genudine') return 1000
		
		else return null
	},
	translateFromWorldUUID: function (integer) {
		
		if (integer === 1000) return 'genudine'
			
		else return null
	},
	translateOutfitDBGModel: function (region, OutfitDBG) {
		return {
			lastUpdate: new Date,
			region: region,
			id: OutfitDBG.outfit_id,
			alias: OutfitDBG.alias,
			leader: {
				_Character_:  OutfitDBG.leader_character_id,
				name: OutfitDBG.leader.name.first,
			},
			members: OutfitDBG.members.map((member) => {
				return {
					id: member.character_id,
					rank: member.rank,
					name: member.name.first,
					isOnline: member.online_status === '1000' ? true : false
				}
			})
		}
	}
}