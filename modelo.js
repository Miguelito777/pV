// Aqui inicia mi primera clase que saluda hola mundo
function saludarr(){
	this.nombre = "Miguel Angel Menchu Xoyon";
}

saludarr.prototype.saludamiguelito = function (){
	alert("Jesus es el Salvador del mundo, y lo voy a proclamar. Att. "+this.nombre);
}