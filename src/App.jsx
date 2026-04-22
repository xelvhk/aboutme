import "./styles/main.css";
import "./styles/App.css";

import {HashRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/navbar/navbar"
import Footer from "./components/footer/footer";
import Home from "./pages/home";
import Projects from "./pages/projects";
import Project from "./pages/project";
import Blog from "./components/blog/blog";
import AdminPanel from "./components/admin/AdminPanel";
import { LanguageProvider } from "./data/translations";

import ScrollToTop from "./utils/scrollToTop"
import { useEffect, useState } from 'react';
import Preloader from '../src/components/Pre';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
	const [load, updateLoad] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			updateLoad(false);
		}, 1200);

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, []);

		return (
		<ErrorBoundary>
			<LanguageProvider>
				<div className="App">
					<Router>
						<Preloader load={load} />
						<div className="App" id={load ? 'no-scroll' : 'scroll'}>
							<ScrollToTop />
							<Navbar />
							<Routes>
								<Route path="/" element={<Home />} />
								<Route path="/projects" element={<Projects />} />
								<Route path="/project/:id" element={<Project />} />
								<Route path="/blog" element={<Blog />} />
								<Route path="/admin" element={<AdminPanel />} />
							</Routes>
						</div>
						<Footer />
					</Router>
				</div>
			</LanguageProvider>
		</ErrorBoundary>
	);
}

export default App;
