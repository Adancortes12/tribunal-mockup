// =====================================================
// FORMULARIO OFICIO
// =====================================================

import { showModal, closeForm } from "./formHelper.js";

import { createId } from "../utils.js";

import { getData, saveData } from "../storage.js";

export function initOficioForm() {
  window.openOficioForm = openOficioForm;
}

export function openOficioForm() {
  showModal(`


<div class="form-header">


<span>
Oficios
</span>


<h2>
Nuevo oficio
</h2>


</div>





<div class="form-body">


<form id="newOficioForm">





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

onclick="closeForm()"

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


`);

  document.getElementById("newOficioForm").addEventListener(
    "submit",

    saveOficio,
  );
}

function saveOficio(event) {
  event.preventDefault();

  const oficios = getData("oficios", []);

  const nuevoOficio = {
    id: createId(),

    numero: numeroOficio.value,

    expediente: expedienteOficio.value,

    fecha: fechaOficio.value,

    procedencia: procedenciaOficio.value,

    asunto: asuntoOficio.value,

    estado: estadoOficio.value,

    creadoEn: new Date().toISOString(),
  };

  oficios.unshift(nuevoOficio);

  saveData("oficios", oficios);

  closeForm();

  if (window.renderOficios) {
    window.renderOficios();
  }
}
