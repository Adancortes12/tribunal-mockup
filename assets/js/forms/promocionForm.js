// =====================================================
// FORMULARIO PROMOCION
// =====================================================


import {
    showModal,
    closeForm
}
from "./formHelper.js";


import {
    createId
}
from "../utils.js";


import {
    getData,
    saveData
}
from "../storage.js";





export function initPromocionForm(){


    window.openPromocionForm =
        openPromocionForm;


}









export function openPromocionForm(){



showModal(`


<div class="form-header">


<span>
Promociones
</span>


<h2>
Nueva promoción
</h2>


</div>





<div class="form-body">


<form id="newPromocionForm">





<div class="form-grid">





<div class="field">


<label>
Número de promoción
</label>


<input

id="numeroPromocion"

required

>


</div>







<div class="field">


<label>
Número expediente
</label>


<input

id="expedientePromocion"

required

>


</div>







<div class="field">


<label>
Número oficio relacionado
</label>


<input

id="oficioPromocion"

>


</div>







<div class="field">


<label>
Fecha
</label>


<input

type="date"

id="fechaPromocion"

required

>


</div>







<div class="field">


<label>
Tipo de promoción
</label>


<select

id="tipoPromocion"

>


<option>
Escrito
</option>


<option>
Solicitud
</option>


<option>
Notificación
</option>


<option>
Otro
</option>


</select>


</div>







<div class="field">


<label>
Estado
</label>


<select

id="estadoPromocion"

>


<option>
Recibida
</option>


<option>
En revisión
</option>


<option>
Atendida
</option>


</select>


</div>







<div class="field full">


<label>
Descripción
</label>


<textarea

id="descripcionPromocion"

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

Guardar promoción

</button>



</div>





</form>


</div>


`);








document
.getElementById(
"newPromocionForm"
)
.addEventListener(

"submit",

savePromocion

);



}









function savePromocion(
event
){


event.preventDefault();





const promociones =
getData(
"promociones",
[]
);







const nuevaPromocion = {




id:

createId(),





numero:

numeroPromocion.value,





expediente:

expedientePromocion.value,





oficio:

oficioPromocion.value,





fecha:

fechaPromocion.value,





tipo:

tipoPromocion.value,





descripcion:

descripcionPromocion.value,





estado:

estadoPromocion.value,





creadoEn:

new Date()
.toISOString()



};







promociones.unshift(
nuevaPromocion
);






saveData(
"promociones",
promociones
);






closeForm();






if(
window.renderPromociones
){

window.renderPromociones();

}



}