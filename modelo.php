<?php
	
/**
* Clase Conexion
*/
class Conexion 
{
	public $conexion;

	function __construct()
	{
		$this->conexion = new mysqli("localhost","root","Jesus8+","puntoventalibreria");		
	}
}

/**
* Clase Tienda
*/
class Tienda extends Conexion
{
	public $reportesA = array();
	public $reportesCompras = array();
	public $newsCategorias = array();
	public $newsMarcas = array();
	public $newsProveedores = array();

	function __construct()
	{
		
	}

	public function verCompras($verCompras){
		$query = "SELECT fecha FROM detallecompra WHERE date_format(fecha, '%m-%Y') = '$verCompras' group by fecha;";
		parent:: __construct();
		$fechasCompras = $this->conexion->query($query);
		$this->conexion->close();
		$fechasComprasA = array();
		while($fechaCompra = $fechasCompras->fetch_assoc()){
			array_push($fechasComprasA, $fechaCompra["fecha"]);
		}
		return $fechasComprasA;			
	}

	public function setNewPassword($idUsuarioActual, $newPassword){
		$newPassEncript = sha1($newPassword);
		$query = "UPDATE usersadmin set password = '$newPassEncript' where idUsuario = $idUsuarioActual";
		parent:: __construct();

		if (!$resultadoSetPassword = $this->conexion->query($query)) {
			printf("Erro ",$this->conexion->error);
			return false;
			$this->conexion->close();
		}
		else{
			$this->conexion->close();
			return true;
		}
	}

	public function evaluaPasswordActual($passwordActual){
		$newPassEncript = sha1($passwordActual);
		$query = "SELECT * from usersadmin where password = '$newPassEncript'";
		parent:: __construct();
		if (!$userAdmin = $this->conexion->query($query)){
			printf("Error %s\n",$this->conexion->error);
			$this->conexion->close();
			return false;			
		}
		else{
			$this->conexion->close();
			$usuarioAdministrador = $userAdmin->fetch_assoc();
			return $usuarioAdministrador['idUsuario'];
		}
	}

	function loginUsuario($usuario, $password, $typeUser){
		if ($typeUser == 1) {
			$query = "SELECT * from usuarios where nombreUsuario = '$usuario' and passwordUsuario = '$password'";
			parent:: __construct();
			$result = $this->conexion->query($query);
			$usuarioEncontrado = $result->num_rows;
			if($usuarioEncontrado > 0)
				return 1;
			else
				false;
		}
		if ($typeUser == 2) {
			$passwordEncript = $password; //sha1($password);
			$query = "SELECT * from usersadmin where nombre = '$usuario' and password = '$passwordEncript'";
			parent:: __construct();
			$result = $this->conexion->query($query);
			$usuarioEncontrado = $result->num_rows;
			if($usuarioEncontrado > 0){
				return 2;
			}
			else
				false;
		}
	}

	function updateReporte($id, $cantidadModificar){
		$idDetalle = (int)$id;
		$cant = (int)$cantidadModificar;
		parent:: __construct();
		if (!$this->conexion)
			echo "Error al conectar a la Base de Datos";
		else
		{
			$reportesA = array();
			$query = "call updateCantCompDetalleVenta($idDetalle,$cant)";
			if(!$reportes = $this->conexion->query($query))
				printf("Errormensage %s\n",$this->conexion->error);
			$this->conexion->close();
			while ($reporte = $reportes->fetch_assoc()) {
				$reporteA = array();
				foreach ($reporte as $key => $value) {
					$reporteA[$key] = $value;
				}
				array_unshift($reportesA, $reporteA);
			}
			return $reportesA;
		}
	}

	function updateReporteCompra($id, $cantidadModificar){
		$idDetalle = (int)$id;
		$cant = (int)$cantidadModificar;
		parent:: __construct();
		if (!$this->conexion)
			echo "Error al conectar a la Base de Datos";
		else
		{
			$reportesA = array();
			$query = "call updateDetalleCompra($idDetalle,$cant)";
			$reportes = $this->conexion->query($query);
			$this->conexion->close();
			while ($reporte = $reportes->fetch_assoc()) {
				$reporteA = array();
				foreach ($reporte as $key => $value) {
					$reporteA[$key] = $value;
				}
				array_unshift($reportesA, $reporteA);
			}
			return $reportesA;
		}
	}

