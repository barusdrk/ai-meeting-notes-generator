import crypto from "node:crypto";

export function createState(){
  return crypto.randomBytes(32).toString("hex");
}

export function createCodeVerifier(){
  return crypto.randomBytes(64).toString("base64url");
}

export function createCodeChallenge(
  verifier:string
){
  return crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");
}
