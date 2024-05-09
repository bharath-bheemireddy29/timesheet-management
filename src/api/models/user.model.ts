import mongoose, { Schema, Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { toJSON, paginate } from './plugins';
import { roles } from '../../config/roles';

declare global {
  namespace Express {
    interface User extends IUser {}

    interface Request {
      user?: User;
    }
  }
}

export interface QueryResult<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface IUser extends Document {
  remove(): unknown;
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
  employeeID: string;  // Assuming employee ID is a string to include possible alphanumeric IDs
  projects: string[];  // Array of project IDs/names
  technicalRole: string;
  designation: string;
  supportingAccount: string;
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
  paginate(filter: any, options: any): unknown;
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
}

const userSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(email: string) {
          return validator.isEmail(email);
        },
        message: 'Invalid email',
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate: {
        validator: (value: string) => /\d/.test(value) && /[a-zA-Z]/.test(value),
        message: 'Password must contain at least one letter and one number',
      },
      private: true,  // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    employeeID: {
      type: String,
      required: true,
    },
    projects: [{
      type: String,
      required: true,
    }],
    technicalRole: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    supportingAccount: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Apply plugins
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (
  this: IUserModel,
  email: string,
  excludeUserId?: string
): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (
  this: IUser,
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);
export default User;
