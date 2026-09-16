// ==========================================================
// SISTEMA DE GESTIÓN DEL TRIBUNAL
// app.js
// ==========================================================


// ==========================================================
// UTILIDADES DE LOCALSTORAGE
// ==========================================================

function readStorage(key, fallback = []) {

  try {

    const data = localStorage.getItem(key);

    if (data === null) {
      return fallback;
    }

    return JSON.parse(data);

  } catch (error) {

    console.error(
      `Error leyendo ${key}:`,
      error
    );

    return fallback;

  }

}


function createId() {

  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 8)
  );

}


// ==========================================================
// DATOS INICIALES
// ==========================================================

const expedientesIniciales = [

  {
    id: createId(),

    numero: "124/2026",

    fecha: "2026-08-15",

    actor: "HAC COQUIMATLÁN",

    demandado: "SINDICATO",

    codemandado: "",

    entidad: "OTRO(S)",

    clasificacion: "OCL - Educación",

    estado: "En instrucción",

    ubicacion: "Secretaría de Acuerdos",

    creadoEn: "2026-08-15T10:00:00"
  },

  {
    id: createId(),

    numero: "125/2026",

    fecha: "2026-08-16",

    actor: "JUAN PÉREZ",

    demandado: "SECRETARÍA DE SALUD",

    codemandado: "",

    entidad: "Gobierno",

    clasificacion: "OJC - Salud",

    estado: "Recibido",

    ubicacion: "Oficialía de Partes",

    creadoEn: "2026-08-16T10:00:00"
  }

];


// ==========================================================
// CARGAR DATOS
// ==========================================================

let expedientes =
  readStorage(
    "expedientes",
    expedientesIniciales
  );


let demandas =
  readStorage(
    "demandas",
    []
  );


let amparos =
  readStorage(
    "amparos",
    []
  );


let exhortos =
  readStorage(
    "exhortos",
    []
  );


// ==========================================================
// MIGRACIÓN DE OFICIOS / PROMOCIONES ANTIGUOS
// ==========================================================
//
// En el proyecto anterior ambos se guardaban
// en localStorage bajo la llave "oficios".
// Aquí los separamos.
// ==========================================================

const documentosAntiguos =
  readStorage(
    "oficios",
    []
  );


let promociones;

if (
  localStorage.getItem("promociones") !== null
) {

  promociones =
    readStorage(
      "promociones",
      []
    );

} else {

  promociones =
    documentosAntiguos.filter(item => {

      const tipo =
        String(
          item.tipo || ""
        ).toLowerCase();

      return (
        tipo.includes("promoción") ||
        tipo.includes("promocion")
      );

    });

}


let oficios =
  documentosAntiguos.filter(item => {

    const tipo =
      String(
        item.tipo || ""
      ).toLowerCase();

    return !(
      tipo.includes("promoción") ||
      tipo.includes("promocion")
    );

  });


// ==========================================================
// GUARDAR DATOS
// ==========================================================

function saveData() {

  localStorage.setItem(
    "expedientes",
    JSON.stringify(expedientes)
  );

  localStorage.setItem(
    "demandas",
    JSON.stringify(demandas)
  );

  localStorage.setItem(
    "amparos",
    JSON.stringify(amparos)
  );

  localStorage.setItem(
    "exhortos",
    JSON.stringify(exhortos)
  );

  localStorage.setItem(
    "promociones",
    JSON.stringify(promociones)
  );

  localStorage.setItem(
    "oficios",
    JSON.stringify(oficios)
  );

}


// Guardamos para terminar la migración
saveData();


// ==========================================================
// UTILIDADES GENERALES
// ==========================================================

function escapeHTML(value) {

  return String(
    value ?? ""
  )
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function escapeJS(value) {

  return String(
    value ?? ""
  )
    .replaceAll("\\", "\\\\")
    .replaceAll("'", "\\'")
    .replaceAll("\n", "\\n")
    .replaceAll("\r", "");

}


function normalizeText(value) {

  return String(
    value ?? ""
  )
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .trim();

}


function truncateText(
  value,
  maxLength = 70
) {

  const text =
    String(
      value ?? ""
    );

  if (
    text.length <= maxLength
  ) {

    return text;

  }

  return (
    text.substring(
      0,
      maxLength
    ) + "..."
  );

}


// ==========================================================
// FECHAS
// ==========================================================

function getNowTimestamp() {

  return new Date().toISOString();

}


function getTodayISO() {

  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return (
    `${year}-${month}-${day}`
  );

}


function getCurrentTime() {

  const date =
    new Date();

  return (
    String(
      date.getHours()
    ).padStart(2, "0")
    +
    ":"
    +
    String(
      date.getMinutes()
    ).padStart(2, "0")
  );

}


function getLocalDateFromTimestamp(
  timestamp
) {

  if (!timestamp) {
    return "";
  }

  const date =
    new Date(timestamp);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "";

  }

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return (
    `${year}-${month}-${day}`
  );

}


function formatToday() {

  return new Date()
    .toLocaleDateString(
      "es-MX",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

}


function formatDateMX(value) {

  if (!value) {
    return "—";
  }


  // Evita problemas de zona horaria
  // con fechas YYYY-MM-DD

  const parts =
    value.split("-");


  if (
    parts.length === 3
  ) {

    return (
      `${parts[2]}/${parts[1]}/${parts[0]}`
    );

  }


  return value;

}


function formatDateTimeMX(
  timestamp,
  fallbackDate = ""
) {

  if (timestamp) {

    const date =
      new Date(timestamp);

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {

      return date
        .toLocaleString(
          "es-MX",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",

            hour: "2-digit",
            minute: "2-digit"
          }
        );

    }

  }


  if (fallbackDate) {

    return formatDateMX(
      fallbackDate
    );

  }


  return "—";

}


function formatCaptureTime(
  timestamp
) {

  if (!timestamp) {

    return "Sin hora";

  }


  const date =
    new Date(timestamp);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "Sin hora";

  }


  return date
    .toLocaleTimeString(
      "es-MX",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );

}


// ==========================================================
// FECHA REAL DE CAPTURA
// ==========================================================
//
// Los registros nuevos usan capturadoEn.
//
// Para datos viejos que todavía no tengan
// capturadoEn utilizamos la fecha del registro
// como respaldo.
// ==========================================================

function getRecordCaptureDate(
  item,
  fallbackField = "fecha"
) {

  if (
    item &&
    item.capturadoEn
  ) {

    return getLocalDateFromTimestamp(
      item.capturadoEn
    );

  }


  if (
    item &&
    item[fallbackField]
  ) {

    return item[
      fallbackField
    ];

  }


  return "";

}


function getRecordSortTime(
  item,
  fallbackField = "fecha"
) {

  if (
    item &&
    item.capturadoEn
  ) {

    const time =
      new Date(
        item.capturadoEn
      ).getTime();

    if (
      !Number.isNaN(time)
    ) {

      return time;

    }

  }


  const date =
    item?.[
      fallbackField
    ];


  if (date) {

    const time =
      new Date(
        `${date}T00:00:00`
      ).getTime();

    if (
      !Number.isNaN(time)
    ) {

      return time;

    }

  }


  return 0;

}


// ==========================================================
// NAVEGACIÓN
// ==========================================================

const navItems =
  document.querySelectorAll(
    ".nav-item[data-page]"
  );


function navigateTo(pageId) {

  const page =
    document.getElementById(
      pageId
    );


  if (!page) {

    console.error(
      `No existe la página: ${pageId}`
    );

    return;

  }


  document
    .querySelectorAll(
      ".page"
    )
    .forEach(item => {

      item.classList.remove(
        "active"
      );

    });


  page.classList.add(
    "active"
  );


  navItems.forEach(item => {

    item.classList.toggle(
      "active",
      item.dataset.page === pageId
    );

  });


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  renderAll();

}


