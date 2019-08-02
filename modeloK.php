<?php

    class connection{
        public $conn;


        function __construct(){
            $this->conn = new mysqli("13.92.235.252","root","Jesus8+","puntoventalibreria");
            }
        }

    class Sistema extends  connection{
        public $categorias;
        public $productos;
        public $marca;
        public $proveedores;
        public $venta;
        public $detalleventa;

        function __construct(){
            
        }

        public function getProductosCatCoin($idCategoria, $coinProducto){
            $query = "SELECT * from producto where Categoria_idCategorias = $idCategoria and ProductoDescripcion like '%$coinProducto%'";
            parent:: __construct();
            $productosCatCoin = $this->conn->query($query);
            $this->conn->close();
            $productosCatCoinA = array();
            while($productoCatCoinA = $productosCatCoin->fetch_assoc()){
                array_push($productosCatCoinA, $productoCatCoinA);
            }
            return json_encode($productosCatCoinA);
        }
        public function getProductosCatMarCoin($idCategoria,$idMarca, $coinProducto){
            $query = "SELECT * from producto where Categoria_idCategorias = $idCategoria and Marca_idMarcas = $idMarca and ProductoDescripcion like '%$coinProducto%'";
            parent:: __construct();
            $productosCatMarCoin = $this->conn->query($query);
            $this->conn->close();
            $productosCatMarCoinA = array();
            while($productoCatMarCoinA = $productosCatMarCoin->fetch_assoc()){
                array_push($productosCatMarCoinA, $productoCatMarCoinA);
            }
            return json_encode($productosCatMarCoinA);
        }
        public function getProductosCatMarProCoin($idCategoria, $idMarca, $idProveedor, $coinProducto){
            $query = "SELECT * from producto where Categoria_idCategorias = $idCategoria and Marca_idMarcas = $idMarca and Proveedores_idProveedores = $idProveedor and ProductoDescripcion like '%$coinProducto%'";
            parent:: __construct();
            $productosCatMarCatCoin = $this->conn->query($query);
            $this->conn->close();
            $productosCatMarProCoinA = array();
            while($productoCatMarProCoinA = $productosCatMarCatCoin->fetch_assoc()){
                array_push($productosCatMarProCoinA, $productoCatMarProCoinA);
            }
            return json_encode($productosCatMarProCoinA);
        }
        public function getProductosCatProCoin($idCategoria, $idProveedor, $coinProducto){
            $query = "SELECT * from producto where Categoria_idCategorias = $idCategoria and Proveedores_idProveedores = $idProveedor and ProductoDescripcion like '%$coinProducto%'";
            parent:: __construct();
            $productosCatProCoin = $this->conn->query($query);
            $this->conn->close();
            $productosCatProCoinA = array();
            while($productoCatProCoinA = $productosCatProCoin->fetch_assoc()){
                array_push($productosCatProCoinA, $productoCatProCoinA);
            }
            return json_encode($productosCatProCoinA);
        }        
        public function getProductosMarProCoin($idMarca, $idProveedor, $coinProducto){
            $query = "SELECT * from producto where Marca_idMarcas = $idMarca and Proveedores_idProveedores = $idProveedor and ProductoDescripcion like '%$coinProducto%'";
            parent:: __construct();
            $productosMarProCoin = $this->conn->query($query);
            $this->conn->close();
            $productosMarProCoinA = array();
            while($productoMarProCoinA = $productosMarProCoin->fetch_assoc()){
                array_push($productosMarProCoinA, $productoMarProCoinA);
            }
            return json_encode($productosMarProCoinA);
        }           
        public function getParametros($idProducto){
            $query = "SELECT Categoria_idCategorias, Marca_idMarcas, Proveedores_idProveedores from producto where idProducto = $idProducto";
            parent:: __construct();
            $parametros = $this->conn->query($query);
            $this->conn->close();
            $parametros = $parametros->fetch_assoc();
            return json_encode($parametros);
        }        

        function deleteProducto($id){
            parent:: __construct();
            $query = "call deleteProducto($id)";
            $estadoDelete = $this->conn->query($query);
            $this->conn->close();
            return $estadoDelete;
        }

        
        function getProductosMarcaProveedor($idMarca, $idProveedor){
            parent:: __construct();
            $this->productos = $this->conn->query("call getProductosMarcaProveedor($idMarca, $idProveedor)");
            $this->conn->close();
        }
        function obtenerProductosMarcaProveedor(){
            if ($producto = $this->productos->fetch_assoc())
                return $producto;
            else
                return false;
        }
        function getProductosCategoriaProveedor($idCategoria, $idProveedor){
            parent:: __construct();
            $this->productos = $this->conn->query("call getProductosCategoriaProveedor($idCategoria, $idProveedor)");
            $this->conn->close();
        }

        function obtenerProductosCategoriaProveedor(){
            if ($productoCP = $this->productos->fetch_assoc())
                return $productoCP;
            else
                return false;
        }

        function consultarCategoriasIdNombre(){
            parent:: __construct();
            $this->categorias = $this->conn->query("SELECT idCategorias,categoriaNombre from categoria");
            $this->conn->close();
        }

        function obtenerCategoriasIdNombre(){
        if($categoria=$this->categorias->fetch_assoc())
            return $categoria;
        else
            return false;
        }

        function consultarMarcasIdNombre(){
            parent::__construct();
            $this->marcas = $this->conn->query("SELECT idMarcas,marcaNombre from marca");
            $this->conn->close();
        }

        function ObtenerMarcasIdNombre(){
            if($marcas=$this->marcas->fetch_assoc())
                return $marcas;
            else
                return false;
        }

        function consultarProveedoresIdNombre(){
            parent::__construct();
            $this->proveedores =$this->conn->query("SELECT idProveedores,proveedoresNombre from proveedores");
            $this->conn->close();
        }

        function obtenerProveedoresIdNombre(){
            if($proveedores=$this->proveedores->fetch_assoc())
                return $proveedores;
            else
                return false;
        }
        function consultarProductosCategoria($id){
            parent::__construct();
            $this->productos = $this->conn->query("SELECT * from producto where Categoria_idCategorias ='$id'");
            $this->conn->close();
        }   

        function obtenerProductosCategorias(){
            if($producto=$this->productos->fetch_assoc())
                    return $producto;
            else
                return false;
        }
        
        function consultarProductosMarcas($marca){
            parent::__construct();
            $this->marcas=$this->conn->query("SELECT * from producto where Marca_IdMarcas ='$marca'");
            $this->conn->close();
        }

        function obtenerProductosMarcas(){
            if($marca=$this->marcas-> fetch_assoc()) 
                return $marca;
            else
                return false;
        }
        
        function consultarProductosProveedores($prov){
            parent::__construct();
            $this->proveedores=$this->conn->query("SELECT * from producto where Proveedores_idProveedores = $prov");
            $this->conn->close();
        }

        function obtenerProductosProveedores(){
            if($proveedores=$this->proveedores->fetch_assoc())
                return $proveedores;
            else
                return false;
        }
        
        function consultarProductosCoincidencia($busqueda){
            parent::__construct();
            $this->producto=$this->conn->query("SELECT *from producto where ProductoDescripcion like '%$busqueda%'");
            $this->conn->close();
        }
        function obtenerProductosCoincidencia(){
            if($producto=$this->producto->fetch_assoc())
                return $producto;
            else
                return false;
        }
        function consultarProductos(){
            parent::__construct();
            $this->productos=$this->conn->query("SELECT * from producto");
            $this->conn->close();
        }
        function obtenerProductos(){
            if($producto=$this->productos->fetch_assoc())
                return $producto;
            else 
                return false;
        }
           
        function consultarMarcas(){
            parent::__construct();
            $this->marca=$this->conn->query("SELECT * from marca");
            $this->conn->close();
        }

        function obtenerMarcas(){
            if($marca=$this->marcas->fetch_assoc())
                return $marca;
            else
                return false;
        }

    
        function consultarProveedores(){
            parent::__construct();
            $this->proveedores=$this->conn->query("SELECT * from proveedores");
            $this->conn->close();
        }

        function ObtenerProveedores(){
            if ($proveedores = $this->proveedores->fetch_assoc())
                return $proveedores;
            else 
                return false;
        }

        function getProductos(){
            parent::__construct();
            $this->productos = $this->conn->query("call getProductos()");
            $this->conn->close();
        }
        
        function obtenerGetProductos(){
            if ($producto = $this->productos->fetch_assoc())
                return $producto;
            else 
                return false;
        }

        function consultarGetProductosCategoriasMarcas($idCategoria,$idMarca){
            parent::__construct();
            $this->productos=$this->conn->query("call getProductosCategoriaMarca($idCategoria,$idMarca)");
            $this->conn->close();
        }
        
        function obtenerGetProductosCategoriasMarca(){
            if($producto = $this->productos->fetch_assoc())
                    return $producto;
            else
                    return false;
        }

        function consultarGetCatMarProv($idCategoria,$idMarca,$idProveedor){
            parent::__construct();
            $this->productos=$this->conn->query("call getProductosCategoriaMarcaProveedor($idCategoria,$idMarca,$idProveedor)");
            $this->conn->close();
        }
 
        function obtenerGetCatMarProv(){
            if($producto = $this->productos->fetch_assoc())
                    return $producto;
            else
                      return false;
        }      
        
        function crearNuevoProducto($arrayProducto){
            $descripcionProducto=$arrayProducto['descripcionProducto'];
            $codCategoria=$arrayProducto['codigoCategoria'];
            if (is_string($codCategoria)) {
                parent::__construct();
                $query = "call setCategoriaNP('$codCategoria')";
                $idNCP = $this->conn->query($query);
                $this->conn->close();
                $id = $idNCP->fetch_assoc();
                $codCategoria = (int)$id['last_insert_id()'];
            }
            $codMarca=$arrayProducto['codigoMarca'];
            if (is_string($codMarca)) {
                parent::__construct();
                $query = "call setMarcaNP('$codMarca')";
                $idNCP = $this->conn->query($query);
                $this->conn->close();
                $id = $idNCP->fetch_assoc();
                $codMarca = (int)$id['last_insert_id()'];
            }
            $totalInicial=(int)$arrayProducto['totalInicial'];
            $precioCosto=(float)$arrayProducto['precioCosto'];
            $precioVenta=$arrayProducto['precioVenta'];
            $codProveedor=$arrayProducto['codigoProveedor'];
            if (isset($arrayProducto['telProveedor']))
                $telProveedor = $arrayProducto['telProveedor'];
            if (isset($arrayProducto['nitProveedor']))
                $nitProveedor = $arrayProducto['nitProveedor'];
            if (isset($arrayProducto['dirProveedor']))
                $dirProveedor = $arrayProducto['dirProveedor'];

            if (is_string($codProveedor)) {
                parent::__construct();
                $query = "call setProveedorNP('$codProveedor', '$telProveedor', '$dirProveedor', '$nitProveedor')";
                $idNCP = $this->conn->query($query);
                $this->conn->close();
                $id = $idNCP->fetch_assoc();
                $codProveedor = (int)$id['last_insert_id()'];
            }
            $fecha = date("Y-m-d");
            $query= ("setNames utf8");
            parent:: __construct();
            $this->conn->query($query);
            $query = "call ingresarProducto($totalInicial, '$descripcionProducto', $totalInicial, $precioCosto, $precioVenta, $codCategoria, $codMarca, $codProveedor)";
            if (!$this->productos = $this->conn->query($query)){
                printf("Errormessage: %s\n", $this->conn->error);
            }
            $this->conn->close();
            $productos = array();
            if (!$this->productos) {
                
            }
            $filaProductos = $this->productos->fetch_assoc();
            $producto=array();
            foreach ($filaProductos as $key => $value) {
                $producto[$key] = $value;
            }
            array_unshift($productos,$producto);
            $idNuevoProducto = (int)$productos[0]['idProducto'];
            $query = "call setDetalleCompra('$descripcionProducto', $precioCosto, $codMarca, $codProveedor, $codCategoria, $totalInicial, '$fecha', $idNuevoProducto)";
            parent:: __construct();
            if (!$this->conn->query($query)) {
                printf("Errormessage: %s\n", $this->conn->error);
            }
            $this->conn->close();

            return $productos;
        }


        function modificarNuevoProducto($arrayProducto){
            $descripcionProducto = $arrayProducto['descripcionProducto'];          
            $totalInicial = $arrayProducto['totalInicial'];
            $precioCosto = (float)$arrayProducto['precioCosto'];
            $precioVenta = $arrayProducto['precioVenta'];
            $codigoProductoo = (int)$arrayProducto['codigoProducto'];
            $codCategoria = $arrayProducto['codigoCategoria'];
            $codMarca = $arrayProducto['codigoMarca'];
            $codProveedor = $arrayProducto['codigoProveedor'];
            $fecha = date("Y-m-d");

            // Modifico el producto en inventario
            $query = "call setModificarProducto('$descripcionProducto',$totalInicial,$precioCosto,$precioVenta,$codigoProductoo,$codCategoria, $codMarca, $codProveedor)";
            parent:: __construct();
            $this->productos= $this->conn->query($query);
            $this->conn->close();

            // Si el usuario desea comprar mas de un producto existente
            if ($totalInicial > 0) {
                $query = "call setDetalleCompra('$descripcionProducto', $precioCosto, $codMarca, $codProveedor, $codCategoria, $totalInicial, '$fecha', $codigoProductoo)";
                parent:: __construct();
                if (!$this->conn->query($query)) {
                    printf("Errormessage: %s\n", $this->conn->error);
                }
                $this->conn->close();
            }
        }  


        function obtenerModificarNuevoProducto(){
            if($producto = $this->productos->fetch_assoc())
                    return $producto;
           else
                     return false;
        }
     
        function concultarNuevaVenta($arrayVenta){
            $ventaDescripcion=$arrayVenta['ventaDescripcion'];          
            $ventaFecha=$arrayVenta['ventaFecha'];
            $ventaHora=$arrayVenta['ventaHora'];
            $VentaUsuario=$arrayVenta['ventaUsuario'];
            $cliente=$arrayVenta['cliente'];
            parent::__construct();
            $query = ("call nuevaVenta('$ventaDescripcion',$ventaFecha,$ventaHora,$ventaUsuario,$cliente)");
            $this->ventas= $this->conn->query($query);
            $this->conn->close();
            
        }  
        
        
        function obtenerNuevaVenta(){
            if($venta = $this->productos->fetch_assoc());
                    return $venta;

        }


        function consultarProductosCoincidenciaVenta($coincidencia){
            parent::__construct();
            $this->producto=$this->conn->query("SELECT P.idProducto, C.CategoriaNombre, P.ProductoDescripcion, M.marcaNombre, P.ProductocoPrecioVenta, P.ProductoExistencia from categoria C inner join producto P on C.idCategorias = P.Categoria_idCategorias inner join marca M on P.Marca_idMarcas = M.idMarcas where ProductoDescripcion like '%$coincidencia%'");
            $this->conn->close();
        }
        function obtenerProductosCoincidenciaVenta(){
            if($producto=$this->producto->fetch_assoc())
                return $producto;
            else
                return false;
        }
       
        function consultarGetProductosCategoriaMarcaVenta($catVenta,$imarcaVenta){
            parent::__construct();
            $this->productos=$this->conn->query("call getProductosCategoriaMarcaVenta($catVenta,$imarcaVenta)");
            $this->conn->close();
        }
        
        function obtenerGetProductosCategoriaMarcaVenta(){
            if($producto = $this->productos->fetch_assoc())
                    return $producto;
            else
                    return false;
        }

        function consultarGetProductoMarcaVenta($idMarca){
            parent::__construct();
            $this->productos=$this->conn->query("call getMarcasColumnas($idMarca)");
            $this->conn->close();
        }
 
        function obtenerProductoMarcaVenta(){
            if($producto = $this->productos->fetch_assoc())
                    return $producto;
            else
                      return false;
        }      

        function consultarGetProductosCategoriaVenta($idCategoria){
            parent::__construct();
            $this->productos=$this->conn->query("call getProductosCategoriaVenta($idCategoria)");
            $this->conn->close();
        }

        function obtenerProductoCategoriaVenta(){
            if($producto = $this->productos->fetch_assoc())
                    return $producto;
            else
                      return false;
        }     


        function consultarCoincidenciaCatMVenta($idCategoria,$idMarca,$coincidencias){
            parent::__construct();
            $this->producto=$this->conn->query("SELECT P.idProducto, C.CategoriaNombre, P.ProductoDescripcion, M.marcaNombre, P.ProductocoPrecioVenta, P.ProductoExistencia from categoria C inner join producto P on C.idCategorias = P.Categoria_idCategorias inner join marca M on P.Marca_idMarcas = M.idMarcas where idCategorias and idMarcas like '%$coincidencia%'");
            $this->conn->close();
        }
        function obtenerCoincidenciaCatMVenta(){
            if($producto=$this->producto->fetch_assoc())
                return $producto;
            else
                return false;
        }

        function crearVenta($descripcion,$fecha,$usuario,$idCliente){
            parent::__construct();
            if(!$idProducto = $this->conn->query("call nuevaVenta('$descripcion','$fecha','$usuario',$idCliente)"))
                printf("Error: %s\n",$this->conn->error);
            $this->conn->close();  

            if($idNuevoProducto = $idProducto->fetch_assoc())
                return $idNuevoProducto;
            else
                return false;
        }  


        function detalleVenta($cantidad,$idProductos,$idVentas){
            $tipoCantidad = (int)$cantidad;
            $tipoIdProducto = (int)$idProductos;
            $tipoIdVenta = (int)$idVentas;
            parent::__construct();
            $query = ("call getAlmacenaDetalle($tipoCantidad,$tipoIdProducto,$tipoIdVenta)");
            if(!$this->productos= $this->conn->query($query))
                printf("Error %s\n ",$this->conn->error);
            if (!$this->productos) 
                echo "Error al almacenar el detalle de venta";
            $this->conn->close();
            }

            function modificarProducto(){
            parent::__construct(); 
            $this->productos=$this->conn->query("update producto set productoExistencia=nuevaExistencia");
            if ($this->productos) 
                echo "Detalle de venta almacenado exitosamente";
            else
                echo "Error al almacenar el detalle de venta";
            $this->conn->close();
            
            }

            function modificarCategorias($arrayCategoria){
            $idCategoria=$arrayCategoria['idCategoria'];          
            $categoriaNombre=$arrayCategoria['categoriaNombre'];
            parent::__construct();
            $query = ("call setModificaCategoria($idCategoria,'categoriaNombre')");
            $this->categorias= $this->conn->query($query);
            $this->conn->close();
            
        }  
            function obtenerModificarNuevaCategoria(){
            if($categoria = $this->categorias->fetch_assoc())
                    return $categoria;
            else
                     return false;
            }
     

            function deleteCategoria($id){
            parent:: __construct();
            $query = ("deleteCategoria($id)");
            $estadoDelete = $this->conn->query($query);
            $this->conn->close();
            return $estadoDelete;
        }


    }


      class Categoria extends connection{
        private $nombreCategoria;
        
        public $codigo;
        public $nom;
        public $descripcion;
        
        function __construct(){
            
        }
        
        function borrarCategoria(){
        
        }
        function crearNuevaCategoria(){
            
            
        }
        
    }

    class Producto extends connection{
        private $codigoProducto;
        
        public $codigo;
        public $descripcion;
        public $categoria;
        public $marca;
        public $total;
        public $precioCosto;
        public $precioVenta;
        public $proveedores;
        public $enlace;
        
        function __construct(){
            
        }
        
        function productoBorrarProducto(){
            
        }
        
        function productoCrearNuevoProducto(){
                }
   
    }
    
