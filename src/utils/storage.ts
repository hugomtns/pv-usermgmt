/**
 * Storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  APP_STATE: 'pv-usermgmt-state',
} as const;

/**
 * Get an item from localStorage with type safety
 * @param key - The storage key
 * @param fallback - The fallback value if item doesn't exist or parsing fails
 * @returns The parsed item or fallback value
 */
export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);
    return fallback;
  }
}

/**
 * Set an item in localStorage with type safety
 * @param key - The storage key
 * @param value - The value to store
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error writing to localStorage (key: ${key}):`, error);
    // Handle quota exceeded or other storage errors gracefully
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Consider clearing old data.');
    }
  }
}

/**
 * Clear all items from localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Remove a specific item from localStorage
 * @param key - The storage key to remove
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
  }
}