navItems.forEach(item => {

  item.addEventListener(
    "click",
    () => {

      navigateTo(
        item.dataset.page
      );

    }
  );

});


// ==========================================================
// MODAL
// ==========================================================

function openModal(content) {

  const modal =
    document.getElementById(
      "modal"
    );

  const contentContainer =
    document.getElementById(
      "modalContent"
    );


  if (
    !modal ||
    !contentContainer
  ) {

    return;

  }


  contentContainer.innerHTML =
    content;


  modal.classList.add(
    "show"
  );


  document.body.style.overflow =
    "hidden";

}


function closeModal() {

  const modal =
    document.getElementById(
      "modal"
    );


  if (!modal) {
    return;
  }


  modal.classList.remove(
    "show"
  );


  document.body.style.overflow =
    "";

}


const modal =
  document.getElementById(
    "modal"
  );


if (modal) {

  modal.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {

        closeModal();

      }

    }
  );

}


document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {

      closeModal();

    }

  }
);


// ==========================================================
// LISTA DE EXPEDIENTES PARA DATALIST
// ==========================================================

function expedienteDatalist() {

  const options =
    expedientes
      .map(exp => {

        return `
          <option
            value="${escapeHTML(exp.numero)}"
          >
            ${escapeHTML(exp.actor)}
          </option>
        `;

      })
      .join("");


  return `

    <datalist id="listaExpedientes">
      ${options}
    </datalist>

  `;

}


function oficioDatalist() {

  const options =
    oficios
      .map(item => {

        return `

          <option
            value="${escapeHTML(item.numero)}"
          >
            ${escapeHTML(item.asunto)}
          </option>

        `;

      })
      .join("");


  return `

    <datalist id="listaOficios">
      ${options}
    </datalist>

  `;

}


// ==========================================================
// CREAR EXPEDIENTE
// ==========================================================

function openNewExpediente() {

  openModal(`

    <div class="form-header">

      <span>
        Expedientes
      </span>

      <h2>
        Crear nuevo expediente
      </h2>

    </div>


    <div class="form-body">


      <form id="expedienteForm">


        <div class="form-section">


          <div class="form-section-title">
            1. Información básica
          </div>


          <div class="form-grid three">


            <div class="field">

              <label>
                Número de expediente *
              </label>

              <input
                id="expNumero"
                placeholder="Ej. 126/2026"
                required
              />

            </div>


            <div class="field">

              <label>
                Fecha de recepción *
              </label>

              <input
                id="expFecha"
                type="date"
                value="${getTodayISO()}"
                required
              />

            </div>


            <div class="field">

              <label>
                Clasificación
              </label>

              <select id="expClasificacion">

                <option value="OCL - Educación">
                  OCL - Educación
                </option>

                <option value="OJC - Salud">
                  OJC - Salud
                </option>

              </select>

            </div>


          </div>


        </div>



        <div class="form-section">


          <div class="form-section-title">
            2. Partes principales
          </div>


          <div class="form-grid">


            <div class="field">

              <label>
                Actor / Demandante *
              </label>

              <input
                id="expActor"
                placeholder="Nombre del actor"
                required
              />

            </div>


            <div class="field">

              <label>
                Demandado *
              </label>

              <input
                id="expDemandado"
                placeholder="Nombre del demandado"
                required
              />

            </div>


            <div class="field">

              <label>
                Codemandado
              </label>

              <input
                id="expCodemandado"
                placeholder="Opcional"
              />

            </div>


            <div class="field">

              <label>
                Entidad pública
              </label>

              <input
                id="expEntidad"
                placeholder="Entidad pública"
              />

            </div>


          </div>


        </div>



        <div class="form-section">


          <div class="form-section-title">
            3. Seguimiento inicial
          </div>


          <div class="form-grid">


            <div class="field">

              <label>
                Estado *
              </label>

              <select id="expEstado">

                <option>
                  Recibido
                </option>

                <option>
                  En revisión
                </option>

                <option>
                  En instrucción
                </option>

                <option>
                  Pendiente
                </option>

                <option>
                  Convenio
                </option>

                <option>
                  Laudo
                </option>

                <option>
                  Ejecución
                </option>

                <option>
                  Concluido
                </option>

                <option>
                  Histórico
                </option>

              </select>

            </div>


            <div class="field">

              <label>
                Ubicación *
              </label>

              <select id="expUbicacion">

                <option>
                  Oficialía de Partes
                </option>

                <option>
                  Secretaría de Acuerdos
                </option>

                <option>
                  Presidencia
                </option>

                <option>
                  Actuaría
                </option>

                <option>
                  Archivo
                </option>

              </select>

            </div>


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
            type="submit"
            class="primary-btn"
          >

            Crear expediente

          </button>


        </div>


      </form>


    </div>

  `);


  const form =
    document.getElementById(
      "expedienteForm"
    );


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const numero =
        document
          .getElementById(
            "expNumero"
          )
          .value
          .trim();


      const existe =
        expedientes.some(exp => {

          return (
            normalizeText(
              exp.numero
            )
            ===
            normalizeText(
              numero
            )
          );

        });


      if (existe) {

        alert(
          "Ya existe un expediente con ese número."
        );

        return;

      }


      const expediente = {

        id: createId(),

        numero,

        fecha:
          document
            .getElementById(
              "expFecha"
            )
            .value,

        actor:
          document
            .getElementById(
              "expActor"
            )
            .value
            .trim(),

        demandado:
          document
            .getElementById(
              "expDemandado"
            )
            .value
            .trim(),

        codemandado:
          document
            .getElementById(
              "expCodemandado"
            )
            .value
            .trim(),

        entidad:
          document
            .getElementById(
              "expEntidad"
            )
            .value
            .trim(),

        clasificacion:
          document
            .getElementById(
              "expClasificacion"
            )
            .value,

        estado:
          document
            .getElementById(
              "expEstado"
            )
            .value,

        ubicacion:
          document
            .getElementById(
              "expUbicacion"
            )
            .value,

        creadoEn:
          getNowTimestamp()

      };


      expedientes.unshift(
        expediente
      );


      saveData();

      renderAll();

      closeModal();

    }
  );

}


// ==========================================================
// ABRIR FORMULARIOS
// ==========================================================

function openForm(type) {

  switch (type) {

    case "demandaForm":

      demandaForm();

      break;


    case "amparoForm":

      amparoForm();

      break;


    case "exhortoForm":

      exhortoForm();

      break;


    case "promocionForm":

      promocionForm();

      break;


    case "oficioForm":

      oficioForm();

      break;

  }

}


// ==========================================================
// FORMULARIO DEMANDA
// ==========================================================

