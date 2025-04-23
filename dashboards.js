/* ================= CONFIGURACIÓN ================= */
// 1. URL base de tu esquema/aplicación APEX con AutoREST habilitado
//    (sin terminar en barra; los objetos REST se añaden después)
const API_BASE   = 'https://apex.oracle.com/pls/apex/proyecto_incofer_final';


// 2. Intervalo de refresco (ms)
const REFRESH_MS = 30_000;

/* ================= UTILIDADES ================= */
const statusColors = {
  'A TIEMPO':  'bg-green-600',
  'RETRASADO': 'bg-yellow-500',
  'CANCELADO': 'bg-red-600'
};

const badge = txt => `
  <span class="px-2 py-1 rounded text-xs font-semibold text-white 
              ${statusColors[txt?.toUpperCase()] || 'bg-slate-500'}">
    ${txt}
  </span>`;

/* ================= CARGA DE RUTAS ================= */
async function loadRoutes () {
  try {
    const res = await fetch(`${API_BASE}/rutas_estado_v/`);
    if (!res.ok) throw new Error('No se pudo obtener Rutas');
    const { items } = await res.json();     // ORDS devuelve {items:[…]}
    renderRoutes(items);
  } catch (err) {
    console.error(err);
  }
}

function renderRoutes (rutas = []) {
  const tbody = document.querySelector('#routesTable tbody');
  tbody.innerHTML = rutas.map(r => `
      <tr>
        <td class="px-4 py-2">${r.nombre}</td>
        <td class="px-4 py-2">${badge(r.estado)}</td>
        <td class="px-4 py-2">
          ${new Date(r.ultima_actualizacion).toLocaleTimeString()}
        </td>
      </tr>`
  ).join('');
}

/* ================= CARGA DE HORARIOS ================= */
async function loadSchedules () {
  try {
    const res = await fetch(`${API_BASE}/horarios_estado_v/`);
    if (!res.ok) throw new Error('No se pudo obtener Horarios');
    const { items } = await res.json();
    renderSchedules(items);
  } catch (err) {
    console.error(err);
  }
}

function renderSchedules (horarios = []) {
  const tbody = document.querySelector('#scheduleTable tbody');
  tbody.innerHTML = horarios.map(h => `
      <tr>
        <td class="px-4 py-2">${h.ruta}</td>
        <td class="px-4 py-2">${h.tren_modelo}</td>
        <td class="px-4 py-2">${h.hora_salida}</td>
        <td class="px-4 py-2">${h.hora_llegada}</td>
        <td class="px-4 py-2">${badge(h.estado)}</td>
      </tr>`
  ).join('');
}

/* ================= INICIALIZACIÓN ================= */
document.addEventListener('DOMContentLoaded', () => {
  // Año dinámico en el footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Primera carga
  loadRoutes();
  loadSchedules();

  // Refresco automático
  setInterval(loadRoutes,    REFRESH_MS);
  setInterval(loadSchedules, REFRESH_MS);
});