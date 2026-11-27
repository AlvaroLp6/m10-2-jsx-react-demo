import { useState } from 'react';

// ============================================================================
// [CLAVE EXPOSICIÓN 2] EXPRESIONES JAVASCRIPT { } Y ESTILOS EN LÍNEA
// ----------------------------------------------------------------------------
// 1. Dentro de { } solo caben EXPRESIONES (algo que produce un valor):
//    variables, cálculos, llamadas a funciones, template literals, ternarios.
// 2. NO caben SENTENCIAS (if, for, while, switch). Esas se resuelven fuera
//    del `return` o con expresiones equivalentes.
// 3. `style={{ ... }}` lleva DOBLE LLAVE:
//    - Llave exterior: abre expresión JSX.
//    - Llave interior: define un objeto literal de JavaScript.
//    - Propiedades CSS en camelCase: `backgroundColor`, `fontSize`, `borderRadius`.
// 4. React IGNORA en pantalla: true, false, null y undefined.
// ============================================================================

const formatearEuros = (cantidad) => `${cantidad.toFixed(2)} €`;

// TICKET 03: tipos impositivos disponibles
const TIPOS_IVA = [
  { id: 'general', etiqueta: 'General (21%)', porcentaje: 21 },
  { id: 'reducido', etiqueta: 'Reducido (10%)', porcentaje: 10 },
  { id: 'superreducido', etiqueta: 'Superreducido (4%)', porcentaje: 4 }
];

export default function ExpresionesYEstilos() {
  const [precioBase, setPrecioBase] = useState(100);
  const [colorDestacado, setColorDestacado] = useState('#38bdf8');
  const [tipoIva, setTipoIva] = useState('general');
  // El descuento se guarda como texto para permitir borrar/escribir con naturalidad
  const [descuentoTexto, setDescuentoTexto] = useState('0');

  const IVA = 0.21;

  // --- TICKET 03: cálculo fiscal ---
  const porcentajeIva = TIPOS_IVA.find((t) => t.id === tipoIva).porcentaje;
  // El descuento se limita siempre al rango 0–50
  const descuento = Math.min(50, Math.max(0, Number(descuentoTexto) || 0));
  const importeDescontado = precioBase * (descuento / 100);
  const baseImponible = precioBase - importeDescontado;
  const cuotaIva = baseImponible * (porcentajeIva / 100);
  const totalFinal = baseImponible + cuotaIva;

  // Objeto de estilos dinámico en JavaScript
  const estiloTarjetaDinamica = {
    backgroundColor: 'var(--surface-alt)',
    border: `2px solid ${colorDestacado}`,
    borderRadius: '10px',
    padding: '1rem',
    transition: 'border-color 0.2s ease'
  };

  return (
    <section className="card">
      <h2>2. Expresiones JavaScript &#123; &#125; y Estilos en Línea</h2>
      <p className="subtitle">
        Las llaves son una ventana directa a JavaScript dentro del marcado JSX.
      </p>

      <div className="grid-2">
        <div className="box">
          <h3>Expresiones evaluadas en tiempo real</h3>
          <label htmlFor="precio-input">Precio base (€):</label>
          <input
            id="precio-input"
            type="number"
            className="input"
            value={precioBase}
            onChange={(e) => setPrecioBase(Number(e.target.value) || 0)}
          />

          <ul className="list">
            <li className="list-item">
              <span>Operación matemática directa:</span>
              <strong>{(precioBase * IVA).toFixed(2)} € (IVA 21%)</strong>
            </li>
            <li className="list-item">
              <span>Llamada a función:</span>
              <strong>{formatearEuros(precioBase * (1 + IVA))}</strong>
            </li>
            <li className="list-item">
              <span>Valores ignorados (true/false/null):</span>
              <strong>[{true}{false}{null}{undefined}] (vacío)</strong>
            </li>
          </ul>
        </div>

        <div style={estiloTarjetaDinamica}>
          <h3 style={{ color: colorDestacado, marginTop: 0 }}>
            Estilos en línea con style=&#123;&#123; camelCase &#125;&#125;
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-soft)' }}>
            El borde y el título de este recuadro se calculan dinámicamente desde un objeto
            JavaScript usando <code className="code-inline">border</code> y <code className="code-inline">color</code>.
          </p>

          <div className="btn-row">
            <button type="button" className="btn" onClick={() => setColorDestacado('#38bdf8')}>
              Azul Cyan
            </button>
            <button type="button" className="btn" style={{ backgroundColor: '#059669' }} onClick={() => setColorDestacado('#10b981')}>
              Verde Esmeralda
            </button>
            <button type="button" className="btn" style={{ backgroundColor: '#d97706' }} onClick={() => setColorDestacado('#f59e0b')}>
              Ámbar
            </button>
          </div>
        </div>
      </div>

      {/* TICKET 03: Calculadora fiscal con descuentos e IVA dinámico */}
      <div className="box box-success" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>Calculadora fiscal: IVA dinámico y descuento comercial</h3>

        <div className="form-grid">
          <div>
            <label className="field-label" htmlFor="tipo-iva">Tipo de IVA:</label>
            <select
              id="tipo-iva"
              className="input"
              value={tipoIva}
              onChange={(e) => setTipoIva(e.target.value)}
            >
              {TIPOS_IVA.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.etiqueta}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="descuento-input">Descuento (%) entre 0 y 50:</label>
            <input
              id="descuento-input"
              type="number"
              className="input"
              min={0}
              max={50}
              step={1}
              value={descuentoTexto}
              onChange={(e) => setDescuentoTexto(e.target.value)}
            />
          </div>
        </div>

        {Number(descuentoTexto) > 50 && (
          <p className="field-error" role="alert" style={{ color: '#dc2626' }}>
            El descuento máximo es del 50 %: se aplicará 50 %.
          </p>
        )}

        <ul className="list">
          <li className="list-item">
            <span>Precio Base</span>
            <strong>{formatearEuros(precioBase)}</strong>
          </li>
          <li className="list-item">
            <span>Importe Descontado ({descuento.toFixed(2)} %)</span>
            <strong>- {formatearEuros(importeDescontado)}</strong>
          </li>
          <li className="list-item">
            <span>Base Imponible</span>
            <strong>{formatearEuros(baseImponible)}</strong>
          </li>
          <li className="list-item">
            <span>Cuota de IVA ({porcentajeIva} %)</span>
            <strong>{formatearEuros(cuotaIva)}</strong>
          </li>
          <li className="list-item">
            <span>Total Final</span>
            {/* Si hay descuento, el precio final se resalta en verde con style={{ }} */}
            <strong
              style={
                descuento > 0
                  ? { color: '#16a34a', fontSize: '1.25rem', fontWeight: 800 }
                  : { fontSize: '1.25rem' }
              }
            >
              {formatearEuros(totalFinal)}
            </strong>
          </li>
        </ul>
      </div>

      <p className="file-hint">
        Archivo para mostrar en VS Code: <code className="code-inline">src/components/02_ExpresionesYEstilos.jsx</code>
      </p>
    </section>
  );
}