class Marca extends connection{
        private $marcaCodigo;
        
        public $codigo;
        public $nombre;
        public $observacion;
        public $enlace;
        
        function __construct(){     
       
        }
        function marcaBorrarMarca(){
            
        }
        function marcaCrearNuevaMarca(){
            
        }
    }

class Proveedores extends connection{
    private $proveedorNombre;
    
    public $nombre;
    public $nit;
    public $direccion;
    public $telefono;
    public $email;
    
    function __construct(){
        
    }
    function proveedorBorrarProveedor(){
        
    }
    function proveedorCrearNuevoProveedor(){
        
    }
}

/**
* Tienda
*/
class Tienda extends connection
{
    public $carritoCompra = array();
    public $totalVenta = 0; 
    function __construct()
    {
        
    }

    public function getDatosProducto($idProducto,$cantidad){
        $idInt = (int)$idProducto;
        $query = "call getDatosProductoFactura($idInt)";
        parent:: __construct();
        if(!$datosProducto = $this->conn->query($query)){
            printf("Error : %s\n",$this->conn->error);  
            $this->conn->close();          
        }
        else{
            $this->conn->close();
            $datosProducto = $datosProducto->fetch_assoc();
            $datosProductoA = array();
            $datosProductoA[0] = $datosProducto["idProducto"];
            $datosProductoA[1] = $datosProducto["ProductoDescripcion"];
            $datosProductoA[2] = $datosProducto["marcaNombre"];
            $datosProductoA[3] = $datosProducto["ProductocoPrecioVenta"];
            $datosProductoA[4] = $cantidad;
            $subTotal = (float)$datosProductoA[3] * (int)$cantidad;
            $datosProductoA[5] = $subTotal;
            $this->totalVenta = $this->totalVenta + $subTotal;
            array_push($this->carritoCompra, $datosProductoA);
        }
    }
}

