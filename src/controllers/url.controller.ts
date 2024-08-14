import { Request, Response } from "express";
import { findOriginalUrl } from "../services/url.services.js";

const APP_URL = process.env.BASE_URL || "http://localhost:3000";

const redirect = async (req: Request, res: Response) => {
  const { code } = req.params;
  try {
    const originalUrl = await findOriginalUrl(code);
    if (originalUrl) {
      return res.redirect(originalUrl);
    }
    // return res.status(404).json("URL not found");
    // redirect to home page
    return res.redirect(APP_URL);
  } catch (err) {
    return res.status(500).json("Server error");
  }
};

export { redirect };
