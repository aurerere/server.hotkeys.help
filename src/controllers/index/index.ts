import { Request, Response } from "express";

export default function index(req: Request, res: Response): Response
{
    return res.send({ message: "Hello World!" });
}