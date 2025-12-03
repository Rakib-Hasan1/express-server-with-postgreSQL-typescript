import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {

  try {
    const result = await userServices.createUser(req.body);
    // console.log(result.rows[0]);

    res.status(201).json({
      success: true,
      message: "Data Inserted Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();
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
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getSingleUser(req.params.id as string);
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
};

const updateUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const id = req.params.id;

  try {
    const result = await userServices.updateUser(name, email, id as string);
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
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.id as string);

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
};

export const userControllers = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser
};
