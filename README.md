
Simulador de Salario UEPC

El Simulador de Salario UEPC es una herramienta diseñada para que los docentes afiliados al gremio puedan verificar si su liquidación de haberes es correcta. Dada la complejidad y dificultad para interpretar los recibos de sueldo, este simulador permite comparar el salario percibido con el correspondiente cálculo, brindando la posibilidad de reclamar diferencias o confirmar que el cobro es correcto.

Funcionalidades Principales

Carga de datos:
La información se ingresa en la columna izquierda del simulador.

Datos obligatorios:

Nombre del docente.
Propuesta (mes de cobro).
Antigüedad.
Al menos una categoría (Cargo principal o adicional).

Datos opcionales:

Afiliación al gremio (se considera "No afiliado" de manera predeterminada).
Cálculo de salarios:
Al presionar el botón "Calcular Salario", el simulador procesa los datos ingresados y muestra los resultados en la columna derecha. Estos incluyen conceptos remunerativos, no remunerativos y descuentos, tanto para el cargo principal como para el adicional (si aplica).

Registro de últimas simulaciones:

Cada vez que se calcula un salario, los resultados se guardan en la tabla de Últimas simulaciones, ubicada debajo de los botones principales.
Esta tabla almacena las tres simulaciones más recientes junto con la fecha y hora en que se realizaron.

Las simulaciones pueden:

Recuperarse, cargando nuevamente los datos en los campos de la columna izquierda para recalcular el salario.
Eliminarse, quitándolas definitivamente de la tabla.

Limpieza de campos:
El botón "Limpiar campos" realiza las siguientes acciones:

Elimina por completo los datos almacenados en el localStorage.
Vacía la tabla de Últimas simulaciones.
Restaura todos los campos de entrada y selección a su estado inicial.

Vista de impresión y generación de PDF:

Al presionar el botón "Vista de Impresión", los datos actuales del simulador se trasladan a un nuevo HTML diseñado para simular un recibo de haberes.
En esta nueva página, se puede descargar un PDF con formato A4 y diseño optimizado para impresión, utilizando el botón "Descargar PDF". Este botón no se mostrará al imprimir.

Instrucciones de Uso

Ingresa los datos en la columna izquierda. Asegúrate de completar los campos obligatorios.
Presiona el botón "Calcular Salario" para visualizar los resultados.
Si deseas revisar simulaciones previas, utiliza la tabla de Últimas simulaciones.
Para empezar una nueva simulación o eliminar los datos actuales, utiliza el botón "Limpiar campos".
Para generar una vista de impresión y/o un PDF del recibo de haberes, usa el botón "Vista de Impresión".

Consideraciones Técnicas

El simulador no exige que ambos campos de categoría (Cargo principal y Cargo adicional) estén completos. Es posible calcular el salario con uno solo de ellos.
El diseño está realizado con Bootstrap, proporcionando una interfaz visualmente atractiva y funcional.
Los datos ingresados y las simulaciones recientes se almacenan temporalmente en el localStorage del navegador.

Objetivo

El objetivo de esta herramienta es brindar una solución práctica y accesible para que los docentes puedan verificar y comparar su salario de manera sencilla y efectiva, facilitando cualquier proceso de reclamo o consulta.
