// Array de objetos para categorías y propuestas
const valores = [
    { id: "13475", nombre: "Maestra de Grado de Enseñanza Primaria", propuestas: { "sep2024": { basico: 50000, incDocente: 5000 }, "ago2024": { basico: 49000, incDocente: 4900 }, "jul2024": { basico: 48000, incDocente: 4800 }}},
    { id: "13480", nombre: "Maestro de Jardín de Infantes", propuestas: { "sep2024": { basico: 52000, incDocente: 5200 }, "ago2024": { basico: 51000, incDocente: 5100 }, "jul2024": { basico: 50000, incDocente: 5000 }}},
    { id: "13910", nombre: "Hora Cátedra Enseñanza Media", propuestas: { "sep2024": { basico: 47000, incDocente: 4700 }, "ago2024": { basico: 46000, incDocente: 4600 }, "jul2024": { basico: 45000, incDocente: 4500 }}},
    { id: "13515", nombre: "Maestro Materia Especial", propuestas: { "sep2024": { basico: 53000, incDocente: 5300 }, "ago2024": { basico: 52000, incDocente: 5200 }, "jul2024": { basico: 51000, incDocente: 5100 }}},
    { id: "13255", nombre: "Director de Ens. Primaria", propuestas: { "sep2024": { basico: 60000, incDocente: 6000 }, "ago2024": { basico: 59000, incDocente: 5900 }, "jul2024": { basico: 58000, incDocente: 5800 }}}
];

document.addEventListener("DOMContentLoaded", () => {
    cargarDatosPrevios();
    const formulario = document.getElementById("formulario-salario");
    
    if (formulario) {
        formulario.addEventListener("submit", (event) => {
            event.preventDefault();
            calcularSalario();
        });
    }
});

function cargarDatosPrevios() {
    const elementos = [
        { id: "nombre", key: "nombre" },
        { id: "antiguedad", key: "antiguedad" },
        { id: "cargo", key: "categoria" },
        { id: "propuesta", key: "propuesta" },
        { id: "afiliacion", key: "afiliacion" }
    ];

    elementos.forEach(({ id, key }) => {
        const valor = localStorage.getItem(key);
        if (valor) {
            document.getElementById(id).value = valor;
        }
    });
}

function calcularSalario() {
    const nombre = document.getElementById("nombre").value;
    const antiguedad = parseInt(document.getElementById("antiguedad").value);
    const categoria = document.getElementById("cargo").value;
    const propuesta = document.getElementById("propuesta").value;
    const gremio = document.getElementById("afiliacion").value === "si";

    // Guardar datos en localStorage
    localStorage.setItem("nombre", nombre);
    localStorage.setItem("antiguedad", antiguedad);
    localStorage.setItem("categoria", categoria);
    localStorage.setItem("propuesta", propuesta);
    localStorage.setItem("afiliacion", gremio ? "si" : "no");

    // Lógica para calcular el salario
    const categoriaData = valores.find(c => c.id === categoria); // Cambiado para usar find
    if (!categoriaData || !categoriaData.propuestas[propuesta]) {
        alert("Datos de salario no disponibles para esta combinación de categoría y mes.");
        return;
    }

    const salarioBase = categoriaData.propuestas[propuesta].basico;
    const incentivo = categoriaData.propuestas[propuesta].incDocente;
    const antiguedadPorcentaje = calcularPorcentajeAntiguedad(antiguedad);
    const antiguedadMonto = salarioBase * antiguedadPorcentaje;
    const bruto = salarioBase + incentivo + antiguedadMonto;

    const descuentos = calcularDescuentos(salarioBase, gremio);
    const totalDescuentos = descuentos.total;
    const neto = bruto - totalDescuentos;

// Mostrar resultados en el DOM
document.getElementById("resultados").innerHTML = `
    <p><strong>Nombre:</strong> ${nombre}</p>
    <hr>
    <p><strong>Salario Base:</strong> $${salarioBase.toFixed(2)}</p>
    <p><strong>Antigüedad (%):</strong> ${antiguedadPorcentaje * 100}% ($${antiguedadMonto.toFixed(2)})</p>
    <p><strong>Incentivo Docente:</strong> $${incentivo.toFixed(2)}</p>
    <p><strong>Salario Bruto:</strong> <strong class="resultado-destacado">$${bruto.toFixed(2)}</strong></p>
    <hr>
    <p><strong class="descuento">Descuento Jubilación:</strong> -$${descuentos.jubilacion.toFixed(2)}</p>
    <p><strong class="descuento">Descuento Obra Social:</strong> -$${descuentos.obraSocial.toFixed(2)}</p>
    <p><strong class="descuento">Descuento Sindicato:</strong> ${gremio ? `- $${descuentos.sindicato.toFixed(2)}` : 'No aplica'}</p>
    <p><strong class="descuento">Total Descuentos:</strong> <strong class="resultado-destacado">-$${totalDescuentos.toFixed(2)}</strong></p>
    <hr>
    <p><strong>Salario Neto:</strong> <strong class="resultado-destacado">$${neto.toFixed(2)}</strong></p>
`;
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