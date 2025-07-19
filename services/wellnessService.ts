import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface WellnessEntry {
  id?: string;
  userId: string;
  mood: number;
  sleepHours: number;
  habits: string[];
  reflection: string;
  date: Date;
  createdAt: Timestamp;
}

export const wellnessService = {
  async saveEntry(entry: Omit<WellnessEntry, 'id' | 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'wellness_entries'), {
        ...entry,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving wellness entry:', error);
      throw error;
    }
  },

  async getUserEntries(userId: string, limit = 30) {
    try {
      const q = query(
        collection(db, 'wellness_entries'),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        // limitToLast(limit)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as WellnessEntry[];
    } catch (error) {
      console.error('Error fetching wellness entries:', error);
      throw error;
    }
  },

  async updateEntry(entryId: string, updates: Partial<WellnessEntry>) {
    try {
      const entryRef = doc(db, 'wellness_entries', entryId);
      await updateDoc(entryRef, updates);
    } catch (error) {
      console.error('Error updating wellness entry:', error);
      throw error;
    }
  },

  async getWeeklyStats(userId: string) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
      const q = query(
        collection(db, 'wellness_entries'),
        where('userId', '==', userId),
        where('date', '>=', oneWeekAgo),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const entries = querySnapshot.docs.map(doc => doc.data()) as WellnessEntry[];
      
      return {
        totalEntries: entries.length,
        avgMood: entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length : 0,
        avgSleep: entries.length > 0 ? entries.reduce((sum, entry) => sum + entry.sleepHours, 0) / entries.length : 0,
        currentStreak: this.calculateStreak(entries),
      };
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
      throw error;
    }
  },

  calculateStreak(entries: WellnessEntry[]): number {
    if (entries.length === 0) return 0;
    
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const entry of entries) {
      const entryDate = new Date(entry.date);
      const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  },
};