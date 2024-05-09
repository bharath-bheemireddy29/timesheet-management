import mongoose, { Schema, Document, Model } from "mongoose";
import { toJSON } from "./plugins"; // Assumed path, adjust according to your project structure
import { tokenTypes } from "../../config/tokens";

// Define an interface representing a document in MongoDB.
export interface IToken extends Document {
  token: string;
  user: mongoose.Types.ObjectId;
  type: string;
  expires: Date;
  blacklisted: boolean;
}

// TokenSchema definition
const tokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL,
      ],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add toJSON plugin that cleans up returned JSON
tokenSchema.plugin(toJSON);

// Create a model from the schema
const Token: Model<IToken> = mongoose.model<IToken>("Token", tokenSchema);

export default Token;
