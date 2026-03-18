-- SQL Schema Cập nhật cho Góc Học Vui

-- 1. Thêm cột 'code' vào bảng sessions nếu chưa có
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS code TEXT;

-- 2. Đánh chỉ mục cho cột 'code' để tìm kiếm nhanh hơn
CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(code);

-- 3. Thiết lập chính sách bảo mật (RLS) để cho phép đọc/ghi dữ liệu
-- Cho phép mọi người (bao gồm học sinh) đọc dữ liệu buổi học
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cho phép đọc buổi học công khai" ON sessions;
CREATE POLICY "Cho phép đọc buổi học công khai" ON sessions FOR SELECT USING (true);

-- Cho phép mọi người tạo/cập nhật buổi học (Tạm thời cho MVP)
DROP POLICY IF EXISTS "Cho phép tạo/cập nhật buổi học" ON sessions;
CREATE POLICY "Cho phép tạo/cập nhật buổi học" ON sessions FOR ALL USING (true) WITH CHECK (true);

-- Bảng yêu cầu trợ giúp
ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Cho phép gửi trợ giúp" ON help_requests;
CREATE POLICY "Cho phép gửi trợ giúp" ON help_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Cho phép GV xem trợ giúp" ON help_requests;
CREATE POLICY "Cho phép GV xem trợ giúp" ON help_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cho phép cập nhật trợ giúp" ON help_requests;
CREATE POLICY "Cho phép cập nhật trợ giúp" ON help_requests FOR UPDATE USING (true);

-- LƯU Ý: Hãy đảm bảo bạn đã bật "Realtime" cho bảng 'sessions' và 'help_requests' 
-- trong mục Database -> Replication trên Supabase Dashboard.
