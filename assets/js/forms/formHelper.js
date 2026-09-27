// =====================================================
// FORM HELPERS
// Funciones comunes para formularios
// =====================================================


export function showModal(
    html
){


    const modal =
        document.getElementById(
            "modal"
        );


    const content =
        document.getElementById(
            "modalContent"
        );



    if(!modal || !content){

        console.error(
            "Modal no encontrado"
        );

        return;

    }



    content.innerHTML =
        html;



    modal.classList.add(
        "show"
    );


}





export function closeForm(){


    const modal =
        document.getElementById(
            "modal"
        );



    if(modal){

        modal.classList.remove(
            "show"
        );

    }


}





export function getValue(id){


    const element =
        document.getElementById(
            id
        );



    return element
    ?
    element.value.trim()
    :
    "";

}