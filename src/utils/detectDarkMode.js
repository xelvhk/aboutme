const detectDarkMode = () => {
	if (
		typeof window !== 'undefined' &&
		window.matchMedia &&
		window.matchMedia('(prefers-color-scheme: dark)').matches
	) {
		return 'dark'
	}
    return 'light'
};

export default detectDarkMode;
