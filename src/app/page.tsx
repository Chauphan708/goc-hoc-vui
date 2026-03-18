"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="hero">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mascot-container mascot-bounce mb-8">
            <span style={{ fontSize: "6rem" }}>🎪</span>
          </div>

          <h1 className="mb-4" style={{ color: "var(--c-primary)" }}>
            Góc Học Vui
          </h1>

          <h3 className="mb-8" style={{ color: "var(--c-text-light)", fontWeight: 500, maxWidth: "600px", margin: "0 auto" }}>
            Trợ lý đắc lực giúp thầy cô thiết kế Dạy Học Theo Góc và Trò Chơi Lớn cực kỳ &quot;nhàn&quot; và siêu vui! 🚀
          </h3>

          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <Link href="/teacher/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
                style={{ fontSize: "1.2rem", padding: "16px 32px" }}
              >
                👩‍🏫 Dành cho Giáo Viên
              </motion.button>
            </Link>

            <Link href="/student/join">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary"
                style={{ fontSize: "1.2rem", padding: "16px 32px" }}
              >
                🎒 Phía Học Sinh
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 flex gap-8 justify-center flex-wrap"
          style={{ marginTop: "4rem" }}
        >
          <div className="card text-center" style={{ width: "300px" }}>
            <span style={{ fontSize: "3rem" }}>🧩</span>
            <h3 className="mt-4 mb-2">Học theo Góc</h3>
            <p style={{ color: "var(--c-text-light)" }}>2-10 góc nhộn nhịp, luân chuyển cực mượt, tự động đếm giờ, quản lý liên nhóm siêu xịn.</p>
          </div>
          <div className="card text-center" style={{ width: "300px" }}>
            <span style={{ fontSize: "3rem" }}>🌲</span>
            <h3 className="mt-4 mb-2">Trò chơi Lớn</h3>
            <p style={{ color: "var(--c-text-light)" }}>Quét QR check-in trạm, nhận điểm kịch tính với bản đồ real-time theo đội.</p>
          </div>
          <div className="card text-center" style={{ width: "300px" }}>
            <span style={{ fontSize: "3rem" }}>🤖</span>
            <h3 className="mt-4 mb-2">Trợ lý AI</h3>
            <p style={{ color: "var(--c-text-light)" }}>Gemini AI luôn túc trực gợi ý giúp học sinh, giải phóng giáo viên 100%.</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
