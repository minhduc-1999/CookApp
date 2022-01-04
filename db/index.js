const { MongoClient } = require('mongodb');
const fs = require('fs')


const url = 'mongodb+srv://tastify-be:NPcZ69Jk8aVY7wuG@cluster0.auwps.mongodb.net/cookapp?retryWrites=true&w=majority'; //change this connectionString
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
  const collection = db.collection(collectionName);
  const raw = fs.readFileSync(fileName)


  const foods = JSON.parse(raw);
  console.log(foods)
  const iRe = await collection.insertMany(foods)
  console.log("insert result", iRe)

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());