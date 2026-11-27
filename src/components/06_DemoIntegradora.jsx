import { useState } from 'react';
import ResumenKPIs from './ResumenKPIs.jsx';

// ============================================================================
// [CLAVE EXPOSICIÓN 6] DEMO INTEGRADORA DE TODAS LAS CARACTERÍSTICAS DE JSX
// ----------------------------------------------------------------------------
// Este componente reúne en un caso real de aula:
// - Fragmentos (<>...</>) y atributos camelCase (className, onClick, onChange)
// - Expresiones JS { } y estilos en línea dinámicos style={{ }}
// - Renderizado condicional (ternario + && booleano seguro)
// - Listas con .map() y key única estable
// - Comunicación mediante props y composición de componentes
// - Formularios controlados, estado y persistencia en localStorage
// ============================================================================

const CLAVE_STORAGE = 'm10-2-expedientes';

const EXPEDIENTES_INICIALES = [
  { id: 101, nombre: 'Lucía Serrano', nota: 8.7, modulos: ['DI', 'PSP', 'AD'] },
  { id: 102, nombre: 'Marcos Vega', nota: 4.3, modulos: ['DI', 'SGE'] },
  { id: 103, nombre: 'Sofía Navarro', nota: 9.5, modulos: ['DI', 'PSP', 'AD', 'PMDM'] }
];

// TICKET 10: carga segura desde localStorage (si no hay datos válidos, usa los iniciales)
function cargarExpedientes() {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    if (guardado) {
      const datos = JSON.parse(guardado);
      if (Array.isArray(datos)) return datos;
    }
  } catch {
    // JSON corrupto o localStorage no disponible: se ignora y se usan los datos iniciales
  }
  return EXPEDIENTES_INICIALES;
}

// Normaliza texto para búsquedas sin distinguir mayúsculas ni tildes
const normalizar = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

