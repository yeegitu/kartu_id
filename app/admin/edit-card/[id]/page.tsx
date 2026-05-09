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
  fotoPublicId: string;
}

export default function EditCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<CardData | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);

  // Unwrap params (karena di Next.js 15+ params adalah Promise)
  useEffect(() => {
    params.then((unwrappedParams) => {
      setCardId(unwrappedParams.id);
    });
  }, [params]);

  // Ambil data card berdasarkan ID
  useEffect(() => {
    if (!cardId) return;

    const fetchCard = async () => {
      try {
        const response = await fetch(`/api/cards/${cardId}`);
        const data = await response.json();
        if (data.success) {
          setFormData(data.data);
        } else {
          alert("Card tidak ditemukan");
          router.push("/admin/dashboard");
        }
      } catch (error) {
        console.error("Error fetching card:", error);
        alert("Gagal mengambil data card");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [cardId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/cards/${cardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: formData.nama,
          pekerjaan: formData.pekerjaan,
          email: formData.email,
          phone: formData.phone,
          joinDate: formData.joinDate,
          expireDate: formData.expireDate,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Card berhasil diupdate!");
        router.push("/admin/dashboard");
      } else {
        alert(data.error || "Gagal mengupdate card");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  // Format tanggal ke DD/MM/YYYY
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Generate QR Code URL berdasarkan ID Card yang sudah ada
  const qrCodeUrl = formData?.idCard
    ? `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
        `${window.location.origin}/card/${formData.idCard}`,
      )}`
    : null;

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

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-500">Card tidak ditemukan</p>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">
                  ID
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-semibold text-gray-800">
                Edit ID Card
              </h1>
            </div>
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition"
            >
              Batal
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Edit */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Edit Data Karyawan
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Preview Foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Profile
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg border overflow-hidden">
                    {formData.fotoUrl ? (
                      <img
                        src={formData.fotoUrl}
                        alt={formData.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                        👤
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Foto tidak bisa diubah dari sini. Hapus card dan buat ulang
                    untuk mengganti foto.
                  </p>
                </div>
              </div>

              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              {/* Pekerjaan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pekerjaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pekerjaan"
                  value={formData.pekerjaan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              {/* ID Card (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor ID Card
                </label>
                <input
                  type="text"
                  value={formData.idCard}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">
                  ID Card tidak dapat diubah karena digunakan untuk QR Code.
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Join Date & Expire Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    value={
                      formData.joinDate ? formData.joinDate.split("T")[0] : ""
                    }
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expire Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expireDate"
                    value={
                      formData.expireDate
                        ? formData.expireDate.split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/admin/dashboard")}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>

          {/* Preview QR Code */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Preview QR Code
            </h2>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  QR Code untuk ID Card ini:
                </p>
                {qrCodeUrl ? (
                  <div className="inline-block bg-white p-4 rounded-xl shadow-md">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                    QR Code tidak tersedia
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-4 break-all">
                  {`${window.location.origin}/card/${formData.idCard}`}
                </p>
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-700">
                    📌 <span className="font-semibold">Info:</span> QR Code ini
                    akan mengarah ke halaman publik card. Scan dengan HP untuk
                    verifikasi data karyawan.
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Ringkasan Card */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3">
                Ringkasan ID Card:
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama:</span>
                  <span className="font-medium">{formData.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ID Card:</span>
                  <span className="font-medium">{formData.idCard}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Masa Berlaku:</span>
                  <span className="font-medium">
                    {formatDate(formData.joinDate)} -{" "}
                    {formatDate(formData.expireDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
