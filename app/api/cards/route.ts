import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Card from "@/models/Card";

// GET - Ambil semua card
export async function GET() {
  try {
    await dbConnect();
    const cards = await Card.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: cards }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data card" },
      { status: 500 }
    );
  }
}

// POST - Buat card baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await dbConnect();

    // Generate QR Code URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      `${process.env.NEXT_PUBLIC_BASE_URL || "https://ratuputri.vercel.app"}/card/${body.idCard}`
    )}`;

    const cardData = {
      ...body,
      qrCodeUrl,
      joinDate: new Date(body.joinDate),
      expireDate: new Date(body.expireDate),
    };

    const card = await Card.create(cardData);

    return NextResponse.json(
      { success: true, data: card, message: "Card berhasil dibuat" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating card:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "ID Card sudah digunakan" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Gagal membuat card" },
      { status: 500 }
    );
  }
}