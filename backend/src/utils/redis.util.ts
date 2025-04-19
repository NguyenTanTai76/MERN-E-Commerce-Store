import { redis } from '../config/redis'; // Import Redis client đã cấu hình sẵn

/**
 * Lưu refresh token vào Redis với key là `refresh_token:{userId}`.
 * Token sẽ tự động hết hạn sau 7 ngày (tính bằng giây).
 * @param userId - ID của người dùng
 * @param refreshToken - Token cần lưu
 */
export const storeRefreshToken = async (
  userId: string,
  refreshToken: string
) => {
  await redis.set(
    `refresh_token:${userId}`, // Key Redis định danh riêng cho từng user
    refreshToken, // Giá trị là refresh token
    'EX', // EX: thiết lập thời gian hết hạn (expire)
    7 * 24 * 60 * 60 // 7 ngày tính bằng giây (604800 giây)
  );
};

/**
 * Lấy refresh token từ Redis dựa vào userId.
 * @param userId - ID của người dùng
 * @returns refreshToken hoặc null nếu không có
 */
export const getStoredRefreshToken = async (userId: string) => {
  return await redis.get(`refresh_token:${userId}`);
};

/**
 * Xóa refresh token trong Redis dựa trên userId (thường dùng khi logout).
 * @param userId - ID của người dùng
 */
export const deleteRefreshToken = async (userId: string) => {
  await redis.del(`refresh_token:${userId}`);
};
