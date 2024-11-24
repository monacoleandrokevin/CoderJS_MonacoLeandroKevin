// Obtiene los datos desde localStorage
const data = JSON.parse(localStorage.getItem("simulationData"));

if (data) {
    // Coloca el título y la fecha/hora de la simulación
    document.getElementById("fecha-hora").textContent = data.date;

    // Rellena la información general
    document.getElementById("nombre").textContent = data.name;
    document.getElementById("select-propuesta").textContent = data.proposal;
    document.getElementById("select-antiguedad").textContent = data.seniority;
    document.getElementById("select-afiliacion").textContent = data.affiliation;
    document.getElementById("cargo1Nombre").textContent = data.cargo1Nombre;
    document.getElementById("cargo2Nombre").textContent = data.cargo2Nombre;

    // Rellena los datos del cargo principal
    const cargo1 = data.cargo1;
    if (cargo1) {
        document.getElementById("salario-base-principal").textContent = `$${cargo1.salarioBase}`;
        document.getElementById("antiguedad-principal").textContent = `$${cargo1.antiguedad}`;
        document.getElementById("incentivo-principal").textContent = `$${cargo1.incentivoDocente}`;
        document.getElementById("salario-bruto-principal").textContent = `$${cargo1.salarioBruto}`;
        document.getElementById("jubilacion-principal").textContent = `- $${cargo1.jubilacion}`;
        document.getElementById("obra-social-principal").textContent = `- $${cargo1.obraSocial}`;
        document.getElementById("sindicato-principal").textContent = cargo1.sindicato === "No aplica" ? "No aplica" : `- $${cargo1.sindicato}`;
        document.getElementById("total-descuentos-principal").textContent = `- $${cargo1.descuentos}`;
        document.getElementById("salario-neto-principal").textContent = `$${cargo1.salarioNeto}`;
    }

    // Rellena los datos del cargo adicional (si existe)
    const cargo2 = data.cargo2;
    if (cargo2) {
        document.getElementById("salario-base-adicional").textContent = `$${cargo2.salarioBase}`;
        document.getElementById("antiguedad-adicional").textContent = `$${cargo2.antiguedad}`;
        document.getElementById("incentivo-adicional").textContent = `$${cargo2.incentivoDocente}`;
        document.getElementById("salario-bruto-adicional").textContent = `$${cargo2.salarioBruto}`;
        document.getElementById("jubilacion-adicional").textContent = `- $${cargo2.jubilacion}`;
        document.getElementById("obra-social-adicional").textContent = `- $${cargo2.obraSocial}`;
        document.getElementById("sindicato-adicional").textContent = cargo2.sindicato === "No aplica" ? "No aplica" : `- $${cargo2.sindicato}`;
        document.getElementById("total-descuentos-adicional").textContent = `- $${cargo2.descuentos}`;
        document.getElementById("salario-neto-adicional").textContent = `$${cargo2.salarioNeto}`;
    }

    // Rellena los totalizadores
    document.getElementById("total-salario-bruto").textContent = `$${data.totalBruto}`;
    document.getElementById("total-descuentos").textContent = `- $${data.totalDescuentos}`;
    document.getElementById("total-salario-neto").textContent = `$${data.totalNeto}`;
}

document.getElementById('descargar-pdf').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf; // Accede a jsPDF desde el módulo UMD

    const button = document.getElementById('descargar-pdf');
    button.style.display = 'none'; // Oculta el botón

    const element = document.body;
    const canvas = await html2canvas(element, { scale: 2 });

    button.style.display = 'block'; // Muestra el botón nuevamente

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

    const imgX = (pageWidth - imgWidth * ratio) / 2;
    const imgY = (pageHeight - imgHeight * ratio) / 2;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save('Simulacion_Salario_UEPC.pdf');
});