function demandaForm() {

  openModal(`

    <div class="form-header">

      <span>
        Demandas
      </span>

      <h2>
        Registrar nueva demanda
      </h2>

    </div>


    <div class="form-body">


      <form id="demandaFormElement">


        ${expedienteDatalist()}


        <div class="form-section">

          <div class="form-section-title">
            1. Identificación
          </div>


          <div class="form-grid">


            <div class="field">

              <label>
                Número de expediente *
              </label>

              <input
                id="demExp"
                list="listaExpedientes"
                placeholder="Ej. 124/2026"
                required
              />

            </div>


            <div class="field">

              <label>
                Fecha en la que llega *
              </label>

              <input
                id="demFecha"
                type="date"
                value="${getTodayISO()}"
                required
              />

            </div>


          </div>

        </div>



        <div class="form-section">

          <div class="form-section-title">
            2. Partes involucradas
          </div>


          <div class="form-grid">


            <div class="field">

              <label>
                Quien demanda / Demandante *
              </label>

              <input
                id="demActor"
                required
              />

            </div>


            <div class="field">

              <label>
                A quien se demanda *
              </label>

              <input
                id="demDemandado"
                required
              />

            </div>


          </div>

        </div>



        <div class="form-section">

          <div class="form-section-title">
            3. Información de la demanda
          </div>


          <div class="form-grid">


            <div class="field full">

              <label>
                Actos de la demanda *
              </label>

              <textarea
                id="demActos"
                required
              ></textarea>

            </div>


            <div class="field">

              <label>
                Acción y prestaciones
              </label>

              <textarea
                id="demPrestaciones"
              ></textarea>

            </div>


            <div class="field">

              <label>
                Acción reclamada
              </label>

              <textarea
                id="demAccion"
              ></textarea>

            </div>


          </div>

        </div>



        <div class="form-section">

          <div class="form-section-title">
            4. Seguimiento
          </div>


          <div class="form-grid">


            <div class="field">

              <label>
                Estado
              </label>

              <select id="demEstado">

                <option>
                  Recibido
                </option>

                <option>
                  En revisión
                </option>

                <option>
                  En instrucción
                </option>

                <option>
                  Pendiente
                </option>

                <option>
                  Concluido
                </option>

              </select>

            </div>


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
            type="submit"
            class="primary-btn"
          >

            Registrar demanda

          </button>


        </div>


      </form>


    </div>

  `);


  bindExpedienteAutofill(
    "demExp",
    "demActor",
    "demDemandado"
  );


  document
    .getElementById(
      "demandaFormElement"
    )
    .addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const demanda = {

          id: createId(),

          capturadoEn:
            getNowTimestamp(),

          expediente:
            document
              .getElementById(
                "demExp"
              )
              .value
              .trim(),

          fecha:
            document
              .getElementById(
                "demFecha"
              )
              .value,

          actor:
            document
              .getElementById(
                "demActor"
              )
              .value
              .trim(),

          demandado:
            document
              .getElementById(
                "demDemandado"
              )
              .value
              .trim(),

          actos:
            document
              .getElementById(
                "demActos"
              )
              .value
              .trim(),

          prestaciones:
            document
              .getElementById(
                "demPrestaciones"
              )
              .value
              .trim(),

          accion:
            document
              .getElementById(
                "demAccion"
              )
              .value
              .trim(),

          estado:
            document
              .getElementById(
                "demEstado"
              )
              .value

        };


        demandas.unshift(
          demanda
        );


        saveData();

        renderAll();

        closeModal();

      }
    );

}


// ==========================================================
// FORMULARIO AMPARO
// ==========================================================

function amparoForm() {

  openModal(`

    <div class="form-header">

      <span>
        Amparos
      </span>

      <h2>
        Registrar nuevo amparo
      </h2>

    </div>


    <div class="form-body">


      <form id="amparoFormElement">


        ${expedienteDatalist()}

        ${oficioDatalist()}


        <div class="form-section">

          <div class="form-section-title">
            1. Recepción
          </div>


          <div class="form-grid three">


            <div class="field">

              <label>
                Día *
              </label>

              <input
                id="ampDia"
                type="date"
                value="${getTodayISO()}"
                required
              />

            </div>


            <div class="field">

              <label>
                Hora *
              </label>

              <input
                id="ampHora"
                type="time"
                value="${getCurrentTime()}"
                required
              />

            </div>


            <div class="field">

              <label>
                Número de expediente *
              </label>

              <input
                id="ampExp"
                list="listaExpedientes"
                required
              />

            </div>


          </div>

        </div>



        <div class="form-section">

          <div class="form-section-title">
            2. Información del amparo
          </div>


          <div class="form-grid">


            <div class="field">

              <label>
                Quien promueve el amparo *
              </label>

              <input
                id="ampPromueve"
                required
              />

            </div>


            <div class="field">

              <label>
                Número asignado en el juzgado
              </label>

              <input
                id="ampJuzgado"
              />

            </div>


            <div class="field full">

              <label>
                Qué se tiene que hacer *
              </label>

              <textarea
                id="ampAccion"
                required
              ></textarea>

            </div>


            <div class="field">

              <label>
                No. de oficio previamente registrado
              </label>

              <input
                id="ampOficio"
                list="listaOficios"
              />

            </div>


            <div class="field">

              <label>
                Estado
              </label>

              <select id="ampEstado">

                <option>
                  Recibido
                </option>

                <option>
                  En trámite
                </option>

                <option>
                  Pendiente
                </option>

                <option>
                  Concluido
                </option>

              </select>

            </div>


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
            type="submit"
            class="primary-btn"
          >
            Registrar amparo
          </button>


        </div>


      </form>


    </div>

  `);


  document
    .getElementById(
      "amparoFormElement"
    )
    .addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const amparo = {

          id: createId(),

          capturadoEn:
            getNowTimestamp(),

          dia:
            document
              .getElementById(
                "ampDia"
              )
              .value,

          hora:
            document
              .getElementById(
                "ampHora"
              )
              .value,

          expediente:
            document
              .getElementById(
                "ampExp"
              )
              .value
              .trim(),

          promovente:
            document
              .getElementById(
                "ampPromueve"
              )
              .value
              .trim(),

          juzgado:
            document
              .getElementById(
                "ampJuzgado"
              )
              .value
              .trim(),

          accion:
            document
              .getElementById(
                "ampAccion"
              )
              .value
              .trim(),

          oficio:
            document
              .getElementById(
                "ampOficio"
              )
              .value
              .trim(),

          estado:
            document
              .getElementById(
                "ampEstado"
              )
              .value

        };


        amparos.unshift(
          amparo
        );


        saveData();

        renderAll();

        closeModal();

      }
    );

}


// ==========================================================
// FORMULARIO EXHORTO
// ==========================================================

