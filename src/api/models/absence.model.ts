import mongoose, { Document, Schema, Model } from "mongoose";
import { paginate, toJSON } from "./plugins";

declare global {
  namespace Express {
    interface User extends IAbsenceEntry {}

    interface Request {
      user?: User;
    }
  }
}

export interface IAbsenceEntry extends Document {
  user: mongoose.Schema.Types.ObjectId; // Reference to the User
  date: Date; // The date of absence
  reason: string; // Reason for absence
}
export interface IAbsenceModel extends Model<IAbsenceEntry> {
  paginate(filter: any, options: any): unknown;
}

const absenceEntrySchema = new Schema<IAbsenceEntry, IAbsenceModel>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
});

// Apply plugins
absenceEntrySchema.plugin(toJSON);
absenceEntrySchema.plugin(paginate);

const AbsenceEntry: IAbsenceModel = mongoose.model<
  IAbsenceEntry,
  IAbsenceModel
>("AbsenceEntry", absenceEntrySchema);

export default AbsenceEntry;