function TarjetaExpediente({ alumno, seleccionado, onSeleccionar }) {
  const aprobado = alumno.nota >= 5;

  return (
    <article
      className="box"
      style={{
        borderColor: seleccionado ? 'var(--primary)' : 'var(--border)',
        borderWidth: seleccionado ? '2px' : '1px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <h3 style={{ margin: 0 }}>{alumno.nombre}</h3>
        <span className={`badge ${aprobado ? 'badge-ok' : 'badge-fail'}`}>
          {aprobado ? `Aprobado (${alumno.nota})` : `Pendiente (${alumno.nota})`}
        </span>
      </div>

      {alumno.modulos.length > 0 && (
        <div className="btn-row" style={{ marginTop: '0.6rem' }}>
          {alumno.modulos.map((mod) => (
            <span key={`${alumno.id}-${mod}`} className="code-inline">
              {mod}
            </span>
          ))}
        </div>
      )}

      <div className="btn-row">
        <button type="button" className="btn" onClick={() => onSeleccionar(alumno)}>
          {seleccionado ? 'Expediente seleccionado' : 'Seleccionar expediente'}
        </button>
      </div>
    </article>
  );
}

export default function DemoIntegradora() {
  // TICKET 08 + 10: la lista es ahora un estado inicializado desde localStorage
  const [expedientes, setExpedientes] = useState(cargarExpedientes);
  const [soloAprobados, setSoloAprobados] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);

  // TICKET 07: búsqueda y ordenación
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('nota-desc');

  // TICKET 08: formulario controlado
  const [formNombre, setFormNombre] = useState('');
  const [formNota, setFormNota] = useState('');
  const [formModulos, setFormModulos] = useState('');
  const [errorForm, setErrorForm] = useState('');

  // TICKET 10: actualiza el estado Y persiste la lista en localStorage
  const actualizarExpedientes = (nuevaLista) => {
    setExpedientes(nuevaLista);
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(nuevaLista));
    } catch {
      // Si localStorage no está disponible la app sigue funcionando en memoria
    }
  };

  // TICKET 10: borra la clave y recupera los 3 expedientes originales
  const restablecerDatos = () => {
    try {
      localStorage.removeItem(CLAVE_STORAGE);
    } catch {
      // Sin acceso a localStorage: solo se restablece el estado
    }
    setExpedientes(EXPEDIENTES_INICIALES);
    setSeleccionado(null);
    setErrorForm('');
  };

  // TICKET 08: alta de nuevo expediente
  const agregarExpediente = (e) => {
    e.preventDefault();

    const nombre = formNombre.trim();
    const nota = Number(formNota);

    if (!nombre) {
      setErrorForm('El nombre completo es obligatorio.');
      return;
    }
    if (formNota.trim() === '' || Number.isNaN(nota) || nota < 0 || nota > 10) {
      setErrorForm('La nota debe ser un número entre 0 y 10.');
      return;
    }

    // Módulos separados por comas: se limpian espacios, se pasan a mayúsculas y se eliminan duplicados
    const modulos = [
      ...new Set(
        formModulos
          .split(',')
          .map((m) => m.trim().toUpperCase())
          .filter(Boolean)
      )
    ];

    // id único: siempre mayor que el mayor existente
    const nuevoId = expedientes.reduce((max, a) => Math.max(max, a.id), 100) + 1;

    actualizarExpedientes([...expedientes, { id: nuevoId, nombre, nota, modulos }]);

    // Limpiar los campos del formulario
    setFormNombre('');
    setFormNota('');
    setFormModulos('');
    setErrorForm('');
  };

  // TICKET 07: filtros combinados (aprobados + búsqueda por nombre) y ordenación
  const termino = normalizar(busqueda.trim());
  const listaFiltrada = expedientes
    .filter((a) => (soloAprobados ? a.nota >= 5 : true))
    .filter((a) => normalizar(a.nombre).includes(termino))
    .sort((a, b) => {
      if (orden === 'nota-desc') return b.nota - a.nota;
      if (orden === 'nota-asc') return a.nota - b.nota;
      return a.nombre.localeCompare(b.nombre, 'es');
    });

  return (
    <>
      <section className="card">
        <h2>6. Ejemplo Integrador: Panel de Expedientes DAM2</h2>
        <p className="subtitle">
          Composición de componentes reutilizables aplicando todas las reglas de JSX.
        </p>

        {/* TICKET 09: los KPIs se calculan sobre la lista visible (actual + filtros) */}
        <ResumenKPIs alumnos={listaFiltrada} />

        {/* TICKET 07: buscador y ordenación */}
        <div className="toolbar">
          <div>
            <label className="field-label" htmlFor="buscador-alumnos">Buscar alumno por nombre:</label>
            <input
              id="buscador-alumnos"
              type="search"
              className="input"
              placeholder="Ej.: Lucía"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="orden-alumnos">Ordenar por:</label>
            <select
              id="orden-alumnos"
              className="input"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="nota-desc">Nota (mayor a menor)</option>
              <option value="nota-asc">Nota (menor a mayor)</option>
              <option value="nombre-asc">Nombre (A–Z)</option>
            </select>
          </div>
        </div>

        <div className="btn-row" style={{ marginBottom: '1rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setSoloAprobados((prev) => !prev)}
          >
            {soloAprobados ? 'Mostrar todos los alumnos' : 'Filtrar solo aprobados (>= 5)'}
          </button>

          {/* TICKET 10 */}
          <button type="button" className="btn btn-danger" onClick={restablecerDatos}>
            Restablecer datos iniciales
          </button>

          {seleccionado && (
            <span className="pill">
              Seleccionado: {seleccionado.nombre} (ID #{seleccionado.id})
            </span>
          )}
        </div>

        {/* TICKET 07: estado vacío / listado */}
        {listaFiltrada.length === 0 ? (
          <div className="box box-warn">
            <p>No se encontraron expedientes con esos criterios</p>
          </div>
        ) : (
          <div className="grid-2">
            {listaFiltrada.map((alumno) => (
              <TarjetaExpediente
                key={alumno.id}
                alumno={alumno}
                seleccionado={seleccionado?.id === alumno.id}
                onSeleccionar={setSeleccionado}
              />
            ))}
          </div>
        )}

        {/* TICKET 08: formulario de alta */}
        <form onSubmit={agregarExpediente} className="box box-success" style={{ marginTop: '1.25rem' }}>
          <h3 style={{ marginTop: 0 }}>Alta de nuevo expediente</h3>
          <div className="form-grid">
            <div>
              <label className="field-label" htmlFor="form-nombre">Nombre completo (obligatorio)</label>
              <input
                id="form-nombre"
                type="text"
                className="input"
                placeholder="Ej.: Elena Martínez"
                value={formNombre}
                onChange={(e) => setFormNombre(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="form-nota">Nota (0 a 10)</label>
              <input
                id="form-nota"
                type="number"
                min={0}
                max={10}
                step={0.1}
                className="input"
                placeholder="Ej.: 7.5"
                value={formNota}
                onChange={(e) => setFormNota(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="form-modulos">Módulos (separados por comas)</label>
              <input
                id="form-modulos"
                type="text"
                className="input"
                placeholder="Ej.: DI, PSP, AD"
                value={formModulos}
                onChange={(e) => setFormModulos(e.target.value)}
              />
            </div>
          </div>

          {errorForm && (
            <p role="alert" className="field-error" style={{ color: '#dc2626' }}>
              {errorForm}
            </p>
          )}

          <div className="btn-row">
            <button type="submit" className="btn">Añadir expediente</button>
          </div>
        </form>

        <p className="file-hint">
          Archivo para mostrar en VS Code: <code className="code-inline">src/components/06_DemoIntegradora.jsx</code>
        </p>
      </section>
    </>
  );
}
