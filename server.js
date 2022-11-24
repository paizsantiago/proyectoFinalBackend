const Contenedor = require('./contenedor')
const express = require('express');
const bodyParser = require("body-parser");
const { Router } = express;
const contenedor = new Contenedor('products.txt');
const carrito = new Contenedor('carrito.txt');

const app = express();
const routerProducts = Router();
const routerCarrito = Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/productos', routerProducts);
app.use('/api/carrito', routerCarrito);

const PORT = process.env.PORT || 8080;

let isAdmin = true; // boolean para verificar los roles del usuario, al ser true esta permitido que el mismo ingrese en todos los metodos, de lo contrario solo podra ingresar a ciertos metodos.

app.listen(PORT, ()=>{
    console.log(`La app esta escuchando en el puerto http://localhost:${PORT}`);
})

app.use('/public', express.static(__dirname + '/public'));

app.use('*', (req, res)=>{
    res.json({error: "-2", description: "Ruta no implementada"});
})

app.get('/', (req, res) =>{
    res.send("Hello World");
});

//rutas productos

routerProducts.use((req, res, next)=>{ //middleware
    console.log('estan ingresando a la ruta /api/products');
    next();
})

routerProducts.get('/', 
    (req, res)=>{
        const productos = JSON.stringify(contenedor.getAll());
        if (productos == "[]")  {
            res.json({error: true, msg: "Productos no encontrados"});
        } else {
            const respuesta = JSON.parse(productos);
            res.json(respuesta);
        }
    }    
);

routerProducts.get('/:id', (req, res) =>{
    const {id} = req.params;
    const productosArray = contenedor.getAll();
    const productoPedido = contenedor.getById(parseInt(id));
    if (productosArray.length < id) {
        res.json({error: "true", msg: "El producto no existe"})
    } else {
        res.json(productoPedido);
    }
});

routerProducts.delete('/:id', 
        (req, res, next) =>{
            if(isAdmin === true){
                next();
            }else{
                res.status(401).json({error: "-1", description: `Ruta /api/products DELETE no autorizada, solo administradores`})
            }
        }, (req, res) =>{
            const {id} = req.params;
            const productosArray = contenedor.getAll();
            const productoPedido = contenedor.deteleById(parseInt(id));
            if (productosArray.length < id) {
                res.json({error: "true", msg: "El producto no existe"})
            } else {
                res.json({
                    success: "true",
                    msg: "Producto eliminado",
                    productList: productoPedido
                });
            }
});

routerProducts.post('/', 
    (req, res, next) =>{
        if(isAdmin === true){
            next();
        }else{
            res.status(401).json({error: "-1", description: `Ruta /api/products DELETE no autorizada, solo administradores`})
        }
    }
    ,(req, res) => {
        try {
            const {body} = req;
            const timestamp = new Date();
            const newProduct = {...body, timestamp}
            contenedor.save(newProduct);
            res.json({succes: true, description: "Producto agregado con exito"});
        } catch (error) {
            console.log("error")
        }
});

routerProducts.put('/:id', 
    (req, res, next) =>{
        if(isAdmin === true){
            next();
        }else{
            res.status(401).json({error: "-1", description: `Ruta /api/products DELETE no autorizada, solo administradores`})
        }
    }
    ,(req, res) => {
        try {
            const { id } = req.params;
            const timestamp = Date.now();
            const { nombre, precio, thumbnail, description, codigo, stock} = req.body;
            const boolean = contenedor.updateById(id, nombre, precio, thumbnail, description, codigo, timestamp, stock);
            if (boolean) {
                res.json({succes: true, description: "Producto modificado con exito"});
            } else{
                res.json({succes: false, description: "Producto no encontrado"});
            }  
        } catch (error) {
            console.log("error")
        }
});

//rutas carrito

routerCarrito.post('/', (req, res)=>{
    const timestamp = new Date();
    const newCarrito = {timestamp: timestamp, products: []};
    carrito.save(newCarrito);
    const allCarts = carrito.getAll();
    res.json({succes: true, msg: "Carrito creado con exito", cartID: allCarts.length})
})

routerCarrito.delete('/', (req, res)=>{
    carrito.deteleAll();
    res.json({succes: true, msg: "Se eliminaron todos los carritos"})
})

routerCarrito.get('/:id/productos', (req, res)=>{
    try {
        const {id} = req.params;
        const allCarts = carrito.getAll();
        const productsCart = allCarts.find((item) => Number(item.id) === Number(id));
        res.json({cartID: id, productList: productsCart.products})
    } catch (error) {
        res.json({error: true, msg: "Carrito no encontrado"});
    }
})

routerCarrito.post('/:id/productos/:id_prod' , async (req, res)=>{
        const {id, id_prod} = req.params;
        const productoPedido = await contenedor.getById(parseInt(id_prod));
        if (productoPedido != null) {
            const allCarts = carrito.getAll();
            const cartPedido = allCarts.find((item) => Number(item.id) === Number(id));
            const newProductList = [...cartPedido.products, productoPedido];
            carrito.updateCartById(cartPedido.id, cartPedido.timestamp, newProductList);
            res.json({succes: true, msg: "Producto añadido al carrito!"})
        } else {
            res.json({error: true, msg: "Producto no encontrado"})
        }
})

routerCarrito.delete('/:id/productos/:id_prod' , (req, res)=>{
    const {id, id_prod} = req.params;
    let idNumber = Number(id_prod);
    const allCarts = carrito.getAll();
    const cartPedido = allCarts.find((item) => Number(item.id) === Number(id));
    const newCarrito = cartPedido.products.filter((item) => Number(item.id) !== idNumber);
    if (newCarrito.length === cartPedido.products.length) {
        res.json({error: true, msg: "Producto no encontrado en el carrito"})
    }else{
        carrito.updateCartById(cartPedido.id, cartPedido.timestamp, newCarrito);
        res.json({succes: true, msg: "Producto eliminado con exito al carrito!"})
    }
    
})