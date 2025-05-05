import Mainpage from "./Pages/mainPage/mainPage";
import Usuarios from "./Pages/Usuarios/Usuarios";
import Homologacion from "./Pages/Homologaciones/Homologaciones";
import Configuracion from "./Pages/Configuracion/Configuracion";
import Solicitudes from "./Pages/Solicitudes/adminSolicitudes";
import MateriasEstudiante from "./Pages/Homologaciones/materiasEstudiantes";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <main className="App">
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/Solicitudes" element={<Solicitudes />} />
          <Route path="/Homologaciones" element={<Homologacion />} />
          <Route path="/Usuarios" element={<Usuarios />} />
          <Route path="/Configuracion" element={<Configuracion />} />
          <Route path="/materiasEstudiantes" element={<MateriasEstudiante />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
