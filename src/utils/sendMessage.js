import { db } from "../pages/Chat/firebase";
import { addDoc, collection,  serverTimestamp } from "firebase/firestore";

export const sendMessage   = async (recipientId, text, senderId, imageUrl = null, audioUrl = null, replyTo = null, videoUrl = null, fileUrl = null) => {
    // التأكد من وجود البيانات الأساسية
    if (!senderId || !recipientId) {
        console.error("Missing senderId or recipientId");
        return;
    }

    try {
        // تكوين الـ ID بنفس الطريقة التي يقرأ بها الـ Hook (useChatMessages)
        const chatId = [senderId, recipientId].sort().join("_");
        
        const messagesRef = collection(db, "chats", chatId, "messages");

        await addDoc(messagesRef, {
            senderId,
            text: text || "",
            img: imageUrl || null,
            audio: audioUrl || null,
            video: videoUrl || null,
            file: fileUrl || null,
            replyTo: replyTo || null,
            createdAt: serverTimestamp(),
            read: false,
        });

        return true; 
    } catch (error) {
        console.error("Firebase AddDoc Error:", error);
        alert("حدث خطأ في قاعدة البيانات: " + error.message);
        throw error;
    }
};