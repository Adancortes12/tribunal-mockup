// =====================================================
// MODULO AMPAROS
// =====================================================


import {
    getData,
    saveData
}
from "../storage.js";


import {
    createId,
    escapeHTML,
    escapeJS,
    formatDate
}
from "../utils.js";



let amparos = [];




// =====================================================
// INICIALIZAR
// =====================================================


export function initAmparos(){


    amparos =
        getData(
            "amparos",
            []
        );



    window.openAmparoForm =
        openAmparoForm;



    window.renderAmparos =
        renderAmparos;



    window.viewAmparo =
        viewAmparo;



}









// =====================================================
// RENDER TABLA
// =====================================================


export function renderAmparos(){


    const table =
        document.getElementById(
            "amparosTable"
        );



    if(!table){

        return;

    }






    if(
        amparos.length === 0
    ){


        table.innerHTML = `

        <tr>

        <td colspan="7">

        No existen amparos registrados.

        </td>

        </tr>

        `;


        return;

    }








    table.innerHTML =


    amparos.map(

        amparo => `



<tr>



<td>

${escapeHTML(
    formatDate(amparo.dia)
)}

</td>




<td>

${escapeHTML(
    amparo.hora
)}

</td>





<td>

${escapeHTML(
    amparo.expediente
)}

</td>





<td>

${escapeHTML(
    amparo.promueve
)}

</td>





<td>

${escapeHTML(
    amparo.juzgado
)}

</td>





<td>

${escapeHTML(
    amparo.oficio
)}

</td>





<td>


<button

class="table-action"

onclick="
viewAmparo('${escapeJS(amparo.id)}')
"

>

Ver

</button>



</td>



</tr>



`

    )

    .join("");

}









// =====================================================
// FORMULARIO AMPARO
// =====================================================


export function openAmparoForm(){



const modal =
document.getElementById(
    "modalContent"
);



if(!modal){

    return;

}





modal.innerHTML = `



<div class="form-header">


<span>
Amparos
</span>


<h2>
Nuevo amparo
</h2>


</div>







<div class="form-body">



<form id="amparoForm">






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

required

>


</div>







<div class="field">


<label>
Quién promueve
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
Qué se tiene que hacer
</label>


<textarea

id="amparoAccion"

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

Guardar amparo

</button>


</div>





</form>



</div>



`;






document
.getElementById(
    "modal"
)
.classList.add(
    "show"
);






document
.getElementById(
    "amparoForm"
)
.addEventListener(

    "submit",

    saveAmparo

);



}









// =====================================================
// GUARDAR
// =====================================================


function saveAmparo(
event
){


event.preventDefault();





const amparo = {


    id:

    createId(),



    dia:

    document
    .getElementById(
        "amparoDia"
    )
    .value,



    hora:

    document
    .getElementById(
        "amparoHora"
    )
    .value,



    expediente:

    document
    .getElementById(
        "amparoExpediente"
    )
    .value,



    promueve:

    document
    .getElementById(
        "amparoPromueve"
    )
    .value,



    juzgado:

    document
    .getElementById(
        "amparoJuzgado"
    )
    .value,



    oficio:

    document
    .getElementById(
        "amparoOficio"
    )
    .value,



    accion:

    document
    .getElementById(
        "amparoAccion"
    )
    .value,



    creadoEn:

    new Date()
    .toISOString()


};







amparos.unshift(
    amparo
);




saveData(
    "amparos",
    amparos
);




renderAmparos();



closeModal();



}









// =====================================================
// DETALLE
// =====================================================


export function viewAmparo(
id
){



const amparo =
amparos.find(

item =>

item.id === id

);





if(!amparo){

    return;

}







const modal =
document.getElementById(
    "modalContent"
);





modal.innerHTML = `



<div class="form-header">


<span>
Detalle amparo
</span>


<h2>
Expediente ${escapeHTML(amparo.expediente)}
</h2>


</div>






<div class="form-body">


<div class="detail-grid">



<div class="detail-item">

<span>
Promueve
</span>


<strong>
${escapeHTML(amparo.promueve)}
</strong>

</div>





<div class="detail-item">

<span>
Juzgado
</span>


<strong>
${escapeHTML(amparo.juzgado)}
</strong>

</div>





<div class="detail-item">

<span>
Oficio
</span>


<strong>
${escapeHTML(amparo.oficio)}
</strong>

</div>





<div class="detail-item">

<span>
Acción requerida
</span>


<strong>
${escapeHTML(amparo.accion)}
</strong>

</div>




</div>


</div>


`;





document
.getElementById(
    "modal"
)
.classList.add(
    "show"
);



}