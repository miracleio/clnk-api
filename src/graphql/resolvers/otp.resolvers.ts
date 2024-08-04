import mongoose, { Schema } from "mongoose";
import { genSalt, hash, compare } from "bcrypt";
import { object, string } from "yup";
import otpGenerator from "otp-generator";
import { assignRoleToUser } from "../../services/user.services.js";
import OTP from "../../models/otp.model.js";
import User from "../../models/user.model.js";
import { initOTPGeneration } from "../../services/otp.services.js";

const OTPResolvers = {
  Query: {
    otps: async (parent: any, args: any, context: any, info: any) => {
      try {
        const otps = await OTP.find({});

        return otps;
      } catch (error: any) {
        console.log("Query.otps error", error);
        throw new Error(error);
      }
    },
    otp: async (parent: any, args: { id: any }, context: any, info: any) => {
      try {
        return await OTP.findById(args.id);
      } catch (error: any) {
        console.log("Query.otp error", error);
        throw new Error(error);
      }
    },
  },
  Mutation: {
    sendOTP: async (
      parent: any,
      args: { input: { email: any } },
      context: any,
      info: any
    ) => {
      try {
        console.log("args", args);

        const email = args?.input?.email;
        if (!email) {
          throw new Error("Email is required");
        }
        const response = await initOTPGeneration(email);
        console.log({ response });

        return `OTP sent to ${email} successfully`;
      } catch (error: any) {
        console.log("Mutation.sendOTP error", error);
        throw new Error(error);
      }
    },
    verifyOTP: async (
      parent: any,
      args: { input: { email: any; otp: any } },
      context: any,
      info: any
    ) => {
      try {
        console.log("args", args);

        const email = args.input?.email;
        const otp = args.input?.otp;
        const otpDoc = await OTP.findOne({ email, otp });
        console.log({ otpDoc });

        if (!otpDoc) {
          throw new Error("Invalid OTP");
        }
        // get user from email
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }
        // set user as verified
        user.emailVerified = true;
        const updatedUser = await user.save();

        console.log({ updatedUser });

        // await OTP.deleteOne({ email, otp });
        return true;
      } catch (error: any) {
        console.log("Mutation.verifyOTP error", error);
        throw new Error(error);
      }
    },
  },
};

export default OTPResolvers;
