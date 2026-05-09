"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuatCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, foto: file }));
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fotoUrl = "";
      let fotoPublicId = "";

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

      const submitData = {
        nama: formData.nama,
        pekerjaan: formData.pekerjaan,
        idCard: formData.idCard,
        email: formData.email,
        phone: formData.phone,
        joinDate: formData.joinDate,
        expireDate: formData.expireDate,
        fotoUrl,
        fotoPublicId,
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

  const qrCodeUrl = formData.idCard
    ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
        `https://ratuputri.vercel.app/card/${formData.idCard}`,
      )}`
    : null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "MM/DD/YYYY";
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Placeholder logo icon (landscape image icon as seen in design)
  const LogoIcon = () => (
    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
      <div className="w-full h-full bg-gradient-to-b from-sky-300 to-sky-200 relative flex items-end justify-center">
        <div className="absolute bottom-0 w-full h-5 bg-green-600 rounded-b-xl" />
        <div className="absolute bottom-3 w-8 h-3 bg-green-500 rounded-full" />
        <div className="absolute top-2 left-2 w-5 h-4 bg-white rounded-full opacity-90" />
        <div className="absolute top-1 left-4 w-4 h-3 bg-white rounded-full opacity-80" />
      </div>
    </div>
  );

  // Large version for card body
  const LogoIconLarge = () => (
    <div className="w-24 h-24 rounded-2xl overflow-hidden border-3 border-white shadow-lg mx-auto">
      <div className="w-full h-full bg-gradient-to-b from-sky-300 to-sky-200 relative flex items-end justify-center">
        <div className="absolute bottom-0 w-full h-10 bg-green-600 rounded-b-2xl" />
        <div className="absolute bottom-5 w-16 h-6 bg-green-500 rounded-full" />
        <div className="absolute top-3 left-3 w-10 h-8 bg-white rounded-full opacity-90" />
        <div className="absolute top-2 left-7 w-8 h-6 bg-white rounded-full opacity-80" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">
                  ID
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-semibold text-gray-800">
                Buat Card Baru
              </h1>
            </div>
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition"
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
                    className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
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

            <div className="flex flex-col gap-6 items-center">
              {/* ===== ID CARD DEPAN ===== */}
              <div
                className="relative overflow-hidden rounded-2xl shadow-xl"
                style={{
                  width: "300px",
                  height: "480px",
                  backgroundColor: "#ffffff",
                }}
              >
                {/* Black wavy top header background */}
                <div
                  className="absolute top-0 left-0 right-0 z-0"
                  style={{ height: "115px" }}
                >
                  <svg
                    viewBox="0 0 300 115"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                  >
                    {/* Deep black base wave */}
                    <path
                      d="M0 0 L300 0 L300 78 Q260 115 200 88 Q140 62 80 95 Q40 112 0 88 Z"
                      fill="#111111"
                    />
                  </svg>
                </div>

                {/* Header content: logo + company name */}
                <div className="relative z-10 flex items-center gap-3 px-4 pt-3">
                  <img
                    src="/images/logo.jpeg"
                    alt="Logo"
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <span className="text-white font-bold text-sm tracking-wide">
                    PT RATU PUTRI SENTOSA
                  </span>
                </div>

                {/* Photo - centered, close to header */}
                <div className="relative z-10 flex justify-center mt-2">
                  <div
                    className="rounded-2xl overflow-hidden shadow-lg"
                    style={{
                      width: "130px",
                      height: "130px",
                      border: "3px solid #FFC107",
                    }}
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Foto"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-sky-300 to-sky-200 relative flex items-end justify-center">
                        <div className="absolute bottom-0 w-full h-1/3 bg-green-600 rounded-b-xl" />
                        <div
                          className="absolute bg-green-500 rounded-full"
                          style={{
                            bottom: "20px",
                            width: "70px",
                            height: "24px",
                          }}
                        />
                        <div
                          className="absolute bg-white rounded-full opacity-90"
                          style={{
                            top: "14px",
                            left: "16px",
                            width: "40px",
                            height: "32px",
                          }}
                        />
                        <div
                          className="absolute bg-white rounded-full opacity-80"
                          style={{
                            top: "10px",
                            left: "32px",
                            width: "32px",
                            height: "24px",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Name & Job */}
                <div className="relative z-10 text-center mt-3 px-6">
                  <p className="text-xl font-extrabold text-gray-900 tracking-wide">
                    {formData.nama || "NAMA"}
                  </p>
                  <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase mt-0.5">
                    {formData.pekerjaan || "PEKERJAAN"}
                  </p>
                </div>

                {/* Divider */}
                <div className="relative z-10 mx-8 mt-3 border-t border-white" />

                {/* Info rows */}
                <div className="relative z-10 mt-3 px-12 space-y-1.5 text-sm text-gray-700">
                  <div className="flex gap-2">
                    <span className="font-semibold w-14 flex-shrink-0">
                      ID No
                    </span>
                    <span>: {formData.idCard || "3890091922"}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold w-14 flex-shrink-0">
                      E-mail
                    </span>
                    <span className="truncate">
                      : {formData.email || "sjjkk2mail.com"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold w-14 flex-shrink-0">
                      Phone
                    </span>
                    <span>: {formData.phone || "378982983"}</span>
                  </div>
                </div>

                {/* Yellow wave bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 z-0"
                  style={{ height: "115px" }}
                >
                  <svg
                    viewBox="0 0 300 115"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 115 L300 115 L300 40 Q230 85 160 50 Q90 15 0 50 Z"
                      fill="#FFC107"
                    />
                  </svg>
                </div>

                {/* QR Code centered on bottom wave */}
                <div
                  className="absolute bottom-5 left-1/2 z-10"
                  style={{ transform: "translateX(-50%)" }}
                >
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="rounded-lg shadow-md bg-white p-1"
                      style={{ width: "80px", height: "80px" }}
                    />
                  ) : (
                    <div
                      className="bg-white rounded-lg shadow-md flex items-center justify-center"
                      style={{ width: "80px", height: "80px" }}
                    >
                      <svg
                        viewBox="0 0 90 90"
                        className="w-full h-full p-2 opacity-30"
                      >
                        <rect
                          x="5"
                          y="5"
                          width="30"
                          height="30"
                          rx="3"
                          fill="none"
                          stroke="#000"
                          strokeWidth="4"
                        />
                        <rect
                          x="13"
                          y="13"
                          width="14"
                          height="14"
                          fill="#000"
                        />
                        <rect
                          x="55"
                          y="5"
                          width="30"
                          height="30"
                          rx="3"
                          fill="none"
                          stroke="#000"
                          strokeWidth="4"
                        />
                        <rect
                          x="63"
                          y="13"
                          width="14"
                          height="14"
                          fill="#000"
                        />
                        <rect
                          x="5"
                          y="55"
                          width="30"
                          height="30"
                          rx="3"
                          fill="none"
                          stroke="#000"
                          strokeWidth="4"
                        />
                        <rect
                          x="13"
                          y="63"
                          width="14"
                          height="14"
                          fill="#000"
                        />
                        <rect x="55" y="55" width="8" height="8" fill="#000" />
                        <rect x="70" y="55" width="8" height="8" fill="#000" />
                        <rect x="55" y="70" width="8" height="8" fill="#000" />
                        <rect
                          x="70"
                          y="70"
                          width="15"
                          height="15"
                          fill="#000"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* ===== ID CARD BELAKANG ===== */}
              <div
                className="relative overflow-hidden rounded-2xl shadow-xl"
                style={{
                  width: "300px",
                  height: "480px",
                  backgroundColor: "#111111",
                }}
              >
                {/* Yellow wave top */}
                <div
                  className="absolute top-0 left-0 right-0 z-0"
                  style={{ height: "130px" }}
                >
                  <svg
                    viewBox="0 0 300 130"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 0 L300 0 L300 60 Q200 120 100 70 Q50 45 0 80 Z"
                      fill="#FFC107"
                    />
                  </svg>
                </div>

                {/* Logo centered on top wave */}
                <div
                  className="absolute top-4 left-1/2 z-10"
                  style={{ transform: "translateX(-50%)" }}
                >
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <img
                      src="/images/logo.jpeg"
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Company name */}
                <div className="relative z-10 text-center mt-28 px-6">
                  <p className="text-white font-extrabold text-lg tracking-wide">
                    PT RATU PUTRI SENTOSA
                  </p>
                </div>

                {/* Terms & Conditions */}
                <div className="relative z-10 px-8 mt-6">
                  <p className="text-white font-extrabold text-base tracking-widest text-center mb-4">
                    TERMS &amp; CONDITIONS
                  </p>
                  <ul className="space-y-3 text-sm text-white">
                    <li className="flex gap-2">
                      <span className="text-yellow-400 mt-0.5 flex-shrink-0">
                        •
                      </span>
                      <span>
                        Identification: Carry the ID card at all times during
                        working hours for identification purposes.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-yellow-400 mt-0.5 flex-shrink-0">
                        •
                      </span>
                      <span>
                        Authorized Use: The ID card is strictly for official use
                        and should not be shared or used for unauthorized
                        purposes.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Yellow wave bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 z-0"
                  style={{ height: "110px" }}
                >
                  <svg
                    viewBox="0 0 300 110"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 110 L300 110 L300 65 Q200 10 100 40 Q50 50 0 20 Z"
                      fill="#FFC107"
                    />
                  </svg>
                </div>

                {/* Join & Expire dates */}
                <div className="absolute bottom-6 left-0 right-0 z-10 text-center">
                  <p className="text-gray-900 font-bold text-sm">
                    Join &nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                    <span className="font-extrabold">
                      {formatDate(formData.joinDate)}
                    </span>
                  </p>
                  <p className="text-gray-900 font-bold text-sm">
                    Expire :{" "}
                    <span className="font-extrabold">
                      {formatDate(formData.expireDate)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <p className="text-xs text-yellow-700">
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
