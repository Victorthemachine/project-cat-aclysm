const Event = require('./../structures/Event');
const activities = [
	'These kids with their sci-fi mumbo jumbo like: sleep, happiness and Switzerland',
	'Yes I in fact don\'t sleep I enter coma',
	'Will accept hefty donation of nuts during this harsh winter',
	'If you want to help send Nya~san all of your collage savings or pizza',
	'Munching on deez nuts',
	'If you smell burning toast you are having a stroke or overcooking your toast'
];

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			once: true
		});
	}
	statusInterval(timeout) {
		setTimeout(function () {
			console.log(new Date());
			this.client.user.setActivity(`${this.client.prefix}help | ${activities[Math.floor(Math.random() * activities.length)]}`,
				{ type: 'PLAYING' })
			this.statusInterval(300000)
		}.bind(this), timeout ? timeout : 10);
	};

	run() {
		console.log([
			`Logged in as ${this.client.user.tag}`,
			`Loaded ${this.client.commands.size} commands!`,
			`Loaded ${this.client.events.size} events!`
		].join('\n'));
		this.statusInterval();
	}

};
