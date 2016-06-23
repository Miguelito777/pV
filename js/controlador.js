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
var crudCategorias = [];
var obj;// Objeto para mostrar las categorias 
var crudMarcas = [];
var objM;// Objeto para mostrar las categorias 
var crudProveedores = [];
var objP;// Objeto para mostrar las categorias 
var tipoUser // Tipo de usuario a logearse

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
	var descripcionProducto = document.getElementById("descripcionProducto").value;
	var codigoCategoria = document.getElementsByTagName("select")[3].value;
	var categoriaNueva = document.getElementById("nuevaCategoria").value;
	var codigoMarca = document.getElementsByTagName("select")[4].value;
	var marcaNueva = document.getElementById("nuevaMarca").value;
	var codigoProveedor = document.getElementsByTagName("select")[5].value;
	var proveedorNuevo = document.getElementById("nuevoProveedor").value;
	var totalInicial = document.getElementById("totalInicial").value;
	var precioCosto = document.getElementById("precioCosto").value;
	var precioVenta = document.getElementById("precioVenta").value;	

	if (categoriaNueva == '' && marcaNueva == '' && proveedorNuevo == '') { //Verifico que los campos para ingresar nueva categoria, marca y proveedor sean vacias
		if (descripcionProducto != '' && codigoCategoria != '' && codigoMarca != '' && codigoProveedor != '') {
			nuevoProducto = new Producto();
			nuevoProducto.descripcion = descripcionProducto;
			nuevoProducto.codigoCategoria = parseInt(libreria.categorias[codigoCategoria].getId());
			nuevoProducto.codigoMarca = parseInt(libreria.marcas[codigoMarca].getId());
			nuevoProducto.codigoProveedor = parseInt(libreria.proveedores[codigoProveedor].getId());
			nuevoProducto.cantidadTotal = totalInicial;
			nuevoProducto.precioCosto = precioCosto;
			nuevoProducto.precioVenta = precioVenta;
			posicionModificar = libreria.productos.length;
			libreria.productos.push(nuevoProducto);
			libreria.productos[posicionModificar].crearNuevo();
		}
		else
			alert("Por favor de llenar todos los campos disponibles");
	}// Si alguna opcion de los campos para ingresar nuevo no esta vacia entonces
	else{
		//Creo un nuevo producto con los datos únicos
		var errorEncontrado = false;
		nuevoProducto = new Producto();
		nuevoProducto.descripcion = descripcionProducto;
		if (categoriaNueva != '' && codigoCategoria != ''){ //Verifico que el usuario no haya seleccionado las dos opciones para ingresar una categoria al producto
			errorEncontrado = true;
			alert("Solo debe seleccionar una opcion para categoria");
		}  
		else{
			//El usuario solo ingreso una opcion para ingresar la categoria
			if (categoriaNueva != '')//Si el usuario desea ingresar la categoria por medio del imput 
				nuevoProducto.codigoCategoria = categoriaNueva;
			else//De lo contrario ingresamos el codigo de la categoria seleccionada en el select
				nuevoProducto.codigoCategoria = parseInt(libreria.categorias[codigoCategoria].getId());
		} 
		if(marcaNueva != '' && codigoMarca != ''){ // Verifico que el usuario no haya seleccionado las dos opciones para ingresar una marca al producto
			errorEncontrado = true;
			alert("Solo debe seleccionar una opcion para Marca");
		}
		else{
			//el usuario solo ingreso una opcion para ingresar la marca
			if (marcaNueva != '')// si el usuario desea ingresar la marca por medio del imput
				nuevoProducto.codigoMarca = marcaNueva;
			else//De lo contrario ingresamos el codigo de la marca seleccionada en el select
				nuevoProducto.codigoMarca = parseInt(libreria.marcas[codigoMarca].getId());
		}
		if (proveedorNuevo != '' && codigoProveedor != ''){//Verifico que no se haya seleccionado las dos opciones para ingresar un proveedor al producto
			errorEncontrado = true;
			alert("Solo debe seleccionar una opcion para proveedor");
		}
		else{
			//Solo se ha seleccionada una de las dos opciones para ingresar un proveedor al producto
			if (proveedorNuevo != '')//Se desea almacenar un proveedor nuevo 
				nuevoProducto.codigoProveedor = proveedorNuevo;
			else//Se desea almacenar un proveedor existente
				nuevoProducto.codigoProveedor = parseInt(libreria.proveedores[codigoProveedor].getId());
		}
		nuevoProducto.cantidadTotal = totalInicial;
		nuevoProducto.precioCosto = precioCosto;
		nuevoProducto.precioVenta = precioVenta;
		posicionModificar = libreria.productos.length;
		if (!errorEncontrado){
			libreria.productos.push(nuevoProducto);
			libreria.productos[posicionModificar].crearNuevo();
		}
	}
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
		for(var i in carritoCompra){
			var venta = {};
			venta._id = carritoCompra[i]._id;
			venta.cantidad = carritoCompra[i].cantidad;	
			ventas.push(venta);
		}
		apuntadorParametro.realizarVentaCarrito(ventas);	
}

