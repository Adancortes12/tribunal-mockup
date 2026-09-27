// =====================================================
// MODULO OFICIOS
// =====================================================

import { getData, saveData } from "../storage.js";

import { createId, escapeHTML, escapeJS, formatDate } from "../utils.js";

let oficios = [];

// =====================================================
// INICIALIZAR
// =====================================================

export function initOficios() {
  oficios = getData("oficios", []);

  window.openOficioForm = openOficioForm;

  window.renderOficios = renderOficios;

  window.viewOficio = viewOficio;
}

// =====================================================
// RENDER TABLA
// =====================================================

export function renderOficios() {
  const table = document.getElementById("oficiosTable");

  if (!table) {
    return;
  }

  if (oficios.length === 0) {
    table.innerHTML = `

        <tr>

        <td colspan="6">

        No existen oficios registrados.

        </td>

        </tr>

        `;

    return;
  }

  table.innerHTML = oficios
    .map(
      (item) => `


<tr>



<td>

${escapeHTML(item.numero)}

</td>




<td>

${escapeHTML(item.expediente)}

</td>




<td>

${formatDate(item.fecha)}

</td>





<td>

${escapeHTML(item.procedencia)}

</td>





<td>

${escapeHTML(item.asunto)}

</td>





<td>


<button

class="table-action"

onclick="
viewOficio('${escapeJS(item.id)}')
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
// FORMULARIO
// =====================================================

export function openOficioForm() {
  const modal = document.getElementById("modalContent");

  modal.innerHTML = `



<div class="form-header">


<span>
Oficios
</span>


<h2>
Nuevo oficio
</h2>


</div>







<div class="form-body">



<form id="oficioForm">





<div class="form-grid">





<div class="field">


<label>
Número de oficio
</label>


<input

id="numeroOficio"

required

>


</div>







<div class="field">


<label>
Número expediente
</label>


<input

id="expedienteOficio"

>


</div>







<div class="field">


<label>
Fecha
</label>


<input

type="date"

id="fechaOficio"

required

>


</div>







<div class="field">


<label>
Procedencia
</label>


<input

id="procedenciaOficio"

>


</div>







<div class="field">


<label>
Estado
</label>


<select

id="estadoOficio"

>


<option>
Recibido
</option>


<option>
En revisión
</option>


<option>
Atendido
</option>


</select>


</div>







<div class="field full">


<label>
Asunto
</label>


<textarea

id="asuntoOficio"

rows="4"

></textarea>


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

Guardar oficio

</button>



</div>





</form>



</div>



`;

  document.getElementById("modal").classList.add("show");

  document.getElementById("oficioForm").addEventListener(
    "submit",

    saveOficio,
  );
}

// =====================================================
// GUARDAR
// =====================================================

function saveOficio(event) {
  event.preventDefault();

  const oficio = {
    id: createId(),

    numero: document.getElementById("numeroOficio").value,

    expediente: document.getElementById("expedienteOficio").value,

    fecha: document.getElementById("fechaOficio").value,

    procedencia: document.getElementById("procedenciaOficio").value,

    asunto: document.getElementById("asuntoOficio").value,

    estado: document.getElementById("estadoOficio").value,

    creadoEn: new Date().toISOString(),
  };

  oficios.unshift(oficio);

  saveData("oficios", oficios);

  renderOficios();

  closeModal();
}

// =====================================================
// DETALLE
// =====================================================

export function viewOficio(id) {
  const oficio = oficios.find((item) => item.id === id);

  if (!oficio) {
    return;
  }

  const modal = document.getElementById("modalContent");

  modal.innerHTML = `



<div class="form-header">


<span>
Detalle oficio
</span>


<h2>

${escapeHTML(oficio.numero)}

</h2>


</div>






<div class="form-body">


<div class="detail-grid">



<div class="detail-item">

<span>
Expediente
</span>


<strong>
${escapeHTML(oficio.expediente)}
</strong>

</div>





<div class="detail-item">

<span>
Procedencia
</span>


<strong>
${escapeHTML(oficio.procedencia)}
</strong>

</div>





<div class="detail-item">

<span>
Estado
</span>


<strong>
${escapeHTML(oficio.estado)}
</strong>

</div>





<div class="detail-item">

<span>
Asunto
</span>


<strong>
${escapeHTML(oficio.asunto)}
</strong>

</div>





</div>


</div>



`;

  document.getElementById("modal").classList.add("show");
}
