import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("Login attempt:", { email });

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Ambil dari environment
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    // Cek email
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Cek password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Buat JWT token dengan jose
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default-secret-key-ganti-ini"
    );

    const token = await new SignJWT({ 
      email: ADMIN_EMAIL, 
      role: "admin",
      id: "admin-001" 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .setIssuedAt()
      .sign(secret);

    console.log("Login success, token created");

    // Buat response dengan cookie
    const response = NextResponse.json(
      { 
        success: true, 
        message: "Login berhasil",
        redirectTo: "/admin/dashboard"
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server: " + String(error) },
      { status: 500 }
    );
  }
}