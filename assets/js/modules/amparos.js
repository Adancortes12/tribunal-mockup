// ============================================================
// MÓDULO AMPAROS
// ============================================================

import { getData, saveData } from "../storage.js";

import { escapeHTML } from "../utils.js";

// ============================================================
// ESTADO
// ============================================================

let currentFilter = "";

// ============================================================
// INICIALIZAR
// ============================================================

export async function initAmparos() {
  // Permite que amparoForm.js actualice la tabla
  // inmediatamente después de guardar.
  window.renderAmparos = renderAmparos;

  await seedAmparosEjemplo();

  bindAmparosEvents();

  renderAmparos();
}

// Compatibilidad con el nombre anterior
export const initAmparosPage = initAmparos;

// ============================================================
// DATOS DE EJEMPLO
// ============================================================

async function seedAmparosEjemplo() {
  const actuales = getData("amparos", []);

  // Si ya existen registros no hacemos nada.
  if (actuales.length > 0) {
    return;
  }

  try {
    const url = new URL("../../data/amparos-ejemplo.json", import.meta.url);

    const response = await fetch(url);

    if (!response.ok) {
      console.warn("No se pudo cargar amparos-ejemplo.json");

      return;
    }

    const data = await response.json();

    const ejemplos = Array.isArray(data) ? data : data.amparos || [];

    if (!ejemplos.length) {
      return;
    }

    saveData("amparos", ejemplos);
  } catch (error) {
    console.error("Error cargando amparos de ejemplo:", error);
  }
}

// ============================================================
// EVENTOS
// ============================================================

function bindAmparosEvents() {
  const search = document.getElementById("amparosSearch");

  if (search) {
    search.oninput = (event) => {
      currentFilter = event.target.value.trim().toLowerCase();

      renderAmparos();
    };
  }

  document.querySelectorAll('[data-action="new-amparo"]').forEach((button) => {
    button.onclick = () => {
      if (typeof window.openAmparoForm === "function") {
        window.openAmparoForm();
      }
    };
  });
}

// ============================================================
// RENDER TABLA
// ============================================================

export function renderAmparos() {
  const tbody = document.getElementById("amparosTable");

  const empty = document.getElementById("amparosEmpty");

  if (!tbody) {
    return;
  }

  // SIEMPRE leemos la versión más reciente.
  const amparos = getData("amparos", []);

  const filtered = amparos.filter((amparo) => {
    if (!currentFilter) {
      return true;
    }

    const text = `

                    ${amparo.expediente || ""}
                    ${amparo.promovente || ""}
                    ${amparo.juzgado || ""}
                    ${amparo.oficio || ""}
                    ${amparo.actoReclamado || ""}
                    ${amparo.estado || ""}

                `.toLowerCase();

    return text.includes(currentFilter);
  });

  // ========================================================
  // SIN REGISTROS
  // ========================================================

  if (!filtered.length) {
    tbody.innerHTML = "";

    if (empty) {
      empty.hidden = false;
    }

    return;
  }

  if (empty) {
    empty.hidden = true;
  }

  // ========================================================
  // REGISTROS
  // ========================================================

  tbody.innerHTML = filtered.map((amparo) => createAmparoRow(amparo)).join("");

  bindRowActions();
}

// ============================================================
// CREAR FILA
// ============================================================

function createAmparoRow(amparo) {
  return `

        <tr>


            <!-- RECEPCIÓN -->

            <td>

                <div class="amparo-reception-cell">

                    <strong>

                        ${escapeHTML(formatDate(amparo.dia))}

                    </strong>

                    <span>

                        ${escapeHTML(amparo.hora || "—")}

                    </span>

                </div>

            </td>



            <!-- EXPEDIENTE -->

            <td>

                <span class="amparo-expediente-cell">

                    ${escapeHTML(amparo.expediente || "—")}

                </span>

            </td>



            <!-- PROMOVENTE -->

            <td>

                ${escapeHTML(amparo.promovente || "—")}

            </td>



            <!-- JUZGADO -->

            <td>

                ${escapeHTML(amparo.juzgado || "—")}

            </td>



            <!-- ACTO -->

            <td>

                <div
                    class="amparo-acto-cell"
                    title="${escapeHTML(amparo.actoReclamado || "")}"
                >

                    ${escapeHTML(amparo.actoReclamado || "—")}

                </div>

            </td>



            <!-- ESTADO -->

            <td>

                <span
                    class="
                        amparo-status
                        ${getStatusClass(amparo.estado)}
                    "
                >

                    ${escapeHTML(amparo.estado || "Recibido")}

                </span>

            </td>



            <!-- ACCIONES -->

            <td>

                <button
                    type="button"
                    class="amparo-attach-button"
                    data-amparo-oficio="${escapeHTML(String(amparo.id))}"
                >

                    <i class="fa-solid fa-paperclip"></i>

                    <span>
                        Anexar oficio
                    </span>

                </button>

            </td>


        </tr>

    `;
}

// ============================================================
// ACCIONES DE FILA
// ============================================================

function bindRowActions() {
  document.querySelectorAll("[data-amparo-oficio]").forEach((button) => {
    button.onclick = () => {
      anexarOficio(button.dataset.amparoOficio);
    };
  });
}

// ============================================================
// ANEXAR OFICIO
// ============================================================

function anexarOficio(amparoId) {
  const amparos = getData("amparos", []);

  const amparo = amparos.find((item) => String(item.id) === String(amparoId));

  if (!amparo) {
    alert("No se encontró el amparo.");

    return;
  }

  const context = {
    origen: "amparo",

    amparoId: amparo.id,

    expediente: amparo.expediente,

    promovente: amparo.promovente,

    juzgado: amparo.juzgado,

    actoReclamado: amparo.actoReclamado,
  };

  sessionStorage.setItem("oficioAmparoContext", JSON.stringify(context));

  if (typeof window.openOficioForm === "function") {
    window.openOficioForm(context);
  } else {
    alert("El formulario de Oficios todavía no está inicializado.");
  }
}

// ============================================================
// ESTADO
// ============================================================

function getStatusClass(estado = "") {
  const value = estado.toLowerCase().trim();

  if (value === "en trámite" || value === "en tramite") {
    return "amparo-status-tramite";
  }

  if (value === "pendiente") {
    return "amparo-status-pendiente";
  }

  if (value === "concluido") {
    return "amparo-status-concluido";
  }

  return "amparo-status-recibido";
}

// ============================================================
// FECHA
// ============================================================

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const parts = value.split("-");

  if (parts.length !== 3) {
    return value;
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
