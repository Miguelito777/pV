function addRowHandlers() {

    var table = document.getElementById("tableId");
    var rows = table.getElementsByTagName("tr");

    for (i = 0; i < rows.length; i++) {

        var currentRow = table.rows[i];
        var createClickHandler = 
            function(row) {
                return function() { 
                    var cell = row.getElementsByTagName("td")[0];
                    var id = cell.innerHTML;
                    alert("id:" + id);
                };
            };

        currentRow.onclick = createClickHandler(currentRow);
    }
}
function pruebaajax(){
    alert("Hola, estoy a apunto de hacer una peticion ajax al metodo antiguo");
    if(window.XMLHttpRequest){
        alert("Request estoy listo");
    }
    var conexion = new XMLHttpRequest();

    conexion.onreadystatechange = function (){
        if (conexion.readyState == 4 && conexion.status == 200) {
            alert("Termine de realizar la peticion Ajax");
            document.getElementById("midiv").innerHTML = conexion.responseText;
        };
    }
    conexion.open("GET","controlador.php?texto=Hola soy un texto",true);
    conexion.send();
}

window.onload = pruebaajax;