function exhortoForm() {

  openModal(`

    <div class="form-header">

      <span>
        Exhortos
      </span>

      <h2>
        Registrar nuevo exhorto
      </h2>

    </div>


    <div class="form-body">


      <form id="exhortoFormElement">


        ${expedienteDatalist()}

        ${oficioDatalist()}


        <div class="form-section">

          <div class="form-section-title">
            1. Identificación
          </div>


          <div class="form-grid three">


            <div class="field">

              <label>
                Número de exhorto *
              </label>

              <input
                id="exNumero"
                required
              />

            </div>


            <div class="field">

              <label>
                Cuando llegó *
              </label>

              <input
                id="exFecha"
                type="date"
                value="${getTodayISO()}"
                required
              />

            </div>


            <div class="field">

              <label>
                Número de exhorto de origen
              </label>

              <input
                id="exOrigen"
              />

            </div>


          </div>

        </div>



        <div class="form-section">

          <div class="form-section-title">
            2. Partes
          </div>


          <div class="form-grid">


            <div class="field">

              <label>
                Actor *
              </label>

              <input
                id="exActor"
                required
              />

            </div>


            <div class="field">

              <label>
                Demandado *
              </label>

              <input
                id="exDemandado"
                required
              />

            </div>


          </div>

        </div>



        <div class="form-section">

          <div class="form-section-title">
            3. Autoridad
          </div>


          <div class="form-grid">


            <div class="field full">

              <label>
                Autoridad exhortante *
              </label>

              <input
                id="exAutoridad"
                required
              />

            </div>


          </div>

        </div>



        <div class="form-section">

          <div class="form-section-title">
            4. Promoción relacionada
          </div>


          <div class="form-grid">


            <div class="field">

              <label>
                Número de expediente
              </label>

              <input
                id="exExp"
                list="listaExpedientes"
              />

            </div>


            <div class="field">

              <label>
                Número de oficio
              </label>

              <input
                id="exOficio"
                list="listaOficios"
              />

            </div>


          </div>

        </div>



        <div class="form-section">

          <div class="form-section-title">
            5. Seguimiento
          </div>


          <div class="form-grid">


            <div class="field">

              <label>
                Estado
              </label>

              <select id="exEstado">

                <option>
                  Recibido
                </option>

                <option>
                  En trámite
                </option>

                <option>
                  Pendiente
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

              <select id="exUbicacion">

                <option>
                  Oficialía de Partes
                </option>

                <option>
                  Secretaría de Acuerdos
                </option>

                <option>
                  Presidencia
                </option>

                <option>
                  Actuaría
                </option>

                <option>
                  Archivo
                </option>

              </select>

            </div>


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
            type="submit"
            class="primary-btn"
          >
            Registrar exhorto
          </button>

        </div>


      </form>


    </div>

  `);


  bindExpedienteAutofill(
    "exExp",
    "exActor",
    "exDemandado"
  );


  document
    .getElementById(
      "exhortoFormElement"
    )
    .addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const exhorto = {

          id: createId(),

          capturadoEn:
            getNowTimestamp(),

          numero:
            document
              .getElementById(
                "exNumero"
              )
              .value
              .trim(),

          fecha:
            document
              .getElementById(
                "exFecha"
              )
              .value,

          origen:
            document
              .getElementById(
                "exOrigen"
              )
              .value
              .trim(),

          actor:
            document
              .getElementById(
                "exActor"
              )
              .value
              .trim(),

          demandado:
            document
              .getElementById(
                "exDemandado"
              )
              .value
              .trim(),

          autoridad:
            document
              .getElementById(
                "exAutoridad"
              )
              .value
              .trim(),

          expediente:
            document
              .getElementById(
                "exExp"
              )
              .value
              .trim(),

          oficio:
            document
              .getElementById(
                "exOficio"
              )
              .value
              .trim(),

          estado:
            document
              .getElementById(
                "exEstado"
              )
              .value,

          ubicacion:
            document
              .getElementById(
                "exUbicacion"
              )
              .value

        };


        exhortos.unshift(
          exhorto
        );


        saveData();

        renderAll();

        closeModal();

      }
    );

}


// ==========================================================
// FORMULARIO PROMOCIÓN
// ==========================================================

function promocionForm() {

  openModal(`

    <div class="form-header">

      <span>
        Promociones
      </span>

      <h2>
        Registrar nueva promoción
      </h2>

    </div>


    <div class="form-body">


      <form id="promocionFormElement">


        ${expedienteDatalist()}


        <div class="form-section">

          <div class="form-section-title">
            Información de la promoción
          </div>


          <div class="form-grid three">


            <div class="field">

              <label>
                Número *
              </label>

              <input
                id="proNumero"
                placeholder="Ej. 234/2026"
                required
              />

            </div>


            <div class="field">

              <label>
                Fecha de recepción *
              </label>

              <input
                id="proFecha"
                type="date"
                value="${getTodayISO()}"
                required
              />

            </div>


            <div class="field">

              <label>
                Estado
              </label>

              <select id="proEstado">

                <option>
                  Recibido
                </option>

                <option>
                  En trámite
                </option>

                <option>
                  Atendido
                </option>

                <option>
                  Archivado
                </option>

              </select>

            </div>


            <div class="field full">

              <label>
                Número de expediente relacionado *
              </label>

              <input
                id="proExp"
                list="listaExpedientes"
                placeholder="Ej. 124/2026"
                required
              />

            </div>


            <div class="field">

              <label>
                Procedencia
              </label>

              <input
                id="proProcedencia"
              />

            </div>


            <div class="field">

              <label>
                Asunto *
              </label>

              <input
                id="proAsunto"
                required
              />

            </div>


            <div class="field full">

              <label>
                Descripción / Observaciones
              </label>

              <textarea
                id="proDescripcion"
              ></textarea>

            </div>


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
            type="submit"
            class="primary-btn"
          >
            Registrar promoción
          </button>

        </div>


      </form>


    </div>

  `);


  document
    .getElementById(
      "promocionFormElement"
    )
    .addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const promocion = {

          id: createId(),

          tipo: "Promoción",

          capturadoEn:
            getNowTimestamp(),

          numero:
            document
              .getElementById(
                "proNumero"
              )
              .value
              .trim(),

          fecha:
            document
              .getElementById(
                "proFecha"
              )
              .value,

          expediente:
            document
              .getElementById(
                "proExp"
              )
              .value
              .trim(),

          procedencia:
            document
              .getElementById(
                "proProcedencia"
              )
              .value
              .trim(),

          asunto:
            document
              .getElementById(
                "proAsunto"
              )
              .value
              .trim(),

          descripcion:
            document
              .getElementById(
                "proDescripcion"
              )
              .value
              .trim(),

          estado:
            document
              .getElementById(
                "proEstado"
              )
              .value

        };


        promociones.unshift(
          promocion
        );


        saveData();

        renderAll();

        closeModal();

      }
    );

}


// ==========================================================
// FORMULARIO OFICIO
// ==========================================================

function oficioForm() {

  openModal(`

    <div class="form-header">

      <span>
        Oficios
      </span>

      <h2>
        Registrar nuevo oficio
      </h2>

    </div>


    <div class="form-body">


      <form id="oficioFormElement">


        ${expedienteDatalist()}


        <div class="form-section">

          <div class="form-section-title">
            Información del oficio
          </div>


          <div class="form-grid three">


            <div class="field">

              <label>
                Número *
              </label>

              <input
                id="ofNumero"
                placeholder="Ej. 345/2026"
                required
              />

            </div>


            <div class="field">

              <label>
                Fecha de recepción *
              </label>

              <input
                id="ofFecha"
                type="date"
                value="${getTodayISO()}"
                required
              />

            </div>


            <div class="field">

              <label>
                Estado
              </label>

              <select id="ofEstado">

                <option>
                  Recibido
                </option>

                <option>
                  En trámite
                </option>

                <option>
                  Atendido
                </option>

                <option>
                  Archivado
                </option>

              </select>

            </div>


            <div class="field full">

              <label>
                Número de expediente relacionado *
              </label>

              <input
                id="ofExp"
                list="listaExpedientes"
                placeholder="Ej. 124/2026"
                required
              />

            </div>


            <div class="field">

              <label>
                Procedencia
              </label>

              <input
                id="ofProcedencia"
              />

            </div>


            <div class="field">

              <label>
                Asunto *
              </label>

              <input
                id="ofAsunto"
                required
              />

            </div>


            <div class="field full">

              <label>
                Descripción / Observaciones
              </label>

              <textarea
                id="ofDescripcion"
              ></textarea>

            </div>


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
            type="submit"
            class="primary-btn"
          >
            Registrar oficio
          </button>

        </div>


      </form>


    </div>

  `);


  document
    .getElementById(
      "oficioFormElement"
    )
    .addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const oficio = {

          id: createId(),

          tipo: "Oficio",

          capturadoEn:
            getNowTimestamp(),

          numero:
            document
              .getElementById(
                "ofNumero"
              )
              .value
              .trim(),

          fecha:
            document
              .getElementById(
                "ofFecha"
              )
              .value,

          expediente:
            document
              .getElementById(
                "ofExp"
              )
              .value
              .trim(),

          procedencia:
            document
              .getElementById(
                "ofProcedencia"
              )
              .value
              .trim(),

          asunto:
            document
              .getElementById(
                "ofAsunto"
              )
              .value
              .trim(),

          descripcion:
            document
              .getElementById(
                "ofDescripcion"
              )
              .value
              .trim(),

          estado:
            document
              .getElementById(
                "ofEstado"
              )
              .value

        };


        oficios.unshift(
          oficio
        );


        saveData();

        renderAll();

        closeModal();

      }
    );

}


