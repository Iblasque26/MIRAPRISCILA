document.addEventListener("DOMContentLoaded", function () {
    const numeroCarritoElement = document.querySelector(".numeroCarrito");
    const productosDelCarritoLS = JSON.parse(localStorage.getItem("productosDelCarrito")) || [];
    const cantidadTotalEnCarrito = productosDelCarritoLS.reduce((acc, producto) => acc + producto.cantidad, 0);
    numeroCarritoElement.textContent = cantidadTotalEnCarrito;
});

let productos = [];

fetch("../js/productos.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
      productos = data;
      console.log(productos);
        cargarProductos(productos);
  })
  .catch(error => {
    console.error('Error en la solicitud fetch:', error);
  });


function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        //Cargar productos en el HTML con estilos lindos
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
        <div class="producto-card card shadow-sm">
    <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">
    <div class="producto-info">
        <h5 class="producto-titulo">${producto.titulo}</h5>
        <p class="producto-precio">$${producto.precio}</p>
        <button class="producto-agregar" id="${producto.id}">Agregar al Carrito</button>
    </div>
</div>

        `;
        contenedorProductos.appendChild(div);
    });
    botonAgregar();
}


const contenedorProductos = document.querySelector("#contenedorProductos");
let botonesAgregar = document.querySelectorAll(".productoAgregar");
const numeroCarrito = document.querySelector(".numeroCarrito");



function botonAgregar() {
    botonesAgregar = document.querySelectorAll(".productoAgregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosDelCarrito;

let productosDelCarritoLS = localStorage.getItem("productosDelCarrito");

if (productosDelCarritoLS) {
    productosDelCarrito = JSON.parse(productosDelCarritoLS);
    actualizarNumeroDelCarrito();
} else {
    productosDelCarrito = [];
}

function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosDelCarrito.some(producto => producto.id === idBoton)) {
        const index = productosDelCarrito.findIndex(producto => producto.id === idBoton);
        productosDelCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosDelCarrito.push(productoAgregado);
    }
    actualizarNumeroDelCarrito();
    mostrarNotificacion("Usted ha agregado el producto al carrito!");
    localStorage.setItem("productosDelCarrito", JSON.stringify(productosDelCarrito));
}

function actualizarNumeroDelCarrito() {
    let numeroActualizado = productosDelCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numeroCarrito.innerText = numeroActualizado;
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.getElementById("notificacionProducto");
    const mensajeNotificacion = document.getElementById("mensajeProducto");

    mensajeNotificacion.textContent = mensaje;
    notificacion.style.display = "block";

    setTimeout(() => {
        notificacion.style.display = "none";
    }, 3000); 
}