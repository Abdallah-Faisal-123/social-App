// useSaveContact.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "../pages/Chat/firebase";

export const saveContact = async (currentUserId, currentUserData, otherUser, chatId) => {
  if (!currentUserId || !otherUser._id) return;

  try {
    // 1. حفظ في قائمة جهات اتصالي (أنا)
    const myContactRef = doc(db, "users", currentUserId, "myContacts", otherUser._id);
    await setDoc(doc(db, "users", myId, "myContacts", otherId), data);

    // 2. حفظ في قائمة جهات اتصال الطرف التاني (هو)
    // السحر هنا: بنسجل بياناتي أنا عنده عشان يظهرله الشات فوراً
    const otherContactRef = doc(db, "users", otherUser._id, "myContacts", currentUserId);
    await setDoc(doc(db, "users", otherId, "myContacts", myId), data);

    console.log("Contact saved for both sides!");
  } catch (e) {
    console.error("Error saving contact for both sides", e);
  }
};