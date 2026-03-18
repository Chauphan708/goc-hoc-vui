"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { motion } from "framer-motion";

export default function TeacherSettingsPage() {
    const router = useRouter();
    const { geminiApiKey, setGeminiApiKey } = useSettingsStore();
    const [isClient, setIsClient] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">("idle");

    useEffect(() => {
        setIsClient(true);
        setInputValue(geminiApiKey);
    }, [geminiApiKey]);

    if (!isClient) return <div className="p-8 text-center">Đang tải cấu hình...</div>;

    const handleSave = () => {
        setSaveStatus("saving");
        setGeminiApiKey(inputValue);

        setTimeout(() => {
            setSaveStatus("success");
            setTimeout(() => setSaveStatus("idle"), 3000);
        }, 500);
    };

    return (
        <div className="container" style={{ padding: "2rem 1rem", maxWidth: "800px" }}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 style={{ fontSize: "2rem", color: "var(--c-primary)" }}>⚙️ Cài Đặt Hệ Thống</h1>
                    <p style={{ color: "var(--c-text-light)" }}>Cấu hình các tiện ích nâng cao cho Góc Học Vui</p>
                </div>
                <button className="btn btn-outline" onClick={() => router.push("/teacher/create-session")}>
                    ⬅️ Quay về
                </button>
            </div>

            <motion.div
                className="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ borderTop: "6px solid var(--c-secondary)" }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div style={{ fontSize: "2rem" }}>🤖</div>
                    <h2 style={{ color: "var(--c-secondary)", fontSize: "1.5rem" }}>Cấu hình Trợ lý AI (Gemini)</h2>
                </div>

                <p style={{ color: "var(--c-text-light)", marginBottom: "24px", lineHeight: 1.6 }}>
                    Góc Học Vui sử dụng sức mạnh của <strong>Google Gemini AI</strong> để hoá thân thành Mèo Máy hỗ trợ giải đáp nhanh các thắc mắc của học sinh ngay tại Trạm, giúp giảm tải lượng câu hỏi cho giáo viên.
                    <br /><br />
                    Để kích hoạt, vui lòng cung cấp Gemini API Key (Hoàn toàn miễn phí tại <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: "var(--c-accent)", textDecoration: "underline" }}>Google AI Studio</a>).
                </p>

                <div className="mb-6">
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "var(--c-text)" }}>
                        Gemini API Key của bạn:
                    </label>
                    <input
                        type="password"
                        placeholder="Nhập API Key bắt đầu bằng AIza..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        style={{ width: "100%", padding: "12px 16px", borderRadius: "8px", border: "2px solid var(--c-border)", fontSize: "1rem", fontFamily: "monospace" }}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saveStatus === "saving"}
                    >
                        {saveStatus === "saving" ? "Đang lưu..." : "💾 Lưu Cấu Hình"}
                    </button>

                    {saveStatus === "success" && (
                        <span style={{ color: "var(--c-success)", fontWeight: "bold" }}>✅ Lưu thành công!</span>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
