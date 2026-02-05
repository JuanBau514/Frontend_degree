import React, { useState, useEffect } from "react";
import "./styleEmploye.css";
import Navbar from "../../Components/Navbar";
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

export default function Usuarios() {
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    cargarEstudiantes();
  }, []);

    const descargarReporte = async () => {
    const opcion = window.confirm("¿En qué formato deseas descargar el reporte?\nPresiona OK para CSV o Cancelar para Excel.");
    
    if (opcion) {
      // Descargar como CSV
      const csv = Papa.unparse(estudiantes);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, "reporte_estudiantes.csv");
    } else {
      // Descargar como Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Estudiantes');
      
      // Añadir encabezados error with my co
      worksheet.addRow(['Nombre', 'Documento', 'Código', 'Email', 'Semestre', 'Proyecto Curricular', 'Créditos']);
      
      // Añadir datos
      estudiantes.forEach(estudiante => {
        worksheet.addRow([
          estudiante.nombre,
          estudiante.documento,
          estudiante.codigo,
          estudiante.email,
          estudiante.semestre,
          estudiante.proyectoCurricular,
          estudiante.creditos
        ]);
      });

      // Generar archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'reporte_estudiantes.xlsx');
    }
  };

  const cargarEstudiantes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/estudiantes');
      if (!response.ok) throw new Error('Error al obtener estudiantes');
      const estudiantes = await response.json();
      setEstudiantes(estudiantes);
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
    }
  };

  const eliminarRegistro = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/estudiantes/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        cargarEstudiantes(); // Recargar la lista
      } else {
        alert(data.error || 'Error al eliminar el registro');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al conectar con el servidor');
    }
  };


  return (
    <div>
      <Navbar></Navbar>
      <section className="empleados" id="empleados">
        <div className="tituloEmpleados">
          <span>Estudiantes</span>
          <h2>
            Información de los estudiantes que han solicitado Homologación
          </h2>
        </div>

        <div className="botones">
          <button className="boton">
            <a href="/Homologaciones" className="navbar__menu--link">
              Agregar Estudiantes
            </a>
          </button>
          <button className="boton" onClick={descargarReporte} >Descargar Reporte</button>
        </div>

        <div className="contenedorEmpleados">
          {estudiantes.map((estudiante, index) => (
            <div className="cajaEmpleado" key={index}>
              <div className="imgEmpleado">
                <img
                  src="/src/assets/avatar.png"
                  width={800}
                  height={400}
                  alt="Foto"
                />
              </div>
              <h3>{estudiante.nombre}</h3>
              <p>Código: {estudiante.codigo}</p>
              <p>Documento: {estudiante.documento}</p>
              <p>Email: {estudiante.email}</p>
              <p>Semestre: {estudiante.semestre}</p>
              <p>Proyecto curricular: {estudiante.proyecto_curricular}</p>
              <p>Créditos: {estudiante.creditos}</p>
              <div className="botonCard">
                <button
                    className="boton eliminar"
                    onClick={() => eliminarRegistro(estudiante.id)}
                >
                  Eliminar Registro
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}