	function deleteReporte($id){
		$idDetalle = (int)$id;
		parent:: __construct();
		if (!$this->conexion)
			echo "Error al conectar a la Base de Datos";
		else
		{
			$query = "call deleteDetalleVenta($idDetalle)";
			if(!$reportes = $this->conexion->query($query))
				printf("Errormensage %s\n",$this->conexion->error);
			$this->conexion->close();
			if ($reportes)
				return true;
			else
				return false;
		}
	}
	function deleteReporteCompra($id){
		$idDetalle = (int)$id;
		parent:: __construct();
		if (!$this->conexion)
			echo "Error al conectar a la Base de Datos";
		else
		{
			$query = "call deleteDetalleCompra($idDetalle)";
			if(!$reportes = $this->conexion->query($query))
				printf("Errormensage %s\n",$this->conexion->error);
			$this->conexion->close();
			if ($reportes)
				return true;
			else
				return false;
		}
	}

	function getReporteDiario($fecha){
		parent:: __construct();
		if (!$this->conexion)
			echo "Error al conectar a la Base de Datos";
		else
		{
			$query = "call reporteDia('$fecha')";
			if(!$reportes = $this->conexion->query($query))
				printf("Error: %s\n",$this->conexion->error);
			
			$this->conexion->close();
			while ($reporte = $reportes->fetch_assoc()) {
				$reporteA = array();
				foreach ($reporte as $key => $value) {
					$reporteA[$key] = $value;
				}
				array_unshift($this->reportesA, $reporteA);
			}
		}
		return $this->reportesA;
	}

	function getReporteDiarioCompras($fecha){
		parent:: __construct();
		if (!$this->conexion)
			echo "Error al conectar a la Base de Datos";
		else
		{
			$query = "call getReporteComprasDia('$fecha')";
			$reportes = $this->conexion->query($query);
			$this->conexion->close();
			while ($reporte = $reportes->fetch_assoc()) {
				$reporteA = array();
				foreach ($reporte as $key => $value) {
					$reporteA[$key] = $value;
				}
				array_unshift($this->reportesCompras, $reporteA);
			}
		}
		return $this->reportesCompras;
	}

	public function newCategoria($nombreCategoria){
		$query = "call newCategoria('$nombreCategoria')";
		parent:: __construct();
		if ($newCategoria = $this->conexion->query($query)) {
			$newCategoriaA = array();			
			foreach ($newCategoria->fetch_assoc() as $key => $value) {
				$newCategoriaA[$key] = $value;
			}
			array_unshift($this->newsCategorias, $newCategoriaA);
			return $newCategoriaA;
		}
		else
			echo "Error al ingresar una nueva categoria";
	}
	public function newMarca($nombreMarca){
		$query = "call newMarca('$nombreMarca')";
		parent:: __construct();
		if ($newMarca = $this->conexion->query($query)) {
			$newMarcaA = array();			
			foreach ($newMarca->fetch_assoc() as $key => $value) {
				$newMarcaA[$key] = $value;
			}
			array_unshift($this->newsMarcas, $newMarcaA);
			return $newMarcaA;
		}
		else
			echo "Error al ingresar una nueva categoria";
	}
	public function newProveedor($nombreProveedor){
		$query = "call newProveedor('$nombreProveedor')";
		parent:: __construct();
		if ($newProveedor = $this->conexion->query($query)) {
			$newProveedorA = array();			
			foreach ($newProveedor->fetch_assoc() as $key => $value) {
				$newProveedorA[$key] = $value;
			}
			array_unshift($this->newsProveedores, $newProveedorA);
			return $newProveedorA;
		}
		else
			echo "Error al ingresar una nueva categoria";
	}

