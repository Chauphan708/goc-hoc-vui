"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/useSessionStore";
import Image from "next/image";

export default function TeacherQRCodesPage() {
    const router = useRouter();
    const { session } = useSessionStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (!session || session.status === "draft") {
            router.push("/teacher/create-session");
        }
    }, [session, router]);

    if (!isClient || !session) return <div className="p-8 text-center">Đang tải mã QR...</div>;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="container" style={{ padding: "2rem 1rem", maxWidth: "900px", minHeight: "100vh", backgroundColor: "white" }}>

            {/* Nút in chỉ hiển thị trên màn hình */}
            <div className="flex justify-between items-center mb-8" style={{ borderBottom: "2px dashed var(--c-border)", paddingBottom: "16px", '@media print': { display: 'none' } } as React.CSSProperties}>
                <div>
                    <h1 style={{ fontSize: "2rem", color: "var(--c-primary)" }}>🖨️ In Mã QR Trạm</h1>
                    <p style={{ color: "var(--c-text-light)" }}>Dán các mã này tại các khu vực tương ứng để học sinh quét.</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn btn-outline" onClick={() => router.push("/teacher/dashboard")}>⬅️ Quay lại</button>
                    <button className="btn btn-primary" onClick={handlePrint} style={{ boxShadow: "0 6px 0 var(--c-primary)" }}>In trang này 🖨️</button>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
                {session.stations.map((station, index) => (
                    <div key={station.id} style={{ border: "2px dashed var(--c-text-light)", padding: "24px", borderRadius: "16px", textAlign: "center", breakInside: "avoid" }}>
                        <h2 style={{ fontSize: "1.5rem", color: "var(--c-secondary)", marginBottom: "8px" }}>Trạm {index + 1}</h2>
                        <h3 style={{ fontSize: "1.2rem", color: "var(--c-text)", marginBottom: "16px" }}>{station.name}</h3>

                        <Image
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${station.id}`}
                            alt={`QR Code for ${station.name}`}
                            width={200}
                            height={200}
                            unoptimized
                            style={{ margin: "0 auto", border: "8px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "8px" }}
                        />

                        <p style={{ marginTop: "16px", fontSize: "0.9rem", color: "var(--c-text-light)" }}>Quét mã này bằng ứng dụng Học theo góc để nhận Mật thư!</p>
                    </div>
                ))}
            </div>

        </div>
    );
}
