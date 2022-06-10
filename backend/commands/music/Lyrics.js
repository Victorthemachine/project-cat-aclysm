const Command = require('../../structures/Command');
const embedConfig = require('./../../configuration/embedConfig.json');
const { Lyrics } = require('@discord-player/extractor');
const logger = require('../../structures/Logger');
const lyricsClient = Lyrics.init('');
const Filter = require('bad-words');
const { MessageEmbed } = require('discord.js');
const filter = new Filter({ placeHolder: 'x' });
filter.removeWords('god');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['lyr'],
			description: 'Tries to find lyrics for your song!',
			category: 'Music',
			usage: '<Song> [Artist]',
			ownerOnly: false
		});
	}

	async run(message, args) {
		if (args.length === 0) return message.channel.send('You need to provide me at least a song! How can I know what lyrics you want... gosh >~<!');
		const searchQuery = args.join(' ').trim();
		lyricsClient.search(searchQuery)
			.then(geniusApiData => {
				const allowProfanity = message.channel.nsfw;
				const divideIntoBlocks = geniusApiData.lyrics.replace(/[\\$'"]/g, '\$&').split('\n');
				// //console.log(divideIntoBlocks);
				const blocks = [];
				let potentionallyCompleteBlock = '';
				let tempBlock = '';
				lyricLoop:
				for (let line of divideIntoBlocks) {
					line = line.trim();
					if (line.length === 0) {
						tempBlock += '\n';
						continue lyricLoop;
					}
					if (line.includes('[')) {
						if (potentionallyCompleteBlock && tempBlock) {
							if (potentionallyCompleteBlock.length + tempBlock.length < 4096) {
								logger.info('line 39 - checked for [] pushing both blocks together');
								blocks.push(potentionallyCompleteBlock + tempBlock);
								potentionallyCompleteBlock = '';
								tempBlock = `**${line}**\n`;
							} else {
								logger.info('line 43 - checked for [] pushing potential block');
								blocks.push(potentionallyCompleteBlock);
								potentionallyCompleteBlock = tempBlock;
								tempBlock = `**${line}**\n`;
							}
						} else {
							// Essentially just for the first time so the blocks initialize
							logger.info('line 48 - first time line init');
							tempBlock += `**${line}**\n`;
						}
					} else if (tempBlock.length + line.length < 4096) {
						logger.info('line 53 - adding text');
						tempBlock += `${allowProfanity === true ? line : filter.clean(line)}\n`;
					} else if (potentionallyCompleteBlock) {
						logger.info('line 56 - pushed both blocks');
						blocks.push(potentionallyCompleteBlock, tempBlock);
						potentionallyCompleteBlock = '';
						tempBlock = `${allowProfanity === true ? line : filter.clean(line)}\n`;
					} else {
						logger.info('line 61 - pushed tempBlock');
						blocks.push(tempBlock);
						tempBlock = `${allowProfanity === true ? line : filter.clean(line)}\n`;
					}
				}
				if (potentionallyCompleteBlock) blocks.push(potentionallyCompleteBlock);
				if (tempBlock) blocks.push(tempBlock);
				// //console.log(blocks);
				//console.log(blocks);
				const titleCard = new MessageEmbed()
					.setColor(embedConfig.color)
					.setAuthor(message.member.displayName, message.member.displayAvatarURL())
					.setTitle(`${geniusApiData.artist.name} - ${geniusApiData.title}`)
					.setThumbnail(geniusApiData.thumbnail)
					.setDescription(`${blocks[0]}`);
				if (blocks.length === 1) {
					titleCard
						.setFooter('I hope I got your song right >,<')
						.setTimestamp();
				}
				const embeds = [];
				embeds.push(titleCard);
				for (let i = 1; i < blocks.length; i++) {
					const temp = new MessageEmbed()
						.setColor(embedConfig.color)
						.setDescription(`${blocks[i]}`);
					if (i === blocks.length - 1) {
						temp
							.setFooter('I hope I got your song right >,<')
							.setTimestamp();
					}
					embeds.push(temp);
				}
				for (const embed of embeds) {
					message.channel.send({ embeds: [embed] });
				}
			})
			.catch(err => {
				logger.warn(err);
				return message.channel.send(`Sorry either something went wrong, or there are no results for ${searchQuery}`);
			});
		message.channel.send('WIP');
	}

};
