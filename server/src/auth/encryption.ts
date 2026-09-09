import crypto from "node:crypto";

const KEY=Buffer.from(
  process.env.ENCRYPTION_KEY!,
  "hex"
);

const ALGO="aes-256-gcm";

export function encrypt(text:string){
  const iv=crypto.randomBytes(12);
  const cipher=crypto.createCipheriv(ALGO,KEY,iv);
  const encrypted=Buffer.concat([
    cipher.update(text,"utf8"),
    cipher.final()
  ]);
  const tag=cipher.getAuthTag();
  return{
    iv:iv.toString("hex"),
    tag:tag.toString("hex"),
    value:encrypted.toString("hex"),
  };
}

export function decrypt(data:{
  iv:string;
  tag:string;
  value:string;
}){
  const decipher=crypto.createDecipheriv(
    ALGO,
    KEY,
    Buffer.from(data.iv,"hex")
  );
  decipher.setAuthTag(
    Buffer.from(data.tag,"hex")
  );
  return Buffer.concat([
    decipher.update(
      Buffer.from(data.value,"hex")
    ),
    decipher.final()
  ]).toString("utf8");
}