// ==========================================================
// AUTOCOMPLETAR DATOS DEL EXPEDIENTE
// ==========================================================

function bindExpedienteAutofill(
  expedienteInputId,
  actorInputId,
  demandadoInputId
) {

  const expedienteInput =
    document.getElementById(
      expedienteInputId
    );


  if (!expedienteInput) {
    return;
  }


  expedienteInput.addEventListener(
    "change",
    () => {

      const numero =
        expedienteInput
          .value
          .trim();


      const expediente =
        expedientes.find(item => {

          return (
            normalizeText(
              item.numero
            )
            ===
            normalizeText(
              numero
            )
          );

        });


      if (!expediente) {
        return;
      }


      const actorInput =
        document.getElementById(
          actorInputId
        );

      const demandadoInput =
        document.getElementById(
          demandadoInputId
        );


      if (
        actorInput &&
        !actorInput.value
      ) {

        actorInput.value =
          expediente.actor || "";

      }


      if (
        demandadoInput &&
        !demandadoInput.value
      ) {

        demandadoInput.value =
          expediente.demandado || "";

      }

    }
  );

}


// ==========================================================
// VER EXPEDIENTE
// ==========================================================

function viewExpediente(numero) {

  const expediente =
    expedientes.find(item => {

      return (
        item.numero === numero
      );

    });


  if (!expediente) {
    return;
  }


  const totalDemandas =
    demandas.filter(item => {

      return (
        item.expediente === numero
      );

    }).length;


  const totalAmparos =
    amparos.filter(item => {

      return (
        item.expediente === numero
      );

    }).length;


  const totalExhortos =
    exhortos.filter(item => {

      return (
        item.expediente === numero
      );

    }).length;


  const totalPromociones =
    promociones.filter(item => {

      return (
        item.expediente === numero
      );

    }).length;


  const totalOficios =
    oficios.filter(item => {

      return (
        item.expediente === numero
      );

    }).length;


  openModal(`

    <div class="form-header">

      <span>
        Expediente digital
      </span>

      <h2>
        Expediente ${escapeHTML(expediente.numero)}
      </h2>

    </div>


    <div class="form-body">


      <span class="badge badge-blue">

        ${escapeHTML(expediente.estado)}

      </span>



      <div class="detail-grid">


        <div class="detail-item">

          <span>
            Fecha de recepción
          </span>

          <strong>
            ${escapeHTML(
              formatDateMX(
                expediente.fecha
              )
            )}
          </strong>

        </div>


        <div class="detail-item">

          <span>
            Clasificación
          </span>

          <strong>
            ${escapeHTML(expediente.clasificacion)}
          </strong>

        </div>


        <div class="detail-item">

          <span>
            Actor
          </span>

          <strong>
            ${escapeHTML(expediente.actor)}
          </strong>

        </div>


        <div class="detail-item">

          <span>
            Demandado
          </span>

          <strong>
            ${escapeHTML(expediente.demandado)}
          </strong>

        </div>


        <div class="detail-item">

          <span>
            Codemandado
          </span>

          <strong>
            ${escapeHTML(
              expediente.codemandado || "—"
            )}
          </strong>

        </div>


        <div class="detail-item">

          <span>
            Entidad pública
          </span>

          <strong>
            ${escapeHTML(
              expediente.entidad || "—"
            )}
          </strong>

        </div>


        <div class="detail-item">

          <span>
            Estado
          </span>

          <strong>
            ${escapeHTML(expediente.estado)}
          </strong>

        </div>


        <div class="detail-item">

          <span>
            Ubicación actual
          </span>

          <strong>
            ${escapeHTML(expediente.ubicacion)}
          </strong>

        </div>


      </div>



      <div
        class="form-section"
        style="margin-top:18px;"
      >

        <div class="form-section-title">
          Registros relacionados
        </div>


        <div class="form-grid three">


          <div class="detail-item">
            <span>Demandas</span>
            <strong>${totalDemandas}</strong>
          </div>


          <div class="detail-item">
            <span>Amparos</span>
            <strong>${totalAmparos}</strong>
          </div>


          <div class="detail-item">
            <span>Exhortos</span>
            <strong>${totalExhortos}</strong>
          </div>


          <div class="detail-item">
            <span>Promociones</span>
            <strong>${totalPromociones}</strong>
          </div>


          <div class="detail-item">
            <span>Oficios</span>
            <strong>${totalOficios}</strong>
          </div>


        </div>

      </div>



      <div class="form-actions">

        <button
          class="secondary-btn"
          onclick="closeModal()"
        >
          Cerrar
        </button>

      </div>


    </div>

  `);

}


// ==========================================================
// BUSCAR EXPEDIENTE EN INICIO
// ==========================================================

const searchExpedienteBtn =
  document.getElementById(
    "searchExpedienteBtn"
  );


if (searchExpedienteBtn) {

  searchExpedienteBtn.addEventListener(
    "click",
    searchExpediente
  );

}


const expedienteSearch =
  document.getElementById(
    "expedienteSearch"
  );


if (expedienteSearch) {

  expedienteSearch.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter"
      ) {

        searchExpediente();

      }

    }
  );

}


function searchExpediente() {

  const input =
    document.getElementById(
      "expedienteSearch"
    );


  const container =
    document.getElementById(
      "searchResult"
    );


  if (
    !input ||
    !container
  ) {

    return;

  }


  const search =
    normalizeText(
      input.value
    );


  if (!search) {

    container.innerHTML = "";

    return;

  }


  const result =
    expedientes.find(exp => {

      return (
        normalizeText(
          exp.numero
        ) === search
      );

    });


  if (result) {

    container.innerHTML = `

      <div class="search-success">

        <strong>
          Expediente ${escapeHTML(result.numero)}
        </strong>

        <br>

        ${escapeHTML(result.actor)}

        vs

        ${escapeHTML(result.demandado)}

        <br><br>

        <button
          class="table-action"
          onclick="viewExpediente('${escapeJS(result.numero)}')"
        >
          Abrir expediente →
        </button>

      </div>

    `;

  } else {

    container.innerHTML = `

      <div class="search-error">

        No se encontró el expediente.

        <br><br>

        <button
          class="table-action"
          onclick="openNewExpediente()"
        >
          Crear nuevo expediente
        </button>

      </div>

    `;

  }

}


// ==========================================================
// BUSCADOR GLOBAL
// ==========================================================

const globalSearch =
  document.getElementById(
    "globalSearch"
  );


