import mongoose, { Document, Schema } from 'mongoose';

// Interface cho CartItem
export interface ICartItem {
  quantity: number;
  product: mongoose.Types.ObjectId; // Link đến Product model
}

// Interface cho User
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  cartItems: ICartItem[]; // Danh sách các sản phẩm trong giỏ hàng
  role: 'customer' | 'admin'; // Phân quyền người dùng
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // Liên kết tới Product model
        },
      },
    ],
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Tạo model User từ Schema
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
