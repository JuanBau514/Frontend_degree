import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from "../../assets/Escudo_UD.png";

// Función para ordenar las materias por semestre
const ordenarMateriasPorSemestre = (materias) => {
  const semestreOrden = {
    'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10
  };

  const materiasPorSemestre = {};

  materias.forEach(materia => {
    const semestre = obtenerSemestre(materia.codMateria);
    if (!materiasPorSemestre[semestre]) {
      materiasPorSemestre[semestre] = [];
    }
    materiasPorSemestre[semestre].push(materia);
  });

  return Object.entries(materiasPorSemestre)
    .sort(([semestreA], [semestreB]) => semestreOrden[semestreA] - semestreOrden[semestreB])
    .reduce((acc, [semestre, materias]) => {
      acc[semestre] = materias;
      return acc;
    }, {});
};

// Función auxiliar para obtener el semestre basado en el código de la materia
const obtenerSemestre = (codMateria) => {
  const semestreMap = {
    '1': 'I', '4': 'I', '9': 'I', '12': 'I', '1054': 'I', '1507': 'I', '1508': 'I',
    '3': 'II', '7': 'II', '1056': 'II', '1072': 'II', '1082': 'II', '1513': 'II', '1514': 'II', 
    '13': 'III', '1060': 'III', '1518': 'III', '1519': 'III', '1503': 'III', '1509': 'III', '9901': 'III',
    '1075': 'IV', '1524': 'IV', '1526': 'IV', '1512': 'IV', '1515': 'IV', '1511':'IV', '1510':'IV', '1138':'IV', '9902': 'IV',
    '1535':'V', '1516': 'V', '1531': 'V', '1533': 'V', '1536': 'V', '1537': 'V', '7202': 'V', '7203': 'V',
    '9903':'VI', '1541': 'VI', '7204': 'VI', '1542': 'VI', '7205': 'VI', '1446': 'VI', '1532': 'VI', '1539': 'VI',
    '88':'PEOPEDÉUTICO', '1525':'PEOPEDÉUTICO', '1538':'PEOPEDÉUTICO', 
  };
  return semestreMap[codMateria] || 'Otro';
};