if (globalSearch) {

  globalSearch.addEventListener(
    "keydown",
    event => {

      if (
        event.key !== "Enter"
      ) {

        return;

      }


      const search =
        normalizeText(
          event.target.value
        );


      if (!search) {
        return;
      }


      const expediente =
        expedientes.find(item => {

          const text = normalizeText(`

            ${item.numero}

            ${item.actor}

            ${item.demandado}

            ${item.entidad}

          `);


          return text.includes(
            search
          );

        });


      if (expediente) {

        viewExpediente(
          expediente.numero
        );

        return;

      }


      const resultados = [];


      demandas.forEach(item => {

        const text =
          normalizeText(`

            ${item.expediente}

            ${item.actor}

            ${item.demandado}

            ${item.actos}

          `);


        if (
          text.includes(search)
        ) {

          resultados.push({

            tipo: "Demanda",

            referencia:
              item.expediente,

            detalle:
              item.actor

          });

        }

      });


      amparos.forEach(item => {

        const text =
          normalizeText(`

            ${item.expediente}

            ${item.promovente}

            ${item.juzgado}

            ${item.oficio}

          `);


        if (
          text.includes(search)
        ) {

          resultados.push({

            tipo: "Amparo",

            referencia:
              item.expediente,

            detalle:
              item.promovente

          });

        }

      });


      promociones.forEach(item => {

        const text =
          normalizeText(`

            ${item.numero}

            ${item.expediente}

            ${item.asunto}

          `);


        if (
          text.includes(search)
        ) {

          resultados.push({

            tipo: "Promoción",

            referencia:
              item.numero,

            detalle:
              item.asunto

          });

        }

      });


      oficios.forEach(item => {

        const text =
          normalizeText(`

            ${item.numero}

            ${item.expediente}

            ${item.asunto}

          `);


        if (
          text.includes(search)
        ) {

          resultados.push({

            tipo: "Oficio",

            referencia:
              item.numero,

            detalle:
              item.asunto

          });

        }

      });


      showGlobalResults(
        resultados
      );

    }
  );

}


function showGlobalResults(
  resultados
) {

  if (
    resultados.length === 0
  ) {

    alert(
      "No se encontraron coincidencias."
    );

    return;

  }


  const content =
    resultados
      .slice(0, 10)
      .map(item => `

        <div class="detail-item">

          <span>
            ${escapeHTML(item.tipo)}
          </span>

          <strong>
            ${escapeHTML(item.referencia)}
          </strong>

          <div
            style="
              margin-top:5px;
              font-size:10px;
              color:#667483;
            "
          >

            ${escapeHTML(item.detalle)}

          </div>

        </div>

      `)
      .join("");


  openModal(`

    <div class="form-header">

      <span>
        Búsqueda
      </span>

      <h2>
        Resultados encontrados
      </h2>

    </div>


    <div class="form-body">

      <div class="detail-grid">

        ${content}

      </div>

    </div>

  `);

}


// ==========================================================
// FILTRO DE EXPEDIENTES
// ==========================================================

const filterExpedientes =
  document.getElementById(
    "filterExpedientes"
  );


if (filterExpedientes) {

  filterExpedientes.addEventListener(
    "input",
    event => {

      renderExpedientes(
        event.target.value
      );

    }
  );

}


// ==========================================================
// RENDER EXPEDIENTES
// ==========================================================

function renderExpedientes(
  filter = ""
) {

  const tbody =
    document.getElementById(
      "expedientesTable"
    );


  if (!tbody) {
    return;
  }


  const search =
    normalizeText(
      filter
    );


  const filtered =
    expedientes.filter(exp => {

      const text =
        normalizeText(`

          ${exp.numero}

          ${exp.actor}

          ${exp.demandado}

          ${exp.estado}

          ${exp.ubicacion}

          ${exp.clasificacion}

        `);


      return text.includes(
        search
      );

    });


  if (
    filtered.length === 0
  ) {

    tbody.innerHTML =
      emptyRow(8);

    return;

  }


  tbody.innerHTML =
    filtered
      .map(exp => `

        <tr>

          <td>
            <strong>
              ${escapeHTML(exp.numero)}
            </strong>
          </td>

          <td>
            ${escapeHTML(
              formatDateMX(exp.fecha)
            )}
          </td>

          <td>
            ${escapeHTML(exp.actor)}
          </td>

          <td>
            ${escapeHTML(exp.demandado)}
          </td>

          <td>

            <span class="badge badge-gray">

              ${escapeHTML(exp.clasificacion)}

            </span>

          </td>

          <td>

            <span class="badge badge-blue">

              ${escapeHTML(exp.estado)}

            </span>

          </td>

          <td>
            ${escapeHTML(exp.ubicacion)}
          </td>

          <td>

            <button
              class="table-action"
              onclick="viewExpediente('${escapeJS(exp.numero)}')"
            >

              Ver

            </button>

          </td>

        </tr>

      `)
      .join("");

}


// ==========================================================
// EXPEDIENTES RECIENTES
// ==========================================================

function renderRecent() {

  const tbody =
    document.getElementById(
      "recentTable"
    );


  if (!tbody) {
    return;
  }


  const recent =
    expedientes.slice(
      0,
      5
    );


  if (
    recent.length === 0
  ) {

    tbody.innerHTML =
      emptyRow(6);

    return;

  }


  tbody.innerHTML =
    recent
      .map(exp => `

        <tr>

          <td>

            <strong>
              ${escapeHTML(exp.numero)}
            </strong>

          </td>

          <td>
            ${escapeHTML(exp.actor)}
          </td>

          <td>
            ${escapeHTML(exp.demandado)}
          </td>

          <td>

            <span class="badge badge-blue">

              ${escapeHTML(exp.estado)}

            </span>

          </td>

          <td>
            ${escapeHTML(exp.ubicacion)}
          </td>

          <td>

            <button
              class="table-action"
              onclick="viewExpediente('${escapeJS(exp.numero)}')"
            >

              Abrir

            </button>

          </td>

        </tr>

      `)
      .join("");

}


// ==========================================================
// TABLA DEMANDAS
// ==========================================================

function renderDemandas() {

  const table =
    document.getElementById(
      "demandasTable"
    );


  if (!table) {
    return;
  }


  if (
    demandas.length === 0
  ) {

    table.innerHTML =
      emptyRow(6);

    return;

  }


  table.innerHTML =
    demandas
      .map(item => `

        <tr>

          <td>
            ${escapeHTML(item.expediente)}
          </td>

          <td>
            ${escapeHTML(
              formatDateMX(item.fecha)
            )}
          </td>

          <td>
            ${escapeHTML(item.actor)}
          </td>

          <td>
            ${escapeHTML(item.demandado)}
          </td>

          <td title="${escapeHTML(item.actos)}">

            ${escapeHTML(
              truncateText(
                item.actos,
                65
              )
            )}

          </td>

          <td>

            <span class="badge badge-blue">

              ${escapeHTML(item.estado)}

            </span>

          </td>

        </tr>

      `)
      .join("");

}


// ==========================================================
// TABLA AMPAROS
// ==========================================================

function renderAmparos() {

  const table =
    document.getElementById(
      "amparosTable"
    );


  if (!table) {
    return;
  }


  if (
    amparos.length === 0
  ) {

    table.innerHTML =
      emptyRow(7);

    return;

  }


  table.innerHTML =
    amparos
      .map(item => `

        <tr>

          <td>
            ${escapeHTML(
              formatDateMX(item.dia)
            )}
          </td>

          <td>
            ${escapeHTML(item.hora)}
          </td>

          <td>
            ${escapeHTML(item.expediente)}
          </td>

          <td>
            ${escapeHTML(item.promovente)}
          </td>

          <td>
            ${escapeHTML(item.juzgado || "—")}
          </td>

          <td>
            ${escapeHTML(item.oficio || "—")}
          </td>

          <td>

            <span class="badge badge-blue">

              ${escapeHTML(item.estado)}

            </span>

          </td>

        </tr>

      `)
      .join("");

}


// ==========================================================
// TABLA EXHORTOS
// ==========================================================

