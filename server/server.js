import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

// variables
const app = express();
const port = process.env.SERVER_PORT || 5000;
const saltround = parseInt(process.env.SALTROUND);

// middlewares
app.use(cors());
app.use(express.json());

// db setup
// const db = new pg.Client({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });
const db = new pg.Client({
  connectionString: process.env.DB_CONNECTION_STRING,
});
db.connect();

// routes
// get a user by email
app.get("/users/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const result = await db.query("SELECT name, email FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);
    const data = result.rows[0];

    return res.json(data);
  } catch (err) {
    console.error("Internal server error.", err);
    return res.json("error");
  }
});

// adding a user
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    bcrypt.hash(password, saltround, async (err, hash) => {
      if (err) {
        console.log("Can't hash password.", err);
        return res.json({ message: "error" });
      }

      if (hash) {
        const result = await db.query(
          "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
          [name, email.toLowerCase(), hash]
        );
        const data = result.rows[0];
        const jwtToken = jwt.sign(
          {
            id: data.id,
            name: data.name,
            email: data.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        return res.json({ message: "success", token: jwtToken });
      }
    });
  } catch (err) {
    console.error("Internal server error.", err);
    return res.json({ message: "error" });
  }
});

// logging in a user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const check = await db.query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase(),
    ]);
    const data = check.rows[0];

    bcrypt.compare(password, data.password, (err, isMatched) => {
      if (err) {
        console.log("Can't compare passwords.", err);
        return res.json({ message: "error" });
      }

      if (isMatched) {
        const jwtToken = jwt.sign(
          {
            id: data.id,
            name: data.name,
            email: data.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );

        return res.json({ message: "success", token: jwtToken });
      } else return res.json({ message: "error" });
    });
  } catch (err) {
    console.error("Internal server error.", err);
    return res.json({ message: "error" });
  }
});

// getting all notes per user
app.get("/home/:user_id/notes", async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await db.query(
      "SELECT id, title, content FROM notes WHERE user_id = $1",
      [parseInt(user_id)]
    );
    const data = result.rows;

    if (data) res.json({ message: "success", data: data });
  } catch (err) {
    console.error("Internal server error.", err);
    return res.json({ message: "error" });
  }
});

// adding a note
app.post("/notes", async (req, res) => {
  const { user_id, title, content } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [parseInt(user_id), title, content]
    );
    const data = result.rows[0];

    if (data) return res.json({ message: "success" });
    else return res.json({ message: "error" });
  } catch (err) {
    console.error("Internal server error.", err);
    return res.json({ message: "error" });
  }
});

// delete a note
app.delete("/home/notes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM notes WHERE id = $1", [parseInt(id)]);

    return res.json({ message: "success" });
  } catch (err) {
    console.error("Internal server error.", err);
    return res.json({ message: "error" });
  }
});

// google register
app.post("/register/google", async (req, res) => {
  const { name, email, google_id } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING *",
      [name, email, google_id]
    );
    const data = result.rows[0];

    if (data) {
      const jwtToken = jwt.sign(
        {
          id: data.id,
          name: data.name,
          email: data.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.json({ message: "success", token: jwtToken });
    } else return res.json({ message: "error" });
  } catch (err) {
    console.error("Internal server error.", err);
    return res.json({ message: "error" });
  }
});

// google login
app.post("/login/google", async (req, res) => {
  const { email } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const data = result.rows[0];
    const jwtToken = jwt.sign(
      {
        id: data.id,
        name: data.name,
        email: data.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({ message: "success", token: jwtToken });
  } catch (err) {
    console.error("Internal server error.", err);
    return res.json({ message: "error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
