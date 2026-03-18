"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/useSessionStore";
import { QRScanner } from "@/components/shared/QRScanner";
import { Mascot } from "@/components/shared/Mascot";
import { motion } from "framer-motion";

export default function StudentGamePage() {
    const router = useRouter();
    const { session } = useSessionStore();

    const [isClient, setIsClient] = useState(false);
    const [groupId, setGroupId] = useState("");
    const [showScanner, setShowScanner] = useState(false);

    // Mascot & Message states
    const [mascotMessage, setMascotMessage] = useState("Chào mừng đội đã đến với Trò chơi lớn! Hãy quét QR để nhận nhiệm vụ đầu tiên! 🗺️");
    const [mascotMood, setMascotMood] = useState<"happy" | "thinking" | "celebrate">("happy");

    useEffect(() => {
        setIsClient(true);
        const id = localStorage.getItem("groupId");
        if (!id) router.push("/student/join");
        else setGroupId(id);
    }, [router]);

    if (!isClient || !session || !groupId) return <div className="p-8 text-center">Đang tải bản đồ trò chơi...</div>;

    const currentGroup = session.groups.find(g => g.id === groupId);

    if (!currentGroup) {
        return (
            <div className="hero" style={{ background: "linear-gradient(135deg, #FFF5E6 0%, #E6FAF8 100%)" }}>
                <h2 style={{ color: "var(--c-primary)" }}>Chưa tìm thấy Đội của bạn! 🎈</h2>
                <button className="btn btn-outline mt-8" onClick={() => router.push("/student/join")}>Quay lại chọn Đội</button>
            </div>
        );
    }

    const handleQRCodeScanned = (decodedText: string) => {
        console.log("Mã QR quét được:", decodedText);
        // Tích hợp logic tìm trạm (station) qua ID QR quét được ở phase tiếp theo
        setShowScanner(false);
        setMascotMessage("Oa! Đã quét thành công! Cô giáo đang giao nhiệm vụ cho đội mình kìa!");
        setMascotMood("celebrate");

        // Mô phỏng chuyển qua màn hình Nhiệm vụ (sau 3 giây)
        setTimeout(() => {
            alert("Ví dụ: Chuyển sang màn hình Nhiệm vụ Trạm " + decodedText);
        }, 3000);
    };

    return (
        <div className="container" style={{ padding: "2rem 1rem", maxWidth: "800px", textAlign: "center" }}>

            {/* Header Info */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <span style={{ background: "var(--c-primary)", color: "white", padding: "8px 16px", borderRadius: "24px", fontSize: "1rem", fontWeight: "bold" }}>
                        Đội: {currentGroup.name} 🚩
                    </span>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{ borderTop: "8px solid var(--c-secondary)", marginBottom: "2rem" }}
            >
                <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🗺️</div>
                <h1 style={{ color: "var(--c-secondary)", fontSize: "2rem", marginBottom: "16px" }}>Amazing Race - Gốc Học Vui</h1>
                <p style={{ fontSize: "1.1rem", color: "var(--c-text-light)", marginBottom: "32px", lineHeight: 1.6 }}>
                    Các chiến binh hãy cầm chắc thiết bị trên tay! Di chuyển đến vị trí Trạm theo bản đồ và Dùng Camera để quét thẻ QR lấy Mật thư!
                </p>

                {showScanner ? (
                    <div style={{ background: "#F8FAFC", padding: "16px", borderRadius: "16px" }}>
                        <h3 className="mb-4" style={{ color: "var(--c-primary)" }}>Hướng Camera vào mã QR</h3>
                        <QRScanner
                            onResult={handleQRCodeScanned}
                            onError={(err) => console.log(err)}
                        />
                        <button className="btn btn-outline mt-4" onClick={() => setShowScanner(false)}>
                            Đóng Camera ❌
                        </button>
                    </div>
                ) : (
                    <button
                        className="btn btn-primary"
                        style={{ fontSize: "1.5rem", padding: "20px 40px", boxShadow: "0 6px 0 var(--c-primary)" }}
                        onClick={() => setShowScanner(true)}
                    >
                        📷 QUÉT MẬT THƯ (QR C0DE)
                    </button>
                )}
            </motion.div>

            <Mascot
                message={mascotMessage}
                mood={mascotMood}
                playAudio={true}
                onMessageComplete={() => {
                    setMascotMessage("");
                    setMascotMood("happy");
                }}
            />
        </div>
    );
}
