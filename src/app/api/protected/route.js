import { NextResponse } from 'next/server';
import { getTokenFromCookie, verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';

export async function GET(request) {
  try {
    const token = getTokenFromCookie();
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    await dbConnect();

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Not authorized', details: error.message },
      { status: 403 }
    );
  }
}