function reporteVentas(){
	
	$('#example1').datepicker({
		format: "yyyy/mm/dd",
		startDate: '-3d',
		language: 'es' 
	})
	.on("changeDate", function(e){
		$('#example1').datepicker('hide');

		document.getElementById("espacioReportes").innerHTML = "<img src='img/ajax-loader.gif'>";
		reportes = new Tienda();
		reportes.iniciarTiendaServidor();
		var fecha = document.getElementById("example1").value;
		reportes.getReporteDia(fecha);
	});
}

// Muestra el reporte de Ventas diaria
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

function updateCantidadCompra(posicionModificarV){
	posicionModificar = posicionModificarV;
	document.getElementById("cantidadProductos").value = reportesDia[posicionModificar].cantidadComprada;
}

function modificarCantidadCompra(){
	var nuevaCantidadVenta = parseInt(document.getElementById("cantidadProductos").value);
	if (nuevaCantidadVenta == reportesDia[posicionModificar].cantidadComprada || nuevaCantidadVenta > reportesDia[posicionModificar].cantidadComprada)
		alert("Ingresar valores inferiores a cantidad comprada");
	else
		reportesDia[posicionModificar].updateReporteCompra(posicionModificar,nuevaCantidadVenta);
}

function resultadoUpdateReporte(){
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
	var confirmDeleteReporte = confirm("Desea eliminar esta venta "+reportes.reportes[elementoEliminar].producto);
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


/**
*------------ Script para controlar los crud de Categoria, Marca y proveedor---------------------------------------------------
*/
function getCategorias(){
	selects = 3;
	libreria = new Tienda();
	//apuntadorParametro = libreria;
	libreria.getCategorias(selects);
}

function rCategorias(){
	// Creo un array con las categorias(objetos) de la libreria(objeto)
	for(var i in libreria.categorias){
		var categoria = [];
		categoria.push(libreria.categorias[i].getId());
		categoria.push(libreria.categorias[i].getNombre());
		categoria.push("<button type='button' class='btn btn-link' id="+i+" onclick='deleteCategoria(this.id)'>borrar</button>");
		crudCategorias.push(categoria);
	}

	// Creo una nueva ventana editable para los datos
	obj = { width: 675, height: 447, title: "Categorias",resizable:false,draggable:false };
	// Establesco la estructura de las columnas
	obj.colModel = 
		[
			{ title: "Codigo", width: 25, dataType: "string", align: "center", editable: false},
			{ title: "Categoria", width: 273, dataType: "string", align: "center", editable: true},
			{ title: "Opcion", width: 100, dataType: "string", align: "center", editable: false}
		];
	//Ingreso datos a la tabla, tiene que ser array asociativo numerico
	obj.dataModel = { data: crudCategorias};

	// Muestro la tabla con los datos
	var $grid = $("#rCategorias").pqGrid(obj);
	$("#rCategorias").pqGrid({editModel:{clicksToEdit: 1,saveKey:13 }});

	$grid.on( "pqgridcellsave", function(){
		console.log();
		/*obj.dataModel = { data: curso.tareas_array};
		var $grid = $("#tareasAsignadas").pqGrid(obj);
		$("#tareasAsignadas").pqGrid({editModel:{clicksToEdit: 1,saveKey:13 }});*/
	});

}

function deleteCategoria(categoriaEliminar){
	posicionModificar = categoriaEliminar;
	var statusDelete = confirm("¿Eliminar la categoria "+libreria.categorias[categoriaEliminar].getNombre()+"?");
	if (statusDelete)
		libreria.categorias[categoriaEliminar].deleteCategoria();
}
function updateTableCategoria(){
	crudCategorias.splice(posicionModificar,1);

	//Ingreso datos a la tabla, tiene que ser array asociativo numerico
	obj.dataModel = { data: crudCategorias};

	// Muestro la tabla con los datos
	var $grid = $("#rCategorias").pqGrid(obj);
	$("#rCategorias").pqGrid({editModel:{clicksToEdit: 1,saveKey:13 }});

}


/**
* Control de marcas
*/
function getMarcas(){
	selects = 3;
	libreria = new Tienda();
	//apuntadorParametro = libreria;
	libreria.getMarcas(selects);
}

function rMarcas(){
	// Creo un array con las categorias(objetos) de la libreria(objeto)
	for(var i in libreria.marcas){
		var marca = [];
		marca.push(libreria.marcas[i].getId());
		marca.push(libreria.marcas[i].getNombre());
		marca.push("<button type='button' class='btn btn-link' id="+i+" onclick='deleteMarca(this.id)'>borrar</button>");
		crudMarcas.push(marca);
	}

	// Creo una nueva ventana editable para los datos
	objM = { width: 675, height: 447, title: "Marcas",resizable:false,draggable:false };
	// Establesco la estructura de las columnas
	objM.colModel = 
		[
			{ title: "Codigo", width: 25, dataType: "string", align: "center", editable: false},
			{ title: "Marca", width: 273, dataType: "string", align: "center", editable: true},
			{ title: "Opcion", width: 100, dataType: "string", align: "center", editable: false}
		];
	//Ingreso datos a la tabla, tiene que ser array asociativo numerico
	objM.dataModel = { data: crudMarcas};

	// Muestro la tabla con los datos
	var $grid = $("#rCategorias").pqGrid(objM);
	$("#rCategorias").pqGrid({editModel:{clicksToEdit: 1,saveKey:13 }});

	$grid.on( "pqgridcellsave", function(){
		console.log('click en las marcas');
		/*obj.dataModel = { data: curso.tareas_array};
		var $grid = $("#tareasAsignadas").pqGrid(obj);
		$("#tareasAsignadas").pqGrid({editModel:{clicksToEdit: 1,saveKey:13 }});*/
	});

}

function deleteMarca(marcaDelete){
	posicionModificar = marcaDelete;
	var statusDelete = confirm("¿Eliminar la marca "+libreria.marcas[posicionModificar].getNombre()+"?");
	if (statusDelete)
		libreria.marcas[posicionModificar].deleteMarca();
}
function updateTableMarcas(){
	crudMarcas.splice(posicionModificar,1);

	//Ingreso datos a la tabla, tiene que ser array asociativo numerico
	objM.dataModel = { data: crudMarcas};

	// Muestro la tabla con los datos
	var $grid = $("#rCategorias").pqGrid(objM);
	$("#rCategorias").pqGrid({editModel:{clicksToEdit: 1,saveKey:13 }});

}



/**
* Control de Proveedores
*/
function getProveedores(){
	selects = 3;
	libreria = new Tienda();
	//apuntadorParametro = libreria;
	libreria.getProveedores(selects);
}

function rProveedor(){
	// Creo un array con las categorias(objetos) de la libreria(objeto)
	for(var i in libreria.proveedores){
		var proveedor = [];
		proveedor.push(libreria.proveedores[i].getId());
		proveedor.push(libreria.proveedores[i].getNombre());
		proveedor.push("<button type='button' class='btn btn-link' id="+i+" onclick='deleteProveedor(this.id)'>borrar</button>");
		crudProveedores.push(proveedor);
	}

	// Creo una nueva ventana editable para los datos
	objP = { width: 675, height: 447, title: "Proveedores",resizable:false,draggable:false };
	// Establesco la estructura de las columnas
	objP.colModel = 
		[
			{ title: "Codigo", width: 25, dataType: "string", align: "center", editable: false},
			{ title: "Proveedor", width: 273, dataType: "string", align: "center", editable: true},
			{ title: "Opcion", width: 100, dataType: "string", align: "center", editable: false}
		];
	//Ingreso datos a la tabla, tiene que ser array asociativo numerico
	objP.dataModel = { data: crudProveedores};

	// Muestro la tabla con los datos
	var $grid = $("#rCategorias").pqGrid(objP);
	$("#rCategorias").pqGrid({editModel:{clicksToEdit: 1,saveKey:13 }});

	$grid.on( "pqgridcellsave", function(){
		console.log('click en las marcas');
		/*obj.dataModel = { data: curso.tareas_array};
		var $grid = $("#tareasAsignadas").pqGrid(obj);
		$("#tareasAsignadas").pqGrid({editModel:{clicksToEdit: 1,saveKey:13 }});*/
	});

}

function deleteProveedor(proveedorDelete){
	posicionModificar = proveedorDelete;
	var statusDelete = confirm("¿Eliminar la marca "+libreria.proveedores[posicionModificar].getNombre()+"?");
	if (statusDelete)
		libreria.proveedores[posicionModificar].deleteProveedor();
}
function updateTableProveedores(){
	crudProveedores.splice(posicionModificar,1);

	//Ingreso datos a la tabla, tiene que ser array asociativo numerico
	objP.dataModel = { data: crudProveedores};

	// Muestro la tabla con los datos
	var $grid = $("#rCategorias").pqGrid(objP);
	$("#rCategorias").pqGrid({editModel:{clicksToEdit: 1,saveKey:13 }});

}


/**
*	--------------------Compras-------------------
*/

function getComprasDia(){
	$('#example1').datepicker({
		format: "yyyy/mm/dd",
		startDate: '-3d',
		language: 'es' 
	})
	.on("changeDate", function(e){
		$('#example1').datepicker('hide');

		document.getElementById("comprasDia").innerHTML = "<img src='img/ajax-loader.gif'>";
		reportes = new Tienda();
		reportes.iniciarTiendaServidor();
		var fecha = document.getElementById("example1").value;
		reportes.getReporteDiaCompras(fecha);
	});
}

// Muestra el reporte de compras diaria
function mostrarReportesCompras(){
	console.log("Primer camino");
	reportesDia = reportes.reportesCompras;
	document.getElementById("comprasDia").innerHTML = "";
	$("#comprasDia").append("<table class='table table-hover table-striped' id='tablaReportes'><tr><th>Hora</th><th>Compra</th><th>Costo</th><th>Cantidad Comprada</th><th>Marca</th><th>Proveedor</th><th>Categoria</th><th>Subtotal</th><th>Opcion 1</th><th>Opcion 2</th></tr></table>");
	for(var i in reportesDia){
		$("#tablaReportes").append("<tr><td>"+reportesDia[i].hora+"</td><td>"+reportesDia[i].producto+"</td><td>"+reportesDia[i].precioCosto+"</td><td>"+reportesDia[i].cantidadComprada+"</td><td>"+reportesDia[i].marca+"</td><td>"+reportesDia[i].proveedor+"</td><td>"+reportesDia[i].categoria+"</td><td>"+reportesDia[i].totalCompra+"</td><td><button id ="+i+" type='button' class='btn btn-primary' data-toggle='modal' data-target='#updateCantidadVenta' onclick = 'updateCantidadCompra(this.id)'>Modificar</button></td><td><button type='button' class='btn btn-danger' id="+i+" onclick='deleteReporteCompra(this.id)'>Borrar</button></td></tr>");
	}
	document.getElementById("totalCompra").innerHTML = "<h1>Total: Q. "+reportes.totalVentaDiaria+"</h1>";
}

// Muestra el reporte de compras diaria
function resultadoReportesCompras(){
	console.log("Buen Camino");
	reportes.reportesCompras.splice(posicionModificar,1);
	reportesDia = reportes.reportesCompras;
	document.getElementById("comprasDia").innerHTML = "";
	$("#comprasDia").append("<table class='table table-hover table-striped' id='tablaReportes'><tr><th>Hora</th><th>Compra</th><th>Costo</th><th>Cantidad Comprada</th><th>Marca</th><th>Proveedor</th><th>Categoria</th><th>Subtotal</th><th>Opcion 1</th><th>Opcion 2</th></tr></table>");
	for(var i in reportesDia){
		$("#tablaReportes").append("<tr><td>"+reportesDia[i].hora+"</td><td>"+reportesDia[i].producto+"</td><td>"+reportesDia[i].precioCosto+"</td><td>"+reportesDia[i].cantidadComprada+"</td><td>"+reportesDia[i].marca+"</td><td>"+reportesDia[i].proveedor+"</td><td>"+reportesDia[i].categoria+"</td><td>"+reportesDia[i].totalCompra+"</td><td><button id ="+i+" type='button' class='btn btn-primary' data-toggle='modal' data-target='#updateCantidadVenta' onclick = 'updateCantidadCompra(this.id)'>Modificar</button></td><td><button type='button' class='btn btn-danger' id="+i+" onclick='deleteReporteCompra(this.id)'>Borrar</button></td></tr>");
	}
	document.getElementById("totalCompra").innerHTML = "<h1>Total: Q. "+reportes.totalVentaDiaria+"</h1>";
}

// Delete reporte compras

function deleteReporteCompra(elementoEliminar){
	console.log("idAeliminar "+reportes.reportesCompras[elementoEliminar].idDetalle);
	posicionModificar = elementoEliminar;
	var confirmDeleteReporte = confirm("Desea eliminar esta compra "+reportes.reportesCompras[elementoEliminar].producto);
	if (confirmDeleteReporte) {
		reportes.reportesCompras[elementoEliminar].deleteReporteCompra(elementoEliminar);
	};
}


/*
* Login usuario Administrador
*/

$("#loginUsuario").click(loginUser);
function loginUser(){
	tipoUser = 1;
	var usuario = document.getElementById("nombreUsuario").value;
	var passwordUsuario = document.getElementById("passwordUsuario").value;

	var libreria = new Tienda();
	libreria.loginUsuario(usuario, passwordUsuario, tipoUser);
}

function verificaCredencialesUsuario(opcion){
	var libreria = new Tienda();
	libreria.verificaLogin(opcion);
}

function verificaCredencialesUsuarioAdmin(){
	var libreria = new Tienda();
	libreria.verificaLoginAdmin();
}

function verificaCredencialesUsuarioAdminInv(){
	var libreria = new Tienda();
	libreria.verificaLoginAdminInv();
}

function desabSistema(){
	var libreria = new Tienda();
	libreria.desabilitarSistema();
}

function desabSistema(){
	var libreria = new Tienda();
	libreria.desabilitarSistema();
}

/*
* Login admin 
*/

$("#loginUsuarioAdmin").click(loginUserAdmin);
function loginUserAdmin(){
	tipoUser = 2;
	var usuario = document.getElementById("nombreUsuarioAdmin").value;
	var passwordUsuario = document.getElementById("passwordUsuarioAdmin").value;

	var libreria = new Tienda();
	libreria.loginUsuario(usuario, passwordUsuario, tipoUser);
}

function verificaCredencialesUsuario(opcion){
	var libreria = new Tienda();
	libreria.verificaLogin(opcion);
}

function desabSistema(){
	var libreria = new Tienda();
	libreria.desabilitarSistema();
}

function desabSistemaAdmin(){
	var libreria = new Tienda();
	libreria.desabilitarSistemaAdmin();
}
