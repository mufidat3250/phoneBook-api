const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require('cors')

app.use(express.json());
app.use(cors())


morgan.token("data", (req) => {
  const body = req.body;
  return JSON.stringify(body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
const generateId = () => {
  maxId = Math.floor(Math.random() * 200);
  return maxId;
};

app.get("/api/info", (_, response) => {
  response.send(`<div>
    <p>Phone book has info for ${persons.length} people </p>
    <p>${new Date()}</p>
    </div>`);
});
app.get("/api/persons", (_, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.filter((person) => person.id !== id);
  response.json(person);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  const newPerson = {
    id: generateId(),
    name: name,
    number: number,
  };

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
  const checkName = persons.find(
    (person) => person.name.toLowerCase() === newPerson.name.toLowerCase()
  );
  if (checkName) {
    return response.status(400).json({ error: "name must be unique" });
  }
  persons = persons.concat(newPerson);
  response.json(persons);
});
console.log(process.env.PORT, 'process.env.port')
let PORT = 3001;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
