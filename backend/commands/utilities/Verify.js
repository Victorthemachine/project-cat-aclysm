const { nanoid } = require('nanoid')
const Command = require('../../structures/Command');
const Client = require('../../structures/schematics/Client');
const axios = require('axios');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['vrf', 'ver'],
            description: 'Verifies Discord nitro link or code',
            category: 'Utilities',
            usage: '<Link / Code>',
            ownerOnly: false
        });
    }

    async checkCode(code) {
        return new Promise(resolve => {
            axios.get(`https://discordapp.com/api/v6/entitlements/gift-codes/${code}`)
                .then(res => {
                    if (res.data.message === 'Unknown Gift Code') {
                        resolve(false)
                    } else {
                        resolve(true);
                    }
                })
                .catch(err => {
                    if (err.response.data.message === 'Unknown Gift Code') console.log('Failed succesfully');
                    resolve(false);
                })
        })
    }

    async run(message, args) {
        if (args.length > 0) {
            console.log(args[0]);
            let str = args[0];
            let linkParts = str.split('/');
            if (linkParts.length > 0) {
                let temp = linkParts.shift();
                linkParts = temp.split('.').concat(linkParts);
            }
            console.log(linkParts);
            if (linkParts[0] === 'discord' && linkParts[1] === 'gift') {
                const code = linkParts.pop();
                if (code.length === 16) {
                    const verified = await this.checkCode(code);
                    return message.channel.send({ content: verified === true ? 'Legitimate gift code' : 'Invalid code or link' })
                } else {
                    return message.channel.send({ content: 'Invalid code or link' });
                }
            } else {
                if (str.length === 16) {
                    const verified = await this.checkCode(str);
                    return message.channel.send({ content: verified === true ? 'Legitimate gift code' : 'Invalid code or link' })
                } else {
                    return message.channel.send({ content: 'Invalid code or link' });
                }
            }
        } else {
            return message.channel.send({ content: 'No link or code supplied' });
        }
    }

};
