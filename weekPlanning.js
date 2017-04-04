// The root URL for the RESTful services
var rootURL = "http://localhost:8080/mealtimeprovider/webresources/mealtimeprovided.meal";

function getBeginingOfWeek(){
	var date = new Date();
	
	var day = date.getDay();
	
	var beginDate = new Date();
	beginDate.setDate((beginDate.getDate() - day) + 1);
	var endDate = new Date();
	endDate.setDate(beginDate.getDate() + 6);
	
	var dates = new Array(2);
	dates[0] = beginDate;
	dates[1] = endDate;
	
	return dates;
}


$('#myTable a').click(function () {
	//on récupère l'id de l'élément cliquer afin de savoir ce que l'on fait
	var clickedID = $(this).attr('id');
	
     var idMeal = $(this)   
    .closest('td')      
	.find("input")
    .val(); 
	
	if(clickedID == "editMenu"){
		//si c'est une modification de menu on fait un traitement de modification
     localStorage.setItem('idMeal', idMeal);
	 localStorage.setItem('navigID', "weekPlaned");
		
	}else if (clickedID == "deleteMenu"){
		// si c'est une suppression de menu on fait un traitement de suppression
		deleteMeal(idMeal);		
	}else if (clickedID == "addMenu"){
		localStorage.setItem('navigID', "weekPlaned");
	}
	
	// dans tous les autres cas, on ne fait rien.
	
	
	

});

$("#btn_lundi_evening").hide();
$("#btn_lundi_morning").hide();
$("#btn_lundi_afternoon").hide();
$("#btn_mardi_evening").hide();
$("#btn_mardi_morning").hide();
$("#btn_mardi_afternoon").hide();
$("#btn_mercredi_evening").hide();
$("#btn_mercredi_morning").hide();
$("#btn_mercredi_afternoon").hide();
$("#btn_jeudi_evening").hide();
$("#btn_jeudi_morning").hide();
$("#btn_jeudi_afternoon").hide();
$("#btn_vendredi_evening").hide();
$("#btn_vendredi_morning").hide();
$("#btn_vendredi_afternoon").hide();
$("#btn_samedi_evening").hide();
$("#btn_samedi_morning").hide();
$("#btn_samedi_afternoon").hide();
$("#btn_dimanche_evening").hide();
$("#btn_dimanche_morning").hide();
$("#btn_dimanche_afternoon").hide();

$("#lundi_morning").append(findPlanningOfTheWeek);

function findPlanningOfTheWeek() {
	
	var dates = getBeginingOfWeek();
	
	var beginDate = getDateToString(dates[0]);
	var endDate = getDateToString(dates[1]);
	
    $.ajax({
        type: 'GET',
        url: rootURL + '/getByDate/' + beginDate + "/" + endDate,
        dataType: "json",
        success: prepareWeekPlanning
    });
}


function getDateToString(date){
 
// GET YYYY, MM AND DD FROM THE DATE OBJECT
var yyyy = date.getFullYear().toString();
var mm = (date.getMonth()+1).toString();
var dd  = date.getDate().toString();
 
// CONVERT mm AND dd INTO chars
var mmChars = mm.split('');
var ddChars = dd.split('');
 
// CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
var datestring = yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);

return datestring;
}

function transformListToMapSortedByDays(list){
	var mapWeekDay = new Map();
	
	$.each(list, function(index, meal) {
		
	if(!mapWeekDay.has(meal.day)){
		var list = [];
		list.push(meal);
		mapWeekDay.set(meal.day, list);
	}else{
		mapWeekDay.get(meal.day).push(meal);
	}
  });
  
  return mapWeekDay;
}

function deleteMeal(idToDelete) {
    $.ajax({
        type: 'DELETE',
		async:false,
        url: rootURL + '/' + idToDelete,
        success: function(data, textStatus, jqXHR){
            alert('Menu supprimé avec succès');
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('Erreur lors de la supression du menu');
        }
    });
}


function prepareWeekPlanning(data){
	//S'il ny a rien on créé un tableau vide. Sinon on vérifie si les données sont sous forme de tableau. Si ce n'est pas le cas on créé un tableau avec les données reçues.
	var list = data == null ? [] : (data instanceof Array ? data : [data]);
 
	var mapWeekDay = transformListToMapSortedByDays(list);
	
	for (var [key, listDay] of mapWeekDay) {
		
	for (var i = 0; i < listDay.length; i++) {
        var meal = listDay[i];
		
		if(meal.moment == "M"){
			
			$('#' + meal.day.toLowerCase() + '_morning').empty();
			$('#' + meal.day.toLowerCase() + '_morning').append("<b> " + meal.titre + " </b>");
			$('#' + meal.day.toLowerCase() + '_morning').append("<br>");
			$('#' + meal.day.toLowerCase() + '_morning').append("<i> " + meal.description + " </i>");
			$('#' + meal.day.toLowerCase() + '_morning').append("<input type='hidden' id='idMeal' value='" + meal.id + "'/>");
			$('#' + meal.day.toLowerCase() + '_morning').append(selectImageByMealCat(meal));
			$('#btn_' + meal.day.toLowerCase() + '_morning').show();
			
		} else if (meal.moment == "A"){
		    $('#' + meal.day.toLowerCase() + '_afternoon').empty();
			$('#' + meal.day.toLowerCase() + '_afternoon').append("<b> " + meal.titre + " </b>");
			$('#' + meal.day.toLowerCase() + '_afternoon').append("<br>");
			$('#' + meal.day.toLowerCase() + '_afternoon').append("<i> " + meal.description + " </i>");
			$('#' + meal.day.toLowerCase() + '_afternoon').append("<input type='hidden' id='idMeal' value='" + meal.id + "'/>");
			$('#' + meal.day.toLowerCase() + '_afternoon').append(selectImageByMealCat(meal));
			$('#btn_' + meal.day.toLowerCase() + '_afternoon').show();
			
		} else if (meal.moment == "S") {
			$('#' + meal.day.toLowerCase() + '_evening').empty();
			$('#' + meal.day.toLowerCase() + '_evening').append("<b> " + meal.titre + " </b>");
			$('#' + meal.day.toLowerCase() + '_evening').append("<br>");
			$('#' + meal.day.toLowerCase() + '_evening').append("<i> " + meal.description + " </i>");
			$('#' + meal.day.toLowerCase() + '_evening').append("<input type='hidden' id='idMeal' value='" + meal.id + "'/>");
			$('#' + meal.day.toLowerCase() + '_evening').append(selectImageByMealCat(meal));
			$('#btn_' + meal.day.toLowerCase() + '_evening').show();
			
		}
    }
}}
  
  function selectImageByMealCat(meal){
	  var srcLink = '../Application repas/img/';
    if(meal.categorie == 'fastFood'){
		
	 srcLink += '001-food.png';
	}else if (meal.categorie == 'dejeunerLight'){
		
		srcLink += '005-coffee.png';
	}else if (meal.categorie == 'bigDejeuner'){
		
		srcLink += 'bacon.png';
	}else if (meal.categorie == 'poisson'){
		
		srcLink += '008-fish.png';
	}else if (meal.categorie == 'viande'){
		
		srcLink += 'steak.png';
		
	}else if (meal.categorie == 'pasta'){
		srcLink += 'pasta.png';
		
	}else if (meal.categorie == 'vego'){
		srcLink += '007-carrot.png';
		
	}else{
		srcLink = undefined;
	}
	
	if(srcLink == undefined){
		return "";
	}else{
	  return "<br/><img src='" + srcLink + "' align='center' height='8%' width='8%'/>";;
	
	} 
}
	