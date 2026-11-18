import { CVData } from '@/types/cv';
import { defaultCVData } from '@/data/initialCVData';

const STORAGE_KEY = 'cvgenie_user_cvs_v1';
const ACTIVE_CV_ID_KEY = 'cvgenie_active_cv_id_v1';

export function getStoredCVs(): CVData[] {
  if (typeof window === 'undefined') return [defaultCVData];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredCVs([defaultCVData]);
      return [defaultCVData];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [defaultCVData];
  } catch (e) {
    console.error('Failed reading CVs from localStorage', e);
    return [defaultCVData];
  }
}

export function saveStoredCVs(cvs: CVData[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
  } catch (e) {
    console.error('Failed saving CVs to localStorage', e);
  }
}

export function getActiveCV(): CVData {
  if (typeof window === 'undefined') return defaultCVData;
  const cvs = getStoredCVs();
  const activeId = localStorage.getItem(ACTIVE_CV_ID_KEY);
  if (activeId) {
    const found = cvs.find((c) => c.id === activeId);
    if (found) return found;
  }
  return cvs[0] || defaultCVData;
}

export function saveActiveCV(cv: CVData): void {
  if (typeof window === 'undefined') return;
  const cvs = getStoredCVs();
  const index = cvs.findIndex((c) => c.id === cv.id);
  if (index >= 0) {
    cvs[index] = { ...cv, updatedAt: 'Just now' };
  } else {
    cvs.unshift({ ...cv, updatedAt: 'Just now' });
  }
  saveStoredCVs(cvs);
  localStorage.setItem(ACTIVE_CV_ID_KEY, cv.id);
}
