"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/useSessionStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { motion, AnimatePresence } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { Mascot } from "@/components/shared/Mascot";

export default function StudentStationPage() {
    const router = useRouter();
    const { session } = useSessionStore();
    const { geminiApiKey } = useSettingsStore();

    const [isClient, setIsClient] = useState(false);
    const [groupId, setGroupId] = useState("");

    const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
    const [completedBonus, setCompletedBonus] = useState<Record<string, boolean>>({});

    const [sosSent, setSosSent] = useState(false);

    // Mascot & Hints States
    const [mascotMessage, setMascotMessage] = useState("Chào các bạn nhé! Cố lên! 🎉");
    const [mascotMood, setMascotMood] = useState<"happy" | "thinking" | "celebrate">("happy");
    const [currentHintIndex, setCurrentHintIndex] = useState(-1);

    // Quiz States
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [quizScore, setQuizScore] = useState(0);

    useEffect(() => {
        setIsClient(true);
        const id = localStorage.getItem("groupId");
        if (!id) router.push("/student/join");
        else setGroupId(id);
    }, [router]);

    if (!isClient || !session || !groupId) return <div className="p-8 text-center">Đang tải góc học tập...</div>;

    const currentGroup = session.groups.find(g => g.id === groupId);
    const currentStation = session.stations.find(s => s.id === currentGroup?.currentStationId);

    if (!currentGroup || !currentStation) {
        return (
            <div className="hero" style={{ background: "linear-gradient(135deg, #FFF5E6 0%, #E6FAF8 100%)" }}>
                <h2 style={{ color: "var(--c-primary)" }}>Bọn mình đang nghỉ giải lao nhé! 🎈</h2>
                <button className="btn btn-outline mt-8" onClick={() => router.push("/student/join")}>Đổi nhóm</button>
            </div>
        );
    }

    // Auto-complete check
    const allTasksDone = currentStation.tasks.length > 0 &&
        currentStation.tasks.every(t => checkedTasks[t.id]);

    const handleShowHint = async () => {
        if (geminiApiKey) {
            setMascotMood("thinking");
            setMascotMessage("Đợi tớ xíu nha...");
            try {
                // Dynamic import at usage-time to avoid SSR module loading issues sometimes with 'generateAIHint'
                const { generateAIHint } = await import("@/lib/ai");
                const aiHint = await generateAIHint(geminiApiKey, currentStation.name, currentStation.instructions);
                setMascotMessage(aiHint);
                setMascotMood("happy");
            } catch (err) {
                console.error(err);
                // Fallback to static hint
                handleStaticHint();
            }
        } else {
            handleStaticHint();
        }
    };

    const handleStaticHint = () => {
        if (!currentStation.hints || currentStation.hints.length === 0) {
            setMascotMessage("Góc này cô giáo chưa ghi gợi ý rùi~ Bạn gọi cô giúp nha!");
            setMascotMood("thinking");
            return;
        }
        const nextHint = currentHintIndex + 1 < currentStation.hints.length ? currentHintIndex + 1 : 0;
        setCurrentHintIndex(nextHint);
        setMascotMessage(`Gợi ý ${nextHint + 1}: ${currentStation.hints[nextHint]}`);
        setMascotMood("happy");
    };

    const handleSOS = async () => {
        const { sendHelpRequest } = useSessionStore.getState();
        await sendHelpRequest(groupId, currentStation.id, "Nhóm con bấm nút SOS!");
        setSosSent(true);
        setTimeout(() => setSosSent(false), 5000);
    };

    const handleToggleTask = async (taskId: string) => {
        const newChecked = { ...checkedTasks, [taskId]: !checkedTasks[taskId] };
        setCheckedTasks(newChecked);
        
        // Sync progress to store & supabase
        const { updateGroupProgress } = useSessionStore.getState();
        const completedCount = Object.values(newChecked).filter(v => v).length;
        const totalCount = currentStation.tasks.length;
        
        await updateGroupProgress(groupId, currentStation.id, {
            status: completedCount === totalCount ? 'completed' : 'in_progress',
            score: completedCount * 2 // Ví dụ: mỗi nhiệm vụ 2 điểm
        });
    };

    const handleFinishStation = () => {
        if (currentStation.quiz && currentStation.quiz.length > 0) {
            setShowQuizModal(true);
        } else {
            finalizeStation(0);
        }
    };

    const finalizeStation = (score: number) => {
        alert(`🎉 Chúc mừng ${currentGroup.name} đã hoàn thành ${currentStation.name}! Điểm cộng: ${score}đ.`);
        setShowQuizModal(false);
        // Code chuyển trạm ở đây (Phase tiếp theo)
    };

    const handleReadInstructions = () => {
        setMascotMessage(currentStation.instructions || "Cứ nhìn đồ dùng trên bàn mà làm nhé!");
        setMascotMood("happy");
    };

    const handleQuizSubmit = (selectedOptionIndex: number, correctIndex: number) => {
        if (selectedOptionIndex === correctIndex) {
            const newScore = quizScore + 10;
            setQuizScore(newScore);
            setMascotMessage("Đúng rồi! Cậu giỏi quá! 🌟");
            setMascotMood("celebrate");
        } else {
            setMascotMessage("Chưa chính xác rồi. Lần sau cố lên nhé! 💪");
            setMascotMood("thinking");
        }

        // Mô phỏng mini quiz chỉ có 1 câu cho MVP Phase 2
        setTimeout(() => {
            finalizeStation(selectedOptionIndex === correctIndex ? 10 : 0);
        }, 3000);
    };

    return (
        <div className="container" style={{ padding: "2rem 1rem", maxWidth: "800px" }}>

            {/* Header Info */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <span style={{ background: "var(--c-primary)", color: "white", padding: "4px 12px", borderRadius: "16px", fontSize: "0.9rem", fontWeight: "bold" }}>
                        {currentGroup.name}
                    </span>
                </div>
                <div>
                    <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--c-accent)" }}>⏳ Sắp hết giờ!</span>
                </div>
            </div>

            <div className="card" style={{ borderTop: "8px solid var(--c-secondary)", marginBottom: "2rem" }}>

                <div className="flex justify-between items-start mb-6">
                    <h1 style={{ color: "var(--c-secondary)", fontSize: "2rem" }}>Mục tiêu: {currentStation.name}</h1>
                    <div className="flex gap-2">
                        <button
                            className="btn btn-outline"
                            style={{ padding: "8px 16px", borderRadius: "24px" }}
                            onClick={handleReadInstructions}
                        >
                            🔊 Nghe lệnh
                        </button>
                        <button
                            className="btn btn-outline"
                            style={{ padding: "8px 16px", borderRadius: "24px" }}
                            onClick={handleShowHint}
                        >
                            💡 Gợi ý
                        </button>
                        <button
                            className="btn"
                            style={{ backgroundColor: sosSent ? "#FFEFEF" : "var(--c-accent)", color: sosSent ? "var(--c-accent)" : "white", padding: "8px 16px", borderRadius: "24px" }}
                            onClick={handleSOS}
                        >
                            {sosSent ? "Cô đang đến! 🏃‍♀️" : "Cần giúp đỡ 🆘"}
                        </button>
                    </div>
                </div>

                <div style={{ backgroundColor: "#F0F9FF", padding: "16px", borderRadius: "12px", marginBottom: "32px", fontSize: "1.1rem", border: "1px solid #BAE6FD" }}>
                    <p><strong>Nhiệm vụ:</strong> {currentStation.instructions || "Cô giáo chưa ghi gì~ Cứ nhìn đồ dùng trên bàn mà làm nhé!"}</p>
                </div>

                <h3 className="mb-4">Checklist Nhiệm vụ (Tích vào ô trống)</h3>

                <div className="flex flex-col gap-3 mb-8">
                    {currentStation.tasks.map((task) => (
                        <div
                            key={task.id}
                            className="flex items-center gap-4"
                            style={{ padding: "12px", border: "2px solid", borderColor: checkedTasks[task.id] ? "var(--c-success)" : "var(--c-border)", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s" }}
                            onClick={() => handleToggleTask(task.id)}
                        >
                            <div style={{
                                width: "32px", height: "32px", border: "3px solid", borderColor: checkedTasks[task.id] ? "var(--c-success)" : "var(--c-border)", borderRadius: "8px",
                                backgroundColor: checkedTasks[task.id] ? "var(--c-success)" : "transparent",
                                display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.2rem"
                            }}>
                                {checkedTasks[task.id] ? "✓" : ""}
                            </div>
                            <span style={{ fontSize: "1.2rem", textDecoration: checkedTasks[task.id] ? "line-through" : "none", color: checkedTasks[task.id] ? "var(--c-text-light)" : "var(--c-text)", fontWeight: "500" }}>{task.text}</span>
                        </div>
                    ))}
                </div>

                <AnimatePresence>
                    {allTasksDone && currentStation.bonusTasks && currentStation.bonusTasks.length > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            style={{ backgroundColor: "#FFF5E6", padding: "20px", borderRadius: "12px", border: "2px dashed var(--c-primary)", marginBottom: "32px" }}
                        >
                            <h3 style={{ color: "var(--c-primary)", marginBottom: "12px" }}>⭐ Úi chà! Nhóm làm nhanh thế! Thử sức thêm nhé:</h3>
                            <div className="flex flex-col gap-2">
                                {currentStation.bonusTasks.map((bonus) => (
                                    <div key={bonus.id} className="flex items-center gap-3" onClick={() => setCompletedBonus(prev => ({ ...prev, [bonus.id]: !prev[bonus.id] }))} style={{ cursor: "pointer" }}>
                                        <span style={{ fontSize: "1.5rem", opacity: completedBonus[bonus.id] ? 1 : 0.3 }}>⭐</span>
                                        <span style={{ fontSize: "1.1rem", textDecoration: completedBonus[bonus.id] ? "line-through" : "none" }}>{bonus.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="text-center mt-8 pt-8" style={{ borderTop: "2px dashed var(--c-border)" }}>
                    <motion.button
                        whileHover={allTasksDone ? { scale: 1.05 } : {}}
                        whileTap={allTasksDone ? { scale: 0.95 } : {}}
                        className={`btn ${allTasksDone ? "btn-secondary" : "btn-outline"}`}
                        style={{ fontSize: "1.5rem", padding: "20px 40px", opacity: allTasksDone ? 1 : 0.5, boxShadow: allTasksDone ? "0 6px 0 #1B8A80" : "none" }}
                        onClick={allTasksDone ? handleFinishStation : undefined}
                        disabled={!allTasksDone}
                    >
                        {allTasksDone ? "HOÀN THÀNH 🎉" : "Chưa làm xong đâu!"}
                    </motion.button>

                    {!allTasksDone && (
                        <p style={{ marginTop: "16px", color: "var(--c-text-light)" }}>Tích hết các ô vuông phía trên để mở khóa nút Hoàn thành nha!</p>
                    )}
                </div>

            </div>

            <Mascot
                message={mascotMessage}
                mood={mascotMood}
                playAudio={true}
                onMessageComplete={() => {
                    setMascotMessage("");
                    setMascotMood("happy");
                }}
            />

            {/* Quiz Modal */}
            <AnimatePresence>
                {showQuizModal && currentStation.quiz && currentStation.quiz.length > 0 && (
                    <div style={{
                        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
                        display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card"
                            style={{ maxWidth: "500px", width: "100%", padding: "32px", textAlign: "center" }}
                        >
                            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎯</div>
                            <h2 style={{ color: "var(--c-primary)", marginBottom: "8px" }}>Thử thách cuối cùng!</h2>
                            <p style={{ color: "var(--c-text-light)", marginBottom: "24px" }}>Trả lời đúng để kiếm thêm 10 sao nhé!</p>

                            <div style={{ background: "#F0F9FF", padding: "16px", borderRadius: "12px", marginBottom: "24px" }}>
                                <h3 style={{ fontSize: "1.3rem" }}>{currentStation.quiz[0].question}</h3>
                            </div>

                            <div className="flex flex-col gap-3">
                                {currentStation.quiz[0].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        className="btn btn-outline"
                                        style={{ width: "100%", padding: "16px", textAlign: "left", fontSize: "1.1rem", border: "2px solid var(--c-border)" }}
                                        onClick={() => handleQuizSubmit(idx, currentStation.quiz![0].correctIndex)}
                                    >
                                        <span style={{ fontWeight: "bold", marginRight: "12px", color: "var(--c-secondary)" }}>
                                            {String.fromCharCode(65 + idx)}.
                                        </span>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
