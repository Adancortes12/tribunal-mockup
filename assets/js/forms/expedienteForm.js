import { closeForm } from "./formHelper.js";

import {
  openStandardForm,
  inputField,
  selectField,
  formSection,
} from "./formKit.js";

import { createId } from "../utils.js";

import { getData, saveData } from "../storage.js";

export function initExpedienteForm() {
  window.openNewExpediente = openNewExpediente;
}

export function openNewExpediente() {
  openStandardForm({
    eyebrow: "EXPEDIENTES",
    title: "Registrar nuevo expediente",
    description: "Captura la información necesaria para dar de alta el expediente.",
    formId: "newExpedienteForm",
    cancelId: "cancelExpedienteBtn",
    submitLabel: "Registrar expediente",
    onSubmit: saveExpediente,

    sections: [
      formSection({
        number: 1,
        title: "Identificación",
        description: "Número y fecha de recepción.",
        fields: [
          inputField({
            id: "numeroExp",
            label: "Número expediente",
            placeholder: "Ej. 124/2026",
            required: true,
          }),

          inputField({
            id: "fechaExp",
            label: "Fecha recepción",
            type: "date",
            required: true,
          }),
        ],
      }),

      formSection({
        number: 2,
        title: "Partes",
        description: "Actor y demandado del expediente.",
        fields: [
          inputField({
            id: "actorExp",
            label: "Actor",
            placeholder: "Nombre del actor",
            required: true,
          }),

          inputField({
            id: "demandadoExp",
            label: "Demandado",
            placeholder: "Nombre del demandado",
            required: true,
          }),
        ],
      }),

      formSection({
        number: 3,
        title: "Clasificación y ubicación",
        description: "Clasificación, estado y dónde se encuentra.",
        fields: [
          selectField({
            id: "clasificacionExp",
            label: "Clasificación",
            options: ["OCL - Educación", "OJC - Salud"],
          }),

          selectField({
            id: "estadoExp",
            label: "Estado",
            options: ["Recibido", "En revisión", "Concluido"],
          }),

          inputField({
            id: "ubicacionExp",
            label: "Ubicación",
            placeholder: "Ej. Secretaría de Acuerdos",
            full: true,
          }),
        ],
      }),
    ],
  });
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
