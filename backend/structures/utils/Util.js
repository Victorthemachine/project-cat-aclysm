
// Docs
const { Permissions, Channel, Constants: { ChannelTypes }, Guild, GuildChannel, CategoryChannel, Collection, Message, TextChannel, Role } = require('discord.js');
// =============
const path = require('path');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const logger = require('./../Logger');
const ServerConfig = require('./../schematics/ServerConfig');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const Command = require('../Command.js');
const Event = require('../Event.js');

// Configuration
const Reactions = require('./../../configuration/reactions.json');
const CONSTANTS = require('./../../configuration/botConstants');
const MOD_PERMISSIONS = new Permissions(
	Permissions.FLAGS.MANAGE_MESSAGES,
	Permissions.FLAGS.MANAGE_ROLES,
	Permissions.FLAGS.KICK_MEMBERS,
	Permissions.FLAGS.BAN_MEMBERS,
	Permissions.FLAGS.VIEW_AUDIT_LOG,
	Permissions.FLAGS.MANAGE_NICKNAMES
)

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
					data: command.toJSON()
				};
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
				{ body: this.client.slashCommands }
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

	// TODO: Get rid of this in code, delete afterwards
	throwError(description) {
		if (!description) description = 'Error occured';
		return new Error(description);
	}

	// WTF v (THERE IS ALREADY A METHOD FOR THAT!)
	// TODO: Unite all time convertors
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
			const regex = new RegExp(`\\b${el}\\b`, 'g');
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
			const regex = new RegExp(`\\b${el}\\b`);
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
		const index = reaction.length;
		for (let i = 0; i < index; i++) {
			message.react(reaction[i]);
		}
	}

	// TODO: Unite all time convertors
	formatTimeToHHMMSS(string) {
		// don't forget the second param
		var secs = parseInt(string, 10) / 1000;
		var hours = Math.floor(secs / 3600);
		var minutes = Math.floor((secs - (hours * 3600)) / 60);
		var seconds = Math.round(secs - (hours * 3600) - (minutes * 60));

		if (hours < 10) { hours = `0${hours}`; }
		if (minutes < 10) { minutes = `0${minutes}`; }
		if (seconds < 10) { seconds = `0${seconds}`; }
		return `${hours} hr:${minutes} min:${seconds} sec`;
	}

	/**
	 * Get old uncached messages from a channel
	 *
	 * @param {Channel} channel
	 * @param {Integer} amount
	 *
	 * @returns {Array} messages
	 */
	/*
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
				const options = { limit: limit };
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
					});
			}
		});
	}
	*/

	/**
	 * 
	 * @param {TextChannel} channel 
	 * @param {number.Integer} amount 
	 * @param {{ messageAgeOverride: boolean }} scope 
	 * @param {function messageFilter(message) { return boolean }} messageFilter 
	 * @returns {Collection<Message>}
	 */
	async #recursionMessageFetch(channels, amount, scope, messageFilter) {
		return new Promise(resolve => {
			return resolve(this.#loopUtil(channels, amount, scope, messageFilter))
		})
	}

	// NOTE: I am well aware this approach is god awful but I am way too tired rn
	/**
	 * 
	 * @param {TextChannel} channel 
	 * @param {number.Integer} amount 
	 * @param {{ messageAgeOverride: boolean }} scope 
	 * @param {function messageFilter(message) { return boolean }} messageFilter 
	 * @param {Collection} messageCollection 
	 * @param {number.Integer} index
	 * @returns {Collection<Message>}
	 */
	async #loopUtil(channels, amount, scope, messageFilter, messageCollection = new Collection(), index = 0) {
		console.log(channels.length, index);
		if (index === channels.length) return messageCollection;
		messageCollection = messageCollection.concat(await this.#fetchUtil(channels[index], amount, scope, messageFilter));
		return await this.#loopUtil(channels, amount, scope, messageFilter, messageCollection, index + 1);
	}

	/**
	 * 
	 * @param {TextChannel} channel 
	 * @param {number.Integer} amount 
	 * @param {{ messageAgeOverride: boolean }} scope 
	 * @param {function messageFilter(message) { return boolean }} messageFilter 
	 * @param {Collection} messageCollection 
	 * @returns {Collection<Message>}
	 */
	async #fetchUtil(channel, amount, scope, messageFilter, messageCollection = new Collection()) {
		return new Promise(resolve => {
			if (amount === 0) return resolve(messageCollection);
			let limit;
			if (amount !== -1) {
				if (amount > 100) {
					limit = 100;
					amount -= 100
				} else {
					limit = amount;
					amount = 0;
				}
			} else {
				limit = 100;
			}
			const options = {
				limit: limit
			};
			if (messageCollection.last()) options.before = messageCollection.last().id;
			channel.messages.fetch(options).then(msgCollection => {
				if (!scope.messageAgeOverride || scope.messageAgeOverride === false) {
					if (msgCollection.first() && this.isOlder(msgCollection.first()) === true) amount = 0
				}
				messageCollection = messageCollection.concat(msgCollection.filter(message => messageFilter(message)));
				return resolve(this.#fetchUtil(channel, amount, scope, messageFilter, messageCollection));
			}).catch(err => {
				logger.warn(`Failed to fetch messages in ${guild.name}`);
				logger.warn(err);
				return resolve(this.#fetchUtil(channel, 0, scope, messageFilter, messageCollection));
			})
		});
	}

	/**
	 * Fetches all messages from guild according to your scope.
	 * Your scope is determined by channel or targetsId.
	 * You can also choose to only fetch amount.
	 * Although it's recommended only if you scope a channel to use amount.
	 * Since this function iterates guild channels and therefore would fetch the amount from every channel in order.
	 * May result in way more messages than you expected.
	 *
	 * Note: This function only returns messages that aren't older than 14 days.
	 * Since any of the messages over that wouldn't be deleted and would result in error.
	 * If you want to disable this functionality, use messageAgeOverride.
	 *
	 * @param {Guild} guild from where to fetch messages
	 * @param {{ channel: TextChannel | CategoryChannel, amount: number.Integer, targetId: string, messageAgeOverride: boolean}} scope specifying the scope to fetch messages
	 *
	 * @returns {Collection<Message>} collection of messages
	 */
	async fetchMessages(guild, scope = {}) {
		return new Promise(resolve => {
			let messages = new Collection();
			let channelFilter;
			let messageFilter;
			// Setup a filter
			if (scope.targetId) {
				channelFilter = (channel) => channel.type === ChannelTypes.GUILD_TEXT;
				if (scope.messageAgeOverride && scope.messageAgeOverride === true) {
					messageFilter = (message) => message.author.id === scope.targetId;
				} else {
					messageFilter = (message) => (message.author.id === scope.targetId) && (this.isOlder(message) === false);
				}
			} else if (scope.channel) {
				if (scope.messageAgeOverride && scope.messageAgeOverride === true) {
					messageFilter = (message) => true;
				} else {
					messageFilter = (message) => this.isOlder(message) === false
				}
			}
			console.log(channelFilter);
			console.log(messageFilter);
			if (!messageFilter) return messages;
			let channels;
			if (ChannelTypes[scope.channel] === ChannelTypes.GUILD_CATEGORY) {
				channels = scope.channel.children.map(a => a);
			} else {
				channels = !channelFilter ? [scope.channel] : guild.channels.cache.filter(channel => channelFilter(channel)).map(a => a);
			}
			console.log(channels.map(a => a.id));
			if (channels.length === 0) return messages;
			// Needs to be constant to be able to fetch same amount from all the channels
			const amountToFetch = scope.amount ? scope.amount : -1;
			this.#recursionMessageFetch(channels, amountToFetch, scope, messageFilter)
				.then(msgCollection => {
					return resolve(msgCollection);
				});
		});
	}

	isOlder(message, days) {
		let check = false;
		const currentTime = Date.now();
		if (days) {
			if ((currentTime - message.createdTimestamp) >= (days * CONSTANTS.milis.milisTime.day)) {
				check = true;
			}
		} else if ((currentTime - message.createdTimestamp) >= (CONSTANTS.milis.milisTime.week * 2)) {
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
					const userGuilds = this.client.guilds.cache.filter(guild => guild.members.cache.findKey(member => member.id === id));
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
				});
		});
	}

	canInvite(user, guildCollection) {
		return new Promise(resolve => {
			const filteredGuilds = [];
			guildCollection.each(guild => {
				guild.members.fetch(user)
					.then(targetMember => {
						filteredGuilds.push({ icon: guild.iconURL(), name: guild.name, id: guild.id, invitable: false });
						if (guild.systemChannel.permissionsFor(targetMember).has('CREATE_INSTANT_INVITE')) {
							filteredGuilds[filteredGuilds.length - 1].invitable = true;
						}
					});
			});
			resolve(filteredGuilds);
		});
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
				position = 'Owner';
			} else {
				const modPerms = new Set([
					Permissions.FLAGS.MANAGE_MESSAGES,
					Permissions.FLAGS.MANAGE_ROLES,
					Permissions.FLAGS.KICK_MEMBERS,
					Permissions.FLAGS.BAN_MEMBERS,
					Permissions.FLAGS.VIEW_AUDIT_LOG,
					Permissions.FLAGS.MANAGE_NICKNAMES
				]);
				guild.members.fetch(user)
					.then(target => {
						if (target.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
							position = 'Admin';
						} else if (target.permissions.toArray().every(Set.prototype.has, modPerms)) {
							position = 'Mod';
						}
					});
			}
			shallowCopy[counter] = Object.assign(shallowCopy[counter], { position: position });
			counter++;
		});
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
										if (targetChannel.permissionsFor(targetMember).has('CREATE_INSTANT_INVITE')) {
											targetGuild.invites.create(targetChannel, { maxAge: 0, maxUses: 0 })
												.then(invite => {
													resolve({ invite: invite.url });
												})
												.catch(error => {
													console.log('Step three');
													console.log(error);
													resolve({ error: 'missing permission' });
												});
										}
									});
							})
							.catch(error => {
								console.log('Step two');
								console.log(error);
								resolve({});
							});
					})
					.catch(err => {
						console.log('Step one');
						console.error(err);
						resolve({});
					});
			} else {
				this.client.users.fetch(id)
					.then(target => {
						const targetGuild = this.client.guilds.cache.get(guildId);
						targetGuild.members.fetch(target)
							.then(targetMember => {
								if (targetGuild.systemChannel.permissionsFor(targetMember).has('CREATE_INSTANT_INVITE')) {
									targetGuild.invites.create(targetGuild.systemChannel, { maxAge: 0, maxUses: 0 })
										.then(invite => {
											resolve({ invite: invite.url });
										})
										.catch(error => {
											console.log('Step three');
											console.log(error);
											resolve({ error: 'missing permission' });
										});
								}
							});
					})
					.catch(err => {
						console.log('Step one');
						console.error(err);
						resolve({});
					});
			}
		});
	}

	/**
	 * Formats the channel name based on the channel type.
	 * See {@link ChannelTypes} for reference.
	 *
	 * @param {Array | Integer} channels channelTypes to format
	 * @returns {string} formatted channel name
	 */
	formatChannelTypes(channels) {
		if (channels) {
			if (Array.isArray(channels)) {
				console.log('Formatting array of channels');
				const channelNames = channels.map(el => {
					let channelName = ChannelTypes[el].replace('_', ' ');
					if (channelName !== 'DM') {
						channelName = (channelName.charAt(0) + channelName.toLocaleLowerCase().slice(1)).replace('dm', 'chat');
					}
					return `${channelName}s`;
				});
				return channelNames.join(', ');
			} else {
				return `${ChannelTypes[channels]}`;
			}
		} else {
			return '';
		}
	}

	/**
	 * Verifies if client can assign this role.
	 * 
	 * @param {Role} role any guildrole
	 * @returns {boolean} can assign role
	 */
	verifyRolePosition(role) {
		return (role.guild.members.cache.get(this.client.user.id)).roles.highest.comparePositionTo(role) > 0 ? true : false;
	}

	async fetchUserGuilds(userId) {
		const user = this.client.users.cache.get(userId);
		if (!user || Object.keys(user).length === 0) return [];
		const mutualGuilds = this.client.guilds.cache.filter(guild => guild.members.cache.has(userId)).map(guild => guild);
		console.log(mutualGuilds.map(guild => guild.name));
		const userGuildInfoObj = await this.determineUserStandingInGuilds(user, mutualGuilds);
		// Dunno how it works rn, but if they return iterable it could be chained like a builder I think
		// TODO: do that ^
		const enableFunctions = await this.determineAvailibleFunctions(user, userGuildInfoObj);
		// If necessary can add more data here
		return enableFunctions;
	}

	async determineUserStandingInGuilds(user, guilds) {
		return new Promise(resolve => {
			if (Array.isArray(guilds) === false) throw TypeError(`Guilds must be array, received ${typeof guilds}`);
			if (guilds.length === 0) return resolve({});
			// simple way to sync up async func. Doesn't matter in this case since the function is already in async loop
			// so it doesn't impact performance
			let syncCounter = 0;
			const returnObj = {};
			const populateReturnObj = (position, guild, member) => {
				console.log('Populating the response');
				syncCounter++;
				guild.members.fetch(guild.ownerId)
					.then(owner => {
						returnObj[guild.name] = {
							guildId: guild.id,
							guildAvatar: guild.iconURL({ dynamic: true }),
							owner: {
								id: owner.id,
								avatar: owner.displayAvatarURL({ dynamic: true }),
								name: owner.user.username,
								discriminator: owner.user.discriminator
							},
							position: position,
							invite: {
								allowed: member.permissions.has(Permissions.FLAGS.CREATE_INSTANT_INVITE)
							}
						}
						console.log(returnObj[guild.name]);
						if (syncCounter === guilds.length) return resolve(returnObj);
					})
			}
			guilds.forEach(guild => {
				guild.members.fetch(user)
					.then(member => {
						let position = 'Member';
						if (guild.ownerId === user.id) {
							position = 'Owner';
						} else if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
							position = 'Admin';
						} else if (member.permissions.missing(MOD_PERMISSIONS, false).length === 0) {
							position = 'Mod'
						}
						return populateReturnObj(position, guild, member);
					})
			})

		})
	}

	async determineAvailibleFunctions(user, guildObj) {
		return new Promise(resolve => {
			let syncCounter = 0;
			const populateGuildObj = (guildName, funcObj) => {
				syncCounter++;
				guildObj[guildName].userPerms = funcObj;
				if (syncCounter === Object.keys(guildObj).length) return resolve(guildObj);
			}

			const checkPerms = async (guildName, guildId, funcObj) => {
				const guild = this.client.guilds.cache.get(guildId);
				const member = await guild.members.fetch(user);
				// TODO: automate checks
				funcObj.manage.roles = member.permissions.has(Permissions.FLAGS.MANAGE_ROLES);
				console.log('===============Mongo test===============');
				console.log('Somethings fishy')
				console.log(await ServerConfig.find({}));
				console.log(ServerConfig.checkServerRolesAccessByGuildId(guildId).get('memberRoles.selfAssign'))
				console.log((await ServerConfig.checkServerRolesAccessByGuildId(guildId)).memberRoles.selfAssign)
				console.log('I hope this works');
				const roles = [];
				const rolesData = (await ServerConfig.checkServerRolesAccessByGuildId(guildId)).memberRoles.selfAssign;
				if (rolesData.any.length > 0) roles.push('any');
				roles.concat(rolesData.specific.map(el => el.roleId));
				console.log(roles);
				console.log('=====Mongo test 2 electric boogaloo=====');
				const actualManualQuery = await ServerConfig.findOne({ guildId: guildId });
				console.log(actualManualQuery.memberRoles.selfAssign.any);
				console.log(actualManualQuery.memberRoles.selfAssign.specific);
				ServerConfig.findOne({ guildId: "782596167158333460" }, function (err, serverConfig) {
					if (err) console.error(err);
					console.log(serverConfig);
				})
				console.log('========================================')
				populateGuildObj(guildName, funcObj);
				return;
			}

			const checkAccessibleRoles = async (guildId, funcObj) => {
				const roles = [];
				const document = await ServerConfig.getByGuildId(guildId);
				if (!document) return funcObj;
				console.log('Data for ', guildId);
				const rolesData = document.memberRoles.selfAssign;
				console.log(rolesData.any);
				console.log(rolesData.specific)
				if (rolesData.any.length > 0) roles.push('any');
				funcObj.roles = roles.concat(rolesData.specific.map(el => el.roleId));
				return funcObj;
			}

			guildLoop:
			for (let guild in guildObj) {
				// TODO: when I have the time, investigate efficient deep cloning
				// I just can't bring myself to do the JSON.parse with stringify
				// also maybe move invite over here as well... makes more sense
				const allFunctions = {
					manage: {
						// All stuff admin
						roles: false
					},
					// Are there roles to pick?
					roles: [],

				}

				if (guildObj[guild].position === 'Owner') {
					for (let i in allFunctions.manage) allFunctions.manage[i] = true;
					checkAccessibleRoles(guildObj[guild].guildId, allFunctions)
						.then(obj => {
							populateGuildObj(guild, obj);
						})
					continue guildLoop;
				}
				checkAccessibleRoles(guildObj[guild].guildId, allFunctions)
					.then(obj => {
						checkPerms(guild, guildObj[guild].guildId, obj);
					})
			}
		})
	}

	// REST API only func
	async fetchGuildInvite(userId, guildId) {
		return new Promise(resolve => {
			const guild = this.client.guilds.cache.get(guildId);
			if (!guild) resolve({});
			guild.members.fetch(userId)
				.then(member => {
					if (guild.systemChannel.permissionsFor(member).has(Permissions.FLAGS.CREATE_INSTANT_INVITE) === true) {
						guild.invites.create(guild.systemChannel, { maxAge: 0, maxUses: 0 })
							.then(invite => {
								resolve({ invite: invite.url });
							})
							.catch(err => {
								logger.error(err);
								resolve({});
							});
					}
				})
				.catch(err => {
					logger.error(err);
					resolve({});
				})
		})
	}

	/**
	 * 
	 * @param {string} guildId 
	 * @param {{ "any"|"specific": [string|{ "roleId": string, "roles": [string] }] }} roles 
	 */
	updateAccessibleRoles(guildId, roles) {
		return new Promise(async resolve => {
			/*ServerConfig.updateAccessibleRolesByGuildId(guildId, roles)
				.then(() => {
					return resolve('finished');
				})*/
			/*ServerConfig.findOneAndUpdate({ guildId: guildId }, { $set: { 'memberRoles.selfAssign': roles } }, { upsert: true, new: true }, (err, newDoc) => {
				if (err) {
					logger.error(err);
					resolve('fail');
				} else {
					console.log(newDoc.memberRoles.selfAssign.any);
					console.log(newDoc.memberRoles.selfAssign.specific);
					resolve('finished');
				}
			});*/
			console.log('Did I catch the fuckwit?');
			console.log(roles);
			const any = roles.any ? roles.any : [];
			const specific = roles.specific ? roles.specific : [];
			console.log('Mmh this update');
			const newDoc = await ServerConfig.findOneAndUpdate({ guildId: guildId }, { $set: { 'memberRoles.selfAssign.any': any, 'memberRoles.selfAssign.specific': specific } }, { upsert: true, new: true });
			resolve(newDoc);
		})
	}

	fetchSelfAssignableRoles(guildId, user) {
		console.log('==============Depression time==============');
		return new Promise(resolve => {
			let guild, member, guildConfRoles, guildAllRoles = '';
			const load = async () => {
				guild = await this.client.guilds.fetch(guildId);
				member = await guild.members.fetch(user);
				guildConfRoles = (await ServerConfig.getByGuildId(guildId)).memberRoles.selfAssign;
				guildAllRoles = await guild.roles.fetch();
				return;
			}
			load()
				.then(() => {
					console.log(guildConfRoles);
					let roles = [];
					const basicRoleFilter = (role) => {
						if (!role) return false
						console.log(role ? true : false);
						console.log(this.verifyRolePosition(role) === true ? true : false);
						console.log(!role.tags ? true : false);
						return (this.verifyRolePosition(role) === true && !role.tags) ? true : false;
					}
					if (guildConfRoles.any.length > 0) roles = roles.concat(guildConfRoles.any.map(el => {
						console.log(guildAllRoles.size);
						console.log(el);
						const role = guildAllRoles.get(el);
						console.log(role);
						console.log(el, ' => ', basicRoleFilter(role));
						if (basicRoleFilter(role) === true) {
							return {
								name: role.name,
								color: role.hexColor,
								avatar: role.icon,
							}
						} else return;
					}))
					let temp = [];
					if (guildConfRoles.specific.length > 0) guildConfRoles.specific.forEach(el => {
						console.log(el.roleId, ' >>> ', member.roles.cache.has(el.roleId));
						if (member.roles.cache.has(el.roleId) === true) {
							const role = guildAllRoles.get(el.roleId);
							console.log(el.roleId, ' => ', basicRoleFilter(role));
							if (basicRoleFilter(role) === true) {
								temp = temp.concat(el.roles.map(id => {
									const mapEl = guildAllRoles.get(id);
									console.log(id, ' ==>> ', basicRoleFilter(mapEl));
									if (basicRoleFilter(mapEl) === true) {
										return {
											name: mapEl.name,
											color: mapEl.hexColor,
											avatar: mapEl.icon,
			
										}
									} else return;
								}))
							}
						}
					});
					console.log('===========================================');
					return resolve((roles.concat(temp)).filter(el => el ? true : false));		
				})	
		})
	}

};
