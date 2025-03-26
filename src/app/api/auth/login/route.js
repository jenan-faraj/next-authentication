import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';
import { createToken, setTokenCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create token
    const token = await createToken({ userId: user._id });

    // Set cookie
    const response = NextResponse.json(
      { message: 'Login successful', user: { id: user._id, name: user.name, email: user.email } },
      { status: 200 }
    );

    setTokenCookie(token);

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Error logging in', details: error.message },
      { status: 500 }
    );
  }
}