function renderExhortos() {

  const table =
    document.getElementById(
      "exhortosTable"
    );


  if (!table) {
    return;
  }


  if (
    exhortos.length === 0
  ) {

    table.innerHTML =
      emptyRow(8);

    return;

  }


  table.innerHTML =
    exhortos
      .map(item => `

        <tr>

          <td>
            ${escapeHTML(item.numero)}
          </td>

          <td>
            ${escapeHTML(
              formatDateMX(item.fecha)
            )}
          </td>

          <td>
            ${escapeHTML(item.origen || "—")}
          </td>

          <td>
            ${escapeHTML(item.actor)}
          </td>

          <td>
            ${escapeHTML(item.demandado)}
          </td>

          <td>
            ${escapeHTML(item.autoridad)}
          </td>

          <td>

            <span class="badge badge-blue">

              ${escapeHTML(item.estado)}

            </span>

          </td>

          <td>
            ${escapeHTML(item.ubicacion)}
          </td>

        </tr>

      `)
      .join("");

}


// ==========================================================
// TABLA PROMOCIONES
// ==========================================================

function renderPromociones() {

  const table =
    document.getElementById(
      "promocionesTable"
    );


  if (!table) {
    return;
  }


  if (
    promociones.length === 0
  ) {

    table.innerHTML =
      emptyRow(6);

    return;

  }


  table.innerHTML =
    promociones
      .map(item => `

        <tr>

          <td>
            <strong>
              ${escapeHTML(item.numero)}
            </strong>
          </td>

          <td>
            ${escapeHTML(item.expediente)}
          </td>

          <td>
            ${escapeHTML(
              formatDateMX(item.fecha)
            )}
          </td>

          <td>
            ${escapeHTML(
              item.procedencia || "—"
            )}
          </td>

          <td>
            ${escapeHTML(item.asunto)}
          </td>

          <td>

            <span class="badge badge-green">

              ${escapeHTML(item.estado)}

            </span>

          </td>

        </tr>

      `)
      .join("");

}


// ==========================================================
// TABLA OFICIOS
// ==========================================================

function renderOficios() {

  const table =
    document.getElementById(
      "oficiosTable"
    );


  if (!table) {
    return;
  }


  if (
    oficios.length === 0
  ) {

    table.innerHTML =
      emptyRow(6);

    return;

  }


  table.innerHTML =
    oficios
      .map(item => `

        <tr>

          <td>
            <strong>
              ${escapeHTML(item.numero)}
            </strong>
          </td>

          <td>
            ${escapeHTML(item.expediente)}
          </td>

          <td>
            ${escapeHTML(
              formatDateMX(item.fecha)
            )}
          </td>

          <td>
            ${escapeHTML(
              item.procedencia || "—"
            )}
          </td>

          <td>
            ${escapeHTML(item.asunto)}
          </td>

          <td>

            <span class="badge badge-green">

              ${escapeHTML(item.estado)}

            </span>

          </td>

        </tr>

      `)
      .join("");

}


// ==========================================================
// RESUMEN DIARIO
// ==========================================================

function renderDailySummary() {

  const elements = {

    date:
      document.getElementById(
        "dailyDate"
      ),

    total:
      document.getElementById(
        "dailyTotal"
      ),

    demandas:
      document.getElementById(
        "dailyDemandas"
      ),

    amparos:
      document.getElementById(
        "dailyAmparos"
      ),

    exhortos:
      document.getElementById(
        "dailyExhortos"
      ),

    promociones:
      document.getElementById(
        "dailyPromociones"
      ),

    oficios:
      document.getElementById(
        "dailyOficios"
      )

  };


  if (
    Object
      .values(elements)
      .some(
        element => !element
      )
  ) {

    return;

  }


  const today =
    getTodayISO();


  const demandasHoy =
    demandas.filter(item => {

      return (
        getRecordCaptureDate(
          item,
          "fecha"
        )
        === today
      );

    });


  const amparosHoy =
    amparos.filter(item => {

      return (
        getRecordCaptureDate(
          item,
          "dia"
        )
        === today
      );

    });


  const exhortosHoy =
    exhortos.filter(item => {

      return (
        getRecordCaptureDate(
          item,
          "fecha"
        )
        === today
      );

    });


  const promocionesHoy =
    promociones.filter(item => {

      return (
        getRecordCaptureDate(
          item,
          "fecha"
        )
        === today
      );

    });


  const oficiosHoy =
    oficios.filter(item => {

      return (
        getRecordCaptureDate(
          item,
          "fecha"
        )
        === today
      );

    });


  const total =
    demandasHoy.length
    +
    amparosHoy.length
    +
    exhortosHoy.length
    +
    promocionesHoy.length
    +
    oficiosHoy.length;


  elements.date.textContent =
    formatToday();


  elements.total.textContent =
    total;


  elements.demandas.textContent =
    demandasHoy.length;


  elements.amparos.textContent =
    amparosHoy.length;


  elements.exhortos.textContent =
    exhortosHoy.length;


  elements.promociones.textContent =
    promocionesHoy.length;


  elements.oficios.textContent =
    oficiosHoy.length;


  renderDailyRecentCaptures(
    today
  );

}


// ==========================================================
// ÚLTIMAS CAPTURAS
// ==========================================================

function renderDailyRecentCaptures(
  today
) {

  const container =
    document.getElementById(
      "dailyRecentCaptures"
    );


  if (!container) {
    return;
  }


  const registros = [];


  demandas.forEach(item => {

    if (
      getRecordCaptureDate(
        item,
        "fecha"
      )
      === today
    ) {

      registros.push({

        tipo: "Demanda",

        referencia:
          item.expediente ||
          "Sin expediente",

        descripcion:
          item.actor ||
          "Sin actor",

        capturadoEn:
          item.capturadoEn,

        sort:
          getRecordSortTime(
            item,
            "fecha"
          )

      });

    }

  });


  amparos.forEach(item => {

    if (
      getRecordCaptureDate(
        item,
        "dia"
      )
      === today
    ) {

      registros.push({

        tipo: "Amparo",

        referencia:
          item.expediente ||
          "Sin expediente",

        descripcion:
          item.promovente ||
          "Sin promovente",

        capturadoEn:
          item.capturadoEn,

        sort:
          getRecordSortTime(
            item,
            "dia"
          )

      });

    }

  });


  exhortos.forEach(item => {

    if (
      getRecordCaptureDate(
        item,
        "fecha"
      )
      === today
    ) {

      registros.push({

        tipo: "Exhorto",

        referencia:
          item.numero ||
          "Sin número",

        descripcion:
          item.actor ||
          "Sin actor",

        capturadoEn:
          item.capturadoEn,

        sort:
          getRecordSortTime(
            item,
            "fecha"
          )

      });

    }

  });


  promociones.forEach(item => {

    if (
      getRecordCaptureDate(
        item,
        "fecha"
      )
      === today
    ) {

      registros.push({

        tipo: "Promoción",

        referencia:
          item.numero ||
          "Sin número",

        descripcion:
          item.expediente
            ? `Expediente ${item.expediente}`
            : item.asunto,

        capturadoEn:
          item.capturadoEn,

        sort:
          getRecordSortTime(
            item,
            "fecha"
          )

      });

    }

  });


  oficios.forEach(item => {

    if (
      getRecordCaptureDate(
        item,
        "fecha"
      )
      === today
    ) {

      registros.push({

        tipo: "Oficio",

        referencia:
          item.numero ||
          "Sin número",

        descripcion:
          item.expediente
            ? `Expediente ${item.expediente}`
            : item.asunto,

        capturadoEn:
          item.capturadoEn,

        sort:
          getRecordSortTime(
            item,
            "fecha"
          )

      });

    }

  });


  registros.sort(
    (a, b) => {

      return (
        b.sort -
        a.sort
      );

    }
  );


  const ultimos =
    registros.slice(
      0,
      5
    );


  if (
    ultimos.length === 0
  ) {

    container.innerHTML = `

      <div class="daily-empty">

        Todavía no hay capturas
        registradas hoy.

      </div>

    `;

    return;

  }


  container.innerHTML =
    ultimos
      .map(item => `

        <div class="daily-recent-item">


          <div class="daily-recent-top">

            <strong>

              ${escapeHTML(item.tipo)}

              ·

              ${escapeHTML(item.referencia)}

            </strong>


            <span>

              ${escapeHTML(
                formatCaptureTime(
                  item.capturadoEn
                )
              )}

            </span>

          </div>


          <p>

            ${escapeHTML(item.descripcion)}

          </p>


        </div>

      `)
      .join("");

}


