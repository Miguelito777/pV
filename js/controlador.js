//Variables globales
/*
valores selects: 1 = inventario, 2 = ventas
*/
var selects;
var libreria;
var coin;
var posicionModificar;
var nuevoProducto;
var apuntadorParametro;
var carritoCompra = [];
var elementoAAgregar;
var reportes;
var reportesDia;

function criteriosVentas(){
	selects = 2;
	coin = new Coincidencia();
	apuntadorParametro = coin;
	coin.getCategorias(selects);
	coin.getMarcas(selects);
}

function criterios(){
	selects = 1;
	libreria = new Tienda();
	coin = new Coincidencia();
	//var espCat = document.getElementsByTagName('select')[0].id;
	libreria.getProductos();
	apuntadorParametro = libreria;
	libreria.getCategorias(selects);
	libreria.getMarcas(selects);
	libreria.getProveedores(); 
	document.getElementById("resultadosInventario").innerHTML = "<h2>Buscando todos los productos</h2>";
}

$("#categoria").change(cambiaSelect);
$("#marca").change(cambiaSelect);
$("#proveedor").change(cambiaSelect);
$("#categoriaVentas").change(selectsVentas);
$("#marcaVentas").change(selectsVentas);

// controla los selects del modulo de ventas
function selectsVentas(){
	var categoria = document.getElementsByTagName("select")[0].value;
	var marca = document.getElementsByTagName("select")[1].value;
	var coincidencia = document.getElementById("coincidenciaPV").value;
	if (categoria != '' && marca == '' && coincidencia == ''){
		apuntadorParametro = coin;
		apuntadorParametro.categorias[categoria].getProductosCategoria(selects);
		apuntadorParametro = apuntadorParametro.categorias[categoria];
	}
	if (categoria == '' && marca != '' && coincidencia == ''){
		apuntadorParametro = coin;
		apuntadorParametro.marcas[marca].getProductosMarca(selects);
		apuntadorParametro = apuntadorParametro.marcas[marca];
	}
	if (categoria != '' && marca != '' && coincidencia == ''){
		apuntadorParametro = coin;
		apuntadorParametro.getProductosCategoriaMarcaVenta(apuntadorParametro.categorias[categoria]._id, apuntadorParametro.marcas[marca]._id);
	}
	if (categoria != '' && marca != '' && coincidencia != ''){
		apuntadorParametro = coin;
		apuntadorParametro.getProductosCategoriaMarcaVentaC(apuntadorParametro.categorias[categoria]._id, apuntadorParametro.marcas[marca]._id,coincidencia);
	}
}

