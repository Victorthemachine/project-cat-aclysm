const Event = require('./../../structures/Event');
const Member = require('../../structures/schematics/Member');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {

		});
	}

	async run(member) {
		/*
		const canvas = Canvas.createCanvas(700, 250);
		const context = canvas.getContext('2d');
		const background = await Canvas.loadImage(`${__dirname}./../../structures/public/welcome.jpg`);

		context.drawImage(background, 0, 0, canvas.width, canvas.height);
		context.strokeRect(0, 0, canvas.width, canvas.height);

		const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));

		context.drawImage(avatar, 25, 25, 200, 200);
		context.save();

		context.beginPath();
		context.arc(125, 125, 100, 0, Math.PI * 2, true);
		context.clip();

		const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');

		member.guild.systemChannel.send({ files: [attachment] });\
		*/
		const memberDoc = await Member.getByMemberId(member.id);
		if (memberDoc) {
			const index = memberDoc.roles.findIndex(el => el.guildId === member.guild.id);
			if (index !== -1) {
				await member.roles.set(
					Array.from(
						new Set(
							[
								...member.roles.cache.map(el => el.id),
								...memberDoc.roles[index].roles
									.filter(el => member.guild.roles.cache.has(el) === true)
							].filter(el => member.guild.roles.cache.get(el).comparePositionTo(member.guild.members.cache.get(this.client.user.id).roles.highest) < 0)
						)
					)
				);
			}
		}
	}

};
