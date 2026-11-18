import { CVData } from '@/types/cv';
import { blankCVData } from '@/data/initialCVData';

const STORAGE_KEY = 'cvgenie_user_cvs_v2';
const ACTIVE_CV_ID_KEY = 'cvgenie_active_cv_id_v2';

// Purge old cached data from v1
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('cvgenie_user_cvs_v1');
    localStorage.removeItem('cvgenie_active_cv_id_v1');
    const oldV1 = localStorage.getItem('cvgenie_user_cvs_v1');
    if (oldV1) localStorage.removeItem('cvgenie_user_cvs_v1');
  } catch {
    // ignore
  }
}

export function getStoredCVs(): CVData[] {
  if (typeof window === 'undefined') return [];
  try {
    // Remove legacy v1
    localStorage.removeItem('cvgenie_user_cvs_v1');
    localStorage.removeItem('cvgenie_active_cv_id_v1');

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filter out old demo data if any
    return parsed.filter(
      (c: CVData) =>
        c.personalInfo?.fullName !== 'Fazle Dzaky Aryaguna' && c.id !== 'cv-fazle-01'
    );
  } catch (e) {
    console.error('Failed reading CVs from localStorage', e);
    return [];
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
  if (typeof window === 'undefined') return { ...blankCVData };
  const cvs = getStoredCVs();
  const activeId = localStorage.getItem(ACTIVE_CV_ID_KEY);
  if (activeId) {
    const found = cvs.find((c) => c.id === activeId);
    if (
      found &&
      found.personalInfo?.fullName !== 'Fazle Dzaky Aryaguna' &&
      found.id !== 'cv-fazle-01'
    ) {
      return found;
    }
  }
  if (cvs.length > 0) return cvs[0];
  const newId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `cv-${Date.now()}`;
  return { ...blankCVData, id: newId };
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

export function clearActiveCV(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACTIVE_CV_ID_KEY);
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('cvgenie_user_cvs_v1');
  localStorage.removeItem('cvgenie_active_cv_id_v1');
}
