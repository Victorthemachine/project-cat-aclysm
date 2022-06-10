const Event = require('./../../structures/Event');
const { MessageEmbed } = require('discord.js');

/**
 * So basically this handles all of the long term reaction events.
 * Short term are monitored by message instances and only pass through this class.
 */
module.exports = class extends Event {

	// FIXME: Alright just the fact that these two functions exist is ridiculous. Redo
	doInteract(emoji) {
		switch (emoji) {
			case '🗑️':
				return true;
			case '✅':
				return true;
			case '❎':
				return true;
			default:
				return false;
		}
	}

	verificationCheck(message) {
		// TODO: Fix up these array operations, way too much effort and confusing to read
		const reactMan = message.reactions;
		const objectArr = {
			emotes: [

			]
		};
		reactMan.cache.map(el => {
			const tempArr = [];
			el.users.cache.map(elem => {
				tempArr.push(elem.id);
			});
			objectArr.emotes.push({ name: el.emoji.name, users: tempArr });
		});

		let correctCount = 0;
		let falseCount = 0;
		const voterArr = [];
		for (let i = 0; i < objectArr.emotes.length; i++) {
			if (objectArr.emotes[i].name === '✅' || objectArr.emotes[i].name === '❎') {
				objectArr.emotes[i].users.forEach(element => {
					if (message.guild.members.cache.has(element)) {
						if (!message.guild.members.cache.get(element).user.bot) {
							if (message.guild.members.cache.get(element).id !== message.author.id) {
								switch (objectArr.emotes[i].name) {
									case '✅':
										correctCount++;
										break;
									case '❎':
										voterArr.push(message.guild.members.cache.get(element).displayName);
										falseCount++;
										break;
								}
							} else {
								switch (objectArr.emotes[i].name) {
									case '❎':
										voterArr.push(message.guild.members.cache.get(element).displayName);
										falseCount = 9999;
										break;
								}
							}
						}
					}
				});
			}
		}

		falseCount -= correctCount;
		if (falseCount < 0) falseCount = 0;
		if (falseCount >= 3) {
			const attachments = message.attachments.size ? message.attachments.map(attachment => attachment.proxyURL) : null;
			const embed = new MessageEmbed()
				.setTitle(`Content flagged for possible mistake`)
				.setDescription('**Disclaimer**\nThis content has been voted by at least 3 different users to be incorrect. You have been advised.')
				.setAuthor(`${message.member.displayName}'s work`)
				.setImage(message.author.displayAvatarURL({ dynamic: true }))
				.addField('**❯ Original post:**', [
					message.content.length > 500 ? `${message.content.slice(0, 500)}...` : message.content,
					`Check your work ${message.author}!`,
					`${attachments ? `**❯ Attachments:** ${attachments.join('\n')}` : ''}`,
					`\n **❯ Voted by:** ${voterArr}`
				])
				.setTimestamp();
			message.guild.channels.cache.get('781118529797619723').send(embed).then(() => {
				message.delete();
			});
		}
	}

	async run(messageReaction, user) {
		if (user.bot) return;
		if (this.doInteract(messageReaction.emoji.name) === false) return;
		switch (messageReaction.emoji.name) {
			case '🗑️':
				if (user.id === messageReaction.message.author.id || this.client.utils.checkOwner(user.id) === true) {
					messageReaction.message.delete({ timeout: 1000 });
				}
				break;
			case '✅':
				this.verificationCheck(messageReaction.message);
				break;
			case '❎':
				this.verificationCheck(messageReaction.message);
				break;
			default:
				break;
		}
		return;
	}

};
