// auth/register.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "../../../lib/mongodb";

export async function POST(req) {
  const { username, email, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const usersCollection = db.collection("users");
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const result = await usersCollection.insertOne({ username, email, password: hashedPassword });
    return NextResponse.json({ user: result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}