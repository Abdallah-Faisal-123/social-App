// في صفحة القائمة (ChatList.js)
import { collection, onSnapshot } from "firebase/firestore";

useEffect(() => {
  if (!currentUser.id) return;

  // بنجيب "درج" المحادثات اللي اتحفظت ليك بس
  const q = collection(db, "users", currentUser.id, "myContacts");

  const unsub = onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map(doc => doc.data());
    setMyChatList(list); // دي القائمة اللي هتعرضها في الـ UI
  });

  return () => unsub();
}, [currentUser.id]);