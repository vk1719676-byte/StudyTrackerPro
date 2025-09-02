import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Exam, StudySession, UserStats } from '../types';

// Exams
export const addExam = async (exam: Omit<Exam, 'id'>) => {
  const docRef = await addDoc(collection(db, 'exams'), {
    ...exam,
    date: Timestamp.fromDate(exam.date),
    createdAt: Timestamp.fromDate(exam.createdAt)
  });
  return docRef.id;
};

export const updateExam = async (examId: string, updates: Partial<Exam>) => {
  const examRef = doc(db, 'exams', examId);
  const updateData: any = { ...updates };
  if (updates.date) {
    updateData.date = Timestamp.fromDate(updates.date);
  }
  await updateDoc(examRef, updateData);
};

export const deleteExam = async (examId: string) => {
  await deleteDoc(doc(db, 'exams', examId));
};

export const getUserExams = (userId: string, callback: (exams: Exam[]) => void) => {
  const q = query(
    collection(db, 'exams'),
    where('userId', '==', userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const exams = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
      createdAt: doc.data().createdAt.toDate()
    })) as Exam[];
    
    // Sort by date on the client side to avoid composite index requirement
    exams.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    callback(exams);
  });
};

// Study Sessions
export const addStudySession = async (session: Omit<StudySession, 'id'>) => {
  const docRef = await addDoc(collection(db, 'sessions'), {
    ...session,
    date: Timestamp.fromDate(session.date)
  });
  return docRef.id;
};

export const getUserSessions = (userId: string, callback: (sessions: StudySession[]) => void) => {
  const q = query(
    collection(db, 'sessions'),
    where('userId', '==', userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    })) as StudySession[];
    
    // Sort by date on the client side to avoid composite index requirement
    sessions.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    callback(sessions);
  });
};

// Leaderboard Functions
export const getAllUserSessions = (callback: (sessions: StudySession[]) => void) => {
  const q = query(collection(db, 'sessions'));
  
  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    })) as StudySession[];
    
    callback(sessions);
  });
};

export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const getAllUserProfiles = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }
};

// User Stats
export const updateUserStats = async (userId: string, stats: UserStats) => {
  const userRef = doc(db, 'userStats', userId);
  await updateDoc(userRef, stats);
};

export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  const userRef = doc(db, 'userStats', userId);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() as UserStats : null;
};

// Study Materials
export const addStudyMaterial = async (material: Omit<StudyMaterial, 'id'>) => {
  const docRef = await addDoc(collection(db, 'studyMaterials'), {
    ...material,
    uploadedAt: Timestamp.fromDate(material.uploadedAt)
  });
  return docRef.id;
};

export const getUserStudyMaterials = (userId: string, callback: (materials: StudyMaterial[]) => void) => {
  const q = query(
    collection(db, 'studyMaterials'),
    where('userId', '==', userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const materials = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt.toDate()
    })) as StudyMaterial[];
    
    // Sort by upload date on the client side
    materials.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    
    callback(materials);
  });
};

export const deleteStudyMaterial = async (materialId: string) => {
  await deleteDoc(doc(db, 'studyMaterials', materialId));
};
