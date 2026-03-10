import { addDoc, collection, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../pages/Chat/firebase";
import { getCurrentUser } from "../utils/getUser";

export const sendMessage = async (otherUserId, text, senderId = null) => {
  const currentUser = senderId ? { id: senderId  } : getCurrentUser();

 
  if (!currentUser || !currentUser.id) {
    
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
 
    await setDoc(chatRef, {
      users: [currentUser.id, otherUserId],
      updatedAt: serverTimestamp()
    }, { merge: true });

 
    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: currentUser.id,
      text: text.trim(),
      createdAt: serverTimestamp()
    });

 
    await updateDoc(chatRef, {
            lastMessage: {
        text: text.trim(),
        senderId: userId,
        createdAt: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    
  }
};
