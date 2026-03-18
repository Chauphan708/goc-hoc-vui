"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRScannerProps {
    onResult: (result: string) => void;
    onError?: (error: string) => void;
}

export function QRScanner({ onResult, onError }: QRScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        if (!isScanning) return;

        // Ensure we only initialize once
        if (!scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false // verbose=false
            );

            scannerRef.current.render(
                (decodedText) => {
                    // Stop scanning on success
                    setIsScanning(false);
                    if (scannerRef.current) {
                        scannerRef.current.clear();
                    }
                    onResult(decodedText);
                },
                () => {
                    // parse errors are normal (e.g., no qr code found in frame), 
                    // only call onError for actual failures if necessary, but usually ignore
                    if (onError) {
                        // onError(errorMessage);
                    }
                }
            );
        }

        // Cleanup function
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5QrcodeScanner. ", error);
                });
                scannerRef.current = null;
            }
        };
    }, [isScanning, onResult, onError]);

    return (
        <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
            {isScanning ? (
                <div id="qr-reader" style={{ width: "100%", borderRadius: "12px", overflow: "hidden", border: "2px solid var(--c-primary)" }}></div>
            ) : (
                <div className="text-center p-4" style={{ backgroundColor: "var(--c-success)", color: "white", borderRadius: "12px" }}>
                    ✅ Quét mã thành công!
                </div>
            )}
        </div>
    );
}
