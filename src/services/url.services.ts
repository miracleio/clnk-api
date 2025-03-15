import { nanoid } from "nanoid";
import URL from "../models/url.model.js";
import User from "../models/user.model.js";

type URLType = {
  url?: string;
  userId?: string;
  code?: string;
  image?: string;
  shorten?: boolean;
};

const APP_URL = process.env.APP_URL || "http://localhost:8000";

const shortenURL = async ({
  url,
  userId,
  code,
  image,
  shorten = true,
}: URLType) => {
  try {
    console.log("🪵🪵🪵🪵🪵", {
      url,
      userId,
      code,
      image,
      shorten,
    });

    // check if user exists
    const user = await User.findById(userId);

    if (!user) {
      // throw new Error("User does not exist");
      console.log("🚨🚨🚨🚨🚨 ~ error: User does not exist");
    }

    // check if code provided already exists
    const existingURL = await URL.findOne({ code });

    if (existingURL) {
      throw new Error("Code already exists");
    }

    const URLCode = code ? code : nanoid(6);
    const shortUrl = shorten ? `${APP_URL}/${URLCode}` : url;

    const obj: URLType & { shortUrl?: string; user?: string } = {};

    url && (obj.url = url);
    userId && (obj.user = userId);
    URLCode && (obj.code = URLCode);
    image && (obj.image = image);
    shortUrl && (obj.shortUrl = shortUrl);

    console.log("🪵🪵🪵🪵🪵 ~ obj", obj);

    const shortURL = (await URL.create(obj)).populate("user");

    return shortURL;
  } catch (error: any) {
    console.log("🚨🚨🚨🚨🚨 ~ error: ", error);

    throw new Error(error);
  }
};

const findOriginalUrl = async (urlCode: string) => {
  try {
    const urlDoc = await URL.findOne({ code: urlCode });
    return urlDoc ? urlDoc.url : null;
  } catch (error: any) {
    console.log("🚨🚨🚨🚨🚨 ~ error: ", error);
    throw new Error(error);
  }
};

export { shortenURL, findOriginalUrl };
