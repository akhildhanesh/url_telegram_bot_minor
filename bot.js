'use strict'

const { Telegraf } = require('telegraf')
const { addUrl } = require('./mongo')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

const DOMAIN = 'https://testingthisforfun.minor'

const validateUrl = value => /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)

bot.start(ctx => ctx.reply('send a url to shorten'))

bot.on('text', (ctx) => {
    const msg = ctx.update.message.text.toLowerCase()
    if (!validateUrl(msg)) return ctx.reply('please send a valid url')
    addUrl(msg)
        .then(data => ctx.reply(`${DOMAIN}/${data}`))
        .catch(err => console.error(err))
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))