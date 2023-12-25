import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

type payload = {
  id: number;
  email: string;
  firstName: string;
  lastname: string;
  gender: string;
};

class JwtService {
  static signToken(
    payload: payload,
    expiry: string = "60s",
    secret: string = JWT_SECRET || "defaultSecret"
  ): string {
    const token = jwt.sign(payload, secret, { expiresIn: expiry });

    return token;
  }
}

export default JwtService;
