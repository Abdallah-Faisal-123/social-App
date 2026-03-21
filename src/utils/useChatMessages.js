
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../src/pages/Chat/firebase";

export const useChatMessages = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    if (!chatId) {
        setMessages([]);
        setLoadingMessages(false);
        return;
    }

    setLoadingMessages(true);

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
      setLoadingMessages(false);
    });

    return () => unsub();
  }, [chatId]);

  return { messages, loadingMessages };
};

/* 
export const sendMessage = async (receiverId, text, senderId, imageUrl = null) => {
    const chatId = [senderId, receiverId].sort().join("_");
    const msgsRef = collection(db, "chats", chatId, "messages");

    await addDoc(msgsRef, {
        senderId,
        text,
        img: imageUrl, // هنا بنخزن رابط الصورة
        createdAt: serverTimestamp(),
    });
}; */