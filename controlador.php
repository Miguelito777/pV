<?php
	include 'modelo.php';
	session_start();

	if (isset($_GET["user"])) {
		$user = (int)$_GET["user"];
		if ($user == 1){
			if (isset($_SESSION["usuarioValido"]))
				header("location:ventas.html");
			else
				header("location:index.html");
		}
		if ($user == 2) {
			if (isset($_SESSION["usuarioValidoAdmin"]))
				header("location:ventas.html");
			else
				header("location:index.html");
		}

	}
	if (isset($_GET["desabilitarSis"])) {
		if (isset($_SESSION["usuarioValido"])) {
			unset($_SESSION["usuarioValido"]);
			echo true;
		}
		else
			echo false;
	}
	if (isset($_GET["desabilitarSisAdmin"])) {
		if (isset($_SESSION["usuarioValidoAdmin"])) {
			unset($_SESSION["usuarioValidoAdmin"]);
			echo true;
		}
		else echo false;
	}
	if (isset($_POST["usuario"]) && isset($_POST["password"]) && isset($_POST["tipo"])) {
		$typeUser = (int)$_POST["tipo"]; 
		$libreria = new Tienda();

		$result = $libreria->loginUsuario($_POST["usuario"], $_POST["password"], $typeUser);

		if ($result == 1){
			$_SESSION["usuarioValido"] = true;
			echo 1;
		}
		else if ($result == 2){
			$_SESSION["usuarioValidoAdmin"] = true;
			echo 2;
		}
		else 0;
	}

	if (isset($_GET["verificar"])) {
		if (isset($_SESSION["usuarioValido"]))
			echo true;
		else
			echo false;
	}

	if (isset($_GET["verificarAdmin"])){
		if (isset($_SESSION["usuarioValidoAdmin"]))
			echo true;
		else
			false;
	}

	if (isset($_GET['iniciarTienda'])) {
		$libreria = new Tienda();
		$_SESSION["libreriaa"] = $libreria;
	}

	if (isset($_GET['diaReporte'])) {
		$libreria = $_SESSION["libreriaa"];
		$diaReporte = $_GET['diaReporte'];
		$reportes = $libreria->getReporteDiario($diaReporte);
		echo json_encode($reportes);
	}
	if (isset($_GET['diaReporteCompra'])) {
		$libreria = $_SESSION["libreriaa"];
		$diaReporte = $_GET['diaReporteCompra'];
		$reportes = $libreria->getReporteDiarioCompras($diaReporte);
		echo json_encode($reportes);
	}
	
	if (isset($_GET["deleteReporte"])) {
		$libreria = $_SESSION["libreriaa"];
		$posicionEliminar = (int)$_GET["deleteReporte"];
		$resultado = $libreria->deleteReporte($libreria->reportesA[$posicionEliminar]['idDetalleVenta']);
		if ($resultado){
			unset($libreria->reportesA[$posicionEliminar]);
			$_SESSION["libreriaa"] = $libreria;
			echo true;
		} 	
		else
			echo false;
	}
	if (isset($_GET["deleteReporteCompra"])){
		$libreria = $_SESSION["libreriaa"];
		$posicionEliminar = (int)$_GET["deleteReporteCompra"];
		$resultado = $libreria->deleteReporteCompra($libreria->reportesA[$posicionEliminar]['idDetalleCompra']);
		if ($resultado){
			unset($libreria->reportesA[$posicionEliminar]);
			$_SESSION["libreriaa"] = $libreria;
			echo true;
		} 	
		else
			echo false;
	}

	if (isset($_GET["updateReporte"]) && isset($_GET["nuevaCantidadComprada"])) {
		$libreria = $_SESSION["libreriaa"];
		$posicionModificar = (int)$_GET["updateReporte"];
		$cantidadModificar = (int)$_GET["nuevaCantidadComprada"];
		$resultado = $libreria->updateReporte($libreria->reportesA[$posicionModificar]['idDetalleVenta'], $cantidadModificar);

		echo json_encode($resultado);
	}

	if (isset($_GET["updateReporteCompra"]) && isset($_GET["nuevaCantidadComprada"])) {
		$libreria = $_SESSION["libreriaa"];
		$posicionModificar = (int)$_GET["updateReporteCompra"];
		$cantidadModificar = (int)$_GET["nuevaCantidadComprada"];
		$resultado = $libreria->updateReporteCompra($libreria->reportesA[$posicionModificar]['idDetalleCompra'], $cantidadModificar);

		echo json_encode($resultado);
	}

	if (isset($_GET["deleteCategoria"])) {
		$idCategoriaDelete = (int)$_GET["deleteCategoria"];
		$libreria = new Tienda();

		$statusDelete = $libreria->deleteCategoria($idCategoriaDelete);

		echo "$statusDelete";
	}
	if (isset($_GET["deleteMarca"])) {
		$idMarcaDelete = (int)$_GET["deleteMarca"];
		$libreria = new Tienda();

		$statusDelete = $libreria->deleteMarca($idMarcaDelete);

		echo "$statusDelete";
	}
	if (isset($_GET["deleteProveedor"])) {
		$idProveedorDelete = (int)$_GET["deleteProveedor"];
		$libreria = new Tienda();

		$statusDelete = $libreria->deleteProveedor($idProveedorDelete);

		echo "$statusDelete";
	}
?>