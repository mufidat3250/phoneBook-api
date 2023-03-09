const mongoose = require("mongoose");
const process = require("process");
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
console.log({ name, number });
if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}
if (process.argv.length === 3) {
}
if (process.argv.length === 5) {
  console.log(`added ${name} number ${number} to phonebook`);
}

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});
const Person = mongoose.model("Person", personSchema);
const newPerson = new Person({
  name,
  number,
});

Person.find({}).then((result) => {
  result.forEach((person) => console.log(`${person.name} ${person.number}`));
  mongoose.connection.close();
});

newPerson.save().then((result) => {
  console.log("person Saved");
  mongoose.connection.close();
});
