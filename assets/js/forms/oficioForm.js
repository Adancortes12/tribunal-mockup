// =====================================================
// FORMULARIO OFICIO
// =====================================================

import { closeForm } from "./formHelper.js";

import {
  openStandardForm,
  inputField,
  selectField,
  textareaField,
  formSection,
} from "./formKit.js";

import { createId, escapeHTML } from "../utils.js";

import { getData, saveData } from "../storage.js";

// Contexto con el que se abrió el formulario (p. ej. "Anexar oficio"
// desde Amparos). null = oficio normal.
let oficioContext = null;

export function initOficioForm() {
  window.openOficioForm = openOficioForm;
}

export function openOficioForm(context = null) {
  oficioContext = context && context.amparoId ? context : null;

  openStandardForm({
    eyebrow: "OFICIOS",
    title: "Registrar nuevo oficio",
    description: "Captura la información del oficio recibido.",
    formId: "newOficioForm",
    cancelId: "cancelOficioBtn",
    submitLabel: "Registrar oficio",
    onSubmit: saveOficio,

    sections: [
      formSection({
        number: 1,
        title: "Identificación",
        description: "Número de oficio, expediente y fecha.",
        columns: 3,
        fields: [
          inputField({
            id: "numeroOficio",
            label: "Número de oficio",
            required: true,
          }),

          inputField({
            id: "expedienteOficio",
            label: "Número expediente",
            placeholder: "Ej. 124/2026",
          }),

          inputField({
            id: "fechaOficio",
            label: "Fecha",
            type: "date",
            required: true,
          }),
        ],
      }),

      formSection({
        number: 2,
        title: "Procedencia y estado",
        description: "De dónde proviene y su situación actual.",
        fields: [
          inputField({
            id: "procedenciaOficio",
            label: "Procedencia",
          }),

          selectField({
            id: "estadoOficio",
            label: "Estado",
            options: ["Recibido", "En revisión", "Atendido"],
          }),
        ],
      }),

      formSection({
        number: 3,
        title: "Asunto",
        description: "Descripción del asunto del oficio.",
        fields: [
          textareaField({
            id: "asuntoOficio",
            label: "Asunto",
            rows: 4,
          }),
        ],
      }),
    ],
  });

  // Se ejecuta DESPUÉS de que el formulario ya existe en el DOM.
  applyOficioContext();
}

// Precarga los datos del amparo sin pisar lo que ya haya escrito
// y muestra a qué amparo quedará vinculado el oficio.
function applyOficioContext() {
  if (!oficioContext) {
    return;
  }

  const form = document.getElementById("newOficioForm");

  if (!form) {
    return;
  }

  const setIfEmpty = (id, value) => {
    const input = document.getElementById(id);

    if (input && !input.value && value) {
      input.value = value;
    }
  };

  setIfEmpty("expedienteOficio", oficioContext.expediente);

  // En un amparo, "juzgado" es el NÚMERO asignado por el juzgado
  // (ej. 843/2026), no una dependencia; por eso va en el asunto
  // y no en "Procedencia".
  const asunto = [
    "Amparo",
    oficioContext.juzgado || "",
    oficioContext.promovente ? `promovido por ${oficioContext.promovente}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  setIfEmpty("asuntoOficio", asunto);

  const detalle = [oficioContext.expediente, oficioContext.promovente]
    .filter(Boolean)
    .join(" · ");

  // Estilos en línea con la paleta del README (aún no existe oficios.css)
  form.insertAdjacentHTML(
    "afterbegin",
    `<div style="margin-bottom:12px;padding:10px 12px;border:1px solid #dce3ea;border-radius:7px;background:#e8f1ff;color:#102b45;font-size:13px;">
      <i class="fa-solid fa-paperclip"></i>
      Este oficio se vinculará al amparo
      <strong>${escapeHTML(detalle || "seleccionado")}</strong>
    </div>`,
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

  // Vínculo con el amparo (si se abrió con "Anexar oficio")
  if (oficioContext) {
    nuevoOficio.origen = "amparo";

    nuevoOficio.amparoId = oficioContext.amparoId;
  }

  oficios.unshift(nuevoOficio);

  saveData("oficios", oficios);

  linkOficioToAmparo(nuevoOficio);

  oficioContext = null;

  closeForm();

  if (window.renderOficios) {
    window.renderOficios();
  }

  if (window.renderAmparos) {
    window.renderAmparos();
  }
}

// Si el amparo aún no tiene número de oficio, se le asigna el nuevo.
// Nunca se sobrescribe un número ya capturado.
function linkOficioToAmparo(oficio) {
  if (!oficio.amparoId) {
    return;
  }

  const amparos = getData("amparos", []);

  const amparo = amparos.find(
    (item) => String(item.id) === String(oficio.amparoId),
  );

  if (amparo && !amparo.oficio && oficio.numero) {
    amparo.oficio = oficio.numero;

    saveData("amparos", amparos);
  }
}
