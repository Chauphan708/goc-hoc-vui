import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateAIHint(apiKey: string, stationName: string, taskDescription?: string): Promise<string> {
    if (!apiKey) {
        throw new Error("Missing Gemini API Key");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Bạn là một trợ lý ảo tên là "Mèo Máy" trong ứng dụng giáo dục "Góc Học Vui" dành cho học sinh tiểu học (6-11 tuổi).
Học sinh đang ở góc học tập mang tên: "${stationName}".
Nhiệm vụ của góc này là: "${taskDescription || 'Không có mô tả chi tiết'}".

Học sinh vừa bấm nút xin "Gợi ý". Hãy viết MỘT câu gợi ý ngắn gọn (không quá 20 từ), vui vẻ, thân thiện, mang tính chất khuyến khích học sinh tự suy nghĩ hoặc quan sát xung quanh để hoàn thành nhiệm vụ. Đừng nói thẳng đáp án.
Bắt đầu câu bằng một từ cảm thán nhí nhảnh (VD: Meo meo, Nè cậu ơi, Chú ý nhé...).
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}
