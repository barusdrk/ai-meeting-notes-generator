import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

type RegisterData={
  email:string;
  password:string;
  name?:string;
};

type LoginData={
  email:string;
  password:string;
};

function createToken(userId:string){
  const secret=process.env.JWT_SECRET;

  if(!secret){
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    {userId},
    secret,
    {expiresIn:"7d"}
  );
}

export async function registerUser(
  data:RegisterData
){
  const email=data.email?.trim().toLowerCase();
  const password=data.password;
  const name=data.name?.trim()??"";

  if(!email||!password){
    throw new Error(
      "Email and password are required."
    );
  }

  if(password.length<8){
    throw new Error(
      "Password must be at least 8 characters."
    );
  }

  const existingUser=
    await User.findOne({email});

  if(existingUser){
    throw new Error(
      "An account with this email already exists."
    );
  }

  const hashedPassword=
    await bcrypt.hash(password,12);

  const user=await User.create({
    email,
    password:hashedPassword,
    name,
  });

  const token=createToken(
    user._id.toString()
  );

  return {
    token,
    user:{
      id:user._id,
      email:user.email,
      name:user.name,
      avatar:user.avatar,
      emailVerified:user.emailVerified,
    },
  };
}

export async function loginUser(
  data:LoginData
){
  const email=data.email?.trim().toLowerCase();
  const password=data.password;

  if(!email||!password){
    throw new Error(
      "Email and password are required."
    );
  }

  const user=await User.findOne({
    email,
  });

  if(!user){
    throw new Error(
      "Invalid email or password."
    );
  }

  const validPassword=
    await bcrypt.compare(
      password,
      user.password
    );

  if(!validPassword){
    throw new Error(
      "Invalid email or password."
    );
  }

  user.lastLoginAt=new Date();
  await user.save();

  const token=createToken(
    user._id.toString()
  );

  return {
    token,
    user:{
      id:user._id,
      email:user.email,
      name:user.name,
      avatar:user.avatar,
      emailVerified:user.emailVerified,
    },
  };
}

export async function getCurrentUser(
  userId:string
){
  const user=await User.findById(
    userId
  ).select(
    "-password"
  );

  if(!user){
    throw new Error(
      "User not found."
    );
  }

  return {
    id:user._id,
    email:user.email,
    name:user.name,
    avatar:user.avatar,
    emailVerified:user.emailVerified,
    lastLoginAt:user.lastLoginAt,
    createdAt:user.createdAt,
    updatedAt:user.updatedAt,
  };
}