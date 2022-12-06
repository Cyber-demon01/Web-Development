
const { Collection } = require("mongodb");
const mongoose = require("mongoose");

// Replace the url string with your connection string.

const url = "mongodb://localhost:27017/fruitdb";

main().catch(err => console.log(err));

//connect to the mongodb mongod should be online.
async function main() {
  await mongoose.connect(url);
};


//Everything in Mongoose starts with a Schema. 
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const fruitschema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please enter a name, It can't be empty."],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
  },
  review: String,
});

const Fruit = mongoose.model('Fruit', fruitschema);

const kiwi = new Fruit(
  {
    name: "Kiwi",
    rating: 10,
    review: "sweet and little bit sour",
  }
);

const pineapple = new Fruit(
  {
    name: "Pineapple",
    rating: 9,
    review: "Great fruit",
  }
)

pineapple.save();

// Fruit.deleteMany({ name: "Kiwi" }, (err) => {
//   if (err) {
//     console.log(err);
//   };
// });
Fruit.find((err, fruit) => {
  if (err) {

    console.log(err);

  } else {
    mongoose.connection.close();

    console.log(fruit);
    // fruit.forEach((data) => {
    //   console.log(data);
    // });

  };
});



// const fruits = [
//   {
//     name: "Apple",
//     rating: 10,
//     review: "a Apple keeps doctor away."
//   },
//   {
//     name: "Orange",
//     rating: 9,
//     review: "sweet but sour",
//   },
//   {
//     name: "Watermelon",
//     rating: 5,
//     review: "not good",
//   }
// ];

// Fruit.insertMany(fruits, (err) => {
//   console.log(err);
// });

const personschema = new mongoose.Schema({
  name: String,
  age: Number,
  favouriteFruit: fruitschema,
});

const Person = mongoose.model("Person", personschema);

const person = new Person(
  {
    name: "Enola",
    age: 12,
    favouriteFruit: kiwi,
  }
);

Person.updateOne({ name: "John" }, { favouriteFruit: pineapple }, (err) => {
  if (err) {
    console.log(err);
  };
})

person.save();
// fruit.save();

// mongo syntax
// const client = new MongoClient(url);
// async function run() {
//   try {
//     const database = client.db('fruitdb');
//     const fruits = database.collection("fruits");

//     const data = [
//       {
//         name: "orange",
//         rating: 8,
//         review: "sweet and sour",
//       },
//       {
//         name: "Orange",
//         rating: 7,
//         review: "Sweet and sour perfect combo."
//       },
//       {
//         name: "Mango",
//         rating: 10,
//         review: "Sweetest fruit ever."
//       },
//     ]
//     const cursor = fruits.find({});
//     const fruit_data = await cursor.toArray();
//     // replace console.dir with your callback to access individual elements
//     console.log(fruit_data)
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

