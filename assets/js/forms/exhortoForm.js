// =====================================================
// FORMULARIO EXHORTO
// =====================================================

import { showModal, closeForm } from "./formHelper.js";

import { createId } from "../utils.js";

import { getData, saveData } from "../storage.js";

export function initExhortoForm() {
  window.openExhortoForm = openExhortoForm;
}

export function openExhortoForm() {
  showModal(`


<div class="form-header">


<span>
Exhortos
</span>


<h2>
Nuevo exhorto
</h2>


</div>





<div class="form-body">


<form id="newExhortoForm">





<div class="form-grid">





<div class="field">


<label>
Número de exhorto
</label>


<input

id="numeroExhorto"

required

>


</div>







<div class="field">


<label>
Fecha de llegada
</label>


<input

type="date"

id="fechaExhorto"

required

>


</div>







<div class="field">


<label>
Número exhorto de origen
</label>


<input

id="origenExhorto"

>


</div>







<div class="field">


<label>
Actor demandado
</label>


<input

id="actorDemandado"

>


</div>







<div class="field">


<label>
Autoridad exhortante
</label>


<input

id="autoridadExhortante"

>


</div>







<div class="field">


<label>
Estado
</label>


<select

id="estadoExhorto"

>


<option>
Recibido
</option>


<option>
En trámite
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


<input

id="ubicacionExhorto"

>


</div>







<div class="field full">


<label>
Promoción
</label>


<textarea

id="promocionExhorto"

rows="4"

placeholder="
Número de expediente y número de oficio
"

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

Guardar exhorto

</button>



</div>





</form>


</div>


`);

  document.getElementById("newExhortoForm").addEventListener(
    "submit",

    saveExhorto,
  );
}

function saveExhorto(event) {
  event.preventDefault();

  const exhortos = getData("exhortos", []);

  const nuevoExhorto = {
    id: createId(),

    numero: numeroExhorto.value,

    fecha: fechaExhorto.value,

    origen: origenExhorto.value,

    actorDemandado: actorDemandado.value,

    autoridad: autoridadExhortante.value,

    promocion: promocionExhorto.value,

    estado: estadoExhorto.value,

    ubicacion: ubicacionExhorto.value,

    creadoEn: new Date().toISOString(),
  };

  exhortos.unshift(nuevoExhorto);

  saveData("exhortos", exhortos);

  closeForm();

  if (window.renderExhortos) {
    window.renderExhortos();
  }
}
