import axios from "axios";
import { AppError } from "@/utils/appError";
import { ENV } from "@/config/env";

export interface MessageType {
    role: string;
    parts: [{ text: string }];
}

const generateConfig = {
    generationConfig: {
        response_mime_type: "application/json",
        response_schema: {
            type: "object",
            properties: {
                suggested_questions: {
                    type: "array",
                    description: "Danh sách các câu hỏi gợi ý mà người chơi có thể hỏi tiếp theo để tìm ra gián điệp (tối thiểu 3 câu hỏi và tối đa là 5 câu hỏi)",
                    items: {
                        type: "string"
                    }
                },
                context_summary: {
                    type: "string",
                    description: "Một đoạn văn tóm tắt các câu hỏi để gửi lại cho AI ở lần yêu cầu tiếp theo. (Ngữ cảnh này sẽ tóm tắt các câu hỏi đã hỏi trước đó)"
                }
            },
            required: ["suggested_questions", "context_summary"]
        }
    }
};

export class GeminiService {
    async postAnswer(messages: MessageType[]) {
        try {
            const response = await axios.post(
                `${ENV.GEMINI_API_URL}?key=${ENV.GEMINI_API_KEY}`,
                {
                    contents: messages.map((message) => ({
                        role: message.role,
                        parts: message.parts.map((part) => ({ text: part.text }))
                    })),
                    ...generateConfig
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            return response.data;
        } catch (error: any) {
            // Gọi AppError nếu cần xử lý lỗi tùy chỉnh
            const status = error.response?.status || 500;
            const message = error.response?.data?.error?.message || error.message;
            throw new AppError(message, status);
        }
    }
}
