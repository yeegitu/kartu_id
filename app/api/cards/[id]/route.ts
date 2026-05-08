import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Card from "@/models/Card";

// GET - Ambil satu card by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ UNWRAP params dengan await
    const { id } = await params;
    
    await dbConnect();
    const card = await Card.findOne({ idCard: id });

    if (!card) {
      return NextResponse.json(
        { success: false, error: "Card tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: card }, { status: 200 });
  } catch (error) {
    console.error("Error fetching card:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data card" },
      { status: 500 }
    );
  }
}

// PUT - Update card
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ UNWRAP params dengan await
    const { id } = await params;
    
    const body = await request.json();
    await dbConnect();

    const card = await Card.findOne({ idCard: id });

    if (!card) {
      return NextResponse.json(
        { success: false, error: "Card tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update data
    const updatedCard = await Card.findOneAndUpdate(
      { idCard: id },
      {
        nama: body.nama,
        pekerjaan: body.pekerjaan,
        email: body.email,
        phone: body.phone,
        joinDate: body.joinDate ? new Date(body.joinDate) : card.joinDate,
        expireDate: body.expireDate ? new Date(body.expireDate) : card.expireDate,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { success: true, data: updatedCard, message: "Card berhasil diupdate" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal mengupdate card" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus card
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ UNWRAP params dengan await
    const { id } = await params;
    
    await dbConnect();
    const card = await Card.findOneAndDelete({ idCard: id });

    if (!card) {
      return NextResponse.json(
        { success: false, error: "Card tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Card berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus card" },
      { status: 500 }
    );
  }
}