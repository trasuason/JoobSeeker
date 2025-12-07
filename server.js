const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cấu hình email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "nguyenhoangson10092006@gmail.com",
    pass: process.env.EMAIL_PASS || "kqop jzuy kqoq ytth",
  },
});

// MySQL kết nối
const mysql = require("mysql2/promise");
const dbPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "joobseeker",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Endpoint: Reset password (lookup user in MySQL and send email)
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email là bắt buộc" });
    }

    // Query user from MySQL
    const [rows] = await dbPool.execute(
      "SELECT id, fullname, email, password, is_admin FROM users WHERE email = ?",
      [email]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Email này chưa được đăng ký" });
    }

    const foundUser = rows[0];

    // Nội dung email
    const mailOptions = {
      from: process.env.EMAIL_USER || "nguyenhoangson10092006@gmail.com",
      to: email,
      subject: "Đặt lại mật khẩu Joobseeker",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #ff6b35; text-align: center;">Yêu cầu đặt lại mật khẩu</h2>
          <p>Xin chào ${foundUser.fullname || ""},</p>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu của bạn. Dưới đây là thông tin tài khoản:</p>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${foundUser.email}</p>
            <p><strong>Mật khẩu:</strong> <span style="color: #ff6b35; font-weight: bold; font-size: 16px;">${
              foundUser.password
            }</span></p>
          </div>
          <p style="color: #666;">Vui lòng ghi nhớ mật khẩu này và đăng nhập lại trên ứng dụng của chúng tôi.</p>
          <p style="color: #ff6b35; font-weight: bold;">⚠️ Lưu ý:</p>
          <ul>
            <li>Đừng chia sẻ mật khẩu này với bất kỳ ai</li>
            <li>Nếu bạn không yêu cầu email này, vui lòng bỏ qua</li>
          </ul>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
          <p style="text-align: center; color: #94a3b8; font-size: 12px;">© 2025 Joobseeker. Tất cả quyền được bảo lưu.</p>
        </div>
      `,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Email reset password đã được gửi thành công",
      email: email,
    });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    res.status(500).json({
      error: "Lỗi hệ thống. Vui lòng thử lại sau.",
      details: error.message,
    });
  }
});

// Endpoint: Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// DEBUG: list users (development only).
// Use this to verify DB connection and that test users exist.
app.get("/api/debug-users", async (req, res) => {
  try {
    const [rows] = await dbPool.execute(
      "SELECT id, fullname, email, is_admin, created_at FROM users ORDER BY id"
    );
    res.json({ success: true, count: rows.length, users: rows });
  } catch (err) {
    console.error("Debug users error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("✅ Ready to send emails");
});
