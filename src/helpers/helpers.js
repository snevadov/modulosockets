const hbs = require('hbs');

hbs.registerHelper('mostrarNotas', (listado) => {
    let texto = `<table class='table table-striped table-hover'>
        <thead class='thead-dark'>
        <th>Nombre</th>
        <th>Matemáticas</th>
        <th>Inglés</th>
        <th>Programación</th>
        </thead>
        <tbody>`;

    listado.forEach(estudiante => {
        texto = texto + 
            `<tr>
            <td> ${estudiante.nombre} </td>
            <td> ${estudiante.matematicas} </td>
            <td> ${estudiante.ingles} </td>
            <td> ${estudiante.programacion} </td>
            </tr>`;
    });

    texto = texto + '</tbody> </table>';
    return texto;
});
