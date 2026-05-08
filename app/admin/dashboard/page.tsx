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
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch("/api/cards");
      const data = await response.json();
      if (data.success) {
        setCards(data.data);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const handleBuatCard = () => {
    router.push("/admin/buat-card");
  };

  const handleEdit = (idCard: string) => {
    router.push(`/admin/edit-card/${idCard}`);
  };

  const handleViewCard = (idCard: string) => {
    // Buka halaman public card di tab baru
    window.open(`/card/${idCard}`, "_blank");
  };

  const handleDelete = async (idCard: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus card ini?")) return;

    try {
      const response = await fetch(`/api/cards/${idCard}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        alert("Card berhasil dihapus");
        fetchCards();
      } else {
        alert("Gagal menghapus card");
      }
    } catch (error) {
      console.error("Error deleting card:", error);
      alert("Terjadi kesalahan");
    }
  };

  const filteredCards = cards.filter(
    (card) =>
      card.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.idCard.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.pekerjaan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">ID</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">
                Dashboard Admin
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBuatCard}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                + Buat Card
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Daftar ID Card</h2>
            <p className="text-gray-500 text-sm mt-1">
              Total {filteredCards.length} card
            </p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama, ID, atau pekerjaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-3 text-gray-500">Memuat data...</p>
            </div>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <div
                key={card._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
                  <p className="text-white text-xs font-semibold">ID CARD</p>
                </div>
                <div className="p-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {card.fotoUrl &&
                      card.fotoUrl.startsWith("http") &&
                      !card.fotoUrl.includes("blob:") ? (
                        <img
                          src={card.fotoUrl}
                          alt={card.nama}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl bg-blue-50">
                          👤
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {card.nama}
                      </h3>
                      <p className="text-sm text-blue-600 truncate">
                        {card.pekerjaan}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {card.idCard}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>📧 {card.email || "-"}</span>
                      <span>📱 {card.phone || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>📅 Join: {formatDate(card.joinDate)}</span>
                      <span>⏰ Expire: {formatDate(card.expireDate)}</span>
                    </div>
                  </div>
                  {/* Tombol Aksi dengan 3 tombol */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleViewCard(card.idCard)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1.5 rounded-lg transition"
                    >
                      👁️ Lihat Card
                    </button>
                    <button
                      onClick={() => handleEdit(card.idCard)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium py-1.5 rounded-lg transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(card.idCard)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1.5 rounded-lg transition"
                    >
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredCards.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl">
            <div className="text-6xl mb-4">📇</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Belum ada ID Card
            </h3>
            <p className="text-gray-500 mb-4">
              Klik tombol "Buat Card" untuk membuat ID Card baru
            </p>
            <button
              onClick={handleBuatCard}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              + Buat Card Sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}