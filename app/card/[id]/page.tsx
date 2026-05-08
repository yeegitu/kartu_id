"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Import library untuk generate PDF
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CardData {
  _id: string;
  nama: string;
  pekerjaan: string;
  idCard: string;
  email: string;
  phone: string;
  joinDate: string;
  expireDate: string;
  fotoUrl: string;
  qrCodeUrl: string;
}

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Unwrap params
  useEffect(() => {
    params.then((unwrappedParams) => {
      fetchCard(unwrappedParams.id);
    });
  }, [params]);

  const fetchCard = async (id: string) => {
    try {
      const response = await fetch(`/api/cards/${id}`);
      const data = await response.json();
      if (data.success) {
        setCard(data.data);
      } else {
        alert("Card tidak ditemukan");
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching card:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const downloadAsPDF = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // Kualitas tinggi untuk print
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      
      // Ukuran ID Card standar (landscape)
      // 85.6mm x 53.98mm dalam pixel pada 300 DPI
      const pdf = new jsPDF({
        unit: "mm",
        format: [85.6, 54], // Ukuran ID Card
        orientation: "landscape",
      });

      // Tambahkan gambar ke PDF
      pdf.addImage(imgData, "PNG", 0, 0, 85.6, 54);
      pdf.save(`ID_CARD_${card?.idCard}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-3 text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500">Card tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Tombol Download */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={downloadAsPDF}
            disabled={downloading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>⏳ Generate PDF...</>
            ) : (
              <>📥 Download PDF (Cetak)</>
            )}
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            🖨️ Print
          </button>
        </div>

        {/* ID Card - Yang akan di-download/print */}
        <div ref={cardRef} className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* ID Card Depan */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="bg-white m-1 rounded-lg overflow-hidden">
              <div className="bg-blue-900 text-white text-center py-3">
                <p className="text-sm font-semibold tracking-wide">PT RATU PUTRI SENTOSA</p>
              </div>
              
              <div className="p-5">
                <div className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-28 h-28 bg-gray-200 rounded-lg border-2 border-gray-300 overflow-hidden">
                      {card.fotoUrl ? (
                        <img src={card.fotoUrl} alt="Foto" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">👤</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div>
                      <p className="text-xs text-gray-500">NAMA</p>
                      <p className="font-semibold text-gray-800 border-b border-gray-200 pb-1">{card.nama}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">PEKERJAAN</p>
                      <p className="font-semibold text-gray-800 border-b border-gray-200 pb-1">{card.pekerjaan}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-xs text-gray-500">ID No :</p>
                  <p className="font-mono text-sm font-semibold text-gray-800">{card.idCard}</p>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">E-mail :</p>
                    <p className="text-gray-800 truncate">{card.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone :</p>
                    <p className="text-gray-800">{card.phone || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ID Card Belakang */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="bg-white m-1 rounded-lg overflow-hidden">
              <div className="bg-gray-800 text-white text-center py-2">
                <p className="text-xs font-semibold tracking-wide">PT RATU PUTRI SENTOSA</p>
              </div>
              
              <div className="p-5">
                <p className="text-xs font-semibold text-gray-700 mb-2">TERMS & CONDITIONS</p>
                <div className="space-y-2 text-xs text-gray-600">
                  <p className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Identification: Carry the ID card at all times during working hours.</span>
                  </p>
                  <p className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Authorized Use: The ID card is strictly for official use only.</span>
                  </p>
                </div>
                
                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500">Join : {formatDate(card.joinDate)}</p>
                    <p className="text-xs text-gray-500">Expire : {formatDate(card.expireDate)}</p>
                  </div>
                  <div className="text-center">
                    {card.qrCodeUrl && (
                      <img src={card.qrCodeUrl} alt="QR Code" className="w-16 h-16 border rounded-lg" />
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">Scan to Verify</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Cetak */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-yellow-800 mb-2">📌 Tips Cetak ID Card:</p>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Gunakan kertas PVC atau kertas foto (sticker paper)</li>
            <li>• Setting print: <strong>Ukuran 85.6mm x 54mm</strong> (tanpa margin)</li>
            <li>• Gunakan printer ID Card atau printer biasa dengan kertas khusus</li>
            <li>• Laminating agar lebih awet</li>
          </ul>
        </div>
      </div>
    </div>
  );
}