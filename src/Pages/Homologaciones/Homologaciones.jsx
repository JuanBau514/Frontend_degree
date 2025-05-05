// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Homologacion() {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleArchivoSeleccionado = (event) => {
    setArchivoSeleccionado(event.target.files[0]);
  };

  const enviarArchivoAlServidor = async () => {
    try {
      const formData = new FormData();
      formData.append("archivo", archivoSeleccionado);

      const response = await axios.post("http://localhost:3000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Respuesta del servidor:", response.data);
      setMensaje(response.data.mensaje);
    } catch (error) {
      console.error("Error al enviar el archivo al servidor:", error);
      setMensaje("Error al procesar el archivo.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcf2e8] dark:bg-gray-900">
      <Navbar />

      <div className="w-full max-w-6xl mx-auto flex flex-row justify-between gap-6">
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-md shadow-md dark:bg-gray-900 dark:border-gray-800 m-1 w-[900px] h-[800px]">
          <h2 className="text-5xl font-bold text-gray-950 dark:text-gray-200">
            Sube el archivo HTML
          </h2>

          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Sube el archivo HTML a homologar ya sea con tu mouse o de forma
            manual usando el boton
          </p>

          {/* Modificado el botón para cargar manualmente */}
          <label
            htmlFor="file-upload"
            className="mt-4 cursor-pointer bg-indigo-500 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-indigo-600"
          >
            Sube el archivo manualmente
          </label>
          <input
            type="file"
            id="file-upload"
            accept=".html"
            className="hidden"
            onChange={handleArchivoSeleccionado}
          />

          <button
            className="mt-4 bg-green-400 text-black py-2 px-4 rounded-md transition duration-300 hover:bg-sky-500"
            onClick={enviarArchivoAlServidor}
          >
            Enviar archivo al servidor
          </button>

          <div className="mt-8 relative">
            <input
              accept=".html .pdf"
              className="w-full px-48 py-44 text-lg border border-gray-300 rounded-md shadow-sm placeholder-green-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
              <p className="text-2xl text-gray-500">Suelta el archivo aqui</p>
            </div>
          </div>
          <a
            className="mt-4 bg-green-400 text-black py-2 px-4 rounded-md transition duration-300 hover:bg-sky-500 "
            href="materiasEstudiantes"
          >
            Mostrar materias homologadas
            <Link to="./materiasEstudiantes.jsx"></Link>
          </a>
        </div>

        <div className="flex-1 mt-6 p-6 bg-white border border-gray-200 rounded-md shadow-md dark:bg-gray-800 dark:border-gray-700 m-4 w-[800px] h-[600px]">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Vista previa del archivo
          </h2>
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-gray-900 dark:text-gray-100">
              {archivoSeleccionado
                ? `Archivo seleccionado: ${archivoSeleccionado.name}`
                : "Ningún archivo seleccionado"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