class PDF extends FPDF
{
    // Cabecera de página
    function Header()
    {
        // Logo
        //$this->Image('images/headindex.png',10,8,33);
        // Arial bold 15
        $this->SetFont('Arial','B',15);
        // Movernos a la derecha
        $this->Cell(50);
        // Título
        $this->Cell(100,10,'Libreria y Papeleria',0,0,'C');
        $this->Ln(5);
        $this->SetFont('Arial','B',10);
        $this->Cell(50);
        $this->Cell(100,10,'Suenos de Papel',0,0,'C');
        $this->Ln(5);
        $this->SetFont('Arial','B',7);
        $this->Cell(50);
        $this->Cell(100,10,'Tel. 7766-7184 / 5699-0471',0,0,'C');
        $this->Ln(10);
        $this->SetFont('Arial','B',18);
        $this->Cell(50);
        $this->Cell(100,10,'Factura',0,0,'C');
        // Salto de línea
        $this->Ln(11);
    }
    function BasicTable($header, $data)
    {
        // Cabecera
        $this->SetFont('Arial','B',8);
        for ($i = 0; $i < count($header); $i++){
            if ($i == 0)
                $this->Cell(23,7,$header[$i],1,0,'C');
            else if ($i == 1) {
                $this->Cell(50,7,$header[$i],1,0,'C');
            }
            else
                $this->Cell(23,7,$header[$i],1,0,'C');
        } 
        $this->Ln();
        // Datos
        $this->SetFont('Arial','',7);
        $unidadesUsadas = count($data);
        for ($i = 0; $i < count($data); $i++) { 
            for ($j = 0; $j < count($data[$i]); $j++){
                if ($j == 0)
                    $this->Cell(23,7,$data[$i][$j],1,0,'C');
                else if($j == 1) {
                    $this->Cell(50,7,$data[$i][$j],1,0,'C');
                }
                else if($j == 5) {
                    $this->Cell(23,7,"Q. ".$data[$i][$j],1,0,'C');
                }
                else
                    $this->Cell(23,7,$data[$i][$j],1,0,'C');
            }
            $this->Ln();
        }
    }
}