export default function MateriasEstudiante() {

  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materiasPorSemestre, setMateriasPorSemestre] = useState({});

  

  useEffect(() => {
    async function fetchDatos() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/datos-estudiante"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDatos(data);
        const materiasOrdenadas = ordenarMateriasPorSemestre([...data.materiasAprobadas, ...data.materiasPendientes]);
        setMateriasPorSemestre(materiasOrdenadas);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setError("No se pudieron cargar los datos. Por favor, comuníquese con el desarrollador.");
      } finally {
        setLoading(false);
      }
    }

    fetchDatos();
  }, []);

  const generarPDF = () => {
    if (!datos) {
      console.log('No hay datos disponibles');
      return;
    }

    try {
      const doc = new jsPDF();
      let yPos = 20;

      // Agregar logo
      doc.addImage(logo, 'PNG', 10, 10, 20, 20);

      // Estilos
      const titleStyle = { fontSize: 16, fontStyle: 'bold' };
      const subtitleStyle = { fontSize: 14, fontStyle: 'bold' };
      const textStyle = { fontSize: 10 };
      const headerStyle = { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' };

      // Encabezado del documento
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(titleStyle.fontSize);
      doc.text('UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS', 110, yPos, { align: 'center' });
      yPos += 8;
      doc.setFontSize(subtitleStyle.fontSize);
      doc.text('SECRETARÍA ACADÉMICA', 105, yPos, { align: 'center' });
      yPos += 8;
      doc.text('CERTIFICADO DE NOTAS INTERNO', 105, yPos, { align: 'center' });
      yPos += 15;

      // Información del estudiante
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(textStyle.fontSize);
      doc.text(`NOMBRE: ${datos.estudiante.nombre}`, 20, yPos);
      doc.text(`IDENTIFICACIÓN: ${datos.estudiante.identificacion}`, 120, yPos);
      yPos += 8;
      doc.text(`CÓDIGO: ${datos.estudiante.codigo}`, 20, yPos);
      const porcentajeAvance = (datos.creditosAprobados / 100 * 100).toFixed(2); // Asumiendo que el total de créditos es 100
      doc.text(`PORCENTAJE DE AVANCE: ${porcentajeAvance}%`, 120, yPos);
      yPos += 8;
      doc.text(`RENOVACIONES: ${datos.estudiante.renovaciones}`, 120, yPos);
      yPos += 8;
      const creditosFaltantes = 100 - datos.creditosAprobados; // Asumiendo que el total de créditos es 100
      doc.text(`CRÉDITOS APROBADOS: ${datos.creditosAprobados}`, 20, yPos);
      doc.text(`CRÉDITOS FALTANTES: ${creditosFaltantes}`, 120, yPos);
      yPos += 15;

      // Materias Aprobadas por Semestre
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(subtitleStyle.fontSize);
      doc.text('MATERIAS APROBADAS POR SEMESTRE', 20, yPos);
      yPos += 10;

      const materiasPorSemestre = datos.materiasAprobadas.reduce((acc, materia) => {
        const semestre = obtenerSemestre(materia.codMateria);
        if (!acc[semestre]) {
          acc[semestre] = [];
        }
        acc[semestre].push(materia);
        return acc;
      }, {});

      Object.entries(materiasPorSemestre).forEach(([semestre, materias]) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(textStyle.fontSize);
        doc.text(`Semestre ${semestre}`, 20, yPos);
        yPos += 5;

        const headers = ['CÓDIGO', 'NOMBRE', 'NOTA', 'CRÉDITOS', 'CLASIFICACIÓN'];
        const data = materias.map(m => [m.codMateria, m.nombreMateria, m.nota.toFixed(1), m.creditos, m.clasificacion]);

        doc.autoTable({
          startY: yPos,
          head: [headers],
          body: data,
          theme: 'striped',
          headStyles: headerStyle,
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 20 }, 3: { cellWidth: 20 }, 4: { cellWidth: 30 } },
        });

        yPos = doc.lastAutoTable.finalY + 10;
      });

      // Materias Pendientes
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(subtitleStyle.fontSize);
      doc.text('MATERIAS PENDIENTES', 20, yPos);
      yPos += 10;

      const pendientesHeaders = ['CÓDIGO', 'NOMBRE', 'CRÉDITOS', 'CLASIFICACIÓN'];
      const pendientesData = datos.materiasPendientes.map(m => [m.codMateria, m.nombreMateria, m.creditos, m.clasificacion]);

      doc.autoTable({
        startY: yPos,
        head: [pendientesHeaders],
        body: pendientesData,
        theme: 'striped',
        headStyles: headerStyle,
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 20 }, 3: { cellWidth: 30 } },
      });

      // Pie de página
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      }

      // Guardar el PDF
      doc.save('reporte_estudiante.pdf');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };


  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!datos) return <div className="text-center">No hay datos disponibles</div>;

    const creditosPorTipo = datos.materiasAprobadas.reduce((acc, materia) => {
    acc[materia.clasificacion] = (acc[materia.clasificacion] || 0) + materia.creditos;
    return acc;
  }, {});

  // Verifica si hay un error con los créditos de tipo "EI"
  const totalCreditosEI = creditosPorTipo['EI'] || 0;
  const mensajeError = totalCreditosEI === 15 || totalCreditosEI === 18

  return (
    <div className="bg-[#fcf2e8] min-h-screen w-full py-6 space-y-6">
      <Navbar />
      <div className="container px-4 lg:px-6 xl:max-w-6xl xl:mx-auto">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-6xl">
            {datos.estudiante.proyectoCurricular}
          </h1>
          <div className="flex justify-between items-center">
          <p className="text-gray-500 md:text-base/relaxed dark:text-gray-200">
            Plan de estudio 239:
          </p>
          <button onClick={generarPDF} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Descargar reporte del estudiante
          </button>
        </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-4">
            Datos del Estudiante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Nombre" value={datos.estudiante.nombre} />
            <InfoItem label="Identificación" value={datos.estudiante.identificacion} />
            <InfoItem label="Código" value={datos.estudiante.codigo} />
            <InfoItem label="Correo Electrónico" value={datos.estudiante.correoElectronico} />
            <InfoItem label="Renovaciones" value={datos.estudiante.renovaciones} />
            <InfoItem label="Créditos aprobados" value={datos.creditosAprobados} />
          </div>
        </div>

         <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-4">
            Materias por Semestre
          </h2>
          {Object.entries(materiasPorSemestre).map(([semestre, materias]) => (
            <div key={semestre} className="mb-8">
              <h3 className="text-xl font-semibold mb-2">Semestre {semestre}</h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Nombre</th>
                      <th className="border p-2">Código</th>
                      <th className="border p-2">Créditos</th>
                      <th className="border p-2">Nota</th>
                      <th className="border p-2">Clasificación</th>
                      <th className="border p-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materias.map((materia, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                        <td className="border p-2">{materia.nombreMateria}</td>
                        <td className="border p-2">{materia.codMateria}</td>
                        <td className="border p-2">{materia.creditos || 'N/A'}</td>
                        <td className="border p-2">{materia.nota || 'N/A'}</td>
                        <td className="border p-2">{materia.clasificacion || 'N/A'}</td>
                        <td className="border p-2">{materia.nota ? 'Aprobada' : 'Pendiente'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

 <div className="mt-8">
      <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-4">
        Resumen de Créditos
      </h2>
      <div className="bg-white shadow-md rounded-md p-4">
        <h3 className="text-lg font-semibold mb-2">Créditos Vistos</h3>
        <p className="text-gray-600">Total de Créditos: {datos.creditosAprobados}</p>

        <h4 className="mt-4 font-semibold">Créditos por Tipo:</h4>
        <ul className="list-disc list-inside">
          {Object.entries(creditosPorTipo).map(([tipo, creditos]) => (
            <li key={tipo}>{creditos} Créditos - Tipo: {tipo}</li>
          ))}
        </ul>

        {mensajeError && (
          <p className="text-red-500 mt-2">
            Error: Debe contactar con la secretaría del proyecto curricular.
          </p>
        )}
      </div>
    </div>      

        <div className="mt-8">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-4">
            Resumen de Créditos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CreditSummaryCard title="Créditos Aprobados" value={datos.creditosAprobados} />
            <CreditSummaryCard title="Créditos Pendientes" value={datos.creditosAprobados ? 100 - datos.creditosAprobados : 'N/A'} />
            <CreditSummaryCard title="Porcentaje de Avance" value={`${datos.creditosAprobados}%`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <p className="text-gray-700">
      <span className="font-semibold">{label}:</span> {value}
    </p>
  );
}

function CreditSummaryCard({ title, value }) {
  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

