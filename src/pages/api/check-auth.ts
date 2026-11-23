/**
 * Session Authorization Verification API Route Handler
 *
 * Inspects incoming request cookies to verify if an authenticated session exists.
 * Used by client-side route guards and protected pages.
 */

import { NextApiRequest, NextApiResponse } from "next";
import * as cookie from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Parse incoming request cookies
  const cookies = cookie.parse(req.headers.cookie || "");

  // Check for the presence and validity of the authentication token
  if (cookies.authToken === "authenticated") {
    return res.status(200).json({ authenticated: true });
  } else {
    return res.status(401).json({ authenticated: false });
  }
}

