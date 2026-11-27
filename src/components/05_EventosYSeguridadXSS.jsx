import { useRef, useState } from 'react';

// ============================================================================
// [CLAVE EXPOSICIÓN 5] EVENTOS EN JSX Y SEGURIDAD AUTOMÁTICA CONTRA XSS
// ----------------------------------------------------------------------------
// 1. EVENTOS:
//    - En HTML: onclick="saludar()" (cadena de texto).
//    - En JSX:  onClick={saludar}   (referencia a función en camelCase).
//    - Si necesita argumentos: onClick={() => saludar('DAM2')}.
//      ¡ERROR TÍPICO!: escribir onClick={saludar('DAM2')} ejecuta la función
//      inmediatamente al renderizar, no al hacer clic.
// 2. PREVENCIÓN DE XSS (Cross-Site Scripting):
//    - JSX escapa automáticamente cualquier cadena insertada dentro de { }.
//    - Si un atacante introduce `<script>` o `<img onerror=...>`, React lo
//      pinta como texto plano seguro sin ejecutar código JavaScript.
// ============================================================================

// Payload inicial (corregido: las comillas dobles internas ya no rompen la cadena)
const PAYLOAD_INICIAL = `<img src=x onerror="alert('Ataque XSS')" /> <script>alert('Hack')</script>`;

// TICKET 06: vectores de prueba
const PAYLOADS_XSS = [
  { id: 'script', etiqueta: 'Payload 1: <script>', valor: `<script>alert('XSS 1')</script>` },
  { id: 'img', etiqueta: 'Payload 2: <img onerror>', valor: `<img src=x onerror="alert('XSS 2')" />` },
  { id: 'enlace', etiqueta: 'Payload 3: javascript:', valor: `<a href="javascript:alert('XSS 3')">Pulsa aquí</a>` }
];

const MAX_HISTORIAL = 5;

export default function EventosYSeguridadXSS() {
  // TICKET 06: historial de los últimos 5 eventos (más reciente primero)
  const [historial, setHistorial] = useState([]);
  const [entradaUsuario, setEntradaUsuario] = useState(PAYLOAD_INICIAL);
  // Contador para generar una key única por evento
  const contadorId = useRef(0);

  const registrarEvento = (texto) => {
    contadorId.current += 1;
    const evento = { id: contadorId.current, texto };
    setHistorial((prev) => [evento, ...prev].slice(0, MAX_HISTORIAL));
  };

  // Manejador sin parámetros (se pasa como referencia: onClick={manejarClickSimple})
  const manejarClickSimple = () => {
    registrarEvento(`Clic simple registrado a las ${new Date().toLocaleTimeString()}`);
  };

  // Manejador con parámetros (requiere función flecha: onClick={() => manejarConParametro(...)})
  const manejarConParametro = (accion) => {
    registrarEvento(`Acción ejecutada con parámetro: "${accion}"`);
  };

  // TICKET 06: carga de payloads de prueba en el input
  const cargarPayload = (payload) => {
    setEntradaUsuario(payload.valor);
    registrarEvento(`Cargado ${payload.etiqueta}`);
  };

  const limpiarHistorial = () => setHistorial([]);

  return (
    <section className="card">
      <h2>5. Manejo de Eventos y Protección Nativa contra XSS</h2>
      <p className="subtitle">
        Prueba los botones de eventos y comprueba cómo JSX neutraliza automáticamente código HTML/JS malicioso.
      </p>

      <div className="grid-2">
        <div className="box box-success">
          <h3>Sintaxis de Eventos (Synthetic Events)</h3>
          <div className="btn-row">
            {/* Referencia directa a la función */}
            <button type="button" className="btn" onClick={manejarClickSimple}>
              onClick=&#123;fn&#125;
            </button>
            {/* Función flecha para pasar argumentos sin ejecutar en el render */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => manejarConParametro('Exportar PDF')}
            >
              onClick=&#123;() =&gt; fn(arg)&#125;
            </button>
            {/* TICKET 06 */}
            <button
              type="button"
              className="btn btn-danger"
              onClick={limpiarHistorial}
              disabled={historial.length === 0}
            >
              Limpiar historial
            </button>
          </div>

          {/* TICKET 06: historial de auditoría (últimos 5 eventos) */}
          <h3>Historial de eventos (últimos {MAX_HISTORIAL})</h3>
          {historial.length === 0 ? (
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Ningún evento registrado todavía.</p>
          ) : (
            <ul className="list" style={{ marginTop: '0.4rem' }}>
              {historial.map((evento) => (
                <li key={evento.id} className="list-item" style={{ fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--primary)' }}>{evento.texto}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="box box-warn">
          <h3>Escapado automático contra XSS</h3>
          <label htmlFor="xss-input">Introduce HTML o un payload XSS:</label>
          <input
            id="xss-input"
            type="text"
            className="input"
            value={entradaUsuario}
            onChange={(e) => setEntradaUsuario(e.target.value)}
          />

          {/* TICKET 06: botones de carga de payloads de prueba */}
          <div className="btn-row">
            {PAYLOADS_XSS.map((payload) => (
              <button
                key={payload.id}
                type="button"
                className="btn btn-secondary"
                onClick={() => cargarPayload(payload)}
              >
                Cargar payload XSS de prueba ({payload.id})
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.65rem',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontFamily: 'Consolas, monospace',
              fontSize: '0.85rem',
              wordBreak: 'break-all'
            }}
          >
            {/* JSX escapa automáticamente esta cadena: NO se ejecuta el script */}
            Salida renderizada segura: {entradaUsuario}
          </div>
        </div>
      </div>

      <p className="file-hint">
        Archivo para mostrar en VS Code: <code className="code-inline">src/components/05_EventosYSeguridadXSS.jsx</code>
      </p>
    </section>
  );
}
