import { Link, Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./Home";
import Stars from "./Stars";
import Constellations from "./Constellations";
import History from "./History";
import NotFound from "./NotFound";
import "./App.css"; 

function App() {
    return (
        <>
            <div className="app-wrapper">
            <Router>
                <nav style={{ marginBottom: 20 }}>
                    <Link to="/" style={{ marginRight: 10 }}>Strona główna</Link>
                    <Link to="/stars" style={{ marginRight: 10 }}>Gwiazdy</Link>
                    <Link to="/constellations" style={{ marginRight: 10 }}>Konstelacje</Link>
                    <Link to="/history">Historia nieba</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/stars" element={<Stars />} />
                    <Route path="/constellations" element={<Constellations />} />
                    <Route path="/history" element={<History />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
            
                <footer className="sticky-footer">
                Autorzy: Leon Stolecki, Kacper Dombrowicz, Patryk Przydanek &copy; {new Date().getFullYear()}
                </footer>
            </div>
        </>
    );
}

export default App;
