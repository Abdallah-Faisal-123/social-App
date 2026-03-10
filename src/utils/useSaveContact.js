// useSaveContact.js
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, setDoc, doc } from "firebase/firestore";
import { db } from "../pages/Chat/firebase";
import { getCurrentUser } from "./getUser";

let savedContacts = []; // مؤقت لتخزين contacts جديدة

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", currentUser.id)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => {
        const chat = doc.data();
        const otherUserId = chat.users.find(id => id !== currentUser.id);
        return {
          chatId: doc.id,
          userId: otherUserId,
          lastMessage: chat.lastMessage || ""
        };
      });
      setContacts(list);
    });

    return () => unsub();
  }, [currentUser]);

  return contacts;
};

// دالة لحفظ contact جديد
export const saveContact = async (userId, contact) => {
  // هنا ممكن تحفظ في Firebase أو localStorage حسب النظام
  savedContacts.push(contact);

  // مثال حفظ في Firebase
  await setDoc(doc(db, "contacts", `${userId}_${contact.userId}`), contact);
};