const mongoose = require('mongoose');

const reactionMessageConstructSchema = new mongoose.Schema({
	guildId: {
		type: String,
		required: [true, 'You must supply guildId for ReactionMessageConstruct']
	},
	messageId: {
		type: String,
		required: [true, 'You must supply messageId for ReactionMessageConstruct']
	},
	end: {
		type: String,
		default: false
	},
	endBy: Date,
	startedAt: {
		type: Date,
		default: Date.now
	},
	startedBy: {
		type: String,
		required: [true, 'You must supply who started this command for ReactionMessageConstruct']
	},
	// User Id
	exclusive: {
		type: Boolean,
		default: false
	},
	targets: [String],
	summerize: {
		type: Boolean,
		default: true
	},
	validEmojis: [String],
	action: {
		// If both are empty => it's a Poll
		giveRoles: [String],
		giveNickname: [String]
	}
});

const ReactionMessageConstruct = mongoose.model('ReactionMessageConstruct', reactionMessageConstructSchema);
module.exports = ReactionMessageConstruct;
