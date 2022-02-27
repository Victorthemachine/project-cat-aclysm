/* eslint-disable consistent-return */
const Event = require('../../structures/Event');
const channelsHW = ['767707574546989066', '767690000166813726', '767689933116276738'];
const logger = require('./../../structures/Logger');
const { milis } = require('../../configuration/botConstants');
const Filter = require('bad-words');
const filter = new Filter();
filter.removeWords('god');
filter.addWords('strnad');


module.exports = class extends Event {

	async run(message) {
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);
		if (!message.guild || message.author.bot) return;
		// TODO: move this to utils to clean it up, but prolly want to make another branch of utils at this point
		if (message.content) {
			if (Object.keys(this.client.spamLog).includes(message.author.id) === false) {
				this.client.spamLog[message.author.id] = {
					messages: 1,
					lastAt: Date.now()
				};
			} else if (Date.now() - this.client.spamLog[message.author.id].lastAt > milis.toMilis(15, 'second')) {
				this.client.spamLog[message.author.id] = {
					messages: 1,
					lastAt: Date.now()
				};
			} else {
				this.client.spamLog[message.author.id].messages += 1;
				if (this.client.spamLog[message.author.id].messages > 4) {
					message.channel.send(`${message.member.displayName} stop spamming!`);
					message.member.timeout(milis.toMilis(1, 'minute'))
						.then(member => {
							console.log('Timed out the person!');
						})
						.catch(err => {
							console.error(err);
							logger.error('Don\'t have timeout perms');
						});
				}
			}
			if (filter.isProfane(message.content) === true) {
				return message.delete()
					.then(msg => {
						logger.info('Deleted message for profanity');
						msg.author.send({ content: `You sent profanity in ${msg.guild.name}. Don't do that!` })
							.then(succ => {
								logger.info('Send dm about profanity');
							})
							.catch(err => {
								logger.info('Failed to send message to DM bcs of profanity');
								console.error(err);
							});
					})
					.catch(err => {
						logger.error(err);
					});
			}
		}
		// Check for attachment in HW channels, react
		// Scrap completely
		if (message.attachments.size > 0) {
			/*
			 * Basically an idea to
			if (message.attachments.first().name === 'message') {
				if (message.attachments.first().filename === `txt`) {
					this.client.utils.downloadFileFromURL(message.attachments.first().url);
				}
			}
			*/
			if (channelsHW.includes(message.channel.id)) {
				message.react('✅').then(() => message.react('❎').then(() => message.react('🗑️')));
			}
		}

		// Fun reactions
		if (this.client.utils.checkForReactMessages(message.content)) this.client.utils.reactToMessage(message);

		if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is \`${this.client.prefix}\`.`);

		const prefix = message.content.match(mentionRegexPrefix) ?
			message.content.match(mentionRegexPrefix)[0] : this.client.prefix;

		if (!message.content.startsWith(prefix)) return;

		const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

		const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
		if (command) {
			if (command.ownerOnly && !this.client.utils.checkOwner(message.author.id)) {
				return message.reply('Sorry, this command can only be used by the bot owners.');
			}

			if (command.guildOnly && !message.guild) {
				return message.reply('Sorry, this command can only be used in a discord server.');
			}

			if (command.nsfw && !message.channel.nsfw) {
				return message.reply('Sorry, this command can only be ran in a NSFW marked channel.');
			}

			if (command.args && !args.length) {
				return message.reply(`Sorry, this command requires arguments to function. Usage: ${command.usage ?
					`${this.client.prefix + command.name} ${command.usage}` : 'This command doesn\'t have a usage format'}`);
			}

			if (message.guild) {
				const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms;
				if (userPermCheck) {
					const missing = message.channel.permissionsFor(message.member).missing(userPermCheck);
					if (missing.length) {
						return message.reply(`You are missing ${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))} permissions, you need them to use this command!`);
					}
				}

				const botPermCheck = command.botPerms ? this.client.defaultPerms.add(command.botPerms) : this.client.defaultPerms;
				if (botPermCheck) {
					const missing = message.channel.permissionsFor(this.client.user).missing(botPermCheck);
					if (missing.length) {
						return message.reply(`I am missing ${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))} permissions, I need them to run this command!`);
					}
				}
			}

			command.run(message, args);
		}
	}

};
