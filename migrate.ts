import { MongoClient } from 'mongodb';

async function migrate() {
  const url = 'mongodb://0.0.0.0:8051';
  const dbName = 'admin';
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("Connected to database");

    const db = client.db(dbName);
    const products = db.collection('Product');

    await products.updateMany(
      { hidden: { $exists: false } },
      { $set: { hidden: false } }
    );


    await products.updateMany(
      { tagIds: { $exists: false } },
      { $set: { tagIds: [] } }
    );

    await products.updateMany(
      { thumbnail: { $exists: false } },
      { $set: { thumbnail: '' } }
    );

    console.log("Migration completed");
  } finally {
    await client.close();
  }
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});