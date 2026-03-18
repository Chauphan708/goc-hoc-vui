import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface MascotProps {
    message?: string;
    mood?: "happy" | "thinking" | "celebrate";
    playAudio?: boolean;
    onMessageComplete?: () => void;
}

export function Mascot({ message, mood = "happy", playAudio = false, onMessageComplete }: MascotProps) {
    const [showBubble, setShowBubble] = useState(false);

    useEffect(() => {
        if (message) {
            setTimeout(() => setShowBubble(true), 0);

            if (playAudio && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.lang = 'vi-VN';
                utterance.rate = 1.0;
                utterance.pitch = 1.2; // Giọng điệu hơi cao, vui tươi cho trẻ con
                window.speechSynthesis.speak(utterance);
            }

            const timer = setTimeout(() => {
                setShowBubble(false);
                if (onMessageComplete) onMessageComplete();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, playAudio, onMessageComplete]);

    const getEmoji = () => {
        switch (mood) {
            case "thinking": return "🤖"; // Mèo máy suy nghĩ
            case "celebrate": return "🎉"; // Mèo máy tung hô
            default: return "🐱"; // Mèo máy mặc định 
        }
    };

    return (
        <div className="mascot-container" style={{ position: "fixed", bottom: "20px", left: "20px", zIndex: 100 }}>
            <AnimatePresence>
                {showBubble && message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{
                            position: "absolute",
                            bottom: "80px",
                            left: "40px",
                            background: "white",
                            padding: "16px",
                            borderRadius: "16px",
                            borderBottomLeftRadius: "0",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                            border: "2px solid var(--c-primary)",
                            width: "250px",
                            fontSize: "1rem",
                            fontWeight: "500"
                        }}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                animate={
                    mood === "celebrate"
                        ? { y: [0, -20, 0], rotate: [0, -10, 10, 0] }
                        : { y: [0, -10, 0] }
                }
                transition={{
                    repeat: Infinity,
                    duration: mood === "celebrate" ? 0.5 : 2,
                    ease: "easeInOut"
                }}
                style={{
                    fontSize: "4rem",
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                    background: "white",
                    borderRadius: "50%",
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "4px solid var(--c-primary)"
                }}
            >
                {getEmoji()}
            </motion.div>
        </div>
    );
}
