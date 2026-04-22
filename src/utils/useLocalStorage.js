import { useState, useEffect } from 'react';

function getStorageValue(key, defaultValue) {
	// getting stored value
	try {
		const saved = localStorage.getItem(key);
		if (saved === null) return defaultValue;
		const initial = JSON.parse(saved);
		return initial || defaultValue;
	} catch (error) {
		console.warn('Error reading from localStorage:', error);
		return defaultValue;
	}
}

export const useLocalStorage = (key, defaultValue) => {
	const [value, setValue] = useState(() => {
		return getStorageValue(key, defaultValue);
	});

	useEffect(() => {
		// storing input name
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue];
};
