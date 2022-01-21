const mongoose = require('mongoose');

const serverConfigSchema = new mongoose.Schema({
	guildId: {
		type: String,
		required: [true, 'You must supply guildId for ServerConfig']
    },
    joinedAt: {
        type: Date,
        default: Date.now()
    },
    detectModTiers: {
        type: Boolean,
        default: true
    },
    //If this is defined and detectModTiers is true => override for these roles/users
    modTiers: {
        //Probably worth having, bool values regarding if the arrays are empty
        //Cuts down the checks dramatically
        owner: {
            roles: [String],
            users: [String]
        },
        admin: {
            roles: [String],
            users: [String]
        },
        mod: {
            roles: [String],
            users: [String]
        }
    },
    premium: {
        isPremium: {
            type: Boolean,
            default: false
        },
        premiumBy: [String],
    },
    inviteRules: {
        shouldAsk: Boolean,
        ask: [String],
        //Override invite perms
        allowedToInvite:[String],
        rolesOnJoin: [String],
        logInvites: {
            type: Boolean,
            default: false
        }
    },
    
});

const ReactionMessageConstruct = mongoose.model('ReactionMessageConstruct', reactionMessageConstructSchema);
module.exports = ReactionMessageConstruct;
