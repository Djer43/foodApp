// The root URL for the RESTful services
var rootURL = "http://localhost:8080/mealtimeprovider/webresources/mealtimeprovided.meal";

$.ajaxSetup({
    dataFilter: function(data, dataType) {
        if (dataType == 'json' && data == '') {
            return null;
        } else {
            return data;
        }
    }
});

$( document ).ready(function() {
	var idMeal = undefined 
	
	if(localStorage.getItem("idMeal") != null){
	idMeal = localStorage.getItem('idMeal');
	localStorage.removeItem('idMeal');
	}
    
	if(idMeal != null && idMeal != undefined){
	findById(idMeal)
	}
});


function findById(id) {
	console.log('findById: ' + id);
	$.ajax({
		type: 'GET',
		url: rootURL + '/' + id,
		dataType: "json",
		success: function(data){
			currentMeal = data;
			renderDetails(currentMeal);
		}
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

function renderDetails(meal) {
	$('#title').val(meal.titre);
	$('#description').val(meal.description);
	var moment = meal.moment;
	
	if(moment === "M"){
		   $('#moment option[value="M"]').prop('selected', true);
	}else if (moment === "A"){
		 $('#moment option[value="A"]').prop('selected', true);
	}else {
		 $('#moment option[value="S"]').prop('selected', true);
	}
	
	var categorie = meal.categorie;
	
	
	
	//rafraichissement du menu sélectionné (spécifique jquery mobile)
	$('#moment').selectmenu("refresh", true)
	var dateString = getDateToString(new Date(meal.dateMenu));
	$('#myDate').val(dateString);
	$('#day').val(meal.day);
	$('#mealID').val(meal.id);
}

