import { showModal, closeForm } from "./formHelper.js";

import { createId } from "../utils.js";

import { getData, saveData } from "../storage.js";

export function initExpedienteForm() {
  window.openNewExpediente = openNewExpediente;
}

export function openNewExpediente() {
  showModal(`


<div class="form-header">


<span>
Expedientes
</span>


<h2>
Nuevo expediente
</h2>


</div>




<div class="form-body">


<form id="newExpedienteForm">



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
Concluido
</option>


</select>


</div>





<div class="field full">


<label>
Ubicación
</label>


<input
id="ubicacionExp"
>


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

Guardar

</button>


</div>




</form>


</div>


`);

  document
    .getElementById("newExpedienteForm")
    .addEventListener("submit", saveExpediente);
}

function saveExpediente(event) {
  event.preventDefault();

  const expedientes = getData("expedientes", []);

  const nuevo = {
    id: createId(),

    numero: numeroExp.value,

    fecha: fechaExp.value,

    actor: actorExp.value,

    demandado: demandadoExp.value,

    clasificacion: clasificacionExp.value,

    estado: estadoExp.value,

    ubicacion: ubicacionExp.value,

    creadoEn: new Date().toISOString(),
  };

  expedientes.unshift(nuevo);

  saveData("expedientes", expedientes);

  closeForm();

  if (window.renderExpedientes) {
    window.renderExpedientes();
  }
}
