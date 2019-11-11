const inquirer = require("inquirer");
const fs = require("fs");
// Configuro path y files
const filename = "pedidos.json";
const rutaArchivo = [__dirname, filename].join("/");
let data = [];
fs.existsSync(rutaArchivo)? data = fs.readFileSync(rutaArchivo, "utf8") : fs.closeSync(fs.openSync(filename, 'w'));
let contenido = data.length == 0? [] : JSON.parse(data);
//Cargo Fechas
let fechaCompl = new Date();
let dia = fechaCompl.getFullYear()+'-'+("0"+(new Date().getMonth()+1)).slice(-2)+'-'+("0"+new Date().getDate()).slice(-2);
let laHora = fechaCompl.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
// Declaro Regex Pattern y datos maestros
var anyNonDigit = patt1 = /\D/g;
var precios = {
    personal: 430,
    mediana: 560,
    grande: 650,
    delivery: 20, 
    gustoBebida: 80,
};

var aplicarDescuento = (oferta) => 
{ return typeof oferta == 'undefined'? 0: oferta.desc * oferta.itms.reduce( (acum, b) => precios[acum] += precios[b]);
};

var pizza_personal_mas_bebida = { desc:0.03, itms: ["personal", "gustoBebida"]};

var pizza_mediana_mas_bebida = {desc: 0.05, itms: ["mediana", "gustoBebida"]};

var pizza_grande_mas_bebida = {desc: 0.08, itms: ["grande", "gustoBebida"]};

var ofertas = [ pizza_personal_mas_bebida, pizza_mediana_mas_bebida, pizza_grande_mas_bebida ];

let preguntasDelivery = [
            {
                type: 'confirm',
                name: 'esParaLlevar',
                message: 'La pizza es para llevar?',
                default: false,
            },

            {
                type: 'input',
                name: 'direccion',
                message: 'Ingresa tu direccion',
                when: function(respuestas){
                    return respuestas.esParaLlevar;
                        },
                validate: rta => ( rta.trim() == '') ? 'Campo obligatorio' : true
             },
            {
                  type: 'input',
                  name: 'nombreVisitante',
                  message: 'Ingresa tu nombre',
                  validate: rtaDeEstaPregunta => {
                      if (rtaDeEstaPregunta.trim() == ''){
                          return 'Nombre Obligatorio';
                      }  
                      return true;
                  }
             },
             
             {
                  type: 'input',
                  name: 'telefono',
                  message: "Ingresa tu numero telefonico",
                  validate: rtaDeEstaPregunta => {
                      let nroTel = parseInt(rtaDeEstaPregunta);
                      if (rtaDeEstaPregunta.trim() == ''){
                          return 'telef obligatorio';
                      } 
                      if ( anyNonDigit.test(rtaDeEstaPregunta.trim()) ){
                          return 'ingrese solo numeros';
                      }
                          return true;
                      
                  }
             },
     
             {
                  type: 'rawlist',
                  name: 'gustoElegido',
                  message: "Elige el gusto de la pizza",
                  choices: ["napo", "muzza", "jamon y morron", "calabresa"],
                  default: "muzza",
             },

            {
                type: 'list',
                name: 'tamanio',
                message: 'que tamanio gustaría?',
                choices: ["personal", "mediana", "grande"],
                default: "grande",
            },
            {
                type: 'confirm',
                name: 'llevaBebida',
                message: 'Queres agregar una bebida?',
                default: false,
            },

            {
                type: 'list',
                name: 'gustoBebida',
                message: 'Elegi el gusto de la bebida',
                choices: ["Pepsi", "Coca", "Fanta", "Sprite"],
                default: "Coca",
                when: function(respuestas){
                    return respuestas.llevaBebida;
                        },
            },

            {
                type: 'confirm',
                name: 'esClienteHabitual',
                message: 'Es cliente habitual?',
                default: false,
            },
            {
                type: 'checkbox',
                name: 'adicionales',
                choices: ["pepperoni", "tomate", "quesoazul"]
            },
            {
                type: 'checkbox',
                name: 'gustosEmpanada',
                message: '¿Que gusto de empanadas queres?',
                choices: ["Carne", "Capresse", "JyQ", "verdura"],
                when: function (rtas){
                    return rtas.esClienteHabitual === true;
                },
                validate: function(rta){
                    if (rta.length != 3){
                        return 'elegí 3 empanadas';
                    }
                    return true;
                }
            },
    ]


    inquirer
             .prompt(preguntasDelivery)
             .then(function(respuestas){
                console.log("=== Resumen de tu pedido ===");
                console.log("Tus datos son - nombre: " + respuestas.nombreVisitante + 
                "   Teléfono: " + respuestas.telefono);
                if (respuestas.esParaLlevar){
                   console.log("Tu pedido será entregado en: "+ respuestas.direccion); 
                }else{
                   console.log("Nos indicaste que pasarás a retirar tu pedido");
                }
                console.log("=== Productos solicitados ===");
                console.log("Pizza: " + respuestas.gustoElegido);
                console.log("Tamaño: " + respuestas.tamanio);
                if(respuestas.llevaBebida){
                 console.log("Bebida: " + respuestas.gustoBebida);
                }
                if(respuestas.esClienteHabitual){
                    console.log("Tus tres empanadas de regalo serán de: ");
                    for (let empanada in respuestas.gustosEmpanada){
                        console.log(" * " + respuestas.gustosEmpanada[empanada]);
                    }
                };
                //Cargo array de productos, obtengo el precio total de los mismos, aplico descuentos, si los hay.
                let prods = [respuestas.tamanio];
                if (respuestas.llevaBebida) {prods.push("gustoBebida")};
                let total_prod = prods.map (prod => precios[prod]).reduce ( (ac, precio)=> ac += precio);
                let total_dev = respuestas.esParaLlevar? precios.delivery : 0;
                let descuento = aplicarDescuento(ofertas.filter ( ofta => ofta.itms.every( itm => prods.includes(itm) ))[0]);
                //NOTA: Según el enunciado entiendo que los descuentos aplican a los productos, no al costo de delivery.
                console.log("=================================");
                console.log("Total productos: " + total_prod );
                console.log("Total delivery: " + total_dev);
                console.log("Descuentos: " + descuento);
                console.log("Total: " + (total_prod + total_dev - descuento));
                console.log("=================================");
                console.log("Gracias por comprar en DH Pizzas. Esperamos que disfrutes tu pedido.");
                console.log("Fecha: " + dia);
                console.log("Hora: " + laHora);
                // Formo objeto pedido y lo guardo en el archivo.
                let pedido = { ...respuestas, 
                    fecha: dia, 
                    hora: laHora, 
                    totalProductos: total_prod,
                    descuento: descuento,
                    numeroPedido: contenido.length + 1,
                };
                contenido.push(pedido);
                fs.writeFileSync(rutaArchivo, JSON.stringify(contenido, null, ' ')); 
            }); 
             