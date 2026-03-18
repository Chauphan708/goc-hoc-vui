"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/useSessionStore";
import { motion } from "framer-motion";

export default function StudentJoinPage() {
    const router = useRouter();
    const { session } = useSessionStore();
    const [isClient, setIsClient] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState("");

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return <div className="p-8 text-center">Đang tải...</div>;

    const handleJoin = () => {
        if (!selectedGroupId || !session) return;
        
        // Tìm nhóm có mã PIN khớp
        const group = session.groups.find(g => g.pin === selectedGroupId);
        
        if (!group) {
            alert("Mã PIN không đúng rồi! Bạn kiểm tra lại với thầy cô nhé.");
            return;
        }

        // Lưu tạm id nhóm vào localStorage
        localStorage.setItem("groupId", group.id);

        if (session.status === 'active') {
            if (session.type === "game") {
                router.push("/student/game");
            } else {
                router.push("/student/station");
            }
        } else {
            alert("Buổi học chưa bắt đầu! Hãy đợi thầy cô bấm nút 'Bắt đầu' nhé.");
        }
    };

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
                <p style={{ color: "var(--c-text-light)", marginBottom: "32px", fontSize: "1.1rem" }}>
                    Tìm tên nhóm của mình và bắt đầu khám phá nhé!
                </p>

                {(!session || session.status === "draft") ? (
                    <div style={{ padding: "20px", background: "#FFEFEF", borderRadius: "12px", color: "var(--c-accent)", fontWeight: "bold" }}>
                        Hiện chưa có buổi học nào bắt đầu! Thầy cô đang chuẩn bị, các bạn đợi một chút nhé... 💤
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 text-center">
                        <div className="flex flex-col gap-2">
                            <label style={{ fontWeight: "bold", fontSize: "1.1rem", color: "var(--c-text)" }}>Nhập mã PIN của nhóm</label>
                            <input
                                type="text"
                                maxLength={4}
                                placeholder="----"
                                value={selectedGroupId} // Reusing variable for pin logic
                                onChange={(e) => setSelectedGroupId(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "20px",
                                    textAlign: "center",
                                    fontSize: "2.5rem",
                                    letterSpacing: "8px",
                                    borderRadius: "16px",
                                    border: "3px solid var(--c-secondary)",
                                    fontWeight: "900",
                                    color: "var(--c-secondary)"
                                }}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <div style={{ flex: 1, height: "1px", background: "var(--c-border)" }}></div>
                            <span style={{ color: "var(--c-text-light)", fontSize: "0.9rem" }}>HOẶC</span>
                            <div style={{ flex: 1, height: "1px", background: "var(--c-border)" }}></div>
                        </div>

                        <button
                            className="btn btn-outline"
                            style={{ width: "100%", padding: "16px", fontSize: "1.1rem" }}
                            onClick={() => alert("Tính năng quét QR đang được kích hoạt...")}
                        >
                            📷 Quét mã QR trạm
                        </button>

                        <button
                            className="btn btn-secondary mt-4"
                            style={{ width: "100%", padding: "20px", fontSize: "1.5rem" }}
                            onClick={handleJoin}
                            disabled={selectedGroupId.length < 4}
                        >
                            Vào Lớp Ngay! 🚀
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
