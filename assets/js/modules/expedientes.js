// =====================================================
// MODULO EXPEDIENTES
// =====================================================

import { getData, saveData } from "../storage.js";

import {
  createId,
  normalizeText,
  escapeHTML,
  escapeJS,
  formatDate,
} from "../utils.js";

let expedientes = [];

// =====================================================
// INICIALIZAR MODULO
// =====================================================

export function initExpedientes() {
  expedientes = getData("expedientes", []);

  window.openNewExpediente = openNewExpediente;

  window.viewExpediente = viewExpediente;

  window.renderExpedientes = renderExpedientes;
}

// =====================================================
// RENDER TABLA
// =====================================================

export function renderExpedientes() {
  expedientes = getData("expedientes", []);
  const table = document.getElementById("expedientesTable");

  if (!table) {
    return;
  }

  if (expedientes.length === 0) {
    table.innerHTML = `

        <tr>

        <td colspan="8">

        No existen expedientes registrados.

        </td>

        </tr>

        `;

    return;
  }

  table.innerHTML = expedientes
    .map(
      (exp) => `


<tr>


<td>

<strong>

${escapeHTML(exp.numero)}

</strong>

</td>




<td>

${escapeHTML(formatDate(exp.fecha))}

</td>





<td>

${escapeHTML(exp.actor)}

</td>





<td>

${escapeHTML(exp.demandado)}

</td>





<td>

<span class="badge badge-gray">

${escapeHTML(exp.clasificacion)}

</span>

</td>





<td>

<span class="badge badge-blue">

${escapeHTML(exp.estado)}

</span>

</td>





<td>

${escapeHTML(exp.ubicacion)}

</td>





<td>

<button

class="table-action"

onclick="
viewExpediente('${escapeJS(exp.numero)}')
"

>

Ver

</button>


</td>



</tr>


`,
    )

    .join("");
}

// =====================================================
// CREAR EXPEDIENTE
// =====================================================

export function openNewExpediente() {
  const modal = document.getElementById("modalContent");

  if (!modal) {
    return;
  }

  modal.innerHTML = `


<div class="form-header">


<span>
Expedientes
</span>


<h2>
Nuevo expediente
</h2>


</div>





<div class="form-body">


<form id="expedienteForm">


<div class="form-grid">



<div class="field">

<label>
Número expediente
</label>


<input
id="numeroExp"
required
>


</div>





<div class="field">


<label>
Fecha recepción
</label>


<input

type="date"

id="fechaExp"

required

>


</div>





<div class="field">


<label>
Actor
</label>


<input

id="actorExp"

required

>


</div>





<div class="field">


<label>
Demandado
</label>


<input

id="demandadoExp"

required

>


</div>





<div class="field">


<label>
Clasificación
</label>


<select id="clasificacionExp">


<option>
OCL - Educación
</option>


<option>
OJC - Salud
</option>


</select>


</div>





<div class="field">


<label>
Estado
</label>


<select id="estadoExp">


<option>
Recibido
</option>


<option>
En revisión
</option>


<option>
En instrucción
</option>


<option>
Concluido
</option>


</select>


</div>




<div class="field">


<label>
Ubicación
</label>


<select id="ubicacionExp">


<option>
Oficialía de Partes
</option>


<option>
Secretaría de Acuerdos
</option>


<option>
Archivo
</option>


</select>


</div>



</div>






<div class="form-actions">


<button

type="button"

class="secondary-btn"

onclick="closeModal()"

>

Cancelar

</button>





<button

class="primary-btn"

>

Guardar

</button>



</div>





</form>



</div>



`;

  document.getElementById("modal").classList.add("show");

  document.getElementById("expedienteForm").addEventListener(
    "submit",

    saveExpediente,
  );
}

function saveExpediente(event) {
  event.preventDefault();

  const expediente = {
    id: createId(),

    numero: document.getElementById("numeroExp").value,

    fecha: document.getElementById("fechaExp").value,

    actor: document.getElementById("actorExp").value,

    demandado: document.getElementById("demandadoExp").value,

    clasificacion: document.getElementById("clasificacionExp").value,

    estado: document.getElementById("estadoExp").value,

    ubicacion: document.getElementById("ubicacionExp").value,

    creadoEn: new Date().toISOString(),
  };

  expedientes.unshift(expediente);

  saveData("expedientes", expedientes);

  renderExpedientes();

  closeModal();
}

// =====================================================
// VER DETALLE
// =====================================================

export function viewExpediente(numero) {
  const expediente = expedientes.find((item) => item.numero === numero);

  if (!expediente) {
    return;
  }

  const modal = document.getElementById("modalContent");

  modal.innerHTML = `


<div class="form-header">


<span>
Detalle
</span>


<h2>
Expediente ${escapeHTML(numero)}
</h2>


</div>




<div class="form-body">


<div class="detail-grid">



<div class="detail-item">

<span>
Actor
</span>


<strong>
${escapeHTML(expediente.actor)}
</strong>


</div>





<div class="detail-item">

<span>
Demandado
</span>


<strong>
${escapeHTML(expediente.demandado)}
</strong>


</div>





<div class="detail-item">

<span>
Estado
</span>


<strong>
${escapeHTML(expediente.estado)}
</strong>


</div>





<div class="detail-item">

<span>
Ubicación
</span>


<strong>
${escapeHTML(expediente.ubicacion)}
</strong>


</div>



</div>



</div>



`;

  document.getElementById("modal").classList.add("show");
}

// =====================================================
// BUSCAR EXPEDIENTE
// =====================================================

export function searchExpediente(numero) {
  return expedientes.find(
    (item) => normalizeText(item.numero) === normalizeText(numero),
  );
}