// ==========================================================
// RESUMEN HISTÓRICO
// ==========================================================

function buildHistoricalRecords() {

  const records = [];


  demandas.forEach(item => {

    records.push({

      tipo:
        "Demanda",

      fecha:
        getRecordCaptureDate(
          item,
          "fecha"
        ),

      timestamp:
        item.capturadoEn,

      referencia:
        item.expediente,

      movimiento:
        "Demanda registrada",

      detalle:
        `${item.actor} vs ${item.demandado}`

    });

  });


  amparos.forEach(item => {

    records.push({

      tipo:
        "Amparo",

      fecha:
        getRecordCaptureDate(
          item,
          "dia"
        ),

      timestamp:
        item.capturadoEn,

      referencia:
        item.expediente,

      movimiento:
        "Amparo registrado",

      detalle:
        item.promovente

    });

  });


  exhortos.forEach(item => {

    records.push({

      tipo:
        "Exhorto",

      fecha:
        getRecordCaptureDate(
          item,
          "fecha"
        ),

      timestamp:
        item.capturadoEn,

      referencia:
        item.numero,

      movimiento:
        "Exhorto registrado",

      detalle:
        `${item.actor} / ${item.autoridad}`

    });

  });


  promociones.forEach(item => {

    records.push({

      tipo:
        "Promoción",

      fecha:
        getRecordCaptureDate(
          item,
          "fecha"
        ),

      timestamp:
        item.capturadoEn,

      referencia:
        item.numero,

      movimiento:
        "Promoción registrada",

      detalle:
        item.expediente
          ? `${item.asunto} · Exp. ${item.expediente}`
          : item.asunto

    });

  });


  oficios.forEach(item => {

    records.push({

      tipo:
        "Oficio",

      fecha:
        getRecordCaptureDate(
          item,
          "fecha"
        ),

      timestamp:
        item.capturadoEn,

      referencia:
        item.numero,

      movimiento:
        "Oficio registrado",

      detalle:
        item.expediente
          ? `${item.asunto} · Exp. ${item.expediente}`
          : item.asunto

    });

  });


  records.sort(
    (a, b) => {

      const aTime =
        a.timestamp
          ? new Date(
              a.timestamp
            ).getTime()
          : new Date(
              `${a.fecha}T00:00:00`
            ).getTime();


      const bTime =
        b.timestamp
          ? new Date(
              b.timestamp
            ).getTime()
          : new Date(
              `${b.fecha}T00:00:00`
            ).getTime();


      return (
        bTime -
        aTime
      );

    }
  );


  return records;

}


// ==========================================================
// RENDER RESUMEN HISTÓRICO
// ==========================================================

function renderHistoricalResults(
  customRecords = null
) {

  const table =
    document.getElementById(
      "historyTable"
    );

  const total =
    document.getElementById(
      "historyTotal"
    );


  if (
    !table ||
    !total
  ) {

    return;

  }


  const records =
    customRecords ??
    buildHistoricalRecords();


  total.textContent =
    records.length;


  if (
    records.length === 0
  ) {

    table.innerHTML =
      emptyRow(5);

    return;

  }


  table.innerHTML =
    records
      .map(item => `

        <tr>

          <td>

            ${escapeHTML(
              formatDateTimeMX(
                item.timestamp,
                item.fecha
              )
            )}

          </td>


          <td>

            <span class="badge badge-blue">

              ${escapeHTML(item.tipo)}

            </span>

          </td>


          <td>
            ${escapeHTML(
              item.referencia ||
              "—"
            )}
          </td>


          <td>
            ${escapeHTML(
              item.movimiento
            )}
          </td>


          <td>
            ${escapeHTML(
              truncateText(
                item.detalle,
                100
              )
            )}
          </td>


        </tr>

      `)
      .join("");

}


// ==========================================================
// BUSCAR EN RESUMEN HISTÓRICO
// ==========================================================

const historySearchBtn =
  document.getElementById(
    "historySearchBtn"
  );


if (historySearchBtn) {

  historySearchBtn.addEventListener(
    "click",
    filterHistoricalRecords
  );

}


function filterHistoricalRecords() {

  const start =
    document
      .getElementById(
        "historyStartDate"
      )
      ?.value || "";


  const end =
    document
      .getElementById(
        "historyEndDate"
      )
      ?.value || "";


  const type =
    document
      .getElementById(
        "historyType"
      )
      ?.value || "todos";


  const resultText =
    document.getElementById(
      "historyResultText"
    );


  if (
    start &&
    end &&
    start > end
  ) {

    alert(
      "La fecha de inicio no puede ser posterior a la fecha final."
    );

    return;

  }


  const allRecords =
    buildHistoricalRecords();


  const filtered =
    allRecords.filter(item => {

      const validStart =
        !start ||
        item.fecha >= start;


      const validEnd =
        !end ||
        item.fecha <= end;


      const validType =
        type === "todos" ||
        item.tipo === type;


      return (
        validStart &&
        validEnd &&
        validType
      );

    });


  renderHistoricalResults(
    filtered
  );


  if (resultText) {

    const parts = [];


    if (start) {

      parts.push(
        `desde ${formatDateMX(start)}`
      );

    }


    if (end) {

      parts.push(
        `hasta ${formatDateMX(end)}`
      );

    }


    if (
      type !== "todos"
    ) {

      parts.push(
        `tipo: ${type}`
      );

    }


    resultText.textContent =
      parts.length
        ? `Resultados ${parts.join(" · ")}.`
        : "Mostrando todos los movimientos registrados.";

  }

}


// ==========================================================
// LIMPIAR RESUMEN HISTÓRICO
// ==========================================================

const historyClearBtn =
  document.getElementById(
    "historyClearBtn"
  );


if (historyClearBtn) {

  historyClearBtn.addEventListener(
    "click",
    () => {

      const start =
        document.getElementById(
          "historyStartDate"
        );

      const end =
        document.getElementById(
          "historyEndDate"
        );

      const type =
        document.getElementById(
          "historyType"
        );

      const text =
        document.getElementById(
          "historyResultText"
        );


      if (start) {
        start.value = "";
      }


      if (end) {
        end.value = "";
      }


      if (type) {
        type.value = "todos";
      }


      if (text) {

        text.textContent =
          "Mostrando todos los movimientos registrados.";

      }


      renderHistoricalResults();

    }
  );

}


// ==========================================================
// FILA VACÍA
// ==========================================================

function emptyRow(columns) {

  return `

    <tr>

      <td
        colspan="${columns}"
        style="
          text-align:center;
          padding:35px;
          color:#8b96a3;
        "
      >

        No hay registros todavía.

      </td>

    </tr>

  `;

}


// ==========================================================
// RENDER GENERAL
// ==========================================================

function renderAll() {

  renderExpedientes();

  renderRecent();

  renderDemandas();

  renderAmparos();

  renderExhortos();

  renderPromociones();

  renderOficios();

  renderDailySummary();

  renderHistoricalResults();

}


// ==========================================================
// INICIO
// ==========================================================

renderAll();