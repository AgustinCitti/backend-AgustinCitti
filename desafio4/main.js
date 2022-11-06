const express = require('express');
const aplicacion = express();
const { Router } = express;
const port = 8080;


const rutaProductos = Router();

aplicacion.use('/static', express.static(__dirname + '/public'));


class Contenedor{
    constructor(productos){
        this.productos = productos;
    }
     save(objeto){
        let id = 1;
        this.productos.forEach((element, index )=>{
            if(element.id >= id){
                id = element.id + 1;
            }
        });
        objeto.id = id;
        this.productos.push(objeto);
        return id;

    }
     getById(id){
        let objetoSeleccionado = null;
        this.productos.forEach(element => {
            if(element.id == id){
                objetoSeleccionado = element;
            }
        });
        return objetoSeleccionado;
    }

     getAll(){
        return this.productos;
    }

     deleteById(id){
        let indexSeleccionado = -1;
        this.productos.forEach((element,index) =>{
            if(element.id == id){
                indexSeleccionado = index;
            }
        });
        if(indexSeleccionado != -1){
            this.productos.splice(indexSeleccionado,1);
        }
    }
     deleteAll(){
        this.productos = [];
    }
}


const productos = new Contenedor([]);

productos.save({
    title: 'Kolsch',
    price:  '400',
    thumnail:'image'
})

console.log(productos.getAll());
//Endpoints 

rutaProductos.get('/:id', async (peticion, respuesta) => {
const id = parseInt(peticion.params.id);
const producto = productos.getById(id);
if (producto){
    respuesta.json(producto);
} else{
    respuesta.status(404);
    respuesta.json({error: 'producto no encontrado'});
}

});

aplicacion.use('/productos', rutaProductos);


const servidor = aplicacion.listen(port,() =>{
    console.log(`Servidor escuchando: ${servidor.address().port}`);
});

servidor.on('error', error => console.log(`Error: ${error}`));