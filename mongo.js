'use strict'

const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(url);

const dbName = 'shortner';
const db = client.db(dbName)
const collection = db.collection('urls')

async function main() {
    await client.connect();
    return 'DataBase Connected';
}

main()
    .then(console.log)
    .catch(console.error)

module.exports = {
    addUrl: (data) => {
        return new Promise(async (resolve, reject) => {
            let sl = ObjectId()
            await collection.insertOne({ _id: sl, url: data, short: sl.toString().slice(15,) })
            resolve(sl.toString().slice(15,))
        })
    },

    getUrl: (data) => {
        return new Promise(async (resolve, reject) => {
            const result = await collection.find({ short: data }).toArray()
            resolve(result)
        })
    }
}