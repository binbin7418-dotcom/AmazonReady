// Local storage service for demo mode (替代 Supabase)

export interface UserData {
  email: string;
  credits: number;
  processedImages: ProcessedImageRecord[];
  createdAt: string;
}

export interface ProcessedImageRecord {
  id: string;
  filename: string;
  processedAt: string;
  creditsUsed: number;
}

const STORAGE_KEY = 'amazonready_user_data';

export function initializeUser(email: string = 'demo@amazonready.ai'): UserData {
  const existingData = getUserData();
  
  if (existingData) {
    return existingData;
  }

  const userData: UserData = {
    email,
    credits: 20, // Free tier: 20 images
    processedImages: [],
    createdAt: new Date().toISOString(),
  };

  saveUserData(userData);
  return userData;
}

export function getUserData(): UserData | null {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveUserData(userData: UserData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
}

export function getCredits(): number {
  const userData = getUserData();
  return userData?.credits || 0;
}

export function deductCredits(amount: number): boolean {
  const userData = getUserData();
  
  if (!userData || userData.credits < amount) {
    return false;
  }

  userData.credits -= amount;
  saveUserData(userData);
  return true;
}

export function addProcessedImage(filename: string, creditsUsed: number): void {
  const userData = getUserData();
  
  if (!userData) return;

  userData.processedImages.push({
    id: Math.random().toString(36).substr(2, 9),
    filename,
    processedAt: new Date().toISOString(),
    creditsUsed,
  });

  saveUserData(userData);
}

export function getProcessingHistory(): ProcessedImageRecord[] {
  const userData = getUserData();
  return userData?.processedImages || [];
}

export function resetUserData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
