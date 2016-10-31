/*
* Clase Criterios
*/
function Tienda(){
	this.productos = [];
	this.categorias = [];
	this.marcas = [];
	this.proveedores = [];
	this.reportes = [];
	this.reportesCompras = [];
	this.totalVentaDiaria = 0;
}
Tienda.prototype.parseCant = function(nStr){
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;	
}
Tienda.prototype.verCompras = function(verCompras){
	$.ajax({
		data : {"verCompras":verCompras},
		url : "controlador.php",
		type : "POST",
		success : function(data){
			var diasCompras = $.parseJSON(data);
			showCompras(diasCompras);
		}
	})
}
Tienda.prototype.changePaaswordAdmin = function(actualPassword, newPassword, repeatNewPassword){
	$.ajax({
		url : "../controlador.php",
		data : {"actualPassword" : actualPassword, "newPassword": newPassword, "repeatNewPassword" : repeatNewPassword},
		type : "POST",
		success : function(data){
			if (data == '1')
				alert("Contrasenia modificada Exitosamente");
			else
				alert("Error al modificar contrasenia");
		}
	})
}
Tienda.prototype.loginUsuario = function(usuario, password, tipo){
	$.ajax({
		data : {"usuario":usuario, "password": password, "tipo" : tipo},
		url : "controlador.php",
		type : "POST",
		success : function(data){
			if (data == '1')
				alert("Sistema Habilitado exitosamente");
			else if (data == '2')
				window.location = 'administracion/index.html';
			else
				alert('Nombre de usuario y contrasenia incorrectos');
		}
	})
}

Tienda.prototype.verificaLogin = function(opcionV){
	var opcion = opcionV;
	$.ajax({
		data : {"verificar" : true},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			if (data == '1'){
				if (opcion == 1)
					window.location = 'inventario.html';
				else
					window.location = 'ventas.html';		
			}
			else
				alert("Ingresar credenciales");
		}
	})
}
Tienda.prototype.verificaLoginAdmin = function(){
	$.ajax({
		data : {"verificarAdmin" : true},
		url : "../controlador.php",
		type : "GET",
		success : function(data){
			if (data == '1')
				console.log("Welcome administrator");
			else{
				window.location = '../index.html';
			}
		}
	})
}

Tienda.prototype.verificaLoginAdminInv = function(){
	$.ajax({
		data : {"verificarAdmin" : true},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			if (data == '1')
				console.log("Welcome inventory administrator");
			else{
				window.location = 'index.html';
			}
		}
	})
}

Tienda.prototype.desabilitarSistema = function(){
	$.ajax({
		data : {"desabilitarSis" : true},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			if (data == '1')
				alert("Desabilitado Exitosamente");
			else
				alert("No  ha iniciado session en el sistema de punto de venta");
		}
	})
}

Tienda.prototype.desabilitarSistemaAdmin = function(){
	$.ajax({
		data : {"desabilitarSisAdmin" : true},
		url : "../controlador.php",
		type : "GET",
		success : function(data){
			if (data == '1')
				window.location = 'index.html';
		}
	})
}


Tienda.prototype.obtenerReportes = function(){
	return this.reportes;
}

Tienda.prototype.iniciarTiendaServidor = function(){
	$.ajax({
		data : {"iniciarTienda":true},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			console.log(data);
		}
	})
}

Tienda.prototype.getReporteDiaCompras = function(fecha){
	_this = this;
	$.ajax({
		data : {"diaReporteCompra" : fecha},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			var reportes = $.parseJSON(data);
			for(var i in reportes){
				var reporte = new Reporte();
				reporte.hora = reportes[i]['hora'];
				reporte.cantidadComprada = reportes[i]['cantidadComprada'];
				reporte.producto = reportes[i]['descripcionCompra'];
				reporte.marca = reportes[i]['MarcaNombre'];
				reporte.proveedor = reportes[i]['ProveedoresNombre'];
				reporte.categoria = reportes[i]['CategoriaNombre'];
				reporte.precioCosto = reportes[i]['precioCostoCompra'];
				reporte.idDetalle = reportes[i]['idDetalleCompra'];
				var CantidadComprada = parseInt(reportes[i]['cantidadComprada']);
				var PrecioCosto = parseFloat(reportes[i]['precioCostoCompra']);
				reporte.totalCompra = CantidadComprada * PrecioCosto;
				_this.totalVentaDiaria = _this.totalVentaDiaria + reporte.totalCompra;
				_this.reportesCompras.push(reporte);
			}
			mostrarReportesCompras();
		}
	})
}

Tienda.prototype.getReporteDia = function(fecha){
	_this = this;
	$.ajax({
		data : {"diaReporte" : fecha},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			var reportes = $.parseJSON(data);
			for(var i in reportes){
				var reporte = new Reporte();
				reporte.hora = reportes[i]['ventaHora'];
				reporte.cantidadComprada = reportes[i]['cantidadComprada'];
				reporte.producto = reportes[i]['ProductoDescripcion'];
				reporte.marca = reportes[i]['MarcaNombre'];
				reporte.precioVenta = reportes[i]['ProductocoPrecioVenta'];
				reporte.existencia = reportes[i]['ProductoExistencia'];
				reporte.idDetalle = reportes[i]['idDetalleVenta'];
				var CantidadComprada = parseInt(reportes[i]['cantidadComprada']);
				var PrecioVenta = parseFloat(reportes[i]['ProductocoPrecioVenta']);
				reporte.totalCompra = CantidadComprada * PrecioVenta;
				_this.totalVentaDiaria = _this.totalVentaDiaria + reporte.totalCompra;
				_this.reportes.push(reporte);
			}
			mostrarReportes();
		}
	})
}

Tienda.prototype.newCategoria = function(nombreCategoria){
	var _this = this;
	$.ajax({
		url : "controlador.php",
		data : {"newCategoria" : nombreCategoria},
		type : "GET",
		success : function(data){
			var newCategoria = $.parseJSON(data);
			var categoria = new Categoria();
			categoria.setId(newCategoria["idCategorias"]);
			categoria.setNombre(newCategoria["CategoriaNombre"]);
			_this.categorias.unshift(categoria);
			document.getElementById("newCat").innerHTML = "<div class='alert alert-success'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>Buena!</strong> Categoria Creada exitosamente</div>";
			document.getElementById("okMensajeNewCat").innerHTML = "<button type='button' class='btn btn-info' data-dismiss='modal'>Aceptar</button>";
			rCategorias();
		}
	})
}

