// useSaveContact.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "../pages/Chat/firebase";

export const saveContact = async (currentUserId, otherUser, chatId) => {
  if (!currentUserId || !otherUser._id) return;

  try {
    // بيحفظ الشخص في "درج" خاص بيك أنت بس جوه الـ Firebase
    const contactRef = doc(db, "users", currentUserId, "myContacts", otherUser._id);
    
    await setDoc(contactRef, {
      userId: otherUser._id,
      username: otherUser.username,
      photo: otherUser.photo || "",
      chatId: chatId,
      lastInteraction: new Date() 
    }, { merge: true });
  } catch (e) {
    console.error("Error saving contact", e);
  }
};