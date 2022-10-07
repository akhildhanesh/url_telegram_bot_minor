'use strict'
const { getUrl } = require('./mongo')
const express = require('express')
const app = express()

const { createClient } = require('redis')

const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err))

client.connect()


const PORT = process.env.PORT || 3000

const DOMAIN = 'http://localhost:3000/'

app.get('/:url', async (req, res) => {
    let data = await client.get(req.params.url)
    if (data != null) return res.redirect(data)
    getUrl(req.params.url)
        .then(result => {
            if (result.length === 0) return res.send('Something\'s wrong here')
            res.redirect(result[0]['url'])
            client.set(req.params.url, result[0]['url'], 'EX', 60 * 60 * 24)
        })
        .catch(err => console.log(err))
})

app.get('*', (req, res) => res.send('err'))

app.listen(PORT, () => console.log(`running on port => ${PORT}`))