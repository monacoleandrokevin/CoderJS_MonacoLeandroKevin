//Obtener los valores desde el archivo JSON
fetch("./db/data.json")
.then(response => response.json())
.then(data =>{
    valores = data; // Asignar los datos al array valores
})

// Cargar datos previos desde localStorage y completar los campos del formulario
cargarDatosPrevios();

// Variable de barndera para evitar doble mensaje al borrar cargo
let recalculoDesdeBorrado = false;

// Actualizacion de la tabla de siumaciones anteriores
actualizarTablaSimulaciones();

// Agregar evento al formulario para calcular el salario al enviarlo
const formulario = document.getElementById("formulario-salario");
if (formulario) {
    formulario.addEventListener("submit", (event) => {
        event.preventDefault();
        calcularSalario(); // Calcular el salario en base a los datos ingresados
    });
}

function cargarDatosPrevios() {
    const elementos = [
        { id: "nombre", key: "nombre" },
        { id: "antiguedad", key: "antiguedad" },
        { id: "cargo1", key: "cargo1" },
        { id: "cargo2", key: "cargo2" },
        { id: "propuesta", key: "propuesta" },
        { id: "afiliacion", key: "afiliacion" }
    ];
    // Recorrer los campos y completar los valores desde localStorage
    elementos.forEach(({ id, key }) => {
        const valor = localStorage.getItem(key);
        if (valor) {
            document.getElementById(id).value = valor;
        }
    });
}

function calcularSalario() {
    try {
        const nombre = document.getElementById("nombre").value.trim();
        const antiguedad = parseInt(document.getElementById("antiguedad").value) || 0;
        const propuesta = document.getElementById("propuesta").value;
        const gremio = document.getElementById("afiliacion").value === "si";

        // Guardar datos en localStorage para conservar el estado del formulario
        localStorage.setItem("nombre", nombre);
        localStorage.setItem("antiguedad", antiguedad);
        localStorage.setItem("cargo1", document.getElementById("cargo1").value);
        localStorage.setItem("cargo2", document.getElementById("cargo2").value);
        localStorage.setItem("propuesta", propuesta);
        localStorage.setItem("afiliacion", gremio ? "si" : "no");

        // Obtener los datos de los cargos seleccionados
        const categoria1 = document.getElementById("cargo1").value.trim();
        const categoria2 = document.getElementById("cargo2").value.trim();

        let salarioCargo1 = null;
        let salarioCargo2 = null;

        // Calcular salario para Cargo 1 si está seleccionado
        if (categoria1) {
            const categoriaData1 = valores.find(c => c.id === categoria1);
            if (categoriaData1 && categoriaData1.propuestas[propuesta]) {
                salarioCargo1 = calcularSalarioPorCargo(categoriaData1, propuesta, antiguedad, gremio);
            }
        }

        // Calcular salario para Cargo 2 si está seleccionado
        if (categoria2) {
            const categoriaData2 = valores.find(c => c.id === categoria2);
            if (categoriaData2 && categoriaData2.propuestas[propuesta]) {
                salarioCargo2 = calcularSalarioPorCargo(categoriaData2, propuesta, antiguedad, gremio);
            }
        }

        // Guardar los resultados en localStorage si existen
        if (salarioCargo1) {
            localStorage.setItem("cargo1-bruto", salarioCargo1.bruto);
            localStorage.setItem("cargo1-descuentos", salarioCargo1.descuentos.total);
            localStorage.setItem("cargo1-neto", salarioCargo1.neto);
        } else {
            // Remover los datos de Cargo 1 si no existen
            localStorage.removeItem("cargo1-bruto");
            localStorage.removeItem("cargo1-descuentos");
            localStorage.removeItem("cargo1-neto");
        }

        if (salarioCargo2) {
            localStorage.setItem("cargo2-bruto", salarioCargo2.bruto);
            localStorage.setItem("cargo2-descuentos", salarioCargo2.descuentos.total);
            localStorage.setItem("cargo2-neto", salarioCargo2.neto);
        } else {
            // Remover los datos de Cargo 2 si no existen
            localStorage.removeItem("cargo2-bruto");
            localStorage.removeItem("cargo2-descuentos");
            localStorage.removeItem("cargo2-neto");
        }

        // Mostrar resultados en el DOM, incluso si ambos cargos están vacíos
        if (!categoria1 && !categoria2) {
            mostrarResultados(null, null, nombre, antiguedad, propuesta, gremio); // Mostrar vacíos
            actualizarTotales(); // Totales en $0.00
            return; // No continuar con Toastify
        }

        // Mostrar resultados en el DOM
        mostrarResultados(salarioCargo1, salarioCargo2, nombre, antiguedad, propuesta, gremio);

        // Actualizar totales después de mostrar los resultados
        actualizarTotales();

        // Guardar simulación después de actualizar totales
        guardarSimulacion();

        // Mostrar mensaje de éxito solo si no proviene de un borrado
        if (!recalculoDesdeBorrado && (salarioCargo1 || salarioCargo2)) {
            Toastify({
                text: "Cálculo de salario realizado con éxito",
                duration: 2000,
                gravity: "top",
                position: "right",
                style: {
                    background: "#4caf50", // Color verde para éxito
                }
            }).showToast();
        }
    } catch (error) {
        console.error("Error al calcular el salario: ", error);
        // Mostrar un mensaje de error al usuario, si es necesario
        Toastify({
            text: "Hubo un error al calcular el salario. Intenta nuevamente.",
            duration: 2000,
            gravity: "top",
            position: "right",
            style: {
                background: "#ff0000", // Color rojo para el error
            }
        }).showToast();
    }
}

