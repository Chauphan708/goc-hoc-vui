"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/useSessionStore";
import { v4 as uuidv4 } from "uuid";
import { TEMPLATES } from "@/data/templates";

export default function CreateSessionPage() {
    const router = useRouter();
    const { session, initSession, updateTitle, updateType, addStation, updateStation, removeStation, startSession, loadTemplate } = useSessionStore();

    const [isClient, setIsClient] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (!session) {
            // Mock teacher ID for now
            initSession("Buổi học Thám Hiểm Rừng Xanh", "teacher-123", "station");
        }
    }, [initSession, session]);

    if (!isClient || !session) return <div className="p-8 text-center">Đang tải...</div>;

    const handleStart = () => {
        startSession();
        router.push("/teacher/dashboard");
    };

    return (
        <div className="container" style={{ padding: "2rem 1rem", maxWidth: "800px" }}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 style={{ fontSize: "2rem", color: "var(--c-primary)" }}>🏕️ Thiết Lập Buổi Học</h1>
                    <p style={{ color: "var(--c-text-light)" }}>Chuẩn bị các góc học tập thật vui cho học sinh nào!</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn btn-secondary" onClick={() => setShowTemplateModal(true)}>
                        📖 Chọn từ Thư viện Mẫu
                    </button>
                    <button className="btn btn-outline" onClick={() => router.push("/teacher/settings")}>
                        ⚙️ Cài đặt
                    </button>
                    <button className="btn btn-primary" onClick={handleStart}>
                        Bắt đầu ngay 🚀
                    </button>
                </div>
            </div>

            {/* Session Type & Title */}
            <div className="card mb-8">
                <div className="flex gap-4 mb-6">
                    <button
                        className={`btn ${session.type === 'station' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ flex: 1, padding: '16px', borderRadius: '12px' }}
                        onClick={() => updateType('station')}
                    >
                        🏫 Học Theo Góc (Local)
                    </button>
                    <button
                        className={`btn ${session.type === 'game' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ flex: 1, padding: '16px', borderRadius: '12px' }}
                        onClick={() => updateType('game')}
                    >
                        🗺️ Trò Chơi Lớn (Quét QR)
                    </button>
                </div>

                <h3 className="mb-4">Tên Buổi Học / Trò Chơi</h3>
                <input
                    type="text"
                    value={session.title}
                    onChange={(e) => updateTitle(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid var(--c-border)", fontSize: "1.1rem" }}
                />
            </div>

            {/* Stations List */}
            <div className="flex justify-between items-center mb-4">
                <h3>Các Góc Hoạt Động ({session.stations.length}/10)</h3>
                {session.stations.length < 10 && (
                    <button className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: "1rem" }} onClick={addStation}>
                        + Thêm Góc Mới
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-4">
                {session.stations.map((station, index) => (
                    <div key={station.id} className="card" style={{ padding: "16px", borderLeft: "6px solid var(--c-secondary)" }}>
                        <div className="flex justify-between items-center mb-4">
                            <h4 style={{ color: "var(--c-secondary)" }}>Góc {index + 1}: {station.name}</h4>
                            {session.stations.length > 2 && (
                                <button
                                    onClick={() => removeStation(station.id)}
                                    style={{ color: "var(--c-accent)", fontWeight: "bold", padding: "4px 8px" }}
                                >
                                    Xóa 🗑️
                                </button>
                            )}
                        </div>

                        <div className="flex gap-4 mb-4" style={{ flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 calc(50% - 8px)" }}>
                                <label style={{ display: "block", marginBottom: "4px", fontSize: "0.9rem", fontWeight: "bold" }}>Tên Góc</label>
                                <input
                                    type="text"
                                    value={station.name}
                                    onChange={(e) => updateStation(station.id, { name: e.target.value })}
                                    style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid var(--c-border)" }}
                                />
                            </div>
                            <div style={{ flex: "1 1 calc(50% - 8px)" }}>
                                <label style={{ display: "block", marginBottom: "4px", fontSize: "0.9rem", fontWeight: "bold" }}>Thời gian (phút)</label>
                                <input
                                    type="number"
                                    value={station.durationMinutes}
                                    onChange={(e) => updateStation(station.id, { durationMinutes: Number(e.target.value) })}
                                    style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid var(--c-border)" }}
                                    min="1" max="60"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label style={{ display: "block", marginBottom: "4px", fontSize: "0.9rem", fontWeight: "bold" }}>Mô tả nhiệm vụ</label>
                            <textarea
                                value={station.instructions}
                                onChange={(e) => updateStation(station.id, { instructions: e.target.value })}
                                placeholder="VD: Các em hãy đong 50ml nước vào cốc A..."
                                style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid var(--c-border)", minHeight: "80px", resize: "vertical" }}
                            />
                        </div>

                        <div style={{ padding: "12px", backgroundColor: "#FFF5E6", borderRadius: "8px", border: "1px dashed var(--c-primary)" }}>
                            <div className="flex justify-between items-center mb-2">
                                <span style={{ fontWeight: "bold", color: "var(--c-primary)" }}>⭐ Nhiệm vụ mở rộng (Bonus)</span>
                                <button
                                    onClick={() => {
                                        const bonusTask = { id: uuidv4(), text: "Nhiệm vụ thêm...", isCompleted: false };
                                        updateStation(station.id, { bonusTasks: [...(station.bonusTasks || []), bonusTask] })
                                    }}
                                    style={{ fontSize: "0.9rem", color: "var(--c-primary)", fontWeight: "bold" }}
                                >
                                    + Thêm Bonus
                                </button>
                            </div>
                            <p style={{ fontSize: "0.85rem", color: "var(--c-text-light)", marginBottom: "8px" }}>Dành cho nhóm làm xong sớm để kiếm thêm điểm!</p>

                            {station.bonusTasks?.map((bonus, bIndex) => (
                                <div key={bonus.id} className="flex gap-2 mb-2 items-center">
                                    <span style={{ fontSize: "1.2rem" }}>⭐</span>
                                    <input
                                        type="text"
                                        value={bonus.text}
                                        onChange={(e) => {
                                            const newBonus = [...(station.bonusTasks || [])];
                                            newBonus[bIndex].text = e.target.value;
                                            updateStation(station.id, { bonusTasks: newBonus });
                                        }}
                                        style={{ flex: 1, padding: "6px", borderRadius: "4px", border: "1px solid var(--c-border)" }}
                                    />
                                    <button
                                        onClick={() => {
                                            const newBonus = (station.bonusTasks || []).filter(b => b.id !== bonus.id);
                                            updateStation(station.id, { bonusTasks: newBonus });
                                        }}
                                        style={{ color: "var(--c-accent)", padding: "4px" }}
                                    >✕</button>
                                </div>
                            ))}
                        </div>

                    </div>
                ))}
            </div>

            {/* Template Library Modal */}
            {showTemplateModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div className="card" style={{ maxWidth: '800px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ color: "var(--c-primary)" }}>📖 Thư viện Mẫu Buổi học</h2>
                            <button onClick={() => setShowTemplateModal(false)} style={{ fontSize: "1.5rem", color: "var(--c-text-light)" }}>✕</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                            {TEMPLATES.map(template => (
                                <div key={template.id} style={{
                                    border: '2px solid var(--c-border)', borderRadius: '12px', padding: '16px',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    display: 'flex', flexDirection: 'column',
                                    backgroundColor: 'white'
                                }}
                                    onClick={() => {
                                        loadTemplate(template);
                                        setShowTemplateModal(false);
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--c-primary)'}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--c-border)'}
                                >
                                    <div style={{ fontSize: '0.8rem', color: 'var(--c-secondary)', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                                        {template.subject} • {template.type === 'game' ? 'Trò chơi lớn' : 'Học theo góc'}
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{template.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--c-text-light)', flex: 1 }}>{template.description}</p>
                                    <div style={{ marginTop: '12px', padding: '6px 12px', backgroundColor: 'var(--c-background)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', alignSelf: 'flex-start' }}>
                                        {template.stations.length} {template.type === 'game' ? 'trạm' : 'góc'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
