import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';
import { createToken, setTokenCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Create token
    const token = await createToken({ userId: user._id });

    // Set cookie
    const response = NextResponse.json(
      { message: 'User created successfully', user: { id: user._id, name: user.name, email: user.email } },
      { status: 201 }
    );

    setTokenCookie(token);

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating user', details: error.message },
      { status: 500 }
    );
  }
}