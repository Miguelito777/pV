// Aqui inicia mi primera clase que saluda hola mundo
function saludarr(){
	this.nombre = "Miguel Angel Menchu Xoyon";
}

saludarr.prototype.saludamiguelito = function (){
	alert("Jesus es el Salvador del mundo. Att. "+this.nombre);
}