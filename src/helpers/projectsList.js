import project01 from "./../img/projects/01.jpg";
import project01Big from "./../img/projects/01-big.jpg";

import project02 from "./../img/projects/02.jpg";
import project02Big from "./../img/projects/02-big.jpg";

import project03 from "./../img/projects/03.jpg";
import project03Big from "./../img/projects/03-big.jpg";


const projects = [
	{
		title: 'Burgers restaurant site',
		skills: 'Angular, HTML, CSS',
		img: project01,
		imgBig: project01Big,
		gitHubLink: 'https://github.com/xelvhk/js-marvel',
		problem_en: 'Create a visually clear landing page for a food business with structured sections and responsive layout.',
		solution_en: 'Implemented a modular Angular frontend with reusable UI blocks and adaptive CSS.',
		result_en: 'Got a production-like single-page website that presents the menu and core business info clearly.',
		problem_ru: 'Создать понятный лендинг для фуд-проекта с логичной структурой блоков и адаптивной версткой.',
		solution_ru: 'Реализован модульный frontend на Angular с переиспользуемыми UI-блоками и адаптивными стилями.',
		result_ru: 'Получился цельный одностраничный сайт, который понятно показывает меню и ключевую информацию.',
		type: 'site',
	},
	{
		title: 'Farmgame site',
		img: project02,
		imgBig: project02Big,
		skills: 'HTML, CSS',
		gitHubLink: 'https://github.com/xelvhk/farmgame',
		problem_en: 'Build a themed promo page with clean visual hierarchy and basic responsiveness.',
		solution_en: 'Assembled semantic HTML structure and responsive CSS layout with custom visual styling.',
		result_en: 'Delivered a stable static website with clear sections and improved readability on different screens.',
		problem_ru: 'Собрать тематическую промо-страницу с чистой визуальной иерархией и базовой адаптивностью.',
		solution_ru: 'Сверстана семантичная HTML-структура и адаптивный CSS-лейаут с кастомным визуальным стилем.',
		result_ru: 'Получился стабильный статический сайт с понятными секциями и хорошей читаемостью на разных экранах.',
		type: 'site',
	},
	{
		title: 'Fashion store',
		img: project03,
		imgBig: project03Big,
		skills: 'React, HTML, CSS',
		gitHubLink: 'https://github.com/xelvhk/fashion_store_with_React',
		problem_en: 'Create a storefront UI that feels modern and supports component-driven development.',
		solution_en: 'Built the interface with React components, reusable layouts, and clean style composition.',
		result_en: 'Produced a maintainable frontend baseline for e-commerce scenarios with improved UX consistency.',
		problem_ru: 'Сделать UI витрины, который выглядит современно и поддерживает компонентный подход разработки.',
		solution_ru: 'Интерфейс реализован на React-компонентах с переиспользуемыми лейаутами и чистой структурой стилей.',
		result_ru: 'Сформирована поддерживаемая frontend-база для e-commerce сценариев с более цельным UX.',
		type: 'site',
	},

];

export { projects };