Tienda.prototype.searchCategorias = function(str){
	var _this = this;
	_this.categorias = [];
	$.ajax({
		url : "controlador.php",
		type : "GET",
		data : {"searchCategorias" : str},
		success : function(data){
			var categorias = $.parseJSON(data);
			for(var i in categorias){
				var categoria = new Categoria();
				categoria.setId(categorias[i]["idCategorias"]);
				categoria.setNombre(categorias[i]["CategoriaNombre"]);
				_this.categorias.unshift(categoria);
			}
			rCategorias();
		}
	})
}
Tienda.prototype.searchMarcas = function(str){
	var _this = this;
	_this.marcas = [];
	$.ajax({
		url : "controlador.php",
		type : "GET",
		data : {"searchMarcas" : str},
		success : function(data){
			var marcas = $.parseJSON(data);
			for(var i in marcas){
				var marca = new Marca();
				marca.setId(marcas[i]["idMarcas"]);
				marca.setNombre(marcas[i]["MarcaNombre"]);
				_this.marcas.unshift(marca);
			}
			rMarcas();
		}
	})
}
Tienda.prototype.searchProveedores = function(str){
	var _this = this;
	_this.proveedores = [];
	$.ajax({
		url : "controlador.php",
		type : "GET",
		data : {"searchProveedores" : str},
		success : function(data){
			var proveedores = $.parseJSON(data);
			for(var i in proveedores){
				var proveedor = new Proveedor();
				proveedor.setId(proveedores[i]["idProveedores"]);
				proveedor.setNombre(proveedores[i]["ProveedoresNombre"]);
				_this.proveedores.unshift(proveedor);
			}
			rProveedor();
		}
	})
}
Tienda.prototype.getCategorias = function (selects){
	_this	 = this;
	$.ajax({
		data : {"getCategorias":true},
		url : "controladorK.php",
		type : "GET",
		//dataType: "json",
		success : function (data){
			var categoriasTodas = $.parseJSON(data);
			_this.categorias = [];
			//Obtengo las categorias y creo los objetos, luego las guardo en un arrya que contendra objetos categoria
			for(var i in categoriasTodas){
				var categoria = new Categoria();
				categoria.setId(categoriasTodas[i][0]);
				categoria.setNombre(categoriasTodas[i][1]);
				_this.categorias.unshift(categoria);
			}
			if (selects == 3) {
				rCategorias();
			};
			if (selects == 1) {
				//LLeno el select de categorias con los nombre e ids de los objetos categorias
				for (var i = 0; i < _this.categorias.length; i++) {
					$("#categoria").append("<option value="+i+">"+_this.categorias[i].getNombre()+"</option>")
				};
				//Coloco un selecciona categoria al final del select de cateogrias
				$("#categoria").append("<option value='' selected>Seleccione Categoria</option>");
				//Coloco un selecciona categoria al final del select de cateogrias
				$("#categoriaProductoNuevo").append("<option value='' selected>Seleccione Categoria</option>");
				//LLeno el select de categorias para crear un nuevo producto con los nombre e ids de los objetos categorias
				for (var i = 0; i < _this.categorias.length; i++) {
					$("#categoriaProductoNuevo").append("<option value="+i+">"+_this.categorias[i].getNombre()+"</option>")
				};
			}
			if (selects == 2) {
				//LLeno el select de categorias para crear un nuevo producto con los nombre e ids de los objetos categorias
				for (var i = 0; i < _this.categorias.length; i++) {
					$("#categoriaVentas").append("<option value="+i+">"+_this.categorias[i].getNombre()+"</option>")
				};
				//Coloco un selecciona categoria al final del select de cateogrias
				$("#categoriaVentas").append("<option value='' selected>Seleccione Categoria</option>");
			};
		}
	})
}
Tienda.prototype.getMarcas = function (selects){
	_this = this;
	$.ajax({
		data : {"getMarcas":true},
		url : "controladorK.php",
		type : "GET",
		//dataType: "json",
		success : function (data){
			var marcasTodas = $.parseJSON(data);
			_this.marcas = [];
			//Obtengo las marcas y creo los objetos, luego las almaceno en un array que conteiene objetos de marca.
			for(var i in marcasTodas){
				var marca = new Marca();
				marca.setId(marcasTodas[i][0]);
				marca.setNombre(marcasTodas[i][1]);
				_this.marcas.unshift(marca);
			}
			if (selects == 3) {
				rMarcas();
			};
			if (selects == 1) {
				//Lleno el select de marcas
				for (var i = 0; i < _this.marcas.length; i++) {
					$("#marca").append("<option value="+i+">"+_this.marcas[i].getNombre()+"</option>")
				};
				// Agrego un seleccione marca al minal del select marcas
				$("#marca").append("<option value='' selected>Seleccione Marca</option>");
			
				// Agrego un seleccione marca al minal del select marcas
				$("#marcaNuevoProducto").append("<option value='' selected>Seleccione Marca</option>");
				//Lleno el select de marcas para crear nuevo producto
				for (var i = 0; i < _this.marcas.length; i++) {
					$("#marcaNuevoProducto").append("<option value="+i+">"+_this.marcas[i].getNombre()+"</option>")
				};
			}
			if (selects == 2) {
				//Lleno el select de marcas para crear nuevo producto
				for (var i = 0; i < _this.marcas.length; i++) {
					$("#marcaVentas").append("<option value="+i+">"+_this.marcas[i].getNombre()+"</option>")
				};
				// Agrego un seleccione marca al minal del select marcas
				$("#marcaVentas").append("<option value='' selected>Seleccione Marca</option>");
			};
		}
	})
}

Tienda.prototype.newMarca = function(nombreMarca){
	var _this = this;
	$.ajax({
		url : "controlador.php",
		data : {"newMarca" : nombreMarca},
		type : "GET",
		success : function(data){
			var newMarca = $.parseJSON(data);
			var marca = new Marca();
			marca.setId(newMarca["idMarcas"]);
			marca.setNombre(newMarca["MarcaNombre"]);
			_this.marcas.unshift(marca);
			document.getElementById("newCat").innerHTML = "<div class='alert alert-success'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>Buena!</strong> Marca Creada exitosamente</div>";
			document.getElementById("okMensajeNewCat").innerHTML = "<button type='button' class='btn btn-info' data-dismiss='modal'>Aceptar</button>";
			rMarcas();
		}
	})
}

