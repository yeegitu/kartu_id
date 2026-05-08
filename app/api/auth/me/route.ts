import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default-secret-key-ganti-ini"
    );
    
    const { payload } = await jwtVerify(token, secret);
    
    return NextResponse.json(
      { success: true, user: payload },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Token tidak valid atau expired" },
      { status: 401 }
    );
  }
}