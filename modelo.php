<?php
	
/**
* Clase Conexion
*/
class Conexion 
{
	public $conexion;

	function __construct()
	{
		$this->conexion = new mysqli("192.168.43.140","root","","puntoventalibreria");		
	}
}

/**
* Clase Tienda
*/
class Tienda extends Conexion
{
	public $reportesA = array();

	function __construct()
	{
		
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
			$reportes = $this->conexion->query($query);
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
			$reportes = $this->conexion->query($query);
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
				array_unshift($this->reportesA, $reporteA);
			}
		}
		return $this->reportesA;
	}
}

?>