function calcularSalarioPorCargo(categoriaData, propuesta, antiguedad, gremio) {
    const salarioBase = categoriaData.propuestas[propuesta].basico;
    const incentivo = categoriaData.propuestas[propuesta].incDocente;
    const antiguedadPorcentaje = calcularPorcentajeAntiguedad(antiguedad);
    const antiguedadMonto = salarioBase * antiguedadPorcentaje;
    const bruto = salarioBase + incentivo + antiguedadMonto;

    const descuentos = calcularDescuentos(salarioBase, gremio);
    const totalDescuentos = descuentos.total;
    const neto = bruto - totalDescuentos;

    return { salarioBase, incentivo, antiguedadMonto, bruto, descuentos, neto };
}

function mostrarResultados(salarioCargo1, salarioCargo2, nombre, antiguedad, propuesta, gremio) {
    if (salarioCargo1) {
        document.getElementById("cargo1-resultados").innerHTML = `
            <h4>Resultado Cargo Principal:</h4>
            <p id="cargo1-nombre"><strong>Nombre:</strong> ${nombre}</p>
            <hr>
            <p id="cargo1-salary-base"><strong>Salario Base:</strong> $${salarioCargo1.salarioBase.toFixed(2)}</p>
            <p id="cargo1-antiguedad-bonus"><strong>Antigüedad (%):</strong> ${salarioCargo1.antiguedadMonto.toFixed(2)}</p>
            <p id="cargo1-incentivo-docente"><strong>Incentivo Docente:</strong> $${salarioCargo1.incentivo.toFixed(2)}</p>
            <p id="cargo1-salario-bruto"><strong>Salario Bruto:</strong> <strong class="resultado-destacado">$${salarioCargo1.bruto.toFixed(2)}</strong></p>
            <hr>
            <p id="cargo1-descuento-jubilacion"><strong class="descuento">Descuento Jubilación:</strong> -$${salarioCargo1.descuentos.jubilacion.toFixed(2)}</p>
            <p id="cargo1-descuento-obra-social"><strong class="descuento">Descuento Obra Social:</strong> -$${salarioCargo1.descuentos.obraSocial.toFixed(2)}</p>
            <p id="cargo1-descuento-sindicato"><strong class="descuento">Descuento Sindicato:</strong> ${gremio ? `- $${salarioCargo1.descuentos.sindicato.toFixed(2)}` : 'No aplica'}</p>
            <p id="cargo1-total-descuentos"><strong class="descuento">Total Descuentos:</strong> <strong class="resultado-destacado descuento">-$${salarioCargo1.descuentos.total.toFixed(2)}</strong></p>
            <hr>
            <p id="cargo1-salario-neto"><strong>Salario Neto:</strong> <strong class="resultado-destacado">$${salarioCargo1.neto.toFixed(2)}</strong></p>
        `;
    } else {
        document.getElementById("cargo1-resultados").innerHTML = "<p>No hay datos para el Cargo 1.</p>";
    }

    if (salarioCargo2) {
        document.getElementById("cargo2-resultados").innerHTML = `
            <h4>Resultado Cargo Adicional:</h4>
            <p id="cargo2-nombre"><strong>Nombre:</strong> ${nombre}</p>
            <hr>
            <p id="cargo2-salary-base"><strong>Salario Base:</strong> $${salarioCargo2.salarioBase.toFixed(2)}</p>
            <p id="cargo2-antiguedad-bonus"><strong>Antigüedad (%):</strong> ${salarioCargo2.antiguedadMonto.toFixed(2)}</p>
            <p id="cargo2-incentivo-docente"><strong>Incentivo Docente:</strong> $${salarioCargo2.incentivo.toFixed(2)}</p>
            <p id="cargo2-salario-bruto"><strong>Salario Bruto:</strong> <strong class="resultado-destacado">$${salarioCargo2.bruto.toFixed(2)}</strong></p>
            <hr>
            <p id="cargo2-descuento-jubilacion"><strong class="descuento">Descuento Jubilación:</strong> -$${salarioCargo2.descuentos.jubilacion.toFixed(2)}</p>
            <p id="cargo2-descuento-obra-social"><strong class="descuento">Descuento Obra Social:</strong> -$${salarioCargo2.descuentos.obraSocial.toFixed(2)}</p>
            <p id="cargo2-descuento-sindicato"><strong class="descuento">Descuento Sindicato:</strong> ${gremio ? `- $${salarioCargo2.descuentos.sindicato.toFixed(2)}` : 'No aplica'}</p>
            <p id="cargo2-total-descuentos"><strong class="descuento">Total Descuentos:</strong> <strong class="resultado-destacado descuento">-$${salarioCargo2.descuentos.total.toFixed(2)}</strong></p>
            <hr>
            <p id="cargo2-salario-neto"><strong>Salario Neto:</strong> <strong class="resultado-destacado">$${salarioCargo2.neto.toFixed(2)}</strong></p>
        `;
    } else {
        document.getElementById("cargo2-resultados").innerHTML = "<p>No hay datos para el Cargo 2.</p>";
    }
}

