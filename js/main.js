// Declaración de categorías
const cat13475 = {
    cat: 13475,
    nombre: 'Maestra de Grado de Enseñanza Primaria',
    cargaHoraria: 20,
};
const cat13480 = {
    cat: 13480,
    nombre: 'Maestro de Jardín de Infantes',
    cargaHoraria: 22,
};
const cat13910 = {
    cat: 13910,
    nombre: 'Hora Cátedra Enseñanza Media',
    cargaHoraria: 1,
};
const cat13515 = {
    cat: 13515,
    nombre: 'Maestro Materia Especial',
    cargaHoraria: 1,
};
const cat13255 = {
    cat: 13255,
    nombre: 'Director de Ens. Primaria',
    cargaHoraria: 25,
};
const categorias = [cat13475, cat13480, cat13910, cat13515, cat13255];

// Declaración de Meses
const sep2024 = {
    cod: '092024',
    nombre: 'sep2024',
    nombreCom: 'Septiembre 2024',
};
const ago2024 = {
    cod: '082024',
    nombre: 'ago2024',
    nombreCom: 'Agosto 2024',
};
const jul2024 = {
    cod: '072024',
    nombre: 'jul2024',
    nombreCom: 'Julio 2024',
};
const mesesLiq = [sep2024, ago2024, jul2024];

// Declaración de valores
const valores = {
    "13475": {
        "sep2024": { basico: 500000, incDocente: 100000 },
        "ago2024": { basico: 480000, incDocente: 90000 },
        "jul2024": { basico: 470000, incDocente: 85000 },
    },
    "13480": {
        "sep2024": { basico: 540031, incDocente: 100000 },
        "ago2024": { basico: 509050, incDocente: 90000 },
        "jul2024": { basico: 475624, incDocente: 85000 },
    },
    "13910": {
        "sep2024": { basico: 36000, incDocente: 6600 },
        "ago2024": { basico: 35000, incDocente: 5750 },
        "jul2024": { basico: 32000, incDocente: 4700 },
    },
    "13515": {
        "sep2024": { basico: 40000, incDocente: 8200 },
        "ago2024": { basico: 37900, incDocente: 7100 },
        "jul2024": { basico: 34000, incDocente: 6000 },
    },
    "13255": {
        "sep2024": { basico: 600000, incDocente: 100000 },
        "ago2024": { basico: 580000, incDocente: 90000 },
        "jul2024": { basico: 570000, incDocente: 85000 },
    }
};

// Solicitud de nombre
alert('Bienvenido al Simulador de Salarios de UEPC');
let nombre = prompt('¿Cuál es tu nombre?');
console.log("Nombre:", nombre);

// Categorías disponibles
let categoriasMostradas = "";
let catArray = [];
function mostrarCategorias() {
    for (const categoria of categorias) {
        catArray.push(categoria.cat);
    }
    categoriasMostradas = catArray.join(", ");
}
mostrarCategorias();

// Solicitud de categoría y verificación de existencia
let categoriaExiste = false;
let categoriaUser;

while (!categoriaExiste) {
    categoriaUser = parseInt(prompt('A continuación ingresa tu categoría. Deben ser 6 dígitos numéricos. Categorías disponibles: ' + categoriasMostradas));
    
    // Verificar si la categoría ingresada existe en catArray
    if (catArray.includes(categoriaUser)) {
        categoriaExiste = true;
    } else {
        alert('Categoría inválida. Por favor, ingresa una categoría válida.');
    }
}

console.log("Categoría ingresada:", categoriaUser);

// Solicitud de antigüedad
let antiguedadUser = parseInt(prompt('A continuación ingresa tu antigüedad cumplida a la fecha. La misma deberá ser un dato numérico entre 0 y 30. Ejemplo: 13'));

// Función para calcular porcentaje de antigüedad
function calcularPorcentajeAntiguedad(antiguedad) {
    if (antiguedad >= 0 && antiguedad <= 5) {
        return 0.25;
    } else if (antiguedad >= 6 && antiguedad <= 10) {
        return 0.35;
    } else if (antiguedad >= 11 && antiguedad <= 15) {
        return 0.40;
    } else if (antiguedad >= 16 && antiguedad <= 20) {
        return 0.45;
    } else if (antiguedad >= 21 && antiguedad <= 30) {
        return 0.50;
    } else {
        return 0.25;
    }
}

let porcentajeAntiguedad = calcularPorcentajeAntiguedad(antiguedadUser);

console.log("Antigüedad ingresada:", antiguedadUser);
console.log("Porcentaje de antigüedad:", porcentajeAntiguedad);

