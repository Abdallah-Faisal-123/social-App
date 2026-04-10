export const saveContact = async (currentUserId, currentUserData, otherUser, chatId) => {
  if (!currentUserId || !otherUser._id) return;
  const myContactRef = doc(db, "users", currentUserId, "myContacts", otherUser._id);
  await setDoc(myContactRef, {
    userId: otherUser._id,
    username: otherUser.name,
    photo: otherUser.photo || "",
    chatId: chatId,
    lastInteraction: serverTimestamp()
  }, { merge: true });

  const otherContactRef = doc(db, "users", otherUser._id, "myContacts", currentUserId);
  await setDoc(otherContactRef, {
    userId: currentUserId,
    username: currentUserData.name,
    photo: currentUserData.photo || "",
    chatId: chatId,
    lastInteraction: serverTimestamp()
  }, { merge: true });
};