class PDFC extends FPDF
{
    // Cabecera de página
    function Header()
    {
        // Logo
        //$this->Image('images/headindex.png',10,8,33);
        // Arial bold 15
        $this->SetFont('Arial','B',15);
        // Movernos a la derecha
        $this->Cell(50);
        // Título
        $this->Cell(100,10,'Libreria y Papeleria',0,0,'C');
        $this->Ln(5);
        $this->SetFont('Arial','B',10);
        $this->Cell(50);
        $this->Cell(100,10,'Suenos de Papel',0,0,'C');
        $this->Ln(5);
        $this->SetFont('Arial','B',7);
        $this->Cell(50);
        $this->Cell(100,10,'Tel. 7766-7184 / 5699-0471',0,0,'C');
        $this->Ln(10);
        $this->SetFont('Arial','B',18);
        $this->Cell(50);
        $this->Cell(100,10,'Cotizacion',0,0,'C');
        // Salto de línea
        $this->Ln(11);
    }
    function BasicTable($header, $data)
    {
        // Cabecera
        $this->SetFont('Arial','B',8);
        for ($i = 0; $i < count($header); $i++){
            if ($i == 0)
                $this->Cell(23,7,$header[$i],1,0,'C');
            else if ($i == 1) {
                $this->Cell(50,7,$header[$i],1,0,'C');
            }
            else
                $this->Cell(23,7,$header[$i],1,0,'C');
        } 
        $this->Ln();
        // Datos
        $this->SetFont('Arial','',7);
        $unidadesUsadas = count($data);
        for ($i = 0; $i < count($data); $i++) { 
            for ($j = 0; $j < count($data[$i]); $j++){
                if ($j == 0)
                    $this->Cell(23,7,$data[$i][$j],1,0,'C');
                else if($j == 1) {
                    $this->Cell(50,7,$data[$i][$j],1,0,'C');
                }
                else if($j == 5) {
                    $this->Cell(23,7,"Q. ".$data[$i][$j],1,0,'C');
                }
                else
                    $this->Cell(23,7,$data[$i][$j],1,0,'C');
            }
            $this->Ln();
        }
    }
}
?>







