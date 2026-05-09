"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    if (!date) return "MM/DD/YYYY";
    const d = new Date(date);
    return `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d
      .getDate()
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  const qrCodeUrl = card?.idCard
    ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
        `https://ratuputri.vercel.app/card/${card.idCard}`
      )}`
    : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
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
      <div className="max-w-md mx-auto flex flex-col gap-6 items-center">

        {/* ===== ID CARD DEPAN ===== */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-xl"
          style={{ width: "300px", height: "480px", backgroundColor: "#ffffff" }}
        >
          {/* Black wavy top header */}
          <div className="absolute top-0 left-0 right-0 z-0" style={{ height: "115px" }}>
            <svg viewBox="0 0 300 115" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
              <path d="M0 0 L300 0 L300 78 Q260 115 200 88 Q140 62 80 95 Q40 112 0 88 Z" fill="#111111" />
              <path d="M0 0 L300 0 L300 55 Q250 85 190 60 Q130 35 70 65 Q35 80 0 60 Z" fill="#1e1e1e" />
              <path d="M0 0 L300 0 L300 28 Q220 50 140 30 Q80 14 0 35 Z" fill="#2a2a2a" />
            </svg>
          </div>

          {/* Header: logo + company name */}
          <div className="relative z-10 flex items-center gap-3 px-4 pt-3">
            <img src="/images/logo.jpeg" alt="Logo" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-white font-bold text-sm tracking-wide">
              PT RATU PUTRI SENTOSA
            </span>
          </div>

          {/* Photo */}
          <div className="relative z-10 flex justify-center mt-2">
            <div
              className="rounded-2xl overflow-hidden shadow-lg"
              style={{ width: "130px", height: "130px", border: "3px solid #FFC107" }}
            >
              {card.fotoUrl ? (
                <img src={card.fotoUrl} alt="Foto" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-4xl">👤</div>
              )}
            </div>
          </div>

          {/* Name & Job */}
          <div className="relative z-10 text-center mt-3 px-6">
            <p className="text-xl font-extrabold text-gray-900 tracking-wide">{card.nama}</p>
            <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase mt-0.5">{card.pekerjaan}</p>
          </div>

          {/* Divider */}
          <div className="relative z-10 mx-8 mt-3 border-t border-gray-200" />

          {/* Info rows */}
          <div className="relative z-10 mt-3 px-12 space-y-1.5 text-sm text-gray-700">
            <div className="flex gap-2">
              <span className="font-semibold w-14 flex-shrink-0">ID No</span>
              <span>: {card.idCard}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-14 flex-shrink-0">E-mail</span>
              <span className="truncate">: {card.email || "-"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold w-14 flex-shrink-0">Phone</span>
              <span>: {card.phone || "-"}</span>
            </div>
          </div>

          {/* Yellow wave bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-0" style={{ height: "115px" }}>
            <svg viewBox="0 0 300 115" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
              <path d="M0 115 L300 115 L300 40 Q230 85 160 50 Q90 15 0 50 Z" fill="#FFC107" />
            </svg>
          </div>

          {/* QR Code */}
          <div className="absolute bottom-5 left-1/2 z-10" style={{ transform: "translateX(-50%)" }}>
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code" className="rounded-lg shadow-md bg-white p-1" style={{ width: "80px", height: "80px" }} />
            ) : (
              <div className="bg-white rounded-lg shadow-md flex items-center justify-center" style={{ width: "80px", height: "80px" }}>
                <svg viewBox="0 0 90 90" className="w-full h-full p-2 opacity-30">
                  <rect x="5" y="5" width="30" height="30" rx="3" fill="none" stroke="#000" strokeWidth="4" />
                  <rect x="13" y="13" width="14" height="14" fill="#000" />
                  <rect x="55" y="5" width="30" height="30" rx="3" fill="none" stroke="#000" strokeWidth="4" />
                  <rect x="63" y="13" width="14" height="14" fill="#000" />
                  <rect x="5" y="55" width="30" height="30" rx="3" fill="none" stroke="#000" strokeWidth="4" />
                  <rect x="13" y="63" width="14" height="14" fill="#000" />
                  <rect x="55" y="55" width="8" height="8" fill="#000" />
                  <rect x="70" y="55" width="8" height="8" fill="#000" />
                  <rect x="55" y="70" width="8" height="8" fill="#000" />
                  <rect x="70" y="70" width="15" height="15" fill="#000" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* ===== ID CARD BELAKANG ===== */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-xl"
          style={{ width: "300px", height: "480px", backgroundColor: "#111111" }}
        >
          {/* Yellow wave top */}
          <div className="absolute top-0 left-0 right-0 z-0" style={{ height: "130px" }}>
            <svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
              <path d="M0 0 L300 0 L300 60 Q200 120 100 70 Q50 45 0 80 Z" fill="#FFC107" />
            </svg>
          </div>

          {/* Logo */}
          <div className="absolute top-4 left-1/2 z-10" style={{ transform: "translateX(-50%)" }}>
            <div className="rounded-2xl overflow-hidden" style={{ width: "80px", height: "80px" }}>
              <img src="/images/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Company name */}
          <div className="relative z-10 text-center mt-28 px-6">
            <p className="text-white font-extrabold text-lg tracking-wide">PT RATU PUTRI SENTOSA</p>
          </div>

          {/* Terms & Conditions */}
          <div className="relative z-10 px-8 mt-6">
            <p className="text-white font-extrabold text-base tracking-widest text-center mb-4">
              TERMS &amp; CONDITIONS
            </p>
            <ul className="space-y-3 text-sm text-white">
              <li className="flex gap-2">
                <span className="text-yellow-400 mt-0.5 flex-shrink-0">•</span>
                <span>Identification: Carry the ID card at all times during working hours for identification purposes.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-400 mt-0.5 flex-shrink-0">•</span>
                <span>Authorized Use: The ID card is strictly for official use and should not be shared or used for unauthorized purposes.</span>
              </li>
            </ul>
          </div>

          {/* Yellow wave bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-0" style={{ height: "110px" }}>
            <svg viewBox="0 0 300 110" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
              <path d="M0 110 L300 110 L300 65 Q200 10 100 40 Q50 50 0 20 Z" fill="#FFC107" />
            </svg>
          </div>

          {/* Join & Expire dates */}
          <div className="absolute bottom-6 left-0 right-0 z-10 text-center">
            <p className="text-gray-900 font-bold text-sm">
              Join &nbsp;&nbsp;&nbsp;&nbsp;: <span className="font-extrabold">{formatDate(card.joinDate)}</span>
            </p>
            <p className="text-gray-900 font-bold text-sm">
              Expire : <span className="font-extrabold">{formatDate(card.expireDate)}</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}