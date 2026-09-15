import { useState } from 'react';

/**
 * Custom hook for managing localStorage with safe parsing and error handling.
 * Automatically syncs state with localStorage and provides update functionality.
 * 
 * @param {string} key - The localStorage key
 * @param {*} initialValue - Default value if key doesn't exist or parsing fails
 * @returns {[*, function]} - [storedValue, setValue] similar to useState
 */
export function useLocalStorage(key, initialValue) {
    // State to store the value
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Failed to parse localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter that persists to localStorage
    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Failed to set localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}

/**
 * Helper to safely parse localStorage without crashing on corrupted data.
 * @param {string} key - The localStorage key
 * @param {*} fallback - Value to return if parsing fails
 * @returns {*} - Parsed value or fallback
 */
export function getFromStorage(key, fallback = null) {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (error) {
        console.warn(`Failed to parse localStorage key "${key}":`, error);
        return fallback;
    }
}

/**
 * Helper to safely save to localStorage with error handling.
 * @param {string} key - The localStorage key
 * @param {*} value - Value to store (will be JSON stringified)
 * @returns {boolean} - Success indicator
 */
export function saveToStorage(key, value) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Failed to set localStorage key "${key}":`, error);
        return false;
    }
}

/**
 * Helper to safely remove from localStorage.
 * @param {string} key - The localStorage key
 * @returns {boolean} - Success indicator
 */
export function removeFromStorage(key) {
    try {
        window.localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Failed to remove localStorage key "${key}":`, error);
        return false;
    }
}
