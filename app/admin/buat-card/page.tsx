"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuatCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Form data dengan field baru
  const [formData, setFormData] = useState({
    nama: "",
    pekerjaan: "",
    idCard: "",
    email: "",
    phone: "",
    joinDate: "",
    expireDate: "",
    foto: null as File | null,
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, foto: file }));
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  // Handle submit
  // Update handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fotoUrl = "";
      let fotoPublicId = "";

      // Upload foto ke Cloudinary dulu jika ada
      if (formData.foto) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", formData.foto);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          fotoUrl = uploadData.fotoUrl;
          fotoPublicId = uploadData.fotoPublicId;
        } else {
          throw new Error("Upload foto gagal");
        }
      } else {
        fotoUrl = "https://via.placeholder.com/150";
        fotoPublicId = "placeholder";
      }

      // Submit data card dengan URL foto permanen
      const submitData = {
        nama: formData.nama,
        pekerjaan: formData.pekerjaan,
        idCard: formData.idCard,
        email: formData.email,
        phone: formData.phone,
        joinDate: formData.joinDate,
        expireDate: formData.expireDate,
        fotoUrl: fotoUrl,
        fotoPublicId: fotoPublicId,
      };

      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Card berhasil dibuat!");
        router.push("/admin/dashboard");
      } else {
        alert(data.error || "Gagal membuat card");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  // Generate preview QR Code URL
  const qrCodeUrl = formData.idCard
    ? `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
        `https://kartuid.com/card/${formData.idCard}`,
      )}`
    : null;

  // Format tanggal ke MM/DD/YYYY
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ID</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">
                Buat Card Baru
              </h1>
            </div>
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Kembali
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Kiri */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Form Data Karyawan
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Upload Foto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Profile
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-2xl">📷</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
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
                  placeholder="Masukkan nama lengkap"
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
                  placeholder="Contoh: Manager, Staff, Direktur"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              {/* ID Card */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="idCard"
                  value={formData.idCard}
                  onChange={handleChange}
                  placeholder="Contoh: 3890091922"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  ID ini akan digunakan untuk generate QR Code otomatis
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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@perusahaan.com"
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
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0812-3456-7890"
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
                    value={formData.joinDate}
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
                    value={formData.expireDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Card"}
              </button>
            </form>
          </div>

          {/* Preview Kanan - ID Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Preview ID Card
            </h2>

            <div className="bg-gray-100 rounded-xl p-4">
              {/* ID Card Depan */}
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden shadow-lg mb-6">
                <div className="bg-white m-1 rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-blue-900 text-white text-center py-3">
                    <p className="text-sm font-semibold tracking-wide">
                      PT RATU PUTRI SENTOSA
                    </p>
                  </div>

                  <div className="p-5">
                    <div className="flex gap-5">
                      {/* Foto */}
                      <div className="flex-shrink-0">
                        <div className="w-28 h-28 bg-gray-200 rounded-lg border-2 border-gray-300 overflow-hidden">
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt="Foto"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                              👤
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Data diri */}
                      <div className="flex-1 space-y-1">
                        <div>
                          <p className="text-xs text-gray-500">NAMA</p>
                          <p className="font-semibold text-gray-800 border-b border-gray-200 pb-1">
                            {formData.nama || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">PEKERJAAN</p>
                          <p className="font-semibold text-gray-800 border-b border-gray-200 pb-1">
                            {formData.pekerjaan || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ID Number */}
                    <div className="mt-4">
                      <p className="text-xs text-gray-500">ID No :</p>
                      <p className="font-mono text-sm font-semibold text-gray-800">
                        {formData.idCard || "-"}
                      </p>
                    </div>

                    {/* E-mail & Phone */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">E-mail :</p>
                        <p className="text-gray-800 truncate">
                          {formData.email || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone :</p>
                        <p className="text-gray-800">{formData.phone || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ID Card Belakang - Terms & Conditions */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-white m-1 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 text-white text-center py-2">
                    <p className="text-xs font-semibold tracking-wide">
                      PT RATU PUTRI SENTOSA
                    </p>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      TERMS & CONDITIONS
                    </p>
                    <div className="space-y-2 text-xs text-gray-600">
                      <p className="flex gap-2">
                        <span className="text-blue-600">•</span>
                        <span>
                          Identification: Carry the ID card at all times during
                          working hours for identification purposes.
                        </span>
                      </p>
                      <p className="flex gap-2">
                        <span className="text-blue-600">•</span>
                        <span>
                          Authorized Use: The ID card is strictly for official
                          use and should not be shared or used for unauthorized
                          purposes.
                        </span>
                      </p>
                    </div>

                    {/* QR Code dan Join/Expire */}
                    <div className="mt-4 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-500">
                          Join : {formatDate(formData.joinDate)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Expire : {formatDate(formData.expireDate)}
                        </p>
                      </div>
                      <div className="text-center">
                        {qrCodeUrl ? (
                          <img
                            src={qrCodeUrl}
                            alt="QR Code"
                            className="w-16 h-16 border rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                            QR
                          </div>
                        )}
                        <p className="text-[10px] text-gray-400 mt-1">
                          Scan to Verify
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                ✨ <span className="font-semibold">QR Code otomatis:</span> QR
                Code akan langsung tergenerate saat Anda mengisi Nomor ID Card.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
