const Event = require('./../../structures/Event');
const { MessageAttachment } = require('discord.js');

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
	}

};
