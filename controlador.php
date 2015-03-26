<?php

	if ($_POST["saludar"]) {
		
		$datos = array('1' => "dos", '1' => "dos",'3' => "tres" );

		$datosobject = (Object)$datos;

		echo json_encode($datosobject);
	}

?>