function calcularPorcentajeAntiguedad(antiguedad) {
    const rangos = [5, 10, 15, 20, 30];
    const porcentajes = [0.25, 0.35, 0.40, 0.45, 0.50];

    for (let i = 0; i < rangos.length; i++) {
        if (antiguedad <= rangos[i]) {
            return porcentajes[i]; // Retorna el porcentaje correspondiente
        }
    }
    
    return 0.25; // Si la antigüedad no cae en los rangos definidos, retorna el porcentaje más bajo
}

function calcularDescuentos(salarioBase, gremio) {
    const jubilacion = salarioBase * 0.11;
    const obraSocial = salarioBase * 0.03;
    const sindicato = gremio ? salarioBase * 0.02 : 0;

    const total = jubilacion + obraSocial + sindicato;

    return {
        jubilacion,
        obraSocial,
        sindicato,
        total,
    };
}

//Evento para limpiar campos
const botonLimpiarCampos = document.getElementById("limpiar-campos");

botonLimpiarCampos.addEventListener("click", () => {
    // Muestra un cuadro de confirmación con SweetAlert
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esto eliminará todos los datos del formulario y no se podrán recuperar.",
        icon: 'warning',
        showCancelButton: true,  // Muestra un botón de cancelar
        confirmButtonColor: '#d33',  // Color del botón de confirmar
        cancelButtonColor: '#3085d6',  // Color del botón de cancelar
        confirmButtonText: 'Sí, eliminar todo',  // Texto del botón de confirmar
        cancelButtonText: 'Cancelar'  // Texto del botón de cancelar
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, limpia el localStorage y recarga la página
            localStorage.clear();  // Limpia todo el localStorage
            location.reload();     // Recarga la página
        }
    });
});

// Función para borrar un cargo
function borrarCargo(cargoId) {
    const nombreElemento = document.getElementById(`${cargoId}-nombre`);
    const brutoElemento = document.getElementById(`${cargoId}-bruto`);
    const descuentosElemento = document.getElementById(`${cargoId}-descuentos`);
    const netoElemento = document.getElementById(`${cargoId}-neto`);

    if (nombreElemento) nombreElemento.innerText = "";
    if (brutoElemento) brutoElemento.innerText = "$0.00";
    if (descuentosElemento) descuentosElemento.innerText = "$0.00";
    if (netoElemento) netoElemento.innerText = "$0.00";

    // Limpiar los campos de cargo en el formulario
    const cargoElemento = document.getElementById(cargoId);
    if (cargoElemento) cargoElemento.value = "";

    // Mostrar mensaje con Toastify para indicar que el cargo fue eliminado
    Toastify({
        text: `Cargo ${cargoId === "cargo1" ? "1" : "2"} eliminado exitosamente`,
        duration: 2000,
        gravity: "top", // Mostrar en la parte superior
        position: "right", // Mostrar a la derecha
        style: {
            background: "#ff6f61", // Color personalizado
        }
    }).showToast();

    // Activar bandera para evitar mensaje duplicado
    recalculoDesdeBorrado = true;

    // Actualizar totales y recalcular salarios
    actualizarTotales();
    calcularSalario();

    // Reiniciar bandera después del recalculo
    recalculoDesdeBorrado = false;
}

