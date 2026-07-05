import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import { personalInfo } from './data/resumeData';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="bg-surface-container-lowest border-t border-outline-variant w-full py-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-base">
            <span className="font-label-lg text-label-lg font-bold text-on-surface">AK.</span>
            <span className="font-body-md text-body-md text-on-surface-variant text-center md:text-left">
              © {new Date().getFullYear()} Allan Khester M. Mesa. AI Engineer and AI Automation Specialist.
            </span>
            <div className="flex gap-4">
              <a className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm" href={`https://${personalInfo?.github || 'github.com'}`}>GitHub</a>
              <a className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm" href={`https://${personalInfo?.linkedin || 'linkedin.com'}`}>LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
