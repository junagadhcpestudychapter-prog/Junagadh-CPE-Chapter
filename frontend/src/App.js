import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Committee from "./pages/Committee";
import Gallery from "./pages/Gallery";
import Noticeboard from "./pages/Noticeboard";
import Newsletter from "./pages/Newsletter";
import Contact from "./pages/Contact";
import Library from "./pages/Library";
import Directory from "./pages/Directory";
import Resources from "./pages/Resources";
import Membership from "./pages/Membership";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/noticeboard" element={<Noticeboard />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/library" element={<Library />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
