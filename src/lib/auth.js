import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_NAME = 'Token';
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week

export function createToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      {
        expiresIn: MAX_AGE,
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}

export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
}

export function setTokenCookie(token) {
  cookies().set(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });
}

export function removeTokenCookie() {
  cookies().delete(TOKEN_NAME);
}

export function getTokenFromCookie() {
  return cookies().get(TOKEN_NAME)?.value;
}