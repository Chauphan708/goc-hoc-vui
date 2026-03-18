import { Station } from '@/types';

export interface Template {
    id: string;
    title: string;
    subject: string;
    type: 'station' | 'game';
    description: string;
    stations: Partial<Station>[];
}

export const TEMPLATES: Template[] = [
    {
        id: 'tpl-lich-su-dia-li',
        title: 'Hành Trình Xuyên Việt',
        subject: 'Lịch sử & Địa lí',
        type: 'station',
        description: 'Buổi học 6 góc khám phá các vùng miền, lịch sử và văn hóa đất nước.',
        stations: [
            { name: '1. Bản Đồ Kì Diệu', durationMinutes: 10, instructions: 'Quan sát bản đồ, xác định các vùng kinh tế trọng điểm và điền tên các tỉnh thành vào chỗ trống.', bonusTasks: [{ id: 'b1', text: 'Tìm dãy núi dài nhất Việt Nam', isCompleted: false }] },
            { name: '2. Nhà Sử Học Nhí', durationMinutes: 10, instructions: 'Sắp xếp các thẻ sự kiện lịch sử theo đúng dòng thời gian từ quá khứ đến hiện tại.', hints: ['Hãy chú ý đến các năm ghi trên thẻ!'] },
            { name: '3. Khám Phá Địa Hình', durationMinutes: 10, instructions: 'Dùng đất nặn mô phỏng lại địa hình đồi núi, đồng bằng và bờ biển của nước ta.' },
            { name: '4. Văn Hóa Vùng Miền', durationMinutes: 10, instructions: 'Nối các món ăn, trang phục truyền thống với đúng vùng miền tương ứng.' },
            { name: '5. Dấu Chân Anh Hùng', durationMinutes: 10, instructions: 'Đọc mẩu chuyện ngắn về một vị anh hùng dân tộc và trả lời 3 câu hỏi trắc nghiệm.' },
            { name: '6. Báo Cáo Thám Hiểm', durationMinutes: 10, instructions: 'Vẽ một bức tranh hoặc viết một đoạn văn ngắn về nơi em muốn đến nhất.' }
        ]
    },
    {
        id: 'tpl-cong-nghe',
        title: 'Kỹ Sư Lắp Ráp Tương Lai',
        subject: 'Công nghệ',
        type: 'station',
        description: 'Buổi học 5 góc hướng dẫn học sinh quy trình thiết kế và lắp ráp mô hình đơn giản.',
        stations: [
            { name: '1. Khám Phá Vật Liệu', durationMinutes: 10, instructions: 'Nhận biết và phân loại các vật liệu: bìa carton, nhựa, gỗ, kim loại...' },
            { name: '2. Phác Thảo Ý Tưởng', durationMinutes: 15, instructions: 'Vẽ bản thiết kế mô hình chiếc xe ô tô mơ ước của em ra giấy.' },
            { name: '3. Chế Tạo Chi Tiết', durationMinutes: 15, instructions: 'Cắt và chuẩn bị các bộ phận (bánh xe, trục, thân xe) theo đúng kích thước.' },
            { name: '4. Lắp Ráp Khung', durationMinutes: 10, instructions: 'Lắp ghép các bộ phận lại với nhau bằng keo và băng dính.' },
            { name: '5. Chạy Thử & Sửa Lỗi', durationMinutes: 10, instructions: 'Cho xe chạy thử trên dốc, ghi nhận lại quãng đường và sửa các bánh xe nếu bị kẹt.' }
        ]
    },
    {
        id: 'tpl-dao-duc',
        title: 'Hạt Giống Yêu Thương',
        subject: 'Đạo đức',
        type: 'station',
        description: 'Buổi học 3 góc giúp học sinh rèn luyện kỹ năng xử lý tình huống và thể hiện sự tôn trọng.',
        stations: [
            { name: '1. Xử Lý Tình Huống', durationMinutes: 10, instructions: 'Đọc tình huống bạn Tí làm rơi hộp bút của bạn Sửu. Em hãy chọn cách giải quyết đúng nhất.' },
            { name: '2. Sân Khấu Rung Chuông', durationMinutes: 15, instructions: 'Cùng nhóm đóng vai diễn lại một tình huống thể hiện lòng biết ơn với thầy cô giáo.' },
            { name: '3. Cây Yêu Thương', durationMinutes: 10, instructions: 'Viết một lời chúc hoặc lời xin lỗi chân thành lên chiếc lá giấy và dán lên Cây Yêu Thương của lớp.' }
        ]
    },
    {
        id: 'tpl-toan',
        title: 'Công Trường Toán Học',
        subject: 'Toán',
        type: 'station',
        description: 'Dự án 6 góc: Học sinh đóng vai nhà thầu xây dựng khu phố.',
        stations: [
            { name: '1. Tính Toán Ngân Sách', durationMinutes: 10, instructions: 'Cho 500,000 xu. Hãy tính tổng chi phí mua gạch, xi măng và cát. Cập nhật số xu còn lại.' },
            { name: '2. Phân Lô Đất', durationMinutes: 10, instructions: 'Tính diện tích và chu vi các lô đất hình chữ nhật trên bản vẽ.', bonusTasks: [{ id: 'b2', text: 'Tính diện tích đường đi chung', isCompleted: false }] },
            { name: '3. Đo Đạc Chiều Cao', durationMinutes: 10, instructions: 'Sử dụng thước dây để đo đạc các mô hình nhà và quy đổi đơn vị (cm -> m).' },
            { name: '4. Mua Vật Liệu', durationMinutes: 10, instructions: 'Giải các bài toán đố về tỉ lệ để tính đúng số lượng vật liệu cần thiết.' },
            { name: '5. Thống Kê Dữ Liệu', durationMinutes: 10, instructions: 'Lập bảng thống kê số lượng các loại nhà (nhà trệt, nhà cao tầng) trong dự án.' },
            { name: '6. Nghiệm Thu Công Trình', durationMinutes: 10, instructions: 'Kiểm tra chéo kết quả tính toán của nhóm khác và điền vào bảng nghiệm thu.' }
        ]
    },
    {
        id: 'tpl-khoa-hoc',
        title: 'Phi Hành Gia Nhí',
        subject: 'Khoa học',
        type: 'station',
        description: 'Khám phá vũ trụ và các hiện tượng vật lý thú vị qua 5 trạm thực hành.',
        stations: [
            { name: '1. Giải Mã Hành Tinh', durationMinutes: 10, instructions: 'Sắp xếp thứ tự các hành tinh trong Hệ Mặt Trời và ghép thẻ đặc điểm tương ứng.' },
            { name: '2. Tên Lửa Bong Bóng', durationMinutes: 15, instructions: 'Khám phá phản lực: Thổi bong bóng, gắn vào ống hút trên sợi dây và đo xem quả nào bay xa nhất.' },
            { name: '3. Truyền Tín Hiệu Ánh Sáng', durationMinutes: 10, instructions: 'Dùng gương để phản chiếu ánh sáng pin chiếu trúng đích (mô phỏng trạm thu phát).' },
            { name: '4. Lực Hút Trái Đất', durationMinutes: 10, instructions: 'Thả rơi các vật thể có khối lượng khác nhau và ghi lại quan sát của em.' },
            { name: '5. Trồng Cây Chân Không', durationMinutes: 10, instructions: 'Quan sát các mẫu thực vật và ghi chép dự đoán cây cần sống trong điều kiện thế nào để tồn tại trên sao Hỏa.' }
        ]
    },
    {
        id: 'tpl-tro-choi-lon',
        title: 'Truy Tìm Kho Báu Amazon',
        subject: 'Hoạt động Ngoài trời',
        type: 'game',
        description: 'Trò chơi lớn với 6 trạm ngoài trời, yêu cầu kĩ năng giải mật thư và làm việc nhóm.',
        stations: [
            { name: 'Trạm 1: Khởi Hành', durationMinutes: 15, instructions: 'Mật thư khởi động: Giải mã quy tắc Thay Thế (A=B) để tìm địa điểm Trạm 2.' },
            { name: 'Trạm 2: Vượt Suối Dữ', durationMinutes: 15, instructions: 'Thử thách thể lực: Cả đội phải vượt qua chướng ngại vật bằng cách bước trên các tấm thảm mà không chạm đất.' },
            { name: 'Trạm 3: Mắt Thần Rừng Nhai', durationMinutes: 15, instructions: 'Tìm 5 mảnh ghép được giấu xung quanh khu vực trạm và ghép thành bực tranh chiếc chìa khoá.' },
            { name: 'Trạm 4: Thử Thách Trí Tuệ', durationMinutes: 15, instructions: 'Đóng kịch câm: 1 bạn diễn tả từ khóa, các bạn khác đoán. Phải đoán đúng 3 từ mới được qua trạm.' },
            { name: 'Trạm 5: Giải Mã Toạ Độ', durationMinutes: 15, instructions: 'Sử dụng la bàn và số bước chân để tìm hướng đi đến Trạm Cuối theo lời căn dặn.' },
            { name: 'Trạm 6: Mở Kho Báu', durationMinutes: 15, instructions: 'Đọc kỹ lời nguyền của Vua Khỉ, nhập đúng dãy số thứ tự 4 bức tượng để mở khóa lấy phần thưởng!' }
        ]
    }
];
