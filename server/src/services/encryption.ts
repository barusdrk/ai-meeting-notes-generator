import crypto from "crypto";

const algorithm=
  "aes-256-gcm";

function getKey(){
  const secret=
    process.env.ENCRYPTION_SECRET;

  if(!secret){
    throw new Error(
      "ENCRYPTION_SECRET is not configured."
    );
  }

  return crypto
    .createHash("sha256")
    .update(secret)
    .digest();
}

export function encrypt(
  value:string
){
  const iv=
    crypto.randomBytes(16);

  const cipher=
    crypto.createCipheriv(
      algorithm,
      getKey(),
      iv
    );

  const encrypted=
    Buffer.concat([
      cipher.update(
        value,
        "utf8"
      ),
      cipher.final(),
    ]);

  const tag=
    cipher.getAuthTag();

  return [
    iv.toString("hex"),
    tag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

export function decrypt(
  value:string
){
  const[
    ivHex,
    tagHex,
    encryptedHex,
  ]=value.split(":");

  const decipher=
    crypto.createDecipheriv(
      algorithm,
      getKey(),
      Buffer.from(
        ivHex,
        "hex"
      )
    );

  decipher.setAuthTag(
    Buffer.from(
      tagHex,
      "hex"
    )
  );

  const decrypted=
    Buffer.concat([
      decipher.update(
        Buffer.from(
          encryptedHex,
          "hex"
        )
      ),
      decipher.final(),
    ]);

  return decrypted.toString(
    "utf8"
  );
}
