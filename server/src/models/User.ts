import {
  Schema,
  model,
  type InferSchemaType,
} from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export type UserDocument =
  InferSchemaType<typeof userSchema>;

const User = model(
  "User",
  userSchema
);

export default User;
