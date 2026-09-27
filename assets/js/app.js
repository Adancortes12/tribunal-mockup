// =====================================================
// APP PRINCIPAL
// Sistema Tribunal
// =====================================================


import {
    setupModal
}
from "./modal.js";


import {
    initRouter,
    navigate
}
from "./router.js";


// Dashboard

import {
    initDashboard
}
from "./dashboard/home.js";


import {
    initResumen
}
from "./dashboard/resumen.js";


import {
    initHistorico
}
from "./dashboard/historico.js";



// Modules

import {
    initExpedientes
}
from "./modules/expedientes.js";


import {
    initDemandas
}
from "./modules/demandas.js";


import {
    initAmparos
}
from "./modules/amparos.js";


import {
    initExhortos
}
from "./modules/exhortos.js";


import {
    initPromociones
}
from "./modules/promociones.js";


import {
    initOficios
}
from "./modules/oficios.js";




// Forms

import {
    initExpedienteForm
}
from "./forms/expedienteForm.js";


import {
    initDemandaForm
}
from "./forms/demandaForm.js";


import {
    initAmparoForm
}
from "./forms/amparoForm.js";


import {
    initExhortoForm
}
from "./forms/exhortoForm.js";


import {
    initPromocionForm
}
from "./forms/promocionForm.js";


import {
    initOficioForm
}
from "./forms/oficioForm.js";







// =====================================================
// CARGAR COMPONENTES
// =====================================================


async function loadComponent(
    id,
    file
){


    const container =
        document.getElementById(id);



    if(!container){

        return;

    }



    const response =
        await fetch(file);



    const html =
        await response.text();



    container.innerHTML =
        html;


}








async function loadLayout(){


    await loadComponent(
        "sidebar-container",
        "components/sidebar.html"
    );


    await loadComponent(
        "navbar-container",
        "components/navbar.html"
    );


    await loadComponent(
        "modal-container",
        "components/modal.html"
    );


}








// =====================================================
// INICIALIZAR MODULOS
// =====================================================


function initModules(){


    initDashboard();

    initResumen();

    initHistorico();



    initExpedientes();

    initDemandas();

    initAmparos();

    initExhortos();

    initPromociones();

    initOficios();



    initExpedienteForm();

    initDemandaForm();

    initAmparoForm();

    initExhortoForm();

    initPromocionForm();

    initOficioForm();


}









// =====================================================
// EVENTOS
// =====================================================


function setupEvents(){


document.addEventListener(
"click",
event=>{


const button =
event.target.closest(
"[data-action]"
);



if(!button){

return;

}



const action =
button.dataset.action;



switch(action){



case "new-expediente":

window.openNewExpediente();

break;



case "new-demanda":

window.openDemandaForm();

break;



case "new-amparo":

window.openAmparoForm();

break;



case "new-exhorto":

window.openExhortoForm();

break;



case "new-promocion":

window.openPromocionForm();

break;



case "new-oficio":

window.openOficioForm();

break;



}



}

);



}









// =====================================================
// INICIO
// =====================================================


async function init(){



await loadLayout();



setupModal();



initRouter();



initModules();



setupEvents();



// cargar inicio

navigate(
"dashboard"
);



}



init();