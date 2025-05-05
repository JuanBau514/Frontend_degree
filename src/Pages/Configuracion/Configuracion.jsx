import Navbar from "../../Components/Navbar";
import { useState } from "react";

export default function Configuracion() {
  // Lista de planes de estudio para seleccionar
  const planes = [
    "Tecnología en Sistematización de Datos",
    "Ingeniería en Telemática",
    "Plan Futuro"
  ];

  const [selectedPlan, setSelectedPlan] = useState(planes[0]);

  // Función para manejar el cambio de plan
  const handleSelectChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6 bg-[#fcf2e8]">
        <a className="flex items-center gap-2 text-lg font-semibold sm:text-base mr-4" href="#">
          <Navbar />
          <span className="sr-only">Settings Dashboard</span>
        </a>
      </header>

      <main className="flex min-h-[calc(100vh-_theme(spacing.16))] bg-[#fcf2e8] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
        <div className="max-w-6xl w-full mx-auto">
          <div className="bg-white p-4 rounded shadow-md mb-6">
            <h2 className="text-xl font-semibold">Configuración de Homologaciones</h2>
            <div className="mt-4">
              <span className="text-lg font-medium">Comparar Planes de Estudio</span>
              <select
                value={selectedPlan}
                onChange={handleSelectChange}
                className="ml-4 border rounded px-2 py-1"
              >
                {planes.map((plan, index) => (
                  <option key={index} value={plan}>{plan}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mostrar contenido del plan seleccionado */}
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-2">{selectedPlan}</h3>
            <p>
              {selectedPlan === "Tecnología en Sistematización de Datos" ? (
                <>
                  <strong>Tecnología en Sistematización de Datos</strong> <br />
                  <span>Plan de estudios: 239</span> <br />
                  <span>Email: </span><a className="text-red-500" href="mailto:tecsistematizaciondatos@udistrital.edu.co">tecsistematizaciondatos@udistrital.edu.co</a> <br />
                  <span>Coordinación:</span> Martes 3:00 PM - 5:00 PM y Jueves 5:00 PM - 7:00 PM <br />
                  <span>Profesional de Apoyo:</span> Lunes 10:00 AM - 12:00 PM
                </>
              ) : selectedPlan === "Ingeniería en Telemática" ? (
                <>
                  <strong>Ingeniería en Telemática</strong> <br />
                  <span>Plan de estudios: 239</span> <br />
                  <span>Email: </span><a className="text-red-500" href="mailto:ingtelematica@udistrital.edu.co">ingtelematica@udistrital.edu.co</a> <br />
                  Lunes a viernes de 8:00 AM a 5:00 PM
                </>
              ) : (
                <span>Descripción del plan futuro...</span>
              )}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
