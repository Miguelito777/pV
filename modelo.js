// Aqui inicia mi primera clase que saluda hola mundo
function saludarr(){
	this.nombre = "Miguel Angel Menchu Xoyon";
}

saludarr.prototype.saludamiguelito = function (){
	alert("Jesus es el Salvador del mundo, y lo voy a proclamar. Att. "+this.nombre);
}

saludarr.prototype.pedirarray = function(){
	$.ajax({
		url : "controlador.php",
		data : {saludar : "saludar"},
		type : "POST",
		Cache : false,
		success : function (data){
			var array = $.parseJSON(data);
			console.log(array);
			var tareasarray = [];
			var k = 0;
			for(var i in array){
					var tarea = [];
					k = 0;
					for (var j in array[i]){
						tarea[k] = array[i][j];
						k++; 
					};
					tareasarray.push(tarea);
				}
				console.log(tareasarray);
		}
	}).done(function(data,textStatus,jqXHR){
		if(console && console.log)
			console.log("Array retornado correctamente");
	}).fail(function(jqXHR,textStatus,errorThrown){
		if (console && console.log) {
			console.log("Erro al retornar el array, rerifica el tipo de datos de retorno del servidor");
		};
	});
}