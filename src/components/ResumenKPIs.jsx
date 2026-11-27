// ============================================================================
// TICKET 09 — Componente reutilizable de cuadro de mando (KPIs)
// ----------------------------------------------------------------------------
// Recibe la lista de alumnos por PROPS y calcula 3 indicadores derivados.
// No tiene estado propio: al cambiar la prop `alumnos` (nuevo alumno, filtro
// de búsqueda, "solo aprobados"...) React vuelve a renderizarlo con los datos
// actualizados.
// ============================================================================

function TarjetaKPI({ etiqueta, valor }) {
  return (
    <div className="kpi-card">
      <div className="kpi-value">{valor}</div>
      <div className="kpi-label">{etiqueta}</div>
    </div>
  );
}

export default function ResumenKPIs({ alumnos }) {
  const total = alumnos.length;
  const sumaNotas = alumnos.reduce((acc, a) => acc + a.nota, 0);
  const aprobados = alumnos.filter((a) => a.nota >= 5).length;

  // Evitamos dividir entre 0 cuando la lista está vacía
  const notaMedia = total > 0 ? sumaNotas / total : 0;
  const porcentajeAprobados = total > 0 ? (aprobados / total) * 100 : 0;

  return (
    <div className="kpi-grid" aria-label="Resumen de indicadores">
      <TarjetaKPI etiqueta="Total de alumnos" valor={total} />
      <TarjetaKPI etiqueta="Nota media del grupo" valor={notaMedia.toFixed(2)} />
      <TarjetaKPI etiqueta="Porcentaje de aprobados" valor={`${porcentajeAprobados.toFixed(1)} %`} />
    </div>
  );
}