Tienda.prototype.getProveedores = function (select){
	_this = this;
	$.ajax({
		data : {"getProveedores":true},
		url : "controladorK.php",
		type : "GET",
		//dataType: "json",
		success : function (data){
			var proveedoresTodos = $.parseJSON(data);
			_this.proveedores = [];
			//Obtengo los proveedores y creo los objetos, luego las almaceno en un array que conteiene objetos de proveedores.
			for(var i in proveedoresTodos){
				var proveedor = new Proveedor();
				proveedor.setId(proveedoresTodos[i][0]);
				proveedor.setNombre(proveedoresTodos[i][1]);
				_this.proveedores.unshift(proveedor);
			}
			if (select == 3) {
				rProveedor();
			}
			else{
				//Lleno el select de proveedores
				for (var i = 0; i < _this.proveedores.length; i++) {
					$("#proveedor").append("<option value="+i+">"+_this.proveedores[i].getNombre()+"</option>")
				};
				// Agrego un seleccione proveedor al minal del select marcas
				$("#proveedor").append("<option value='' selected>Seleccione Proveedor</option>");
				// Agrego un seleccione proveedor al minal del select marcas
				$("#proveedorNuevoProducto").append("<option value='' selected>Seleccione Proveedor</option>");
				//Lleno el select de nuevo producto de proveedores
				for (var i = 0; i < _this.proveedores.length; i++) {
					$("#proveedorNuevoProducto").append("<option value="+i+">"+_this.proveedores[i].getNombre()+"</option>")
				};
			}
		}
	})
}
Tienda.prototype.newProveedor = function(nombreProveedor){
	var _this = this;
	$.ajax({
		url : "controlador.php",
		data : {"newProveedor" : nombreProveedor},
		type : "GET",
		success : function(data){
			var newProveedor = $.parseJSON(data);
			var proveedor = new Marca();
			proveedor.setId(newProveedor["idProveedores"]);
			proveedor.setNombre(newProveedor["ProveedoresNombre"]);
			_this.proveedores.unshift(proveedor);
			document.getElementById("newCat").innerHTML = "<div class='alert alert-success'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>Buena!</strong> Proveedor Creado exitosamente</div>";
			document.getElementById("okMensajeNewCat").innerHTML = "<button type='button' class='btn btn-info' data-dismiss='modal'>Aceptar</button>";
			rProveedor();
		}
	})
}
Tienda.prototype.getProductos = function (){
	_this = this;
	_this.productos = [];
	$.ajax({
		data : {"getProductos":true},
		url : "controladorK.php",
		type : "GET",
		Cache : false,
		//dataType: "json",
		success : function (data){
			var productosTodos = $.parseJSON(data);
			// Obtengo los productos y los almaceno en un arrya
			document.getElementById("resultadosInventario").innerHTML = "";
			for( var i in productosTodos){
				var producto = new Producto();
				producto._id = productosTodos[i]["idProducto"];
				producto.existencia = productosTodos[i]["ProductoExistencia"];
				producto.descripcion = productosTodos[i]["ProductoDescripcion"];
				producto.cantidadTotal = productosTodos[i]["ProductoCantidadTotal"];
				producto.precioCosto = productosTodos[i]["ProductocoPrecioCosto"];
				producto.precioVenta = productosTodos[i]["ProductocoPrecioVenta"];
				_this.productos.push(producto);
			}
			// Creo tabla para mostrar productos
			$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
			var capitalComprometido = 0;
			for (var i = 0; i < _this.productos.length; i++) {
				var totalProducto = _this.productos[i].existencia * _this.productos[i].precioCosto;
				capitalComprometido = capitalComprometido + totalProducto;
				$("#tablaProductos").append("<tr><td>"+_this.productos[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
			};
			var newCant = _this.parseCant(capitalComprometido);
			document.getElementById("capitalComprometido").innerHTML = "<p class='lead'> Q. "+newCant+"</p>";
		}
	})
}
Tienda.prototype.getProductosCatCoin = function (idCategoria, coincidencia){
	_this = this;
	_this.productos = [];
	var getProductosCatCoin = {};
	getProductosCatCoin.idCategoria = idCategoria;
	getProductosCatCoin.coincidencia = coincidencia;
	getProductosCatCoin = JSON.stringify(getProductosCatCoin);
	$.ajax({
		data : {"getProductosCatCoin":getProductosCatCoin},
		url : "controladorK.php",
		type : "POST",
		Cache : false,
		//dataType: "json",
		success : function (data){
			var productosTodos = $.parseJSON(data);
			// Obtengo los productos y los almaceno en un arrya
			document.getElementById("resultadosInventario").innerHTML = "";
			for( var i in productosTodos){
				var producto = new Producto();
				producto._id = productosTodos[i]["idProducto"];
				producto.existencia = productosTodos[i]["ProductoExistencia"];
				producto.descripcion = productosTodos[i]["ProductoDescripcion"];
				producto.cantidadTotal = productosTodos[i]["ProductoCantidadTotal"];
				producto.precioCosto = productosTodos[i]["ProductocoPrecioCosto"];
				producto.precioVenta = productosTodos[i]["ProductocoPrecioVenta"];
				_this.productos.push(producto);
			}
			// Creo tabla para mostrar productos
			$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
			var capitalComprometido = 0;
			for (var i = 0; i < _this.productos.length; i++) {
				var totalProducto = _this.productos[i].existencia * _this.productos[i].precioCosto;
				capitalComprometido = capitalComprometido + totalProducto;
				$("#tablaProductos").append("<tr><td>"+_this.productos[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
			};
			var newCant = _this.parseCant(capitalComprometido);
			document.getElementById("capitalComprometido").innerHTML = "<p class='lead'> Q. "+newCant+"</p>";
		}
	})
}
Tienda.prototype.getProductosCatMarCoin = function (idCategoria, idMarca, coincidencia){
	_this = this;
	_this.productos = [];
	var getProductosCatMarCoin = {};
	getProductosCatMarCoin.idCategoria = idCategoria;
	getProductosCatMarCoin.idMarca = idMarca;
	getProductosCatMarCoin.coincidencia = coincidencia;
	getProductosCatMarCoin = JSON.stringify(getProductosCatMarCoin);
	$.ajax({
		data : {"getProductosCatMarCoin":getProductosCatMarCoin},
		url : "controladorK.php",
		type : "POST",
		Cache : false,
		//dataType: "json",
		success : function (data){
			var productosTodos = $.parseJSON(data);
			// Obtengo los productos y los almaceno en un arrya
			document.getElementById("resultadosInventario").innerHTML = "";
			for( var i in productosTodos){
				var producto = new Producto();
				producto._id = productosTodos[i]["idProducto"];
				producto.existencia = productosTodos[i]["ProductoExistencia"];
				producto.descripcion = productosTodos[i]["ProductoDescripcion"];
				producto.cantidadTotal = productosTodos[i]["ProductoCantidadTotal"];
				producto.precioCosto = productosTodos[i]["ProductocoPrecioCosto"];
				producto.precioVenta = productosTodos[i]["ProductocoPrecioVenta"];
				_this.productos.push(producto);
			}
			// Creo tabla para mostrar productos
			$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
			var capitalComprometido = 0;
			for (var i = 0; i < _this.productos.length; i++) {
				var totalProducto = _this.productos[i].existencia * _this.productos[i].precioCosto;
				capitalComprometido = capitalComprometido + totalProducto;
				$("#tablaProductos").append("<tr><td>"+_this.productos[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
			};
			var newCant = _this.parseCant(capitalComprometido);
			document.getElementById("capitalComprometido").innerHTML = "<p class='lead'> Q. "+newCant+"</p>";
		}
	})
}
Tienda.prototype.getProductosCatMarProCoin = function (idCategoria, idMarca, idProveedor, coincidencia){
	_this = this;
	_this.productos = [];
	var getProductosCatMarProCoin = {};
	getProductosCatMarProCoin.idCategoria = idCategoria;
	getProductosCatMarProCoin.idMarca = idMarca;
	getProductosCatMarProCoin.idProveedor = idProveedor;
	getProductosCatMarProCoin.coincidencia = coincidencia;
	getProductosCatMarProCoin = JSON.stringify(getProductosCatMarProCoin);
	$.ajax({
		data : {"getProductosCatMarProCoin":getProductosCatMarProCoin},
		url : "controladorK.php",
		type : "POST",
		Cache : false,
		//dataType: "json",
		success : function (data){
			var productosTodos = $.parseJSON(data);
			// Obtengo los productos y los almaceno en un arrya
			document.getElementById("resultadosInventario").innerHTML = "";
			for( var i in productosTodos){
				var producto = new Producto();
				producto._id = productosTodos[i]["idProducto"];
				producto.existencia = productosTodos[i]["ProductoExistencia"];
				producto.descripcion = productosTodos[i]["ProductoDescripcion"];
				producto.cantidadTotal = productosTodos[i]["ProductoCantidadTotal"];
				producto.precioCosto = productosTodos[i]["ProductocoPrecioCosto"];
				producto.precioVenta = productosTodos[i]["ProductocoPrecioVenta"];
				_this.productos.push(producto);
			}
			// Creo tabla para mostrar productos
			$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
			var capitalComprometido = 0;
			for (var i = 0; i < _this.productos.length; i++) {
				var totalProducto = _this.productos[i].existencia * _this.productos[i].precioCosto;
				capitalComprometido = capitalComprometido + totalProducto;
				$("#tablaProductos").append("<tr><td>"+_this.productos[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
			};
			var newCant = _this.parseCant(capitalComprometido);
			document.getElementById("capitalComprometido").innerHTML = "<p class='lead'> Q. "+newCant+"</p>";
		}
	})
}
Tienda.prototype.getProductosCatProCoin = function (idCategoria, idProveedor, coincidencia){
	_this = this;
	_this.productos = [];
	var getProductosCatProCoin = {};
	getProductosCatProCoin.idCategoria = idCategoria;
	getProductosCatProCoin.idProveedor = idProveedor;
	getProductosCatProCoin.coincidencia = coincidencia;
	getProductosCatProCoin = JSON.stringify(getProductosCatProCoin);
	$.ajax({
		data : {"getProductosCatProCoin":getProductosCatProCoin},
		url : "controladorK.php",
		type : "POST",
		Cache : false,
		//dataType: "json",
		success : function (data){
			var productosTodos = $.parseJSON(data);
			// Obtengo los productos y los almaceno en un arrya
			document.getElementById("resultadosInventario").innerHTML = "";
			for( var i in productosTodos){
				var producto = new Producto();
				producto._id = productosTodos[i]["idProducto"];
				producto.existencia = productosTodos[i]["ProductoExistencia"];
				producto.descripcion = productosTodos[i]["ProductoDescripcion"];
				producto.cantidadTotal = productosTodos[i]["ProductoCantidadTotal"];
				producto.precioCosto = productosTodos[i]["ProductocoPrecioCosto"];
				producto.precioVenta = productosTodos[i]["ProductocoPrecioVenta"];
				_this.productos.push(producto);
			}
			// Creo tabla para mostrar productos
			$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
			var capitalComprometido = 0;
			for (var i = 0; i < _this.productos.length; i++) {
				var totalProducto = _this.productos[i].existencia * _this.productos[i].precioCosto;
				capitalComprometido = capitalComprometido + totalProducto;
				$("#tablaProductos").append("<tr><td>"+_this.productos[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
			};
			var newCant = _this.parseCant(capitalComprometido);
			document.getElementById("capitalComprometido").innerHTML = "<p class='lead'> Q. "+newCant+"</p>";
		}
	})
}
Tienda.prototype.getProductosMarProCoin = function (idMarca, idProveedor, coincidencia){
	_this = this;
	_this.productos = [];
	var getProductosMarProCoin = {};
	getProductosMarProCoin.idMarca = idMarca;
	getProductosMarProCoin.idProveedor = idProveedor;
	getProductosMarProCoin.coincidencia = coincidencia;
	getProductosMarProCoin = JSON.stringify(getProductosMarProCoin);
	$.ajax({
		data : {"getProductosMarProCoin":getProductosMarProCoin},
		url : "controladorK.php",
		type : "POST",
		Cache : false,
		//dataType: "json",
		success : function (data){
			var productosTodos = $.parseJSON(data);
			// Obtengo los productos y los almaceno en un arrya
			document.getElementById("resultadosInventario").innerHTML = "";
			for( var i in productosTodos){
				var producto = new Producto();
				producto._id = productosTodos[i]["idProducto"];
				producto.existencia = productosTodos[i]["ProductoExistencia"];
				producto.descripcion = productosTodos[i]["ProductoDescripcion"];
				producto.cantidadTotal = productosTodos[i]["ProductoCantidadTotal"];
				producto.precioCosto = productosTodos[i]["ProductocoPrecioCosto"];
				producto.precioVenta = productosTodos[i]["ProductocoPrecioVenta"];
				_this.productos.push(producto);
			}
			// Creo tabla para mostrar productos
			$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
			var capitalComprometido = 0;
			for (var i = 0; i < _this.productos.length; i++) {
				var totalProducto = _this.productos[i].existencia * _this.productos[i].precioCosto;
				capitalComprometido = capitalComprometido + totalProducto;
				$("#tablaProductos").append("<tr><td>"+_this.productos[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
			};
			var newCant = _this.parseCant(capitalComprometido);
			document.getElementById("capitalComprometido").innerHTML = "<p class='lead'> Q. "+newCant+"</p>";
		}
	})
}

Tienda.prototype.getProductosCategoriaMarca = function (idCategoria, idMarca){
	_this = this;
	_this.productos = [];
	$.ajax({
		data : {"getPCC":idCategoria, "getPMM": idMarca},
		url : "controladorK.php",
		type : "GET",
		Cache : false,
		//dataType: "json",
		success : function (data){
			var productosTodos = $.parseJSON(data);
			// Obtengo los productos y los almaceno en un arrya
			document.getElementById("resultadosInventario").innerHTML = "";
			for( var i in productosTodos){
				var producto = new Producto();
				producto._id = productosTodos[i]["idProducto"];
				producto.existencia = productosTodos[i]["ProductoExistencia"];
				producto.descripcion = productosTodos[i]["ProductoDescripcion"];
				producto.cantidadTotal = productosTodos[i]["ProductoCantidadTotal"];
				producto.precioCosto = productosTodos[i]["ProductocoPrecioCosto"];
				producto.precioVenta = productosTodos[i]["ProductocoPrecioVenta"];
				_this.productos.push(producto);
			}
			// Creo tabla para mostrar productos
			$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
			var capitalComprometido = 0;
			for (var i = 0; i < _this.productos.length; i++) {
				var totalProducto = _this.productos[i].existencia * _this.productos[i].precioCosto;
				capitalComprometido = capitalComprometido + totalProducto;
				$("#tablaProductos").append("<tr><td>"+_this.productos[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
			};
			var newCant = _this.parseCant(capitalComprometido);
			document.getElementById("capitalComprometido").innerHTML = "<p class='lead'> Q. "+newCant+"</p>";
		}
	})
}
Tienda.prototype.getProductosMarcaProveedor = function (idMarca, idProveedor){
	_this = this;
	_this.productos = [];
	$.ajax({
		data : {"idMarcaGPMP":idMarca, "idProveedorGPMP": idProveedor},
		url : "controladorK.php",
		type : "GET",
		Cache : false,
		//dataType: "json",
		success : function (data){
			var productosTodos = $.parseJSON(data);
			// Obtengo los productos y los almaceno en un arrya
			document.getElementById("resultadosInventario").innerHTML = "";
			for( var i in productosTodos){
				var producto = new Producto();
				producto._id = productosTodos[i]["idProducto"];
				producto.existencia = productosTodos[i]["ProductoExistencia"];
				producto.descripcion = productosTodos[i]["ProductoDescripcion"];
				producto.cantidadTotal = productosTodos[i]["ProductoCantidadTotal"];
				producto.precioCosto = productosTodos[i]["ProductocoPrecioCosto"];
				producto.precioVenta = productosTodos[i]["ProductocoPrecioVenta"];
				_this.productos.push(producto);
			}
			// Creo tabla para mostrar productos
			$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
			var capitalComprometido = 0;
			for (var i = 0; i < _this.productos.length; i++) {
				var totalProducto = _this.productos[i].existencia * _this.productos[i].precioCosto;
				capitalComprometido = capitalComprometido + totalProducto;
				$("#tablaProductos").append("<tr><td>"+_this.productos[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
			};
			var newCant = _this.parseCant(capitalComprometido);
			document.getElementById("capitalComprometido").innerHTML = "<p class='lead'> Q. "+newCant+"</p>";
		}
	})
}
Tienda.prototype.getProductosCategoriaMarcaProveedor = function (idCategoria, idMarca, idProveedor){
	_this = this;
	_this.productos = [];
	$.ajax({
		data : {"getPCC3":idCategoria, "getPMM3": idMarca, "getPPP":idProveedor},
		url : "controladorK.php",
		type : "GET",
		Cache : false,
		//dataType: "json",
		success : function (data){
			var productosTodos = $.parseJSON(data);
			// Obtengo los productos y los almaceno en un arrya
			document.getElementById("resultadosInventario").innerHTML = "";
			for( var i in productosTodos){
				var producto = new Producto();
				producto._id = productosTodos[i]["idProducto"];
				producto.existencia = productosTodos[i]["ProductoExistencia"];
				producto.descripcion = productosTodos[i]["ProductoDescripcion"];
				producto.cantidadTotal = productosTodos[i]["ProductoCantidadTotal"];
				producto.precioCosto = productosTodos[i]["ProductocoPrecioCosto"];
				producto.precioVenta = productosTodos[i]["ProductocoPrecioVenta"];
				_this.productos.push(producto);
			}
			// Creo tabla para mostrar productos
			$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
			var capitalComprometido = 0;
			for (var i = 0; i < _this.productos.length; i++) {
				var totalProducto = _this.productos[i].existencia * _this.productos[i].precioCosto;
				capitalComprometido = capitalComprometido + totalProducto;
				$("#tablaProductos").append("<tr><td>"+_this.productos[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
			};
			var newCant = _this.parseCant(capitalComprometido);
			document.getElementById("capitalComprometido").innerHTML = "<p class='lead'> Q. "+newCant+"</p>";
		}
	})
}

Tienda.prototype.getProductosCategoriaProveedor = function (idCategoria, idProveedor){
	_this = this;
	_this.productos = [];
	$.ajax({
		data : {"idCategoriaGPCP":idCategoria, "idProveedorGPCP": idProveedor},
		url : "controladorK.php",
		type : "GET",
		Cache : false,
		//dataType: "json",
		success : function (data){
			var productosTodos = $.parseJSON(data);
			// Obtengo los productos y los almaceno en un arrya
			document.getElementById("resultadosInventario").innerHTML = "";
			for( var i in productosTodos){
				var producto = new Producto();
				producto._id = productosTodos[i]["idProducto"];
				producto.existencia = productosTodos[i]["ProductoExistencia"];
				producto.descripcion = productosTodos[i]["ProductoDescripcion"];
				producto.cantidadTotal = productosTodos[i]["ProductoCantidadTotal"];
				producto.precioCosto = productosTodos[i]["ProductocoPrecioCosto"];
				producto.precioVenta = productosTodos[i]["ProductocoPrecioVenta"];
				_this.productos.push(producto);
			}
			// Creo tabla para mostrar productos
			$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
			var capitalComprometido = 0;
			for (var i = 0; i < _this.productos.length; i++) {
				var totalProducto = _this.productos[i].existencia * _this.productos[i].precioCosto;
				capitalComprometido = capitalComprometido + totalProducto;
				$("#tablaProductos").append("<tr><td>"+_this.productos[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
			};
			var newCant = _this.parseCant(capitalComprometido);
			document.getElementById("capitalComprometido").innerHTML = "<p class='lead'> Q. "+newCant+"</p>";
		}
	})
}
Tienda.prototype.verificarRefIndex = function(){
	$.ajax({
		url : "controlador.php",
		type : "POST",
		data : {"verificarRefIndex" : true},
		success : function(data){
			if (data == "1")
				redireccionarIndexAdmon();
			else
				redireccionarIndexUser();
		}
	})
}

/**
*clase Categorias
*/
function Categoria (){
	Tienda.prototype.constructor.call(this);
	this._id;
	this._nombre;
}
Categoria.prototype.parseCant = function(nStr){
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;	
}
Categoria.prototype = new Tienda();

Categoria.prototype.constructor = Categoria;

Categoria.prototype.getId = function(){
	return this._id;
}
Categoria.prototype.getNombre = function(){
	return this._nombre;
}
Categoria.prototype.setId = function(id){
	this._id = id;
}
Categoria.prototype.setNombre = function(nombre){
	this._nombre = nombre;
}
Categoria.prototype.getProductosCategoria = function (selects){
	_this = this;
	_this.productos = [];
	if (selects == 1) {
		$.ajax({
			data : {"getProductosCategoria":_this._id},
			url : "controladorK.php",
			type : "GET",
			//dataType: "json",
			success : function (data){
				var productos = $.parseJSON(data);
				for (var i in productos){
					var productoCategoria = new Producto();
					productoCategoria._id = productos[i][0];
					productoCategoria.existencia = productos[i][1];
					productoCategoria.descripcion = productos[i][2];
					productoCategoria.cantidadTotal = productos[i][3];
					productoCategoria.precioCosto = productos[i][4];
					productoCategoria.precioVenta = productos[i][5];
					_this.productos.push(productoCategoria);
				}
				document.getElementById("resultadosInventario").innerHTML = "";
				// Creo tabla para mostrar productos
				$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
			var capitalComprometido = 0;
			for (var i = 0; i < _this.productos.length; i++) {
				var totalProducto = _this.productos[i].existencia * _this.productos[i].precioCosto;
				capitalComprometido = capitalComprometido + totalProducto;
				$("#tablaProductos").append("<tr><td>"+_this.productos[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
			};
			var newCant = _this.parseCant(capitalComprometido);
			document.getElementById("capitalComprometido").innerHTML = "<p class='lead'> Q. "+newCant+"</p>";
			}
		})
	}
	if (selects == 2) {
		$.ajax({
			data : {"getProductosCategoriaVenta":_this._id},
			url : "controladorK.php",
			type : "GET",
			//dataType: "json",
			success : function (data){
				var productos = $.parseJSON(data);
				for (var i in productos){
					var productoCategoriaVenta = new Producto();
					productoCategoriaVenta._id = productos[i]["idProducto"];
					productoCategoriaVenta.codigoCategoria = productos[i]["CategoriaNombre"];
					productoCategoriaVenta.descripcion = productos[i]["ProductoDescripcion"];
					productoCategoriaVenta.codigoMarca = productos[i]["MarcaNombre"];
					productoCategoriaVenta.precioVenta = productos[i]["ProductocoPrecioVenta"];
					productoCategoriaVenta.existencia = productos[i]["ProductoExistencia"];
					_this.productos.push(productoCategoriaVenta);
				}
				setProductosCoincidenciaV();
			}
		})
	}
}
Categoria.prototype.deleteCategoria = function (){
	_this = this;
	$.ajax({
		data : {"deleteCategoria":_this._id},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			if (data == '1')
				updateTableCategoria();
			else
				alert("Error al eliminar la categoria "+_this._nombre);
		}
	})
}

Categoria.prototype.updateCategoria = function(newName){
	var _this = this;
	$.ajax({
		data : {"updateCategoria":_this._id, "newName":newName},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			if (data == "0")
				alert("Error al modificar el archivo");
			else{
				var categoriaUpdate = $.parseJSON(data);
				_this._id = categoriaUpdate["idCategorias"];
				_this._nombre = categoriaUpdate["CategoriaNombre"];
				rCategorias();
			}
		}
	})
}


/**
*Clase marca
*/

function Marca(){
	Tienda.prototype.constructor.call(this);
	this._id;
	this._nombre;
}
Marca.prototype = new Tienda();

Marca.prototype.constructor = Marca;

Marca.prototype.getId = function(){
	return this._id;
}
Marca.prototype.getNombre = function(){
	return this._nombre;
}
Marca.prototype.setId = function(id){
	this._id = id;
}
Marca.prototype.setNombre = function(nombre){
	this._nombre = nombre;
}
Marca.prototype.getProductosMarca = function (modulo){
	_this = this;
	_this.productos = [];
	if (modulo == 1) {
		$.ajax({
			data : {"getProductosMarca":_this._id},
			url : "controladorK.php",
			type : "GET",
			//dataType: "json",
			success : function (data){
				productos = $.parseJSON(data);
				for (var i in productos){
					var productoMarca = new Producto();
					productoMarca._id = productos[i][0];
					productoMarca.existencia = productos[i][1];
					productoMarca.descripcion = productos[i][2];
					productoMarca.cantidadTotal = productos[i][3];
					productoMarca.precioCosto = productos[i][4];
					productoMarca.precioVenta = productos[i][5];
					_this.productos.push(productoMarca);
				}
				document.getElementById("resultadosInventario").innerHTML = "";
				// Creo tabla para mostrar productos
				$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
			var capitalComprometido = 0;
			for (var i = 0; i < _this.productos.length; i++) {
				var totalProducto = _this.productos[i].existencia * _this.productos[i].precioCosto;
				capitalComprometido = capitalComprometido + totalProducto;
				$("#tablaProductos").append("<tr><td>"+_this.productos[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
			};
			var newCant = _this.parseCant(capitalComprometido);
			document.getElementById("capitalComprometido").innerHTML = "<p class='lead'> Q. "+newCant+"</p>";
			}
		})
	}
	if (modulo == 2) {
		$.ajax({
			data : {"getProductosMarcaVenta":_this._id},
			url : "controladorK.php",
			type : "GET",
			//dataType: "json",
			success : function (data){
				productos = $.parseJSON(data);
				for (var i in productos){
					var productoMar = new Producto();
					productoMar._id = productos[i]["idProducto"];
					productoMar.codigoCategoria = productos[i]["categoriaNombre"];
					productoMar.descripcion = productos[i]["ProductoDescripcion"];
					productoMar.codigoMarca = productos[i]["MarcaNombre"];
					productoMar.precioVenta = productos[i]["ProductocoPrecioVenta"];
					productoMar.existencia = productos[i]["ProductoExistencia"];
					_this.productos.push(productoMar);
				}
				setProductosCoincidenciaV();
			}
		})
	}
}
Marca.prototype.deleteMarca = function (){
	_this = this;
	$.ajax({
		data : {"deleteMarca":_this._id},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			if (data == '1')
				updateTableMarcas();
			else
				alert("Error al eliminar la categoria "+_this._nombre);
		}
	})
}
Marca.prototype.updateMarca = function(newName){
	var _this = this;
	$.ajax({
		data : {"updateMarca":_this._id, "newName":newName},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			if (data == "0")
				alert("Error al modificar el archivo");
			else{
				var marcaUpdate = $.parseJSON(data);
				_this._id = marcaUpdate["idMarcas"];
				_this._nombre = marcaUpdate["MarcaNombre"];
				rMarcas();
			}
		}
	})
}

/**
*Clase Proveedor
*/
function Proveedor(){
	Tienda.prototype.constructor.call(this);
	this._id;
	this._nombre;
}
Proveedor.prototype = new Tienda();

Proveedor.prototype = Proveedor;

Proveedor.prototype.getId = function(){
	return this._id;
}
Proveedor.prototype.getNombre = function(){
	return this._nombre;
}
Proveedor.prototype.setId = function(id){
	this._id = id;
}
Proveedor.prototype.setNombre = function(nombre){
	this._nombre = nombre;
}
Proveedor.prototype.getProductosProveedor = function (){
	_this = this;
	_this.productos = [];
	$.ajax({
		data : {"getProductosProveedor":_this._id},
		url : "controladorK.php",
		type : "GET",
		//dataType: "json",
		success : function (data){
			productos = $.parseJSON(data);
			for (var i in productos){
				var productoProveedor = new Producto();
				productoProveedor._id = productos[i][0];
				productoProveedor.existencia = productos[i][1];
				productoProveedor.descripcion = productos[i][2];
				productoProveedor.cantidadTotal = productos[i][3];
				productoProveedor.precioCosto = productos[i][4];
				productoProveedor.precioVenta = productos[i][5];
				_this.productos.push(productoProveedor);
			}
			document.getElementById("resultadosInventario").innerHTML = "";
			// Creo tabla para mostrar productos
			$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
			var capitalComprometido = 0;
			for (var i = 0; i < _this.productos.length; i++) {
				var totalProducto = _this.productos[i].existencia * _this.productos[i].precioCosto;
				capitalComprometido = capitalComprometido + totalProducto;
				$("#tablaProductos").append("<tr><td>"+_this.productos[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
			};
			var newCant = _this.parseCant(capitalComprometido);
			document.getElementById("capitalComprometido").innerHTML = "<p class='lead'> Q. "+newCant+"</p>";
		}
	})
}
Proveedor.prototype.deleteProveedor = function (){
	_this = this;
	$.ajax({
		data : {"deleteProveedor":_this._id},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			if (data == '1')
				updateTableProveedores();
			else
				alert("Error al eliminar al proveedor "+_this._nombre);
		}
	})
}
Proveedor.prototype.updateProveedor = function(newName){
	var _this = this;
	$.ajax({
		data : {"updateProveedor":_this._id, "newName":newName},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			if (data == "0")
				alert("Error al modificar el archivo");
			else{
				var proveedorUpdate = $.parseJSON(data);
				_this._id = proveedorUpdate["idProveedores"];
				_this._nombre = proveedorUpdate["ProveedoresNombre"];
				rProveedor();
			}
		}
	})
}

/**
*Clase Coincidencia
*/
function Coincidencia(){
	Tienda.prototype.constructor.call(this);
}

Coincidencia.prototype = new Tienda();
Coincidencia.prototype.constructor = Coincidencia;

Coincidencia.prototype.getId = function(){
	return this._id;
}
Coincidencia.prototype.getNombre = function(){
	return this._nombre;
}
Coincidencia.prototype.setId = function(id){
	this._id = id;
}
Coincidencia.prototype.setNombre = function(nombre){
	this._nombre = nombre;
}
Coincidencia.prototype.getProductosCoincidencia = function (str){
	_this = this;
	_this.productos = [];
	$.ajax({
		data : {"getProductosCoincidencia":str},
		url : "controladorK.php",
		type : "GET",
		//dataType: "json",
		success : function (data){
			var productos = $.parseJSON(data);
			for (var i in productos){
				var productoCoincidencia = new Producto();
				productoCoincidencia._id = productos[i][0];
				productoCoincidencia.existencia = productos[i][1];
				productoCoincidencia.descripcion = productos[i][2];
				productoCoincidencia.cantidadTotal = productos[i][3];
				productoCoincidencia.precioCosto = productos[i][4];
				productoCoincidencia.precioVenta = productos[i][5];
				_this.productos.push(productoCoincidencia);
			}
			document.getElementById("resultadosInventario").innerHTML = "";
			// Creo tabla para mostrar productos
			$("#resultadosInventario").append("<table class='table table-striped table-condensed' id='tablaProductos'><tr class='success'><th>Codigo</th><th>Existencia</th><th>Descripcion</th><th>Cantidad Total</th><th>Precio Costo</th><th>Precio Venta</th><th>Modificar</th><th>Borrar</th></tr></table>");
			var capitalComprometido = 0;
			for (var i = 0; i < _this.productos.length; i++) {
				var totalProducto = _this.productos[i].existencia * _this.productos[i].precioCosto;
				capitalComprometido = capitalComprometido + totalProducto;
				$("#tablaProductos").append("<tr><td>"+_this.productos[i]._id+"</td><td>"+_this.productos[i].existencia+"</td><td>"+_this.productos[i].descripcion+"</td><td>"+_this.productos[i].cantidadTotal+"</td><td>"+_this.productos[i].precioCosto+"</td><td>"+_this.productos[i].precioVenta+"</td><td><button type='button' class='btn btn-link' id="+i+" data-toggle='modal' data-target='#updateProducto' onclick = 'updateProducto(this.id)'>modificar</button></td><td><button type='button' class='btn btn-link' id="+i+" onclick = 'deleteProducto(this.id)'>Borrar</button></td></tr>");
			};
			var newCant = _this.parseCant(capitalComprometido);
			document.getElementById("capitalComprometido").innerHTML = "<p class='lead'> Q. "+newCant+"</p>";
		}
	})
}
Coincidencia.prototype.getProductosCoincidenciaVenta = function (str){
	_this = this;
	_this.productos = [];
	$.ajax({
		data : {"getProductosCoincidenciaVenta":str},
		url : "controladorK.php",
		type : "GET",
		//dataType: "json",
		success : function (data){
			var productos = $.parseJSON(data);
			for (var i in productos){
				var productoCoincidencia = new Producto();
				productoCoincidencia._id = productos[i]["idProducto"];
				productoCoincidencia.codigoCategoria = productos[i]["CategoriaNombre"];
				productoCoincidencia.descripcion = productos[i]["ProductoDescripcion"];
				productoCoincidencia.codigoMarca = productos[i]["marcaNombre"];
				productoCoincidencia.precioVenta = productos[i]["ProductocoPrecioVenta"];
				productoCoincidencia.existencia = productos[i]["ProductoExistencia"];
				_this.productos.push(productoCoincidencia);
			}
			setProductosCoincidenciaV();
		}
	})
}
Coincidencia.prototype.getProductosCategoriaMarcaVenta = function (idCategoria, idMarca){
	_this = this;
	_this.productos = [];
	$.ajax({
		data : {"categoriaVenta":idCategoria, "marcaVenta":idMarca},
		url : "controladorK.php",
		type : "GET",
		//dataType: "json",
		success : function (data){
			var productos = $.parseJSON(data);
			for (var i in productos){
				var productoCatMar = new Producto();
				productoCatMar._id = productos[i]["idProducto"];
				productoCatMar.codigoCategoria = productos[i]["CategoriaNombre"];
				productoCatMar.descripcion = productos[i]["ProductoDescripcion"];
				productoCatMar.codigoMarca = productos[i]["marcaNombre"];
				productoCatMar.precioVenta = productos[i]["ProductocoPrecioVenta"];
				productoCatMar.existencia = productos[i]["ProductoExistencia"];
				_this.productos.push(productoCatMar);
			}
			setProductosCoincidenciaV();
		}
	})
}
Coincidencia.prototype.getProductosCategoriaMarcaVentaC = function (idCategoria, idMarca, str){
	_this = this;
	_this.productos = [];
	$.ajax({
		data : {"categoriaVentaC":idCategoria, "marcaVentaC":idMarca, "coincidenciaC" : str},
		url : "controladorK.php",
		type : "GET",
		//dataType: "json",
		success : function (data){
			/*var productos = $.parseJSON(data);
			for (var i in productos){
				var productoCatMar = new Producto();
				productoCatMar._id = productos[i]["idProducto"];
				productoCatMar.codigoCategoria = productos[i]["CategoriaNombre"];
				productoCatMar.descripcion = productos[i]["ProductoDescripcion"];
				productoCatMar.codigoMarca = productos[i]["marcaNombre"];
				productoCatMar.precioVenta = productos[i]["ProductocoPrecioVenta"];
				productoCatMar.existencia = productos[i]["ProductoExistencia"];
				_this.productos.push(productoCatMar);
			}
			setProductosCoincidenciaV();*/
			console.log(data);
		}
	})
}

Coincidencia.prototype.realizarCotizacionCarrito = function(carrito){
	var ventaJS = {};
	ventaJS.carrito = carrito;
	ventaJS.descripcion = "Ningun comentario";
	ventaJS.usuario = "Miguelito";
	var carritoJson = JSON.stringify(ventaJS);
	$.ajax({
		data : {"cotizacionCarritoCompra":carritoJson},
		url : "controladorK.php",
		type : "POST",
		success : function (datos){
		console.log(datos);
			var data = parseInt(datos);
			if (data == 1)
				window.location = 'controladorK.php?cotizacion=true';
			else
				alert("Error al realizar la cotizacion");
		} 
	})
}
Coincidencia.prototype.realizarVentaCarrito = function(carrito){
	var ventaJS = {};
	ventaJS.carrito = carrito;
	ventaJS.descripcion = "Ningun comentario";
	ventaJS.usuario = "Miguelito";
	var carritoJson = JSON.stringify(ventaJS);
	$.ajax({
		data : {"ventaCarritoCompra":carritoJson},
		url : "controladorK.php",
		type : "POST",
		success : function (datos){
			var dato = parseInt(datos);
			if (dato == 1){
				var imprimirFactura = confirm("Desa imprimir su Factura");
				if (imprimirFactura)
					window.location = 'controladorK.php?factura=true';
				else{
					document.getElementById("carritoCompra").innerHTML = "<div class='alert alert-success' style='text-align:center;'><p class='lead'>¡ Venta realizada con exito !</p></div>";
					carritoCompra = [];
					document.getElementById("totalCompra").innerHTML = "<h1>Q.</h1>";
				}
			}
		} 
	})
}

/**
*Clase producto
*/
function Producto(){
	this._id;
	this.existencia;
	this.descripcion;
	this.cantidadTotal;
	this.precioCosto;
	this.precioVenta;
	this.codigoCategoria;
	this.codigoMarca;
	this.codigoProveedor;
	this.telProveedor;
	this.nitProveedor;
	this.dirProveedor;
}

Producto.prototype.crearNuevo = function(){
	var _this = this;
	var nuevoProducto = {};
	nuevoProducto.descripcionProducto = this.descripcion;
	nuevoProducto.codigoCategoria = this.codigoCategoria;
	nuevoProducto.codigoMarca = this.codigoMarca;
	nuevoProducto.codigoProveedor = this.codigoProveedor;
	nuevoProducto.totalInicial = this.cantidadTotal;
	nuevoProducto.precioCosto = this.precioCosto;
	nuevoProducto.precioVenta = this.precioVenta;
	nuevoProducto.telProveedor = this.telProveedor;
	nuevoProducto.nitProveedor = this.nitProveedor;
	nuevoProducto.dirProveedor = this.dirProveedor;

	var producto_json = JSON.stringify(nuevoProducto);
	$.ajax({
		data : {"nuevoProducto":producto_json},
		url : "controladorK.php",
		type : "POST",
		success : function(data){
			var productoNuevo = $.parseJSON(data);
			for (var i in productoNuevo) {
				_this._id = productoNuevo[i]["idProducto"];
				_this.existencia = productoNuevo[i]["ProductoExistencia"];
				_this.descripcion = productoNuevo[i]["ProductoDescripcion"];
				_this.cantidadTotal = productoNuevo[i]["ProductoCantidadTotal"];
				_this.precioCosto = productoNuevo[i]["ProductocoPrecioCosto"];
				_this.precioVenta = productoNuevo[i]["ProductocoPrecioVenta"];			
			};	
			insertarNuevoProductoTabla();
		}
	})
}

Producto.prototype.updateProducto = function(){
	_this = this;
	var updateProducto = {};
	updateProducto.codigoProducto = this._id;
	updateProducto.descripcionProducto = this.descripcion;

	if (this.cantidadTotal != '' || this.cantidadTotal != '<br>' || parseInt(this.cantidadTotal) > 0)
		updateProducto.totalInicial = this.cantidadTotal;
	else
		updateProducto.totalInicial = 0;

	if (this.cantidadTotal == '')
		updateProducto.totalInicial = 0;

	updateProducto.precioCosto = this.precioCosto;
	updateProducto.precioVenta = this.precioVenta;
	updateProducto.codigoCategoria = this.codigoCategoria;
	updateProducto.codigoMarca = this.codigoMarca;
	updateProducto.codigoProveedor = this.codigoProveedor;

	var updateProductoJson = JSON.stringify(updateProducto);
	$.ajax({
		data : {"updateProducto" : updateProductoJson},
		url : "controladorK.php",
		type : "POST",
		success : function (data){
			var productoModificado = $.parseJSON(data);
			for (var i in productoModificado) {
				_this._id = productoModificado[i]["idProducto"];
				_this.existencia = productoModificado[i]["ProductoExistencia"];
				_this.descripcion = productoModificado[i]["ProductoDescripcion"];
				_this.cantidadTotal = productoModificado[i]["ProductoCantidadTotal"];
				_this.precioCosto = productoModificado[i]["ProductocoPrecioCosto"];
				_this.precioVenta = productoModificado[i]["ProductocoPrecioVenta"];			
			};
			updateProductoTabla();
		}
	})
}

Producto.prototype.deleteProducto = function(){
	$.ajax({
		data : {"deleteProducto" : this._id},
		url : "controladorK.php",
		type : "GET",
		success : function(data){
			var valorEntero = parseInt(data);
			if (valorEntero == 1)
				deleteproductoTabla();
			else
				alert("Error al eliminar el producto");
		}
	})
}
Producto.prototype.getParametros = function(){
	$.ajax({
		data : {"getParametros" : this._id},
		url : "controladorK.php",
		type : "GET",
		success : function(data){
			var parametros = $.parseJSON(data);
			showParameter(parametros);
		}
	})	
}

/**
* Clase cliente
*/

function Cliente(){
	this.nombre;
	this.nit;
	this.direccion;
	this.telefono;
	this.saldo;
	this.carrito = new Carrito();
}

Cliente.prototype.obtenerDatos = function(){

}

Cliente.prototype.agregarAlCarrito = function(producto){
	this.carrito.productos.push(producto);
}

Cliente.prototype.setIdCarrito = function(){
	this.carrito.setDatosCliente(this.nombre,this.nit,this.direccion,this.telefono,this.saldo);
}


/**
* Clase carrito
*/

function Carrito(){
	this.valorTotal;
	this.productos = [];
	this.cliente = [];
}

Carrito.prototype.setDatosCliente = function(nombre,nit,direccion,telefono,saldo){
	this.cliente["nombre"] = nombre;
	this.cliente["direccion"] = direccion;
	this.cliente["nit"] = nit;
	this.cliente["telefono"] = telefono;
	this.cliente["saldo"] = saldo;
}

Carrito.prototype.calcularValorTotal = function(){
	/*for (var i = 0; i < productos.length; i++) {
		
	};*/
}


/**
* Clase reporte
*/

function Reporte(){
	this.hora;
	this.cantidadComprada;
	this.producto;
	this.marca;
	this.precioVenta;
	this.precioCosto;
	this.existencia;
	this.idDetalle;
	this.proveedor;
	this.categoria;
}
Reporte.prototype.deleteReporte = function(posicionActual){
	_this = this;
	$.ajax({
		data : {"deleteReporte" : posicionActual},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			if (data == '1') {
				resultadoDeleteReporte();
			}
			else
				alert("Error al borrar el archivo");
		}
	});
}

Reporte.prototype.deleteReporteCompra = function(posicionActual){
	_this = this;
	$.ajax({
		data : {"deleteReporteCompra" : posicionActual},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			if (data == '1') {
				resultadoReportesCompras();
			}
			else
				alert("Error al borrar reporte de compra");
		}
	});
}

Reporte.prototype.updateReporteReporte = function(posicionActual, nuevaCantidad){
	_this = this;
	$.ajax({
		data : {"updateReporte" : posicionActual, "nuevaCantidadComprada" : nuevaCantidad},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			var reportes = $.parseJSON(data);
			for(var i in reportes){
				_this.hora = reportes[i]['ventaHora'];
				_this.cantidadComprada = reportes[i]['cantidadComprada'];
				_this.producto = reportes[i]['ProductoDescripcion'];
				_this.marca = reportes[i]['MarcaNombre'];
				_this.precioVenta = reportes[i]['ProductocoPrecioVenta'];
				_this.existencia = reportes[i]['ProductoExistencia'];
				_this.idDetalle = reportes[i]['idDetalleVenta'];
				var CantidadComprada = parseInt(reportes[i]['cantidadComprada']);
				var PrecioVenta = parseFloat(reportes[i]['ProductocoPrecioVenta']);
				_this.totalCompra = CantidadComprada * PrecioVenta;
			}
			resultadoUpdateReporte();
		}
	});
}

Reporte.prototype.updateReporteCompra = function(posicionActual, nuevaCantidad){
	_this = this;
	$.ajax({
		data : {"updateReporteCompra" : posicionActual, "nuevaCantidadComprada" : nuevaCantidad},
		url : "controlador.php",
		type : "GET",
		success : function(data){
			var reportes = $.parseJSON(data);
			for(var i in reportes){
				_this.hora = reportes[i]['hora'];
				_this.cantidadComprada = reportes[i]['cantidadComprada'];
				_this.producto = reportes[i]['descripcionCompra'];
				_this.marca = reportes[i]['MarcaNombre'];
				_this.proveedor = reportes[i]['ProveedoresNombre'];
				_this.categoria = reportes[i]['CategoriaNombre'];
				_this.precioCosto = reportes[i]['precioCostoCompra'];
				_this.idDetalle = reportes[i]['idDetalleCompra'];
				var CantidadComprada = parseInt(reportes[i]['cantidadComprada']);
				var PrecioCosto = parseFloat(reportes[i]['precioCostoCompra']);
				_this.totalCompra = CantidadComprada * PrecioCosto;
			}
			mostrarReportesCompras();
		}
	});
}