import jwt from "jsonwebtoken";

const SECRET=process.env.JWT_SECRET||"development-secret";
const EXPIRES=process.env.JWT_EXPIRES_IN||"7d";

export function signToken(payload:{id:string;email:string;}){
  return jwt.sign(payload,SECRET,{expiresIn:EXPIRES} as jwt.SignOptions);
}

export function verifyToken(token:string){
  return jwt.verify(token,SECRET) as{
    id:string;
    email:string;
    iat:number;
    exp:number;
  };
}
