import { addDoc, collection, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../pages/Chat/firebase";
import { getCurrentUser } from "../utils/getUser";

export const sendMessage = async (otherUserId, text, senderId = null) => {
  const currentUser = senderId ? { id: senderId } : getCurrentUser();

  // منع الإرسال لو البيانات ناقصة
  if (!currentUser || !currentUser.id) {
    console.error("Current user is invalid", currentUser);
    return;
  }
  if (!otherUserId) {
    console.error("No recipient selected");
    return;
  }
  if (!text || !text.trim()) {
    console.error("Message is empty");
    return;
  }

  const chatId = [currentUser.id, otherUserId].sort().join("_");

  const chatRef = doc(db, "chats", chatId);

  try {
    // إنشاء أو تحديث الدردشة
    await setDoc(chatRef, {
      users: [currentUser.id, otherUserId],
      updatedAt: serverTimestamp()
    }, { merge: true });

    // إضافة الرسالة
    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: currentUser.id,
      text: text.trim(),
      createdAt: serverTimestamp()
    });

    // تحديث آخر رسالة
    await updateDoc(chatRef, {
      lastMessage: text.trim(),
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("Error sending message:", err);
  }
};
