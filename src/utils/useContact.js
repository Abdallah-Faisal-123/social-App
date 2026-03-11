import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "../pages/Chat/firebase";

export const useContacts = (currentUser) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (!currentUser || !currentUser.id) return;

    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", currentUser.id)
    );

    const unsub = onSnapshot(q, async (snapshot) => {
      const list = await Promise.all(snapshot.docs.map(async doc => {
        const chat = doc.data();
        const otherUserId = chat.users.find(id => id !== currentUser.id);

      
        let lastMessage = "";
        let lastMessageTime = null;

        if (chat.messages && chat.messages.length > 0) {
          const lastMsg = chat.messages[chat.messages.length - 1];
          lastMessage = lastMsg.text || lastMsg.img || "";
          lastMessageTime = lastMsg.createdAt?.seconds ? new Date(lastMsg.createdAt.seconds * 1000) : null;
        }

        return {
          chatId: doc.id,
          userId: otherUserId,
          lastMessage,
          lastMessageTime
        };
      }));
      setContacts(list);
    });

    return () => unsub();
  }, [currentUser]);

  return contacts;
};