// Evento para el botón de "Borrar Cargo 1"
document.getElementById("borrar-cargo1").addEventListener("click", () => {
    borrarCargo("cargo1");
});

// Evento para el botón de "Borrar Cargo 2"
document.getElementById("borrar-cargo2").addEventListener("click", () => {
    borrarCargo("cargo2");
});

// Función para actualizar los totales desde localStorage
function actualizarTotales() {
    // Obtener los valores de cada campo desde localStorage
    const bruto1 = parseFloat(localStorage.getItem("cargo1-bruto") || 0);
    const bruto2 = parseFloat(localStorage.getItem("cargo2-bruto") || 0);
    const descuentos1 = parseFloat(localStorage.getItem("cargo1-descuentos") || 0);
    const descuentos2 = parseFloat(localStorage.getItem("cargo2-descuentos") || 0);
    const neto1 = parseFloat(localStorage.getItem("cargo1-neto") || 0);
    const neto2 = parseFloat(localStorage.getItem("cargo2-neto") || 0);

    // Calcular totales
    const totalBruto = bruto1 + bruto2;
    const totalDescuentos = descuentos1 + descuentos2;
    const totalNeto = neto1 + neto2;

    // Mostrar resultados en el DOM
    document.getElementById("total-bruto").innerText = `$${totalBruto.toFixed(2)}`;
    document.getElementById("total-descuentos").innerText = `-$${totalDescuentos.toFixed(2)}`;
    document.getElementById("total-neto").innerText = `$${totalNeto.toFixed(2)}`;
}

//Funcion para guardar simulacion
function guardarSimulacion() {
    const simulaciones = JSON.parse(localStorage.getItem("simulaciones")) || [];
    const nuevaSimulacion = {
        nombre: document.getElementById("nombre").value,
        antiguedad: document.getElementById("antiguedad").value,
        cargo1: document.getElementById("cargo1").value,
        cargo2: document.getElementById("cargo2").value,
        propuesta: document.getElementById("propuesta").value,
        gremio: document.getElementById("afiliacion").value,
        fecha: new Date().toLocaleString(), // Hora y fecha actuales
    };

    // Agregar nueva simulación y eliminar la más antigua si ya hay 3
    if (simulaciones.length === 3) simulaciones.shift();
    simulaciones.push(nuevaSimulacion);

    // Guardar en localStorage
    localStorage.setItem("simulaciones", JSON.stringify(simulaciones));

    // Actualizar la tabla
    actualizarTablaSimulaciones();
}

