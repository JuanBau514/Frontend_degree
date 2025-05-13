import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
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
  // Si el código está vacío, retornar 'Otro'
  if (!codMateria || codMateria.trim() === '') return 'Otro';

  // Mapeo completo de códigos a semestres
  const semestreMap = {
    // Semestre I (Tecnología)
    '1': 'I', '4': 'I', '9': 'I', '12': 'I', '1054': 'I',
    '1507': 'I', '1508': 'I',

    // Semestre II (Tecnología)
    '3': 'II', '7': 'II', '1056': 'II', '1072': 'II',
    '1082': 'II', '1513': 'II', '1514': 'II',

    // Semestre III (Tecnología)
    '13': 'III', '1060': 'III', '1518': 'III', '1519': 'III',
    '1503': 'III', '1509': 'III', '9901': 'III',

    // Semestre IV (Tecnología)
    '1075': 'IV', '1524': 'IV', '1526': 'IV', '1512': 'IV',
    '1515': 'IV', '1511': 'IV', '1510': 'IV', '1138': 'IV', '9902': 'IV',

    // Semestre V (Tecnología)
    '1535': 'V', '1516': 'V', '1531': 'V', '1533': 'V',
    '1536': 'V', '1537': 'V', '7202': 'V', '7203': 'V',

    // Semestre VI (Tecnología)
    '9903': 'VI', '1541': 'VI', '7204': 'VI', '1542': 'VI',
    '7205': 'VI', '1446': 'VI', '1532': 'VI', '1539': 'VI',

    // Categorías especiales (Tecnología)
    '88': 'PEOPEDÉUTICO',
    '1525': 'PEOPEDÉUTICO',
    '1538': 'PEOPEDÉUTICO',

    // Semestre VII (Ingeniería)
    '16': 'VII', '1619': 'VII', '1808': 'VII', '7208': 'VII', '7209': 'VII',

    // Semestre VIII (Ingeniería)
    '1428': 'VIII', '7210': 'VIII', '7211': 'VIII', '7212': 'VIII', '7213': 'VIII',

    // Semestre IX (Ingeniería)
    '7219': 'IX', '7220': 'IX', '7221': 'IX', '7222': 'IX', '1670': 'IX',
    '7214': 'IX', '7215': 'IX', '7216': 'IX',

    // Semestre X (Ingeniería)
    '7223': 'X', '7224': 'X', '7228': 'X', '7225': 'X', '7226': 'X',
    '7229': 'X', '1831': 'X', '7217': 'X',

    // Materias adicionales que aparecen en el JSON
    '1540': 'VI', // Globalización
    '7206': 'VI', // Regulación para telecomunicaciones
  };

  // Buscar el código en el mapa
  const semestre = semestreMap[codMateria];

  // Si no se encuentra, verificar si es un código de 4 dígitos que empieza con 15 (tecnología)
  if (!semestre && codMateria.length === 4 && codMateria.startsWith('15')) {
    const tercerDigito = codMateria[2];
    // Asignar semestre basado en el tercer dígito para códigos 15XX
    const semestrePorTercerDigito = {
      '0': 'I', '1': 'II', '2': 'III', '3': 'IV',
      '4': 'V', '5': 'VI', '6': 'VII', '7': 'VIII',
      '8': 'IX', '9': 'X'
    };
    return semestrePorTercerDigito[tercerDigito] || 'Otro';
  }

  // Si no se encuentra, verificar si es un código de 4 dígitos que empieza con 72 (ingeniería)
  if (!semestre && codMateria.length === 4 && codMateria.startsWith('72')) {
    const tercerDigito = codMateria[2];
    // Asignar semestre basado en el tercer dígito para códigos 72XX
    const semestrePorTercerDigito = {
      '0': 'VII', '1': 'VIII', '2': 'IX', '3': 'X'
    };
    return semestrePorTercerDigito[tercerDigito] || 'Otro';
  }

  return semestre || 'Otro';
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
      // Crear un elemento contenedor para el PDF
      const container = document.createElement('div');
      container.style.padding = '20px';
      container.style.fontFamily = 'Helvetica, Arial, sans-serif';

      // Encabezado con logo
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '20px';

      // Agregar logo
      const logoImg = document.createElement('img');
      logoImg.src = logo;
      logoImg.style.width = '60px';
      logoImg.style.display = 'block';
      logoImg.style.margin = '0 auto 10px auto';
      header.appendChild(logoImg);

      // Títulos
      const title = document.createElement('h1');
      title.textContent = 'UNIVERSIDAD DISTRITAL FRANCISCO JOSÉ DE CALDAS';
      title.style.fontSize = '16px';
      title.style.fontWeight = 'bold';
      title.style.margin = '5px 0';
      header.appendChild(title);

      const subtitle1 = document.createElement('h2');
      subtitle1.textContent = 'SECRETARÍA ACADÉMICA';
      subtitle1.style.fontSize = '14px';
      subtitle1.style.fontWeight = 'bold';
      subtitle1.style.margin = '5px 0';
      header.appendChild(subtitle1);

      const subtitle2 = document.createElement('h2');
      subtitle2.textContent = 'CERTIFICADO DE NOTAS INTERNO';
      subtitle2.style.fontSize = '14px';
      subtitle2.style.fontWeight = 'bold';
      subtitle2.style.margin = '5px 0';
      header.appendChild(subtitle2);

      container.appendChild(header);

      // Información del estudiante
      const infoEstudiante = document.createElement('div');
      infoEstudiante.style.marginBottom = '20px';
      infoEstudiante.style.fontSize = '10px';

      // Crear una tabla para la información del estudiante (estructura en 2 columnas)
      const tablaInfo = document.createElement('table');
      tablaInfo.style.width = '100%';
      tablaInfo.style.borderCollapse = 'collapse';

      // Primera fila
      const row1 = document.createElement('tr');
      const cell1_1 = document.createElement('td');
      cell1_1.textContent = `NOMBRE: ${datos.estudiante.nombre}`;
      cell1_1.style.textAlign = 'left';
      cell1_1.style.width = '50%';

      const cell1_2 = document.createElement('td');
      cell1_2.textContent = `IDENTIFICACIÓN: ${datos.estudiante.identificacion}`;
      cell1_2.style.textAlign = 'left';
      cell1_2.style.width = '50%';

      row1.appendChild(cell1_1);
      row1.appendChild(cell1_2);
      tablaInfo.appendChild(row1);

      // Segunda fila
      const row2 = document.createElement('tr');
      const cell2_1 = document.createElement('td');
      cell2_1.textContent = `CÓDIGO: ${datos.estudiante.codigo}`;
      cell2_1.style.textAlign = 'left';

      const cell2_2 = document.createElement('td');
      const porcentajeAvance = (datos.creditosAprobados / 100 * 100).toFixed(2);
      cell2_2.textContent = `PORCENTAJE DE AVANCE: ${porcentajeAvance}%`;
      cell2_2.style.textAlign = 'left';

      row2.appendChild(cell2_1);
      row2.appendChild(cell2_2);
      tablaInfo.appendChild(row2);

      // Tercera fila
      const row3 = document.createElement('tr');
      const cell3_1 = document.createElement('td');
      cell3_1.textContent = `CRÉDITOS APROBADOS: ${datos.creditosAprobados}`;
      cell3_1.style.textAlign = 'left';

      const cell3_2 = document.createElement('td');
      cell3_2.textContent = `RENOVACIONES: ${datos.estudiante.renovaciones}`;
      cell3_2.style.textAlign = 'left';

      row3.appendChild(cell3_1);
      row3.appendChild(cell3_2);
      tablaInfo.appendChild(row3);

      // Cuarta fila
      const row4 = document.createElement('tr');
      const cell4_1 = document.createElement('td');
      const creditosFaltantes = 100 - datos.creditosAprobados;
      cell4_1.textContent = `CRÉDITOS FALTANTES: ${creditosFaltantes}`;
      cell4_1.style.textAlign = 'left';

      row4.appendChild(cell4_1);
      tablaInfo.appendChild(row4);

      infoEstudiante.appendChild(tablaInfo);
      container.appendChild(infoEstudiante);

      // Materias Aprobadas por Semestre
      const materiasAprobadas = document.createElement('div');
      materiasAprobadas.style.marginBottom = '20px';

      const tituloMateriasAprobadas = document.createElement('h3');
      tituloMateriasAprobadas.textContent = 'MATERIAS APROBADAS POR SEMESTRE';
      tituloMateriasAprobadas.style.fontSize = '14px';
      tituloMateriasAprobadas.style.fontWeight = 'bold';
      tituloMateriasAprobadas.style.margin = '10px 0';
      materiasAprobadas.appendChild(tituloMateriasAprobadas);

      // Agrupar materias por semestre
      const materiasPorSemestre = datos.materiasAprobadas.reduce((acc, materia) => {
        const semestre = obtenerSemestre(materia.codMateria);
        if (!acc[semestre]) {
          acc[semestre] = [];
        }
        acc[semestre].push(materia);
        return acc;
      }, {});

      // Crear tablas para cada semestre
      Object.entries(materiasPorSemestre).forEach(([semestre, materias]) => {
        const tituloSemestre = document.createElement('h4');
        tituloSemestre.textContent = `Semestre ${semestre}`;
        tituloSemestre.style.fontSize = '12px';
        tituloSemestre.style.fontWeight = 'bold';
        tituloSemestre.style.margin = '8px 0';
        materiasAprobadas.appendChild(tituloSemestre);

        // Crear tabla para las materias del semestre
        const tabla = document.createElement('table');
        tabla.style.width = '100%';
        tabla.style.borderCollapse = 'collapse';
        tabla.style.marginBottom = '15px';
        tabla.style.fontSize = '9px';

        // Encabezado de la tabla
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.style.backgroundColor = '#2980b9';
        headerRow.style.color = 'white';

        const headers = ['CÓDIGO', 'NOMBRE', 'NOTA', 'CRÉDITOS', 'CLASIFICACIÓN'];
        headers.forEach(text => {
          const th = document.createElement('th');
          th.textContent = text;
          th.style.padding = '5px';
          th.style.textAlign = 'left';
          headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        tabla.appendChild(thead);

        // Cuerpo de la tabla
        const tbody = document.createElement('tbody');
        materias.forEach((materia, index) => {
          const row = document.createElement('tr');
          row.style.backgroundColor = index % 2 === 0 ? '#f2f2f2' : 'white';

          const data = [
            materia.codMateria,
            materia.nombreMateria,
            materia.nota.toFixed(1),
            materia.creditos,
            materia.clasificacion
          ];

          data.forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            td.style.padding = '5px';
            td.style.borderBottom = '1px solid #ddd';
            row.appendChild(td);
          });

          tbody.appendChild(row);
        });

        tabla.appendChild(tbody);
        materiasAprobadas.appendChild(tabla);
      });

      container.appendChild(materiasAprobadas);

      // Materias Pendientes
      const materiasPendientes = document.createElement('div');
      materiasPendientes.style.marginBottom = '20px';

      const tituloMateriasPendientes = document.createElement('h3');
      tituloMateriasPendientes.textContent = 'MATERIAS PENDIENTES';
      tituloMateriasPendientes.style.fontSize = '14px';
      tituloMateriasPendientes.style.fontWeight = 'bold';
      tituloMateriasPendientes.style.margin = '10px 0';
      materiasPendientes.appendChild(tituloMateriasPendientes);

      // Crear tabla para materias pendientes
      const tablaPendientes = document.createElement('table');
      tablaPendientes.style.width = '100%';
      tablaPendientes.style.borderCollapse = 'collapse';
      tablaPendientes.style.fontSize = '9px';

      // Encabezado de la tabla
      const theadPendientes = document.createElement('thead');
      const headerRowPendientes = document.createElement('tr');
      headerRowPendientes.style.backgroundColor = '#2980b9';
      headerRowPendientes.style.color = 'white';

      const headersPendientes = ['CÓDIGO', 'NOMBRE', 'CRÉDITOS', 'CLASIFICACIÓN'];
      headersPendientes.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.padding = '5px';
        th.style.textAlign = 'left';
        headerRowPendientes.appendChild(th);
      });

      theadPendientes.appendChild(headerRowPendientes);
      tablaPendientes.appendChild(theadPendientes);

      // Cuerpo de la tabla
      const tbodyPendientes = document.createElement('tbody');
      datos.materiasPendientes.forEach((materia, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = index % 2 === 0 ? '#f2f2f2' : 'white';

        const data = [
          materia.codMateria,
          materia.nombreMateria,
          materia.creditos,
          materia.clasificacion
        ];

        data.forEach(text => {
          const td = document.createElement('td');
          td.textContent = text;
          td.style.padding = '5px';
          td.style.borderBottom = '1px solid #ddd';
          row.appendChild(td);
        });

        tbodyPendientes.appendChild(row);
      });

      tablaPendientes.appendChild(tbodyPendientes);
      materiasPendientes.appendChild(tablaPendientes);

      container.appendChild(materiasPendientes);

      // Pie de página
      const footer = document.createElement('div');
      footer.style.fontSize = '8px';
      footer.style.fontStyle = 'italic';
      footer.style.textAlign = 'center';
      footer.style.marginTop = '20px';
      footer.textContent = 'Este documento es de uso interno de la Universidad';
      container.appendChild(footer);

      // Agregar el contenedor al documento temporalmente
      document.body.appendChild(container);
      container.style.display = 'none'; // Ocultar el elemento

      // Opciones para html2pdf
      const opt = {
        margin: 10,
        filename: 'reporte_estudiante.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generar el PDF
      html2pdf().from(container).set(opt).save().then(() => {
        // Eliminar el contenedor después de generar el PDF
        document.body.removeChild(container);
      });

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
            {datos.estudiante.proyecto_curricular}
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
            <InfoItem label="Correo Electrónico" value={datos.estudiante.email}/>
            <InfoItem label="Renovaciones" value={datos.estudiante.renovaciones}/>
            <InfoItem label="Créditos aprobados" value={datos.creditosAprobados}/>
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

