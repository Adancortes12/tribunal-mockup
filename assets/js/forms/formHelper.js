// ============================================================
// FORM HELPER
// ============================================================


// ============================================================
// MOSTRAR MODAL
// ============================================================

export function showModal(
    content
) {

    const modal =
        document.getElementById(
            "modal"
        );


    const modalContent =
        document.getElementById(
            "modalContent"
        );


    if (
        !modal ||
        !modalContent
    ) {

        console.error(
            "No se encontró el modal global."
        );

        return;

    }


    modalContent.innerHTML =
        content;


    modal.classList.add(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );


    setupCloseButton();

}


// ============================================================
// CERRAR
// ============================================================

export function closeForm() {

    const modal =
        document.getElementById(
            "modal"
        );


    const modalContent =
        document.getElementById(
            "modalContent"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );


    if (modalContent) {

        modalContent.innerHTML = "";

    }

}


// ============================================================
// BOTÓN CERRAR
// ============================================================

function setupCloseButton() {

    const button =
        document.getElementById(
            "modalCloseBtn"
        );


    if (!button) {
        return;
    }


    button.onclick =
        closeForm;

}


// ============================================================
// ESC
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {
            return;
        }


        const modal =
            document.getElementById(
                "modal"
            );


        if (
            modal?.classList.contains(
                "show"
            )
        ) {

            closeForm();

        }

    }
);


// ============================================================
// IMPORTANTE
//
// No existe listener para:
// click sobre #modal => cerrar.
//
// Por lo tanto:
// click fuera del formulario NO cierra el modal.
// ============================================================