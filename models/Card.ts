import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICard extends Document {
  nama: string;
  pekerjaan: string;
  idCard: string;
  email: string;
  phone: string;
  joinDate: Date;
  expireDate: Date;
  fotoUrl: string;
  fotoPublicId: string;
  qrCodeUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema<ICard>(
  {
    nama: {
      type: String,
      required: [true, "Nama wajib diisi"],
      trim: true,
    },
    pekerjaan: {
      type: String,
      required: [true, "Pekerjaan wajib diisi"],
      trim: true,
    },
    idCard: {
      type: String,
      required: [true, "ID Card wajib diisi"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    joinDate: {
      type: Date,
      required: [true, "Tanggal bergabung wajib diisi"],
    },
    expireDate: {
      type: Date,
      required: [true, "Tanggal kadaluarsa wajib diisi"],
    },
    fotoUrl: {
      type: String,
      required: [true, "Foto wajib diupload"],
    },
    fotoPublicId: {
      type: String,
      required: [true, "Public ID foto wajib ada"],
    },
    qrCodeUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hindari re-compile model
const Card: Model<ICard> = mongoose.models.Card || mongoose.model<ICard>("Card", CardSchema);

export default Card;