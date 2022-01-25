const Command = require('../../structures/Command');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['del', 'd', 'delpls'],
			description: 'Deletes the desired amount of messages (given that they aren\'t older than 14 days)',
			category: 'Admin',
			usage: '<amount>',
			ownerOnly: true
		});
	}

	async run(message, args) {
		console.log(args[0]);
		const amount = parseInt(args[0], 10);
		let actualAmount = amount;
		console.log(`amount: ${amount}`);
		if (!Number.isInteger(amount)) {
			message.reply('Please enter a valid number of messages you want me to delete >~<!');
			return;
		}
		if (amount - 1 < 1) {
			message.reply('You silly hooman give me a proper task >~< (1 or more messages to delete)');
			return;
		}
		this.client.utils.fetchMessages(message.guild, { channel: message.channel, amount: amount })
			.then(collection => {
				console.log(`The wonderfull output: ${collection.values().lenght}`);
				const deletionArray = collection.filter(a => !this.client.utils.isOlder(a)).map(b => b);
				let leftToGoThrough = deletionArray.length;
				actualAmount = deletionArray.length;
				console.log(leftToGoThrough);
				if (leftToGoThrough >= 100) {
					while (leftToGoThrough > 0) {
						let temp = leftToGoThrough;
						temp > 100 ? temp = 100 : temp = temp;
						leftToGoThrough > 100 ? leftToGoThrough -= 100 : leftToGoThrough = 0;
						console.log(deletionArray.slice(0, 99).length);
						message.channel.bulkDelete(deletionArray.slice(0, 99));
						deletionArray.splice(0, 100);
					}
				} else {
					message.channel.bulkDelete(deletionArray);
				}
				let suffix = '';
				if (amount !== actualAmount) {
					suffix = `(${amount - actualAmount}/${amount} couldn't be deleted due to being older than 14 days)`;
				}
				message.channel.send({ content: `Deleted **${actualAmount}** ${actualAmount === 1 ? 'message' : 'messages'} for you! ${suffix}` });
			});
	}

};
