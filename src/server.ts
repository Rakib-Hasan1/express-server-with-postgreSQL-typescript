import { Message } from "./../node_modules/esbuild/lib/main.d";
import express, { NextFunction, Request, Response } from "express";
import { Pool, Result } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const app = express();
const port = 5000;

// parser
app.use(express.json());
// app.use(express.urlencoded());

// Database
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});

const initDB = async () => {
  await pool.query(`
        
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
            `);
};

initDB();
// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `${new Date().toISOString()} Method: ${req.method} Path: ${req.path} \n`
  );
  next();
};

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!!!!");
});

// users CRUD
app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES ($1, $2) RETURNING *`,
      [name, email]
    );
    // console.log(result.rows[0]);

    res.status(201).json({
      success: false,
      message: "Data Inserted Successfully",
      data: result.rows[0],
    });

    res.send({ message: "data inserted" });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      message: error.message,
    });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);

    res.status(200).json({
      success: true,
      message: "Users retrived successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      message: error.message,
      details: error,
    });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "User retrived successfully!!",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name, email, req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "User retrived successfully!!",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    // console.log(result);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully!!",
        data: result.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//* todos CRUD
app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
      [user_id, title]
    );
    res.status(201).json({
      success: true,
      message: "Todo created successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);
    // console.log(result.rows[0]);

    res.status(200).json({
      success: true,
      message: "todos Retrived Successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: true,
      message: error.message,
      details: error,
    });
  }
});

app.get("/todos/:id", async (req: Request, res: Response) => {
  const result = await pool.query(`SELECT * FROM todos WHERE user_id = $1`, [
    req.params.id,
  ]);

  try {
    if (result.rows.length === 0) {
      res.send(404).json({
        success: false,
        message: "Todos not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "todos retrived successfully!!",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.put("/todos/:id", async (req: Request, res: Response) => {
  const { title, completed } = req.body;

  try {
    const result = await pool.query(
      `UPDATE todos SET title=$1, completed=$2 WHERE user_id=$3 RETURNING *`,
      [title, completed, req.params.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "todos not found!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "todos update successfully!!",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM todos WHERE user_id = $1`, [
      req.params.id,
    ]);

    // console.log(result);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Todo not found!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todo deleted successfully!!",
        data: result.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
