"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/useSessionStore";
import { motion } from "framer-motion";

export default function TeacherReportPage() {
    const router = useRouter();
    const { session, helpRequests } = useSessionStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (!session || session.status === "draft") {
            router.push("/teacher/create-session");
        }
    }, [session, router]);

    if (!isClient || !session) return <div className="p-8 text-center">Đang tạo báo cáo...</div>;

    const totalHelpRequests = helpRequests.length;
    const groupsRanked = [...session.groups].sort((a, b) => {
        const scoreA = a.progress.reduce((sum, p) => sum + p.score + p.bonusScore, 0);
        const scoreB = b.progress.reduce((sum, p) => sum + p.score + p.bonusScore, 0);
        return scoreB - scoreA;
    });

    return (
        <div className="container" style={{ padding: "2rem 1rem", maxWidth: "900px" }}>
            <div className="text-center mb-8">
                <h1 style={{ fontSize: "2.5rem", color: "var(--c-primary)" }}>Báo Cáo Tổng Kết Buổi Học 📊</h1>
                <p style={{ color: "var(--c-text-light)", fontSize: "1.2rem", marginTop: "8px" }}>
                    Buổi học: {session.title}
                </p>
            </div>

            <div className="flex gap-4 mb-8 flex-wrap">
                <div className="card text-center" style={{ flex: "1 1 200px" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>👥</div>
                    <h3 style={{ color: "var(--c-text-light)", fontSize: "1rem" }}>Tổng Số Nhóm</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--c-secondary)" }}>{session.groups.length}</p>
                </div>
                <div className="card text-center" style={{ flex: "1 1 200px" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🚩</div>
                    <h3 style={{ color: "var(--c-text-light)", fontSize: "1rem" }}>Số Góc Tham Gia</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--c-accent)" }}>{session.stations.length}</p>
                </div>
                <div className="card text-center" style={{ flex: "1 1 200px" }}>
                    <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🆘</div>
                    <h3 style={{ color: "var(--c-text-light)", fontSize: "1rem" }}>Yêu Cầu Hỗ Trợ</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", color: "orange" }}>{totalHelpRequests} lần</p>
                </div>
            </div>

            <h2 className="mb-4" style={{ color: "var(--c-secondary)" }}>🏆 Bảng Xếp Hạng Các Nhóm</h2>
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead style={{ backgroundColor: "var(--c-secondary)", color: "white" }}>
                        <tr>
                            <th style={{ padding: "16px" }}>Hạng</th>
                            <th style={{ padding: "16px" }}>Tên Nhóm</th>
                            <th style={{ padding: "16px" }}>Tổng Điểm</th>
                            <th style={{ padding: "16px" }}>Trạng Thái Góc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupsRanked.map((group, index) => {
                            const totalScore = group.progress.reduce((sum, p) => sum + p.score + p.bonusScore, 0);
                            const completedStations = group.progress.filter(p => p.status === "completed").length;
                            const debtStations = group.progress.filter(p => p.status === "debt").length;

                            return (
                                <motion.tr
                                    key={group.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    style={{ borderBottom: "1px solid var(--c-border)", backgroundColor: index === 0 ? "#FFF5E6" : "transparent" }}
                                >
                                    <td style={{ padding: "16px", fontWeight: "bold", fontSize: "1.2rem", color: index === 0 ? "var(--c-primary)" : "var(--c-text)" }}>
                                        #{index + 1} {index === 0 && "👑"}
                                    </td>
                                    <td style={{ padding: "16px", fontWeight: "bold" }}>{group.name}</td>
                                    <td style={{ padding: "16px", color: "var(--c-primary)", fontWeight: "bold" }}>{totalScore} ⭐</td>
                                    <td style={{ padding: "16px" }}>
                                        <div className="flex gap-2">
                                            <span style={{ background: "#F0F9FF", color: "var(--c-secondary)", padding: "4px 8px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "bold" }}>
                                                ✅ {completedStations}/{session.stations.length} góc
                                            </span>
                                            {debtStations > 0 && (
                                                <span style={{ background: "#FFEFEF", color: "var(--c-accent)", padding: "4px 8px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "bold" }}>
                                                    📌 Nợ {debtStations} góc
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="text-center mt-8 pt-8">
                <button className="btn btn-outline" onClick={() => router.push("/teacher/dashboard")}>
                    ⬅️ Quay lại Dashboard
                </button>
            </div>

        </div>
    );
}
