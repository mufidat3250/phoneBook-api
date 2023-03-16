require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const Person = require("./Models/person");
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("data", (req) => {
  const body = req.body;
  return JSON.stringify(body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL);

app.get("/api/info", (_, response) => {
  Person.countDocuments({}).then((count)=> {
    let info = `<p>Phone book has info for ${count} people </p>`;
    info += new Date()
    response.send(info)
  })
});

app.get("/api/persons", (_, response, next) => {
  Person.find({})
    .then((phoneBook) => {
      response.json(phoneBook.map((book) => book));
    })
    .then((error) => next(error));
});

// get person by ID
app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => response.json(person))
    .catch((error) => next(error));
});

// delete a person
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  const newPerson = Person({
    name,
    number,
  });
  if (!newPerson.name) {
    return response.status(400).json({
      error: "Please provide a name",
    });
  }
  if (!newPerson.number) {
    return response.status(400).json({
      error: " please provide a number",
    });
  }
  if (isNaN(newPerson.number)) {
    return response.status(400).json({
      error: "Invalid Number type",
    });
  }
  newPerson.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  console.log({body})
  console.log(request.params.id);
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((person) => response.json(person))
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error);

  if (error === "castError") {
    return response.status(400).send({ error: "malformated Id" });
  }
  next(error);
};
app.use(errorHandler);


// const unKnownEndPoint = (request, response) => {
//   return response.status(404).send({ error: "unknown Endpoint" });
// };
// app.use(unKnownEndPoint);

let PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
