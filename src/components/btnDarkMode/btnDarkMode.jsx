import { useEffect } from 'react';
import {useLocalStorage} from "./../../utils/useLocalStorage"
import detectDarkMode from '../../utils/detectDarkMode';

import sun from './sun.svg';
import moon from './moon.svg';
import './btnDarkMode.css';

const BtnDarkMode = () => {
    const [darkMode, setDarkMode] = useLocalStorage('darkMode', detectDarkMode());

    useEffect(() => {
        if (typeof document !== 'undefined') {
            if (darkMode === 'dark') {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        }
	}, [darkMode]);

    useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (event) => {
			const newColorScheme = event.matches ? 'dark' : 'light';
			setDarkMode(newColorScheme);
		};
		
		mediaQuery.addEventListener('change', handleChange);
		
		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	}, [setDarkMode]);

	const toggleDarkMode = () => {
		setDarkMode((currentValue) => {
			return currentValue === 'light' ? 'dark' : 'light';
		});
	};

    const btnNormal = 'dark-mode-btn';
    const btnActive = 'dark-mode-btn dark-mode-btn--active';

	return (
		<button className={darkMode === 'dark' ? btnActive : btnNormal} onClick={toggleDarkMode}>
			<img src={sun} alt="Light mode" className="dark-mode-btn--icon" />
			<img src={moon} alt="Dark mode" className="dark-mode-btn--icon" />
		</button>
	);
};

export default BtnDarkMode;
