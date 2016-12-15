module.exports = {
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