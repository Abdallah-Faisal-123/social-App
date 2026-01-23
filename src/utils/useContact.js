import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../pages/Chat/firebase";
import { getCurrentUser } from "../utils/getUser";

export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) return;

    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const list = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== currentUser.id); // نشيل نفسك

      setContacts(list);
    });

    return () => unsub();
  }, []);

  return contacts;
};