//Funcion para actualizar la tabla de simulaciones con las ultimas 3 realziadas
function actualizarTablaSimulaciones() {
    const simulaciones = JSON.parse(localStorage.getItem("simulaciones")) || [];
    const tabla = document.getElementById("tabla-simulaciones");
    tabla.innerHTML = ""; // Limpiar tabla

    simulaciones.forEach((simulacion, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${simulacion.nombre}</td>
            <td>${simulacion.fecha}</td>
            <td>
                <button class="btn btn-primary btn-cargar" data-index="${index}">
                    Cargar
                </button>
                <button class="btn btn-danger btn-eliminar" data-index="${index}">
                    Eliminar
                </button>
            </td>
        `;
        tabla.appendChild(fila);
    });

    // Añadir evento para cargar simulación
    document.querySelectorAll(".btn-cargar").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            cargarSimulacion(index);
        });
    });

    // Añadir evento para eliminar simulación
    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            eliminarSimulacion(index);
        });
    });
}

//Funcion para cargar una simulacion enterior
function cargarSimulacion(index) {
    const simulaciones = JSON.parse(localStorage.getItem("simulaciones"));
    const simulacion = simulaciones[index];

    // Completar los campos del formulario con los datos de la simulación
    document.getElementById("nombre").value = simulacion.nombre;
    document.getElementById("antiguedad").value = simulacion.antiguedad;
    document.getElementById("cargo1").value = simulacion.cargo1;
    document.getElementById("cargo2").value = simulacion.cargo2;
    document.getElementById("propuesta").value = simulacion.propuesta;
    document.getElementById("afiliacion").value = simulacion.gremio;

    // Recalcular el salario con los datos cargados
    calcularSalario();
}

//Funcion para eliminar una simulacion anterior
function eliminarSimulacion(index) {
    const simulaciones = JSON.parse(localStorage.getItem("simulaciones")) || [];

    // Eliminar la simulación seleccionada
    simulaciones.splice(index, 1);

    // Guardar los cambios en el localStorage
    localStorage.setItem("simulaciones", JSON.stringify(simulaciones));

    // Actualizar la tabla después de eliminar
    actualizarTablaSimulaciones();
}

//Evento boton de vista de impresion
document.getElementById("vista-impresion").addEventListener("click", () => {
    // Mostrar el SweetAlert de confirmación
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Serás redirigido a la vista de impresión.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma, ejecuta el resto del código
            
            // Función auxiliar para limpiar el texto y obtener solo números
            const obtenerValorNumerico = (id, defaultValue = "0.00") => {
                const elemento = document.getElementById(id);
                if (elemento) {
                    // Busca números, decimales y posibles signos negativos
                    const texto = elemento.textContent.match(/-?[\d.,]+/);
                    return texto ? texto[0].replace(",", "").trim() : defaultValue; // Preserva el signo negativo
                }
                return defaultValue;
            };

            const data = {
                date: new Date().toLocaleString(),
                name: document.getElementById("nombre").value || "No especificado",
                proposal: document.getElementById("propuesta").options[
                    document.getElementById("propuesta").selectedIndex
                ]?.textContent || "No especificado",
                seniority: document.getElementById("antiguedad").options[
                    document.getElementById("antiguedad").selectedIndex
                ]?.textContent || "No especificado",
                affiliation: document.getElementById("afiliacion").value === "si" ? "Sí" : "No",
                cargo1Nombre: document.getElementById("cargo1").options[
                    document.getElementById("cargo1").selectedIndex
                ]?.textContent || "No especificado",
                cargo2Nombre: document.getElementById("cargo2").options[
                    document.getElementById("cargo2").selectedIndex
                ]?.textContent || "No especificado",
                cargo1: {
                    salarioBase: obtenerValorNumerico("cargo1-salary-base"),
                    antiguedad: obtenerValorNumerico("cargo1-antiguedad-bonus"),
                    incentivoDocente: obtenerValorNumerico("cargo1-incentivo-docente"),
                    salarioBruto: obtenerValorNumerico("cargo1-salario-bruto"),
                    jubilacion: obtenerValorNumerico("cargo1-descuento-jubilacion"),
                    obraSocial: obtenerValorNumerico("cargo1-descuento-obra-social"),
                    sindicato: obtenerValorNumerico("cargo1-descuento-sindicato", "No aplica"),
                    descuentos: obtenerValorNumerico("cargo1-total-descuentos"),
                    salarioNeto: obtenerValorNumerico("cargo1-salario-neto"),
                },
                cargo2: {
                    salarioBase: obtenerValorNumerico("cargo2-salary-base"),
                    antiguedad: obtenerValorNumerico("cargo2-antiguedad-bonus"),
                    incentivoDocente: obtenerValorNumerico("cargo2-incentivo-docente"),
                    salarioBruto: obtenerValorNumerico("cargo2-salario-bruto"),
                    jubilacion: obtenerValorNumerico("cargo2-descuento-jubilacion"),
                    obraSocial: obtenerValorNumerico("cargo2-descuento-obra-social"),
                    sindicato: obtenerValorNumerico("cargo2-descuento-sindicato", "No aplica"),
                    descuentos: obtenerValorNumerico("cargo2-total-descuentos"),
                    salarioNeto: obtenerValorNumerico("cargo2-salario-neto"),
                },
                totalBruto: obtenerValorNumerico("total-bruto"),
                totalDescuentos: obtenerValorNumerico("total-descuentos"),
                totalNeto: obtenerValorNumerico("total-neto"),
            };

            // Guarda los datos en localStorage
            localStorage.setItem("simulationData", JSON.stringify(data));

            // Redirige al nuevo HTML
            window.location.href = "pages/print.html";
        }
    });
});