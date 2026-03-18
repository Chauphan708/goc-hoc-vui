"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/useSessionStore";
import { motion } from "framer-motion";

export default function StudentJoinPage() {
    const router = useRouter();
    const { session, findSessionByCode } = useSessionStore();
    const [isClient, setIsClient] = useState(false);
    const [sessionCode, setSessionCode] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleFindSession = async () => {
        if (!sessionCode) return;
        setLoading(true);
        const success = await findSessionByCode(sessionCode);
        setLoading(false);
        if (!success) {
            alert("Không tìm thấy buổi học nào với mã này! Bạn kiểm tra lại nhé.");
        }
    };

    const handleJoin = () => {
        if (!pinCode || !session) return;
        
        // Tìm nhóm có mã PIN khớp
        const group = session.groups.find(g => g.pin === pinCode);
        
        if (!group) {
            alert("Mã PIN không đúng rồi! Bạn kiểm tra lại với thầy cô nhé.");
            return;
        }

        // Lưu tạm id nhóm vào localStorage
        localStorage.setItem("groupId", group.id);

        if (session.status === 'active' || session.status === 'draft') {
            // Cho phép vào xem trước ngay cả khi Draft (nếu GV đã tạo nhóm)
            if (session.type === "game") {
                router.push("/student/game");
            } else {
                router.push("/student/station");
            }
        } else {
            alert("Buổi học này đã kết thúc rồi!");
        }
    };

    if (!isClient) return <div className="p-8 text-center">Đang tải...</div>;

    return (
        <div className="hero" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #E6FAF8 0%, #FFF5E6 100%)" }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card text-center"
                style={{ maxWidth: "500px", width: "100%", padding: "40px" }}
            >
                <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🎒</div>
                <h1 style={{ color: "var(--c-secondary)", marginBottom: "8px" }}>Chào mừng các bạn!</h1>
                
                {!session ? (
                    <div className="flex flex-col gap-6">
                        <p style={{ color: "var(--c-text-light)", fontSize: "1.1rem" }}>
                            Nhập <b>Mã buổi học</b> từ thầy cô giáo để bắt đầu:
                        </p>
                        <input
                            type="text"
                            maxLength={6}
                            placeholder="ABCXYZ"
                            value={sessionCode}
                            onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                            style={{
                                width: "100%", padding: "20px", textAlign: "center", fontSize: "2rem",
                                borderRadius: "16px", border: "3px solid var(--c-primary)", fontWeight: "900", color: "var(--c-primary)"
                            }}
                        />
                        <button
                            className="btn btn-primary"
                            style={{ width: "100%", padding: "20px", fontSize: "1.5rem" }}
                            onClick={handleFindSession}
                            disabled={sessionCode.length < 6 || loading}
                        >
                            {loading ? "Đang tìm..." : "Tiếp tục ➔"}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <p style={{ color: "var(--c-text-light)", fontSize: "1.1rem" }}>
                            Đã kết nối: <b>{session.title}</b>
                        </p>
                        
                        <div className="flex flex-col gap-2">
                            <label style={{ fontWeight: "bold", fontSize: "1.1rem", color: "var(--c-text)" }}>Nhập mã PIN của nhóm</label>
                            <input
                                type="text"
                                maxLength={4}
                                placeholder="----"
                                value={pinCode}
                                onChange={(e) => setPinCode(e.target.value)}
                                style={{
                                    width: "100%", padding: "20px", textAlign: "center", fontSize: "2.5rem", letterSpacing: "8px",
                                    borderRadius: "16px", border: "3px solid var(--c-secondary)", fontWeight: "900", color: "var(--c-secondary)"
                                }}
                            />
                        </div>

                        <button
                            className="btn btn-secondary"
                            style={{ width: "100%", padding: "20px", fontSize: "1.5rem" }}
                            onClick={handleJoin}
                            disabled={pinCode.length < 4}
                        >
                            Vào Lớp Ngay! 🚀
                        </button>
                        
                        <button 
                            style={{ fontSize: "0.9rem", color: "var(--c-text-light)", background: "none", border: "none", cursor: "pointer" }}
                            onClick={() => useSessionStore.setState({ session: null })}
                        >
                            Đổi mã buổi học
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
