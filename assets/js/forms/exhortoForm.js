// =====================================================
// FORMULARIO EXHORTO
// =====================================================

import { closeForm } from "./formHelper.js";

import {
  openStandardForm,
  inputField,
  selectField,
  textareaField,
  checkField,
  formSection,
} from "./formKit.js";

import { createId } from "../utils.js";

import { getData, saveData } from "../storage.js";

export function initExhortoForm() {
  window.openExhortoForm = openExhortoForm;
}

export function openExhortoForm() {
  openStandardForm({
    eyebrow: "EXHORTOS",
    title: "Registrar nuevo exhorto",
    description: "Captura la información del exhorto recibido.",
    formId: "newExhortoForm",
    cancelId: "cancelExhortoBtn",
    submitLabel: "Registrar exhorto",
    onSubmit: saveExhorto,

    sections: [
      formSection({
        number: 1,
        title: "Recepción",
        description: "Número, fecha de llegada y origen.",
        fields: [
          inputField({
            id: "numeroExhorto",
            label: "Número de exhorto",
            required: true,
          }),

          inputField({
            id: "fechaExhorto",
            label: "Fecha de llegada",
            type: "date",
            required: true,
          }),

          inputField({
            id: "origenExhorto",
            label: "Número exhorto de origen",
            full: true,
          }),

          checkField({
            id: "exhortoInterno",
            label: "Exhorto interno",
          }),
        ],
      }),

      formSection({
        number: 2,
        title: "Partes y autoridad",
        description: "Actor demandado y autoridad exhortante.",
        fields: [
          inputField({
            id: "actorDemandado",
            label: "Actor demandado",
          }),

          inputField({
            id: "autoridadExhortante",
            label: "Autoridad exhortante",
          }),
        ],
      }),

      formSection({
        number: 3,
        title: "Estado y ubicación",
        description: "Situación actual del exhorto.",
        fields: [
          selectField({
            id: "estadoExhorto",
            label: "Estado",
            options: ["Recibido", "En trámite", "Concluido"],
          }),

          inputField({
            id: "ubicacionExhorto",
            label: "Ubicación",
          }),
        ],
      }),

      formSection({
        number: 4,
        title: "Contenido",
        description: "Promoción y requerimiento del exhorto.",
        fields: [
          textareaField({
            id: "promocionExhorto",
            label: "Promoción",
            placeholder: "Número de expediente y número de oficio",
          }),

          textareaField({
            id: "requerimientoExhorto",
            label: "Requerimiento o solicitud",
          }),
        ],
      }),
    ],
  });
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
    interno: exhortoInterno.checked,
    requerimiento: requerimientoExhorto.value,
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
