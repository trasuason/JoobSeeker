# Joobseeker Backend - Reset Password Email

## 🚀 Hướng dẫn cài đặt

### 1. Cài đặt Node.js

- Download từ: https://nodejs.org/ (LTS version)
- Cài đặt (next, next, finish)
- Kiểm tra: Mở PowerShell, gõ `node --version`

### 2. Cài đặt dependencies

```
cd d:\Hệ_Thống_Tìm_Kiếm_Việc_Làmm
npm install
```

### 3. Tạo file `.env`

Tạo file `.env` trong cùng thư mục với `server.js`:

```
EMAIL_USER=nguyenhoangson10092006@gmail.com
EMAIL_PASS=kqop jzuy kqoq ytth
PORT=3000
```

**Lưu ý:**

- `EMAIL_PASS` là App Password từ Gmail (16 ký tự)
- Không có space xung quanh dấu `=`

### 4. Chạy server

```
node server.js
```

Bạn sẽ thấy:

```
🚀 Server running on http://localhost:3000
✅ Ready to send emails
```

### 5. Test server

- Mở browser: http://localhost:3000/api/health
- Sẽ thấy: `{"status":"Server is running"}`

### 6. Test gửi email

Mở PowerShell và gõ:

```powershell
$body = @{email="nguyenhoangson10092006@gmail.com"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/forgot-password" -Method POST -ContentType "application/json" -Body $body
```

Hoặc dùng Postman/curl để test.

## 📧 Cách hoạt động

1. User nhập email trên trang `quenmatkhaur.html`
2. Frontend gửi request tới `http://localhost:3000/api/forgot-password`
3. Server kiểm tra email trong localStorage (hoặc database)
4. Nếu email tồn tại: **Gửi email thực tế** với mật khẩu
5. Nếu email không tồn tại: Trả về lỗi

## 🔌 MySQL setup

1. Tạo database & table: chạy file `db/init.sql` bằng MySQL client (mysql CLI hoặc Workbench):

```sql
-- trong mysql shell
SOURCE db/init.sql;
```

2. Hoặc chạy các lệnh SQL trong `db/init.sql` để tạo database `joobseeker` và bảng `users`.

3. Cập nhật file `.env` với thông tin kết nối MySQL:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=YOUR_MYSQL_PASSWORD
DB_NAME=joobseeker
DB_PORT=3306
```

4. Khởi động server và thử gửi yêu cầu reset từ frontend

## 🔒 Bảo mật

- **KHÔNG** commit file `.env` lên Git
- **KHÔNG** chia sẻ App Password
- Thêm `.env` vào `.gitignore`:

```
.env
node_modules/
```

## 🌐 Deploy lên production

### Heroku (Free)

1. Tạo tài khoản: https://heroku.com
2. Cài Heroku CLI
3. Run: `heroku login`, `heroku create`, `git push heroku main`
4. Set environment variables:
   ```
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   ```

### Vercel

1. Push code lên GitHub
2. Import trên https://vercel.com
3. Set environment variables tương tự

## ⚠️ Troubleshoot

**Lỗi: "Error: connect ECONNREFUSED"**

- Server chưa chạy. Chạy `node server.js` trước

**Lỗi: "Invalid login"**

- App Password không đúng
- Gmail 2FA chưa bật
- Kiểm tra lại `.env`

**Lỗi: "Less secure app access"**

- Gmail chặn. Bật 2FA và dùng App Password

---

**Liên hệ hỗ trợ:** Nếu có vấn đề, hãy kiểm tra console log của server.
