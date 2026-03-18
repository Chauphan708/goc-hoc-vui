"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/useSessionStore";
import { motion, AnimatePresence } from "framer-motion";

export default function TeacherDashboard() {
    const router = useRouter();
    const { session, helpRequests, resolveHelp, subscribeToChanges } = useSessionStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (!session || session.status === "draft") {
            router.push("/teacher/create-session");
        } else {
            // Đăng ký nhận bản tin real-time
            subscribeToChanges(session.id);
        }
    }, [session?.id, router, subscribeToChanges]);

    if (!isClient || !session) return <div className="p-8 text-center">Đang tải...</div>;

    const unresolvedRequests = helpRequests.filter(r => !r.resolved);

    const startTimeString = session?.startTime ? new Date(session.startTime).toLocaleTimeString() : new Date().toLocaleTimeString();

    return (
        <div className="container" style={{ padding: "2rem 1rem" }}>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 style={{ fontSize: "2rem", color: "var(--c-primary)" }}>{session.title} 🎩</h1>
                    <p style={{ color: "var(--c-text-light)" }}>Khởi tạo lúc: {startTimeString}</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn btn-outline">
                        ⏰ Thêm 5 phút
                    </button>
                    {session.type === 'game' && (
                        <button className="btn" style={{ backgroundColor: "#F59E0B", color: "white" }} onClick={() => router.push("/teacher/qr-codes")}>
                            🖨️ In mã QR
                        </button>
                    )}
                    <button className="btn btn-accent" onClick={() => router.push("/teacher/report")}>
                        Kết thúc ngay 🛑
                    </button>
                </div>
            </div>

            <div className="flex gap-8 flex-wrap">
                {/* Main Grid: Các nhóm / Live Map */}
                <div style={{ flex: "2 1 600px" }}>
                    <h2 className="mb-4" style={{ fontSize: "1.5rem" }}>
                        {session.type === 'game' ? "🗺️ Bản Đồ Thời Gian Thực (Live Map)" : "Bảng Trạng Thái Liên Nhóm"}
                    </h2>
                    <div className="flex flex-col gap-4">
                        {session.groups.map(group => {
                            const currentStation = session.stations.find(s => s.id === group.currentStationId);
                            const progress = group.progress.find(p => p.stationId === group.currentStationId);
                            const isDebt = progress?.status === "debt";

                            return (
                                <motion.div
                                    key={group.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="card"
                                    style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div style={{ fontSize: "2rem" }}>
                                            {isDebt ? "📌" : "⏳"}
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: "1.2rem", color: "var(--c-text)" }}>{group.name}</h4>
                                            <p style={{ color: "var(--c-text-light)", fontSize: "0.9rem" }}>
                                                Điểm: {group.progress.reduce((sum, p) => sum + p.score + p.bonusScore, 0)} ⭐
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "right" }}>
                                        <div style={{
                                            display: "inline-block",
                                            padding: "4px 12px",
                                            borderRadius: "16px",
                                            backgroundColor: isDebt ? "#FFEFEF" : "#F0F9FF",
                                            color: isDebt ? "var(--c-accent)" : "var(--c-secondary)",
                                            fontWeight: "bold",
                                            fontSize: "0.9rem"
                                        }}>
                                            {isDebt ? "Đang nợ góc" : "Đang làm nhiệm vụ"}
                                        </div>
                                        <div style={{ fontWeight: "600", marginTop: "4px" }}>
                                            Tại: {currentStation?.name || "Khu vực chờ"}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar: SOS & Đồng hồ */}
                <div style={{ flex: "1 1 300px" }}>

                    <div className="card mb-4 text-center">
                        <h3 style={{ color: "var(--c-primary)", marginBottom: "8px" }}>Thời gian góc hiện tại</h3>
                        <div style={{ fontSize: "3rem", fontWeight: "900", fontFamily: "monospace", letterSpacing: "2px" }}>
                            08:45
                        </div>
                        <p style={{ color: "var(--c-text-light)" }}>Sắp chuyển trạm! 🔔</p>
                    </div>

                    <div className="card" style={{ borderColor: unresolvedRequests.length > 0 ? "var(--c-accent)" : "var(--c-border)" }}>
                        <h3 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                            Cứu trợ SOS 🆘
                            {unresolvedRequests.length > 0 && (
                                <span style={{ background: "var(--c-accent)", color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "0.9rem" }}>
                                    {unresolvedRequests.length}
                                </span>
                            )}
                        </h3>

                        <div className="flex flex-col gap-3">
                            <AnimatePresence>
                                {unresolvedRequests.length === 0 ? (
                                    <motion.p
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        style={{ color: "var(--c-text-light)", textAlign: "center", padding: "20px 0" }}
                                    >
                                        Mọi thứ đang rất ổn! ✅
                                    </motion.p>
                                ) : (
                                    unresolvedRequests.map(req => {
                                        const group = session.groups.find(g => g.id === req.groupId);
                                        const station = session.stations.find(s => s.id === req.stationId);

                                        return (
                                            <motion.div
                                                key={req.id}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                style={{ padding: "12px", background: "#FFF0F2", borderRadius: "8px", borderLeft: "4px solid var(--c-accent)" }}
                                            >
                                                <div style={{ fontWeight: "bold", color: "var(--c-text)", fontSize: "0.9rem" }}>{group?.name} - {station?.name}</div>
                                                <p style={{ margin: "4px 0", fontSize: "0.95rem" }}>&quot;{req.message}&quot;</p>
                                                <div style={{ textAlign: "right", marginTop: "8px" }}>
                                                    <button
                                                        className="btn btn-outline"
                                                        style={{ fontSize: "0.8rem", padding: "4px 12px" }}
                                                        onClick={() => resolveHelp(req.id)}
                                                    >
                                                        Đã hỗ trợ xong ✓
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