	public function searchCategorias($str){
		$query = "SELECT * from categoria where CategoriaNombre like '%$str%'";
		parent:: __construct();
		$resultadosSearchCategorias = $this->conexion->query($query);
		$this->conexion->close();
		$this->newsCategorias = array();
		while ($categoriaSearch = $resultadosSearchCategorias->fetch_assoc()) {
			$categoriaSearchA = array();
			foreach ($categoriaSearch as $key => $value) {
				$categoriaSearchA[$key] = $value;
			}
			array_unshift($this->newsCategorias, $categoriaSearchA);
		}
		return $this->newsCategorias;
	}
	public function searchMarcas($str){
		$query = "SELECT * from marca where MarcaNombre like '%$str%'";
		parent:: __construct();
		$resultadosSearchMarcas = $this->conexion->query($query);
		$this->conexion->close();
		$this->newsMarcas = array();
		while ($marcaSearch = $resultadosSearchMarcas->fetch_assoc()) {
			$marcaSearchA = array();
			foreach ($marcaSearch as $key => $value) {
				$marcaSearchA[$key] = $value;
			}
			array_unshift($this->newsMarcas, $marcaSearchA);
		}
		return $this->newsMarcas;
	}
	public function searchProveedor($str){
		$query = "SELECT * from proveedores where ProveedoresNombre like '%$str%'";
		parent:: __construct();
		$resultadoSearchProveedor = $this->conexion->query($query);
		$this->conexion->close();
		$this->newsProveedores = array();
		while ($proveedorSearch = $resultadoSearchProveedor->fetch_assoc()) {
			$proveedorSearchA = array();
			foreach ($proveedorSearch as $key => $value) {
				$proveedorSearchA[$key] = $value;
			}
			array_unshift($this->newsProveedores, $proveedorSearchA);
		}
		return $this->newsProveedores;
	}
	function deleteCategoria($idCategoria){
		$query = "DELETE from categoria where idCategorias = $idCategoria";
		parent:: __construct();
		$statusDelete = $this->conexion->query($query);
		$this->conexion->close();
		return $statusDelete;
	}

	function deleteMarca($idMarca){
		$query = "DELETE from marca where idMarcas = $idMarca";
		parent:: __construct();
		$statusDelete = $this->conexion->query($query);
		$this->conexion->close();
		return $statusDelete;
	}

	function deleteProveedor($idProveedor){
		$query = "DELETE from proveedores where idProveedores = $idProveedor";
		parent:: __construct();
		$statusDelete = $this->conexion->query($query);
		$this->conexion->close();
		return $statusDelete;
	}

	function updateCategoria($idCategoria, $newName){
		$query = "call updateCategoria($idCategoria, '$newName')";
		parent:: __construct();
		$statusUpdate = $this->conexion->query($query);
		$this->conexion->close();
		if ($newNameCategoria = $statusUpdate->fetch_assoc()){
			$newCategoria = array();
			foreach ($newNameCategoria as $key => $value) {
				$newCategoria[$key] = $value;
			}
			return $newCategoria; 
		}
		else
			return false;
	}	
	function updateMarca($idMarca, $newName){
		$query = "call updateMarca($idMarca, '$newName')";
		parent:: __construct();
		$statusUpdate = $this->conexion->query($query);
		$this->conexion->close();
		if ($newNameMarca = $statusUpdate->fetch_assoc()){
			$newMarca = array();
			foreach ($newNameMarca as $key => $value) {
				$newMarca[$key] = $value;
			}
			return $newMarca; 
		}
		else
			return false;
	}
	function updateProveedor($idProveedor, $newName){
		$query = "call updateProveedor($idProveedor, '$newName')";
		parent:: __construct();
		$statusUpdate = $this->conexion->query($query);
		$this->conexion->close();
		if ($nameNewProveedor = $statusUpdate->fetch_assoc()){
			$newProveedor = array();
			foreach ($nameNewProveedor as $key => $value) {
				$newProveedor[$key] = $value;
			}
			return $newProveedor; 
		}
		else
			return false;
	}

}

?>