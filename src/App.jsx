import "./styles/main.css";
import "./styles/App.css";
import "./styles/macos.css";

import {HashRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/navbar/navbar"
import Footer from "./components/footer/footer";
import Home from "./pages/home";
import Projects from "./pages/projects";
import Project from "./pages/project";
import Blog from "./components/blog/blog";
import AiStudio from "./pages/aiStudio";
import AdminPanel from "./components/admin/AdminPanel";
import MacDesktop from "./components/macos/MacDesktop";
import MacWindow from "./components/macos/MacWindow";
import { LanguageProvider } from "./data/translations";

import ScrollToTop from "./utils/scrollToTop"
import { useEffect, useState } from 'react';
import Preloader from '../src/components/Pre';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
	const [load, updateLoad] = useState(true);
	const [macBootDone, setMacBootDone] = useState(false);
	const isMacUi = process.env.REACT_APP_UI_MODE === "macos";

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

	useEffect(() => {
		if (!isMacUi) {
			setMacBootDone(true);
			return undefined;
		}

		const bootTimer = setTimeout(() => {
			setMacBootDone(true);
		}, 1600);

		return () => clearTimeout(bootTimer);
	}, [isMacUi]);

	useEffect(() => {
		document.body.classList.toggle("macos-body", isMacUi);
		return () => document.body.classList.remove("macos-body");
	}, [isMacUi]);

		return (
		<ErrorBoundary>
			<LanguageProvider>
				<div className={`App ${isMacUi ? "macos-mode" : ""}`}>
					<Router>
						{!isMacUi && <Preloader load={load} />}
						<div className="App" id={load ? 'no-scroll' : 'scroll'}>
							<ScrollToTop />
							{isMacUi ? (
								<>
									{!macBootDone && (
										<div className="mac-boot-screen" role="status" aria-live="polite">
											<div className="mac-boot-loader" aria-label="Loading" />
										</div>
									)}
									<Routes>
										<Route path="/" element={<MacDesktop />} />
										<Route path="/projects" element={<MacWindow title="Projects"><Projects /></MacWindow>} />
										<Route path="/ai-studio" element={<MacWindow title="AI Studio"><AiStudio /></MacWindow>} />
										<Route path="/project/:id" element={<MacWindow title="Project"><Project /></MacWindow>} />
										<Route path="/blog" element={<MacWindow title="Blog"><Blog /></MacWindow>} />
										<Route path="/admin" element={<MacWindow title="Admin"><AdminPanel /></MacWindow>} />
									</Routes>
								</>
							) : (
								<>
									<Navbar />
									<Routes>
										<Route path="/" element={<Home />} />
										<Route path="/projects" element={<Projects />} />
										<Route path="/ai-studio" element={<AiStudio />} />
										<Route path="/project/:id" element={<Project />} />
										<Route path="/blog" element={<Blog />} />
										<Route path="/admin" element={<AdminPanel />} />
									</Routes>
								</>
							)}
						</div>
						{!isMacUi && <Footer />}
					</Router>
				</div>
			</LanguageProvider>
		</ErrorBoundary>
	);
}

export default App;