// Consulta de estado de afiliación al gremio
let afiliado = confirm('A continuación indica si sos afiliado al gremio. Si estás afiliado presiona "Aceptar", si no lo sos presiona "Cancelar".');
console.log ("Estado de afiliación: ", afiliado)

// Funcion para mostrar los meses disponibles
let mesesMostrados = "";
let mesArray = [];
function mostrarMeses() {
    for (const mes of mesesLiq) {
        mesArray.push(mes.cod);
    }
    mesesMostrados = mesArray.join(", ");
}
mostrarMeses();

// Solicitud de mes a liquidar y muestra de meses disponibles
let mesExiste = false;
let mesUser;

while (!mesExiste) {
    mesUser = prompt('Por último indica a qué mes pertenece la liquidación de tu interés. La misma deberá tener dos dígitos numéricos para el mes y cuatro dígitos numéricos para el año. Ejemplo: 092024 indica Septiembre de 2024. Meses disponibles: ' + mesesMostrados);
    
    // Verificar si el mes ingresado existe en mesArray
    if (mesArray.includes(mesUser)) {
        mesExiste = true;
    } else {
        alert('Mes inválido. Por favor, ingresa un mes válido.');
    }
}

console.log("Mes ingresado:", mesUser);

// Funcion para obtener el nombre del mes
function obtenerNombreMes(mesUser) {
    for (const mes of mesesLiq) {
        if (mes.cod === mesUser) {
            return mes.nombre;
        }
    }
    return null;
}

// Guardar nombre del mes
const nombreMes = obtenerNombreMes(mesUser); 
console.log(nombreMes);

// Función para alcular descuentos
function calcularDescuentos(valorBasico, afiliado) {
    const jubilacion = valorBasico * 0.11;
    const obraSocial = valorBasico * 0.03;
    const sindicato = afiliado ? valorBasico * 0.02 : 0;

    return {
        jubilacion,
        obraSocial,
        sindicato,
        total: jubilacion + obraSocial + sindicato,
    };
}

if (valores[categoriaUser]) {
    if (valores[categoriaUser][nombreMes]) {
        // Obtener valores básicos y de incentivos
        let valorBasico = valores[categoriaUser][nombreMes].basico;
        let valorIncDocente = valores[categoriaUser][nombreMes].incDocente;
        let valorAntiguedad = valorBasico * porcentajeAntiguedad;

        console.log("Valor básico:", valorBasico);
        console.log("Incentivo docente:", valorIncDocente);

        // Calcular descuentos
        let descuentos = calcularDescuentos(valorBasico, afiliado);
        let totalDescuentos = descuentos.total;

        // Función para calcular salario neto
        function calcularSalarioBruto(basico, incentivo, antiguedad) {
            return basico + incentivo + antiguedad;
        }

        // Calcular el salario bruto
        let valorBruto = calcularSalarioBruto(valorBasico, valorIncDocente, valorAntiguedad);

        // Función para calcular salario neto
        function calcularSalarioNeto(valorBruto, descuentos) {
            return valorBruto - descuentos;
        }

        // Calcular el salario neto
        let valorNeto = calcularSalarioNeto(valorBruto, totalDescuentos);

        // Obtener el nombre de la categoría ingresada por el usuario
        let categoriaNombre = categorias.find(categoria => categoria.cat === categoriaUser).nombre;

        // Resultado final
        console.log("Nombre: " + nombre + 
            "\nCategoría: " + categoriaUser + ' - ' + categoriaNombre + 
            "\nBásico: " + valorBasico + 
            "\nAntigüedad: " + valorAntiguedad +
            "\nIncentivo Docente: " + valorIncDocente + 
            "\nJubilación: " + descuentos.jubilacion +
            "\nObra Social: " + descuentos.obraSocial + 
            "\nAporte al sindicato: " + descuentos.sindicato +
            "\nSalario Bruto: " + valorBruto +
            "\nTotal de Descuentos: " + totalDescuentos +
            "\nSalario Neto: " + valorNeto);
        alert('Nombre: ' + nombre + 
            '\nCategoría: ' + categoriaUser + ' - ' + categoriaNombre + 
            '\nBásico: ' + valorBasico + 
            '\nAntigüedad: ' + valorAntiguedad +
            '\nIncentivo Docente: ' + valorIncDocente + 
            '\nJubilación: ' + descuentos.jubilacion +
            '\nObra Social: ' + descuentos.obraSocial + 
            '\nAporte al sindicato: ' + descuentos.sindicato +
            '\nSalario Bruto: ' + valorBruto +
            '\nTotal de Descuentos: ' + totalDescuentos +
            '\nSalario Neto: ' + valorNeto);
        
    }
}
