const fs = require("fs");
const flat = require("array.prototype.flat");
const path = __dirname + "/pedidos.json";
let data = fs.readFileSync(path, "utf8");

if (data.length == 0){
    console.log("Actualmente el sistema no tiene pedidos para generar el reporte");
}else{
    let traerCant = (pedidos, campo, valor) => pedidos.filter( ped => ped[campo] == valor ).length
    let cont = JSON.parse(data);
    let fechaCompl = new Date();
    let dia = fechaCompl.getFullYear()+'-'+("0"+(new Date().getMonth()+1)).slice(-2)+'-'+("0"+new Date().getDate()).slice(-2);
    let laHora = fechaCompl.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });          
    console.log( `¡Reporte generado con éxito!
    |===*** Reporte de ventas ***====|
    Fecha de generación: ${dia}
    Hora: ${laHora}
    |===*** Cantidad de pedidos realizados ***====|
    Total: ${cont.length}
    |===*** Cantidad de pedidos para delivery ***====|
    Total: ${traerCant(cont, "esParaLlevar", true)}
    |===*** Cantidad de pizzas vendidas por gusto ***====|
    Total Muzzarella: ${traerCant(cont, "muzza", true)}
    Total Jamón y morrón: ${traerCant(cont, "gustoElegido", "jamon y morron")}
    Total Calabresa: ${traerCant(cont, "gustoElegido", "calabresa")}
    Total Napolitana: ${traerCant(cont, "gustoElegido", "napo")}
    |===*** Cantidad de pizzas vendidas por tamaño ***====|
    Total Personal: ${traerCant(cont, "tamanio", "personal")}
    Total Mediana: ${traerCant(cont, "tamanio", "mediano")}
    Total Grande: ${traerCant(cont, "tamanio", "grande")}
    |===*** Cantidad de pedidos con bebida ***====|
    Total: ${traerCant(cont, "llevaBebida", true)}
    |===*** Cantidad de clientes habituales ***====|
    Total: ${traerCant(cont, "esClienteHabitual", true)}
    |===*** Cantidad de empanadas regaladas ***====|
    Total: ${ flat(cont.filter( pedido => pedido.esClienteHabitual).map(ped => ped.gustosEmpanada)).length} ` );
};