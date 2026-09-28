// =====================================================
// FORMULARIO PROMOCION
// =====================================================

import { closeForm } from "./formHelper.js";

import {
  openStandardForm,
  inputField,
  selectField,
  textareaField,
  formSection,
} from "./formKit.js";

import { createId } from "../utils.js";

import { getData, saveData } from "../storage.js";

export function initPromocionForm() {
  window.openPromocionForm = openPromocionForm;
}

export function openPromocionForm() {
  openStandardForm({
    eyebrow: "PROMOCIONES",
    title: "Registrar nueva promoción",
    description: "Captura la información de la promoción recibida.",
    formId: "newPromocionForm",
    cancelId: "cancelPromocionBtn",
    submitLabel: "Registrar promoción",
    onSubmit: savePromocion,

    sections: [
      formSection({
        number: 1,
        title: "Identificación",
        description: "Número de promoción, expediente y fecha.",
        columns: 3,
        fields: [
          inputField({
            id: "numeroPromocion",
            label: "Número de promoción",
            required: true,
          }),

          inputField({
            id: "expedientePromocion",
            label: "Número expediente",
            placeholder: "Ej. 124/2026",
            required: true,
          }),

          inputField({
            id: "fechaPromocion",
            label: "Fecha",
            type: "date",
            required: true,
          }),
        ],
      }),

      formSection({
        number: 2,
        title: "Clasificación",
        description: "Oficio relacionado, tipo y estado.",
        columns: 3,
        fields: [
          inputField({
            id: "oficioPromocion",
            label: "Número oficio relacionado",
          }),

          selectField({
            id: "tipoPromocion",
            label: "Tipo de promoción",
            options: ["Escrito", "Solicitud", "Notificación", "Otro"],
          }),

          selectField({
            id: "estadoPromocion",
            label: "Estado",
            options: ["Recibida", "En revisión", "Atendida"],
          }),
        ],
      }),

      formSection({
        number: 3,
        title: "Descripción",
        description: "Detalle de la promoción.",
        fields: [
          textareaField({
            id: "descripcionPromocion",
            label: "Descripción",
            rows: 4,
          }),
        ],
      }),
    ],
  });
}

function savePromocion(event) {
  event.preventDefault();

  const promociones = getData("promociones", []);

  const nuevaPromocion = {
    id: createId(),

    numero: numeroPromocion.value,

    expediente: expedientePromocion.value,

    oficio: oficioPromocion.value,

    fecha: fechaPromocion.value,

    tipo: tipoPromocion.value,

    descripcion: descripcionPromocion.value,

    estado: estadoPromocion.value,

    creadoEn: new Date().toISOString(),
  };

  promociones.unshift(nuevaPromocion);

  saveData("promociones", promociones);

  closeForm();

  if (window.renderPromociones) {
    window.renderPromociones();
  }
}
