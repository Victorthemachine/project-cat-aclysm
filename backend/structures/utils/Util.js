const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const fs = require('fs');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const Command = require('../Command.js');
const Event = require('../Event.js');

//Configuration
const Reactions = require('./../../configuration/reactions.json');
const BOT_CONSTANTS = require('./../../configuration/botConstants');
//Docs
const { Channel } = require('discord.js');
//=============

const { reactToThis } = Reactions;

module.exports = class Util {

	constructor(client) {
		this.client = client;
	}

	isClass(input) {
		return typeof input === 'function' && typeof input.prototype === 'object' && input.toString().substring(0, 5) === 'class';
	}

	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes';
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
	}

	async loadCommands() {
		return glob(`${this.directory}commands/**/*.js`).then(commands => {
			for (const commandFile of commands) {
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
				const File = require(commandFile);
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export class`);
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in Commands`);
				this.client.commands.set(command.name, command);
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name);
					}
				}
			}
		});
	}

	async loadSlashCommands() {
		return glob(`${this.directory}slashcommands/**/*.js`).then(slashCommands => {
			for (const slashCommandFile of slashCommands) {
				delete require.cache[slashCommandFile];
				const { name } = path.parse(slashCommandFile);
				const File = require(slashCommandFile);
				const command = new File(this.client, name.toLowerCase());
				const slashCommand = {
					data: command.toJSON(),
				}
				console.log(slashCommand);
				this.client.slashCommands.set(slashCommand.data.name, command);
			}
		});
	}

	async registerSlashCommands(token, clientId, global) {
		const rest = new REST({ version: '9' }).setToken(token);
		try {
			console.log('Started refreshing application (/) commands.');

			await rest.put(
				Routes.applicationGuildCommands(clientId, '782596167158333460'),
				{ body: this.client.slashCommands },
			);

			console.log('Successfully reloaded application (/) commands.');
		} catch (error) {
			console.error(error);
		}

	}

	async loadEvents() {
		return glob(`${this.directory}events/**/*.js`).then(events => {
			for (const eventFile of events) {
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const File = require(eventFile);
				if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
				const event = new File(this.client, name);
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](name, (...args) => event.run(...args));
			}
		});
	}

	/**
	 * TODO: Rewrite this with the new role command
	 * @param {*} str 
	 * @param {*} pos 
	 * @returns 
	 */
	getContent(str, pos) {
		if (pos === 'undefined') pos = 1;
		const temp = str.split(' ');
		const array = new Array(temp.length - pos);
		for (let i = 0; i < pos; i++) {
			array[i] = temp[i + pos];
		}
		if (array[0] === undefined) return;
		if (array[0].includes(',')) {
			const content = array[0].split(',');
			return content;
		}
		if (array.length === 2) array.pop();
		return array;
	}

	removeDuplicates(arr) {
		return [...new Set(arr)];
	}

	capitalise(string) {
		return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
	}

	trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more....`);
		}
		return arr;
	}

	getUserFromMention(mention) {
		if (!mention) return;

		if (mention.startsWith('<@') && mention.endsWith('>')) {
			mention = mention.slice(2, -1);

			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}

			return this.client.users.cache.get(mention);
		}
	}

	checkOwner(target) {
		return this.client.owners.includes(target);
	}

	comparePerms(member, target) {
		return member.roles.highest.position < target.roles.highest.position;
	}

	formatPerms(perm) {
		return perm
			.toLowerCase()
			// eslint-disable-next-line id-length
			.replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
			.replace(/_/g, ' ')
			.replace(/Guild/g, 'Server')
			.replace(/Use Vad/g, 'Use Voice Acitvity');
	}

	formatArray(array, type = 'conjunction') {
		return new Intl.ListFormat('en-GB', { style: 'short', type: type }).format(array);
	}

	//TODO: Get rid of this in code, delete afterwards
	throwError(description) {
		if (!description) description = 'Error occured';
		return new Error(description);
	}

	//WTF v (THERE IS ALREADY A METHOD FOR THAT!)
	//TODO: Unite all time convertors
	timeConversion(millisec) {
		var seconds = (millisec / 1000).toFixed(1);

		var minutes = (millisec / (1000 * 60)).toFixed(1);

		var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

		var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

		if (seconds < 60) {
			return `${seconds} Sec`;
		} else if (minutes < 60) {
			return `${minutes} Min`;
		} else if (hours < 24) {
			return `${hours} Hrs`;
		} else {
			return `${days} Days`;
		}
	}

	checkForReactMessages(str) {
		let result = false;
		str = str.toLowerCase();
		reactToThis.string.forEach(el => {
			// `/\\b${el}\\b/gi`
			const regex = new RegExp('\\b' + el + '\\b', 'g');
			if (regex.test(str)) {
				result = true;
			}
		});
		return result;
	}

	fetchReactionToMessage(str) {
		let result = false;
		str = str.toLowerCase();
		reactToThis.string.forEach(el => {
			/*			console.log(el);
						if (str.includes(el)) result = el;*/
			// `/\\b${el}\\b/gi`
			const regex = new RegExp('\\b' + el + '\\b');
			if (str.match(regex) !== null) {
				console.log('Look at me I did something!');
				result = str.match(regex);
			}
		});
		result = reactToThis.emotes[reactToThis.emotes.findIndex(el => el.name === result[0])].str;
		return result;
	}

	reactToMessage(message) {
		const reaction = this.fetchReactionToMessage(message.content).split(' ');
		let index = reaction.length;
		for (let i = 0; i < index; i++) {
			message.react(reaction[i])
		}
	}

	//TODO: Unite all time convertors
	formatTimeToHHMMSS(string) {
		var sec_num = parseInt(string, 10) / 1000; // don't forget the second param
		var hours = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = Math.round(sec_num - (hours * 3600) - (minutes * 60));

		if (hours < 10) { hours = "0" + hours; }
		if (minutes < 10) { minutes = "0" + minutes; }
		if (seconds < 10) { seconds = "0" + seconds; }
		return hours + ' hr:' + minutes + ' min:' + seconds + ' sec';
	}

	/**
	 * Get old uncached messages from a channel
	 * 
	 * @param {Channel} channel 
	 * @param {Integer} amount 
	 * 
	 * @returns {Array} messages
	 */
	fetchMessages(channel, amount) {
		let _messages;
		let left = amount;
		let initilized = false;

		console.log(`left: ${left}, initilized: ${initilized}`);
		return new Promise(resolve => {
			loadMessages();
			function loadMessages() {
				if (left === 0) {
					resolve(_messages);
					return;
				}
				let limit;
				if (left >= 100) {
					limit = 100;
					left -= 100;
				} else {
					limit = left;
					left = 0;
				}
				let options = { limit: limit };
				if (initilized === true) {
					console.log(`Current _messages: ${_messages.length}`);
					options.before = _messages.last().id;
				} else {
					initilized = true;
				}
				console.log(options);
				channel.messages.fetch(options)
					.then(msgCollection => {
						if (_messages === undefined) {
							_messages = msgCollection;
						} else {
							_messages = _messages.concat(msgCollection);
						}
						loadMessages();
					})
					.catch(err => {
						console.error(err);
					})
			}
		})
	}

	isOlder(message, days) {
		let check = false;
		const currentTime = Date.now();
		if (days) {
			if ((currentTime - message.createdTimestamp) >= (days * BOT_CONSTANTS.milis.day)) {
				check = true;
			}
		} else if ((currentTime - message.createdTimestamp) >= (BOT_CONSTANTS.milis.week * 2)) {
			check = true;
		}
		return check;
	}

	fetchUserData(id) {
		return new Promise(resolve => {
			console.log('Do you exist?');
			this.client.users.fetch(id)
				.then(target => {
					const data = {
						user: {
							icon: target.displayAvatarURL(),
							name: `${target.username}#${target.discriminator}`
						},
						guilds: []
					};
					const userGuilds = this.client.guilds.cache.filter(guild => {
						return guild.members.cache.findKey(member => member.id === id)
					})
					this.canInvite(target, userGuilds)
						.then(filtered => {
							data.guilds = this.determinePosition(target, userGuilds, filtered);
						});
					console.log(data);
					resolve(data);
				})
				.catch(err => {
					console.error(err);
					resolve({});
				})

		})
	}

	canInvite(user, guildCollection) {
		return new Promise(resolve => {
			const filteredGuilds = [];
			guildCollection.each(guild => {
				guild.members.fetch(user)
					.then(targetMember => {
						filteredGuilds.push({ icon: guild.iconURL(), name: guild.name, id: guild.id, invitable: false });
						if ((guild.systemChannel.permissionsFor(targetMember)).has('CREATE_INSTANT_INVITE')) {
							filteredGuilds[filteredGuilds.length - 1].invitable = true;
						}
					})
			});
			resolve(filteredGuilds);
		})
	}

	/**
	 * Add support for custom tiers in future (specific roles etc.)
	 * @param {*} user 
	 * @param {*} guildCollection 
	 * @param {*} dataToEnrich 
	 */
	determinePosition(user, guildCollection, dataToEnrich) {
		let counter = 0;
		const shallowCopy = dataToEnrich;
		console.log('What is this mindfuck of logs');
		console.log(shallowCopy);
		guildCollection.each(guild => {
			let position = 'Member';
			if (guild.ownerId === user.id) {
				position = 'Owner'
			} else {
				const modPerms = new Set([MANAGE_MESSAGES, MANAGE_ROLES, KICK_MEMBERS, BAN_MEMBERS, VIEW_AUDIT_LOG, MANAGE_NICKNAMES])
				guild.members.fetch(user)
					.then(target => {
						if (target.permissions.has(ADMINISTRATOR)) {
							position = 'Admin';
						} else if (target.permissions.toArray().every(Set.prototype.has, modPerms)) {
							position = 'Mod'
						}
					})
			}
			shallowCopy[counter] = Object.assign(shallowCopy[counter], { position: position });
			counter++;
		})
		return shallowCopy;
	}

	fetchInvite(id, guildId, channelId) {
		return new Promise(resolve => {
			if (channelId) {
				this.client.users.fetch(id)
					.then(target => {
						const targetGuild = this.client.guilds.cache.get(guildId);
						targetGuild.channels.fetch(channelId)
							.then(targetChannel => {
								targetGuild.members.fetch(target)
									.then(targetMember => {
										if ((targetChannel.permissionsFor(targetMember)).has('CREATE_INSTANT_INVITE')) {
											targetGuild.invites.create(targetChannel, { maxAge: 0, maxUses: 0 })
												.then(invite => {
													resolve({ invite: invite.url })
												})
												.catch(error => {
													console.log('Step three')
													console.log(error)
													resolve({ error: 'missing permission' });
												})
										}
									})
							})
							.catch(error => {
								console.log('Step two')
								console.log(error)
								resolve({});
							});
					})
					.catch(err => {
						console.log('Step one')
						console.error(err);
						resolve({});
					})
			} else {
				this.client.users.fetch(id)
					.then(target => {
						const targetGuild = this.client.guilds.cache.get(guildId);
						targetGuild.members.fetch(target)
							.then(targetMember => {
								if ((targetGuild.systemChannel.permissionsFor(targetMember)).has('CREATE_INSTANT_INVITE')) {
									targetGuild.invites.create(targetGuild.systemChannel, { maxAge: 0, maxUses: 0 })
										.then(invite => {
											resolve({ invite: invite.url })
										})
										.catch(error => {
											console.log('Step three')
											console.log(error)
											resolve({ error: 'missing permission' });
										})
								}
							})
					})
					.catch(err => {
						console.log('Step one')
						console.error(err);
						resolve({});
					})

			}
		});
	}
};
