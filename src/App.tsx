import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white selection:bg-google-blue selection:text-white">
        <NavBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Simple Footer */}
        <footer className="bg-gray-50 py-8 text-center text-on-surface-variant">
          <p className="text-sm">© {new Date().getFullYear()} Allan Khester M. Mesa</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
