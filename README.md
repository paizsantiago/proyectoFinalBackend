# Proyecto Final Backend (Primera entrega)

Realice el proyecto entero desde el backend, sin front.
Utilizando Postman para comprobar el funcionamiento del mismo.


## Rutas a probar  


## Para los productos: 


Para los productos: (GET para ver los productos almacenados en fs).


http://localhost:8080/api/productos/:id (GET para ver un producto mediante el id).


http://localhost:8080/api/productos/:id (DELETE para eliminar un producto mediante el id).


http://localhost:8080/api/productos (POST para agregar un producto).


http://localhost:8080/api/productos/:id (PUT para modificar un producto ya existente mediante el id).


##Para el carrito: 


http://localhost:8080/api/carrito (POST para crear un carrito con su respectivo id).


http://localhost:8080/api/productos (DELETE para eliminar todos los carritos existentes).


http://localhost:8080/api/productos/:id/productos (GET para mostrar todos los productos agregados a un carrito especificado por id).


http://localhost:8080/api/productos/:id/:id_prod (POST para agregar un producto existente con su respectivo id a un carrito en especifico).


http://localhost:8080/api/productos/:id/:id_prod (DELETE para eliminar un producto en especifico de un carrito en especifico).


##Postman


Para probar dichos funcionamientos, consta de pegar el endpoint y especificar la funcion a realizar.


SI la funcion a realizar es un GET, o DELETE, consta simplemente a golpear el endpoint mediante el boton "SEND".


![image](https://user-images.githubusercontent.com/90289434/203857998-a537d9c3-97fa-43de-81cf-4c8957893ab9.png)


SI la funcion a realizar es POST, o PUT de un producto por ejemplo, elegir la opcion body, row y json. Siguiendo el la estructura planteada en el enunciado del desafio.


![image](https://user-images.githubusercontent.com/90289434/203858244-ff73e48b-ae47-48bc-b6dd-f43f873ac7db.png)







