import { createId, escapeHTML } from "../utils.js";
// =====================================================
// FORMULARIO AMPARO
// =====================================================

import { showModal, closeForm } from "./formHelper.js";

import { getData, saveData } from "../storage.js";

export function initAmparoForm() {
  window.openAmparoForm = openAmparoForm;
}

export function openAmparoForm() {
  const expedientesGuardados = getData("expedientes", []);

  const opcionesExpedientes = expedientesGuardados
    .map((exp) => `<option value="${escapeHTML(exp.numero)}"></option>`)
    .join("");

  showModal(`


<div class="form-header">


<span>
Amparos
</span>


<h2>
Nuevo amparo
</h2>


</div>





<div class="form-body">


<form id="newAmparoForm">






<div class="form-grid">







<div class="field">


<label>
Día
</label>


<input

type="date"

id="amparoDia"

required

>


</div>









<div class="field">


<label>
Hora
</label>


<input

type="time"

id="amparoHora"

required

>


</div>









<div class="field">

<label>
Número expediente
</label>

<input

id="amparoExpediente"

list="amparoExpedientesList"

autocomplete="off"

required

>

<datalist id="amparoExpedientesList">
${opcionesExpedientes}
</datalist>

</div>

<div class="field full">

<label>
Acto reclamado
</label>

<textarea

id="amparoActoReclamado"

rows="3"

required

></textarea>

</div>

<div class="field">


<label>
Quién promueve el amparo
</label>


<input

id="amparoPromueve"

required

>


</div>









<div class="field">


<label>
Número asignado por juzgado
</label>


<input

id="amparoJuzgado"

>


</div>









<div class="field">


<label>
Número de oficio registrado
</label>


<input

id="amparoOficio"

>


</div>









<div class="field full">


<label>
Acciones
</label>


<textarea

id="amparoAccion"

rows="4"

></textarea>


</div>


<div class="field full">

<label>
Observaciones (opcional)
</label>

<textarea

id="amparoObservaciones"

rows="3"

></textarea>

</div>





</div>







<div class="form-actions">



<button

type="button"

class="secondary-btn"

onclick="closeForm()"

>

Cancelar

</button>





<button

class="primary-btn"

>

Guardar amparo

</button>



</div>





</form>


</div>


`);

  document.getElementById("newAmparoForm").addEventListener(
    "submit",

    saveAmparo,
  );

  document.getElementById("amparoExpediente").addEventListener("change", () => {
    const valor = amparoExpediente.value.trim();

    const encontrado = expedientesGuardados.find((exp) => exp.numero === valor);

    if (!encontrado) {
      return;
    }

    // Solo rellena si el usuario no escribió ya algo
    if (!amparoPromueve.value.trim()) {
      amparoPromueve.value = encontrado.actor || "";
    }
  });
}

function saveAmparo(event) {
  event.preventDefault();

  const amparos = getData("amparos", []);

  const nuevoAmparo = {
    id: createId(),

    dia: amparoDia.value,

    hora: amparoHora.value,

    expediente: amparoExpediente.value,

    actoReclamado: amparoActoReclamado.value,

    promueve: amparoPromueve.value,

    juzgado: amparoJuzgado.value,

    oficio: amparoOficio.value,

    accion: amparoAccion.value,

    observaciones: amparoObservaciones.value,

    creadoEn: new Date().toISOString(),
  };

  amparos.unshift(nuevoAmparo);

  saveData("amparos", amparos);

  closeForm();

  if (window.renderAmparos) {
    window.renderAmparos();
  }
}
