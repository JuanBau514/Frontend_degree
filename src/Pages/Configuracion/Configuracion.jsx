import Navbar from "../../Components/Navbar";
import { useState } from "react";

export default function Configuracion() {
  // Lista de planes de estudio para seleccionar
  const planes = [
    "Tecnología en Sistematización de Datos",
    "Ingeniería en Telemática",
    "Plan Futuro"
  ];

  const planToVarStatus = {
    "Tecnología en Sistematización de Datos": "0",
    "Ingeniería en Telemática": "1",
    "Plan Futuro": "2",
  };

  const [selectedPlan, setSelectedPlan] = useState(planes[0]);
  const [pendingChanges, setPendingChanges] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Función para manejar el cambio de plan seleccionado
  const handleSelectChange = (event) => {
    const newPlan = event.target.value;
    setSelectedPlan(newPlan);
    setPendingChanges(true);
  };

  const handleConfirmChanges = async () => {
    const VARSTATUS = planToVarStatus[selectedPlan];

    try {
      const response = await fetch('http://localhost:3000/api/set-varstatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ VARSTATUS })
      });

      // Verifica primero si la respuesta tiene contenido
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error('Respuesta no válida del servidor');
      }

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }

      showNotification(data.message || "Configuración actualizada correctamente", "success");
      setPendingChanges(false);

    } catch (error) {
      console.error('Error:', error);
      showNotification(
          error.message || "Error al comunicarse con el servidor",
          "error"
      );
    }
  };

  // Mostrar notificación
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
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
            {/* Notificación */}
            {notification.show && (
                <div className={`mb-4 p-4 rounded-md ${notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {notification.message}
                </div>
            )}

            {/* Panel de configuración */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuración de Homologaciones</h2>

              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <label className="text-lg font-medium text-gray-700">Comparar Planes de Estudio:</label>
                  <select
                      value={selectedPlan}
                      onChange={handleSelectChange}
                      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow max-w-md"
                  >
                    {planes.map((plan, index) => (
                        <option key={index} value={plan}>{plan}</option>
                    ))}
                  </select>
                </div>

                {pendingChanges && (
                    <div className="flex justify-end">
                      <button
                          onClick={handleConfirmChanges}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
                      >
                        Confirmar Cambios
                      </button>
                    </div>
                )}
              </div>
            </div>

            {/* Detalles del plan seleccionado */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{selectedPlan}</h3>

              <div className="space-y-3 text-gray-700">
                {selectedPlan === "Tecnología en Sistematización de Datos" ? (
                    <>
                      <div className="flex flex-col md:flex-row">
                        <span className="font-medium md:w-1/4">Plan de estudios:</span>
                        <span>239</span>
                      </div>
                      <div className="flex flex-col md:flex-row">
                        <span className="font-medium md:w-1/4">Email:</span>
                        <a className="text-blue-600 hover:underline" href="mailto:tecsistematizaciondatos@udistrital.edu.co">
                          tecsistematizaciondatos@udistrital.edu.co
                        </a>
                      </div>
                      <div className="flex flex-col md:flex-row">
                        <span className="font-medium md:w-1/4">Coordinación:</span>
                        <span>Martes 3:00 PM - 5:00 PM y Jueves 5:00 PM - 7:00 PM</span>
                      </div>
                      <div className="flex flex-col md:flex-row">
                        <span className="font-medium md:w-1/4">Profesional de Apoyo:</span>
                        <span>Lunes 10:00 AM - 12:00 PM</span>
                      </div>
                    </>
                ) : selectedPlan === "Ingeniería en Telemática" ? (
                    <>
                      <div className="flex flex-col md:flex-row">
                        <span className="font-medium md:w-1/4">Plan de estudios:</span>
                        <span>239</span>
                      </div>
                      <div className="flex flex-col md:flex-row">
                        <span className="font-medium md:w-1/4">Email:</span>
                        <a className="text-blue-600 hover:underline" href="mailto:ingtelematica@udistrital.edu.co">
                          ingtelematica@udistrital.edu.co
                        </a>
                      </div>
                      <div className="flex flex-col md:flex-row">
                        <span className="font-medium md:w-1/4">Horario de atención:</span>
                        <span>Lunes a viernes de 8:00 AM a 5:00 PM</span>
                      </div>
                    </>
                ) : (
                    <div className="text-gray-500 italic">
                      Información del plan futuro no disponible actualmente
                    </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}