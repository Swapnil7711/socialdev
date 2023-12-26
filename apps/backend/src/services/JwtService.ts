import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

type Payload = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
};

class JwtService {
  static signToken(
    payload: Payload,
    secret: string = "defaultsecret",
    expiry: string = "300s"
  ): string {
    if (!secret) {
      throw new Error("can not get JWT");
    }
    const token = jwt.sign(payload, secret, {
      expiresIn: expiry,
    });
    return token;
  }

  static verifyToken(
    token: string | undefined,
    secret: string = "defaultsecret"
  ) {
    if (!token) {
      throw new Error("Token is undefined");
    }
    return jwt.verify(token, secret);
  }
}

export default JwtService;
