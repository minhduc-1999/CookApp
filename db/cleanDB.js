const { MongoClient } = require('mongodb');
const fs = require('fs')
require('dotenv').config()

const url = process.env.DB_CONNECTION; //change this connectionString
const client = new MongoClient(url);

// Config here
const dbName = 'cookapp'
const collectionName = 'foods'
const fileName = 'food_2.json'
//

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const userCol = db.collection("users");
  const wallCol = db.collection("walls");
  const feedCol = db.collection("feeds");
  const postCol = db.collection("posts");
  const commentCol = db.collection("comments");


  console.log("start clean")
  await Promise.allSettled([
    userCol.deleteMany({}),
    wallCol.deleteMany({}),
    feedCol.deleteMany({}),
    postCol.deleteMany({}),
    commentCol.deleteMany({})
  ])
  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());