function setProductosCategoriaVentas(){
	document.getElementById("resultadosBusqueda").innerHTML = "";
	// Creo tabla para mostrar productos
	$("#resultadosBusqueda").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
	for (var i = 0; i < apuntadorParametro.categorias.length; i++) {
		$("#tablaProductos").append("<tr><td>"+apuntadorParametro.categorias[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
	};
}


function cambiaSelect(){
	var categoria = document.getElementsByTagName("select")[0].value;
	var marca = document.getElementsByTagName("select")[1].value;
	var proveedor = document.getElementsByTagName("select")[2].value;
	if (marca == '' && proveedor == '' && categoria != '') {
		document.getElementById("resultadosInventario").innerHTML = "<h1>Buscando productos...</h1>";
		apuntadorParametro = libreria.categorias[categoria];
		libreria.categorias[categoria].getProductosCategoria(selects);
	};
	if (marca != '' && proveedor == '' && categoria == '') {
		document.getElementById("resultadosInventario").innerHTML = "<h1>Buscando productos...</h1>";
		apuntadorParametro = libreria.marcas[marca];
		libreria.marcas[marca].getProductosMarca(selects);
	};
	if (marca == '' && proveedor != '' && categoria == '') {
		document.getElementById("resultadosInventario").innerHTML = "<h1>Buscando productos...</h1>";
		apuntadorParametro = libreria.proveedores[proveedor];
		libreria.proveedores[proveedor].getProductosProveedor();
	};
	if (marca != '' && proveedor == '' && categoria != '') {
		document.getElementById("resultadosInventario").innerHTML = "<h1>Buscando productos...</h1>";
		apuntadorParametro = libreria;
		libreria.getProductosCategoriaMarca(libreria.categorias[categoria].getId(),libreria.marcas[marca].getId());
	};
	if (marca != '' && proveedor != '' && categoria == '') {
		document.getElementById("resultadosInventario").innerHTML = "<h1>Buscando productos...</h1>";
		apuntadorParametro = libreria;
		libreria.getProductosMarcaProveedor(libreria.marcas[marca].getId(),libreria.proveedores[proveedor].getId());
	};
	if (marca == '' && proveedor != '' && categoria != '') {
		document.getElementById("resultadosInventario").innerHTML = "<h1>Buscando productos...</h1>";
		apuntadorParametro = libreria;
		libreria.getProductosCategoriaProveedor(libreria.categorias[categoria].getId(),libreria.proveedores[proveedor].getId());
	};
	if (marca != '' && proveedor != '' && categoria != '') {
		document.getElementById("resultadosInventario").innerHTML = "<h1>Buscando productos...</h1>";
		apuntadorParametro = libreria;
		libreria.getProductosCategoriaMarcaProveedor(libreria.categorias[categoria].getId(),libreria.marcas[marca].getId(), libreria.proveedores[proveedor].getId());
	};
	if (marca == '' && proveedor == '' && categoria == '') {
		document.getElementById("resultadosInventario").innerHTML = "<h1>Buscando productos...</h1>";
		apuntadorParametro = libreria;
		libreria.getProductos();	
	};
}

// Controlador de coincidencias de inventario
function coincidenciaProducto(str){
	if (str != ""){
		document.getElementById("resultadosInventario").innerHTML = "<h1>Buscando resultados...</h1>";
		apuntadorParametro = coin;
		coin.getProductosCoincidencia(str);
	}
	else{
		libreria.getProductos();
		apuntadorParametro = libreria;
	}
}
// control de coincidencia de ventas
function coincidenciaProductoV(str){
	if (str != ""){
		document.getElementById("resultadosBusqueda").innerHTML = "<div style='text-align:center'><img src='img/ajax-loader.gif'></div>";
		apuntadorParametro = coin;
		apuntadorParametro.getProductosCoincidenciaVenta(str);
	}
	else{
		document.getElementById("resultadosBusqueda").innerHTML = "<h1>Aqui se mostrarán los resultados de las busquedas...</h1>";
	}
}
function setProductosCoincidenciaV(){
	document.getElementById("resultadosBusqueda").innerHTML = "";
	// Creo tabla para mostrar productos
	$("#resultadosBusqueda").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Categoria</th><th>Descripcion</th><th>Marca</th><th>Precio Venta</th><th>Existencia</th><th>Agregar</th></tr></table>");
	for (var i = 0; i < apuntadorParametro.productos.length; i++) {
		$("#tablaProductos").append("<tr><td>"+apuntadorParametro.productos[i].codigoCategoria+"</td><td>"+apuntadorParametro.productos[i].descripcion+"</td><td>"+apuntadorParametro.productos[i].codigoMarca+"</td><td>"+apuntadorParametro.productos[i].precioVenta+"</td><td>"+apuntadorParametro.productos[i].existencia+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#cantidadAlCarrito' onclick = 'agregarAlCarrito(this.id)'>Agregar</button></td></tr>");
	};
}

function agregarAlCarrito(elementoAgregar){
	elementoAAgregar = elementoAgregar;
	document.getElementById("cantidadProductos").value = 1;
}

// control de click del modulo de ventas
$("#agregarCantidadCarrito").click(agregarElementosAlCarrito);

function agregarElementosAlCarrito(){
	var cantidadSeleccionada = document.getElementById("cantidadProductos").value;
	if (parseInt(cantidadSeleccionada) <= parseInt(apuntadorParametro.productos[elementoAAgregar].existencia)) {
		realizarCalculosCarrito(apuntadorParametro.productos[elementoAAgregar],cantidadSeleccionada);
	}
	else
		alert("No Existe suficientes productos en inventario");
}

function realizarCalculosCarrito(elemento, Cantidad){
	var nuevoElemento = {};
	var totalCompra = 0;
	var totalProducto;
	nuevoElemento._id = elemento._id;
	nuevoElemento.descripcion = elemento.descripcion;
	nuevoElemento.marca = elemento.codigoMarca;
	nuevoElemento.cantidad = Cantidad;
	nuevoElemento.precio = elemento.precioVenta;
	totalProducto = parseInt(Cantidad)*elemento.precioVenta;
	nuevoElemento.total = totalProducto;
	carritoCompra.push(nuevoElemento);

	for (var i in carritoCompra){
		totalCompra = totalCompra + carritoCompra[i].total;
	}

	document.getElementById("totalCompra").innerHTML = "<h1>Q. "+totalCompra+"</h1>";
	document.getElementById("carritoCompra").innerHTML = "";
	// Creo tabla para mostrar productos
	$("#carritoCompra").append("<table class='table table-striped table-condensed' id='tablaProductosCarrito'><tr class='success'><th>Cantidad Comprada</th><th>Producto</th><th>Marca</th><th>Precio Unitado</th><th>Sub total</th><th>Accion</th></tr></table>");
		for (var i = 0; i < carritoCompra.length; i++) {
			$("#tablaProductosCarrito").append("<tr><td>"+carritoCompra[i].cantidad+"</td><td>"+carritoCompra[i].descripcion+"</td><td>"+carritoCompra[i].marca+"</td><td>"+carritoCompra[i].precio+"</td><td>"+carritoCompra[i].total+"</td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProductoCarrito(this.id)'>borrar</button></tr>");
	};
}

function deleteProductoCarrito(elementoBorrar){
	carritoCompra.splice(elementoBorrar,1);
	var totalCompra = 0;
	for (var i in carritoCompra){
		totalCompra = totalCompra + carritoCompra[i].total;
	}
	document.getElementById("totalCompra").innerHTML = "";
	document.getElementById("totalCompra").innerHTML = "<h1>Q. "+totalCompra+"</h1>";
	document.getElementById("carritoCompra").innerHTML = "";
	$("#carritoCompra").append("<table class='table table-striped table-condensed' id='tablaProductosCarrito'><tr class='success'><th>Cantidad Comprada</th><th>Producto</th><th>Marca</th><th>Precio Unitado</th><th>Sub total</th><th>Accion</th></tr></table>");
		for (var i = 0; i < carritoCompra.length; i++) {
			$("#tablaProductosCarrito").append("<tr><td>"+carritoCompra[i].cantidad+"</td><td>"+carritoCompra[i].descripcion+"</td><td>"+carritoCompra[i].marca+"</td><td>"+carritoCompra[i].precio+"</td><td>"+carritoCompra[i].total+"</td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProductoCarrito(this.id)'>borrar</button></tr>");
	};
}

// Control de clicks de inventario
$("#crearProducto").click(crearProducto);
$("#nuevoPro").click(limpiarFormulario);

function limpiarFormulario(){
	document.getElementById("codigoProducto").value = "";
	document.getElementById("descripcionProducto").value = "";
	document.getElementsByTagName("select")[3].value;
	document.getElementsByTagName("select")[4].value;
	document.getElementsByTagName("select")[5].value;
	document.getElementById("totalInicial").value = "";
	document.getElementById("precioCosto").value = "";
	document.getElementById("precioVenta").value = "";
}

function crearProducto(){
	var codigoProducto = document.getElementById("codigoProducto").value;
	var descripcionProducto = document.getElementById("descripcionProducto").value;
	var codigoCategoria = document.getElementsByTagName("select")[3].value;
	var codigoMarca = document.getElementsByTagName("select")[4].value;
	var codigoProveedor = document.getElementsByTagName("select")[5].value;
	var totalInicial = document.getElementById("totalInicial").value;
	var precioCosto = document.getElementById("precioCosto").value;
	var precioVenta = document.getElementById("precioVenta").value;	

	if (codigoProducto != '' && descripcionProducto != '' && codigoCategoria != '' && codigoMarca != '' && codigoProveedor != '') {
		nuevoProducto = new Producto();
		nuevoProducto._id = codigoProducto;
		nuevoProducto.descripcion = descripcionProducto;
		nuevoProducto.codigoCategoria = libreria.categorias[codigoCategoria].getId();
		nuevoProducto.codigoMarca = libreria.marcas[codigoMarca].getId();
		nuevoProducto.codigoProveedor = libreria.proveedores[codigoProveedor].getId();
		nuevoProducto.cantidadTotal = totalInicial;
		nuevoProducto.precioCosto = precioCosto;
		nuevoProducto.precioVenta = precioVenta;
		posicionModificar = libreria.productos.length;
		libreria.productos.push(nuevoProducto);
		libreria.productos[posicionModificar].crearNuevo();
	}
	else
		alert("Por favor de llenar todos los campos disponibles");
}

function insertarNuevoProductoTabla(productoAlmacenadoNuevo){
	document.getElementById("resultadosInventario").innerHTML = "";
	// Creo tabla para mostrar productos
	$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
		for (var i = 0; i < libreria.productos.length; i++) {
			$("#tablaProductos").append("<tr><td>"+libreria.productos[i]._id+"</td><td>"+libreria.productos[i].existencia+"</td><td>"+libreria.productos[i].descripcion+"</td><td>"+libreria.productos[i].cantidadTotal+"</td><td>"+libreria.productos[i].precioCosto+"</td><td>"+libreria.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
	};
}

function updateProducto(posicionProducto){
	posicionModificar = posicionProducto;
	document.getElementById("descripcionProductoU").value = apuntadorParametro.productos[posicionProducto].descripcion;
	document.getElementById("totalInicialU").value = '';
	document.getElementById("precioCostoU").value = apuntadorParametro.productos[posicionProducto].precioCosto;
	document.getElementById("precioVentaU").value = apuntadorParametro.productos[posicionProducto].precioVenta;
}

$("#updateProductoConfirm").click(updateProductoConfirmBD);

function updateProductoConfirmBD(){
	apuntadorParametro.productos[posicionModificar].descripcion =	document.getElementById("descripcionProductoU").value; 
	apuntadorParametro.productos[posicionModificar].cantidadTotal = document.getElementById("totalInicialU").value;
	apuntadorParametro.productos[posicionModificar].precioCosto = document.getElementById("precioCostoU").value;
	apuntadorParametro.productos[posicionModificar].precioVenta = document.getElementById("precioVentaU").value;
	apuntadorParametro.productos[posicionModificar].updateProducto();
}

function updateProductoTabla(){
	document.getElementById("resultadosInventario").innerHTML = "";
	// Creo tabla para mostrar productos
	$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
		for (var i = 0; i < apuntadorParametro.productos.length; i++) {
			$("#tablaProductos").append("<tr><td>"+apuntadorParametro.productos[i]._id+"</td><td>"+apuntadorParametro.productos[i].existencia+"</td><td>"+apuntadorParametro.productos[i].descripcion+"</td><td>"+apuntadorParametro.productos[i].cantidadTotal+"</td><td>"+apuntadorParametro.productos[i].precioCosto+"</td><td>"+apuntadorParametro.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
	};
}

function deleteProducto(posicionProducto){
	var okDelete = confirm("¿Esta seguro de eliminar "+apuntadorParametro.productos[posicionProducto].descripcion+"?");
	if (okDelete){
		posicionModificar = posicionProducto;
		apuntadorParametro.productos[posicionProducto].deleteProducto();
	}
}

function deleteproductoTabla(){
	apuntadorParametro.productos.splice(posicionModificar,1);
	document.getElementById("resultadosInventario").innerHTML = "";
	// Creo tabla para mostrar productos
	$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
		for (var i = 0; i < apuntadorParametro.productos.length; i++) {
			$("#tablaProductos").append("<tr><td>"+apuntadorParametro.productos[i]._id+"</td><td>"+apuntadorParametro.productos[i].existencia+"</td><td>"+apuntadorParametro.productos[i].descripcion+"</td><td>"+apuntadorParametro.productos[i].cantidadTotal+"</td><td>"+apuntadorParametro.productos[i].precioCosto+"</td><td>"+apuntadorParametro.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
	};	
}

/*
	Realiza la Cotizacion del Carito
*/

$("#realizarCotizacion").click(realizarCotizacion);

function realizarCotizacion(){
	var ventas = [];
	for(var i in carritoCompra){
		var venta = {};
		venta._id = carritoCompra[i]._id;
		venta.cantidad = carritoCompra[i].cantidad;	
		ventas.push(venta);
	}
	apuntadorParametro.realizarCotizacionCarrito(ventas);
	alert("Cotización realizada correctamente...");
	document.getElementById("carritoCompra").innerHTML = "";
	carritoCompra = [];
	document.getElementById("totalCompra").innerHTML = "<h1>Q.</h1>";
}

$("#realizarVenta").click(realizarVenta);

function realizarVenta(){
	var ventas = [];
	var almacenarCliente =  confirm("¿Desea almacenar cliente?");
	if (!almacenarCliente) {
		for(var i in carritoCompra){
			var venta = {};
			venta._id = carritoCompra[i]._id;
			venta.cantidad = carritoCompra[i].cantidad;	
			ventas.push(venta);
		}
		apuntadorParametro.realizarVentaCarrito(ventas);	
		alert("Venta realizada correctamente...");
		document.getElementById("carritoCompra").innerHTML = "";
		carritoCompra = [];
		document.getElementById("totalCompra").innerHTML = "<h1>Q.</h1>";
	};
}

function reporteVentas(){
	document.getElementById("espacioReportes").innerHTML = "<img src='img/ajax-loader.gif'>";

	reportes = new Tienda();
	reportes.iniciarTiendaServidor();
	reportes.getReporteDia();
}

function mostrarReportes(){
	reportesDia = reportes.obtenerReportes();
	document.getElementById("espacioReportes").innerHTML = "";
	$("#espacioReportes").append("<table class='table table-hover table-striped' id='tablaReportes'><tr><th>Hora</th><th>Cantidad <br />Compra</th><th>Producto</th><th>Marca</th><th>Precio Venta</th><th>Existencia</th><th>Subtotal</th><th>Modificar</th><th>Borrar</th></tr></table>");
	for(var i in reportesDia){
		$("#tablaReportes").append("<tr><td>"+reportesDia[i].hora+"</td><td>"+reportesDia[i].cantidadComprada+"</td><td>"+reportesDia[i].producto+"</td><td>"+reportesDia[i].marca+"</td><td>Q. "+reportesDia[i].precioVenta+"</td><td>"+reportesDia[i].existencia+"</td><td>Q. "+reportesDia[i].totalCompra+"</td><td><button id ="+i+" type='button' class='btn btn-primary' data-toggle='modal' data-target='#updateCantidadVenta' onclick = 'updateCantidadVentaa(this.id)'>Modificar</button></td><td><button type='button' class='btn btn-danger' id="+i+" onclick='deleteReporte(this.id)'>Borrar</button></td></tr>");
	}

	document.getElementById("totalVentaDia").innerHTML = "<h1>Total: Q. "+reportes.totalVentaDiaria+"</h1>";
}

function updateCantidadVentaa(posicionModificarV){
	posicionModificar = posicionModificarV;
	document.getElementById("cantidadProductos").value = reportesDia[posicionModificar].cantidadComprada;
}

function modificarCantidadVenta(){
	var nuevaCantidadVenta = parseInt(document.getElementById("cantidadProductos").value);
	if (nuevaCantidadVenta == reportesDia[posicionModificar].cantidadComprada || nuevaCantidadVenta > reportesDia[posicionModificar].cantidadComprada)
		alert("Ingresar valores inferiores a cantidad comprada");
	else
		reportesDia[posicionModificar].updateReporteReporte(posicionModificar,nuevaCantidadVenta);
}

function resultadoUpdateReporte(){
	console.log(reportesDia);
	document.getElementById("espacioReportes").innerHTML = "";
	reportes.totalVentaDiaria = 0;
	$("#espacioReportes").append("<table class='table table-hover table-striped' id='tablaReportes'><tr><th>Hora</th><th>Cantidad <br />Compra</th><th>Producto</th><th>Marca</th><th>Precio Venta</th><th>Existencia</th><th>Subtotal</th><th>Modificar</th><th>Borrar</th></tr></table>");
	for(var i in reportesDia){
		var CantidadComprada = parseInt(reportesDia[i].cantidadComprada);
		var PrecioVenta = parseFloat(reportesDia[i].precioVenta);
		reportesDia[i].totalCompra = CantidadComprada * PrecioVenta;
		reportes.totalVentaDiaria = reportes.totalVentaDiaria + reportesDia[i].totalCompra;
		$("#tablaReportes").append("<tr><td>"+reportesDia[i].hora+"</td><td>"+reportesDia[i].cantidadComprada+"</td><td>"+reportesDia[i].producto+"</td><td>"+reportesDia[i].marca+"</td><td>Q. "+reportesDia[i].precioVenta+"</td><td>"+reportesDia[i].existencia+"</td><td>Q. "+reportesDia[i].totalCompra+"</td><td><button id ="+i+" type='button' class='btn btn-primary' data-toggle='modal' data-target='#updateCantidadVenta' onclick = 'updateCantidadVentaa(this.id)'>Modificar</button></td><td><button type='button' class='btn btn-danger' id="+i+" onclick='deleteReporte(this.id)'>Borrar</button></td></tr>");
	}
	document.getElementById("totalVentaDia").innerHTML = "<h1>Total: Q. "+reportes.totalVentaDiaria+"</h1>";
}

function deleteReporte(elementoEliminar){
	posicionModificar = elementoEliminar;
	var confirmDeleteReporte = confirm("Desea eliminar este reporte"+reportes.reportes[elementoEliminar].producto);
	if (confirmDeleteReporte) {
		reportes.reportes[elementoEliminar].deleteReporte(elementoEliminar);
	};
}
function resultadoDeleteReporte(){
	reportesDia.splice(posicionModificar,1);
	document.getElementById("espacioReportes").innerHTML = "";
	reportes.totalVentaDiaria = 0;
	$("#espacioReportes").append("<table class='table table-hover table-striped' id='tablaReportes'><tr><th>Hora</th><th>Cantidad <br />Compra</th><th>Producto</th><th>Marca</th><th>Precio Venta</th><th>Existencia</th><th>Subtotal</th><th>Modificar</th><th>Borrar</th></tr></table>");
	for(var i in reportesDia){
		var CantidadComprada = parseInt(reportesDia[i].cantidadComprada);
		var PrecioVenta = parseFloat(reportesDia[i].precioVenta);
		reportesDia[i].totalCompra = CantidadComprada * PrecioVenta;
		reportes.totalVentaDiaria = reportes.totalVentaDiaria + reportesDia[i].totalCompra;
		$("#tablaReportes").append("<tr><td>"+reportesDia[i].hora+"</td><td>"+reportesDia[i].cantidadComprada+"</td><td>"+reportesDia[i].producto+"</td><td>"+reportesDia[i].marca+"</td><td>Q. "+reportesDia[i].precioVenta+"</td><td>"+reportesDia[i].existencia+"</td><td>Q. "+reportesDia[i].totalCompra+"</td><td><button id ="+i+" type='button' class='btn btn-primary' data-toggle='modal' data-target='#updateCantidadVenta' onclick = 'updateCantidadVentaa(this.id)'>Modificar</button></td><td><button type='button' class='btn btn-danger' id="+i+" onclick='deleteReporte(this.id)'>Borrar</button></td></tr>");
	}

	document.getElementById("totalVentaDia").innerHTML = "<h1>Total: Q. "+reportes.totalVentaDiaria+"</h1>";

}

