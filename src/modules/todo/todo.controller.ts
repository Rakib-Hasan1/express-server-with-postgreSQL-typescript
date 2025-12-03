import { Request, Response } from "express";
import { todoServices } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.createTodo(req.body);
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
};

const getTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getTodo();
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
};

const getSingleTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getSingleTodo(req.params.id!);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
};

const updateTodo = async (req: Request, res: Response) => {
  const { title, completed } = req.body;

  try {
    const result = await todoServices.updateTodo(
      title,
      completed,
      req.params.id!
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
};

const deleteTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.deleteTodo(req.params.id!);

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
};

export const todoControllers = {
  createTodo,
  getTodo,
  getSingleTodo,
  updateTodo,
  deleteTodo,
};
