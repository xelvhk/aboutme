import "./styles/main.css";
import "./styles/App.css";
import "./styles/macos.css";

import {HashRouter as Router, Routes, Route} from "react-router-dom";
import Projects from "./pages/projects";
import Project from "./pages/project";
import Blog from "./components/blog/blog";
import AiStudio from "./pages/aiStudio";
import AdminPanel from "./components/admin/AdminPanel";
import MacDesktop from "./components/macos/MacDesktop";
import MacWindow from "./components/macos/MacWindow";
import { LanguageProvider } from "./data/translations";

import ScrollToTop from "./utils/scrollToTop"
import { useEffect, useRef, useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
	const [macBootDone, setMacBootDone] = useState(false);
	const [showBootLog, setShowBootLog] = useState(false);
	const bootDurationMs = showBootLog ? 3800 : 1600;
	const bootLogHoldMs = 350;
	const bootHoldTimerRef = useRef(null);
	const bootLogHideTimerRef = useRef(null);

	useEffect(() => {
		const bootTimer = setTimeout(() => {
			setMacBootDone(true);
		}, bootDurationMs);

		return () => clearTimeout(bootTimer);
	}, [bootDurationMs]);

	useEffect(() => {
		document.body.classList.add("macos-body");
		return () => document.body.classList.remove("macos-body");
	}, []);

	useEffect(() => {
		return () => {
			if (bootHoldTimerRef.current) clearTimeout(bootHoldTimerRef.current);
			if (bootLogHideTimerRef.current) clearTimeout(bootLogHideTimerRef.current);
		};
	}, []);

	const activateBootLog = () => {
		if (bootLogHideTimerRef.current) clearTimeout(bootLogHideTimerRef.current);
		setShowBootLog(true);
		bootLogHideTimerRef.current = setTimeout(() => setShowBootLog(false), 2200);
	};

	const startBootPress = () => {
		if (bootHoldTimerRef.current) clearTimeout(bootHoldTimerRef.current);
		if (bootLogHideTimerRef.current) clearTimeout(bootLogHideTimerRef.current);
		bootHoldTimerRef.current = setTimeout(() => {
			activateBootLog();
		}, bootLogHoldMs);
	};

	const endBootPress = () => {
		if (bootHoldTimerRef.current) {
			clearTimeout(bootHoldTimerRef.current);
			bootHoldTimerRef.current = null;
		}
	};

	return (
		<ErrorBoundary>
			<LanguageProvider>
				<div className="App macos-mode">
					<Router>
						<div className="App" id="scroll">
							<ScrollToTop />
							{!macBootDone && (
								<div className="mac-boot-screen" role="status" aria-live="polite">
									<div
										className="mac-boot-loader"
										aria-label="Loading"
										onClick={activateBootLog}
										onMouseDown={startBootPress}
										onMouseUp={endBootPress}
										onMouseLeave={endBootPress}
										onTouchStart={startBootPress}
										onTouchEnd={endBootPress}
									/>
									{showBootLog && (
										<div className="mac-boot-log">
											<div>[ OK ] Booting Astra Linux secure profile...</div>
											<div>[ OK ] Kernel modules verified (signed)</div>
											<div>[ OK ] AppArmor: policies loaded</div>
											<div>[ OK ] Local AI runtime sandbox ready</div>
											<div>[ OK ] xelvhk OS session initialized</div>
										</div>
									)}
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
						</div>
					</Router>
				</div>
			</LanguageProvider>
		</ErrorBoundary>
	);
}

export default App;
