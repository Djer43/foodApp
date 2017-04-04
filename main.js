// The root URL for the RESTful services
var rootURL = "http://localhost:8080/mealtimeprovider/webresources/mealtimeprovided.meal";

$(document).ready(function(e){
	e.preventDefault;
    $('#myForm').on('submit',function(){
		var meal = new Object();
		var datemenu = $('#myDate').datebox('getTheDate')
		meal.titre = $('#title').val();
		meal.day = $("#day").val();
		meal.description = $('#description').val();
		meal.dateMenu = datemenu;
		meal.moment = $("#moment").val();
		meal.categorie = $("#categorie").val();
		
       if ($('#mealID').val() == ""){
		addMeal(meal, Callback);
		redirect();
		}
	   else{
		meal.id = $('#mealID').val();
		updateMeal(meal, Callback);
		redirect();
		}
    });
});

function redirect(){
    var navigID = localStorage.getItem('navigID');
	
	if(navigID == "weekPlaned"){
		alert(navigID);
		localStorage.removeItem('navigID');
		window.location.replace("table.html");
	}else{
		window.location.replace("menu_principal.html");
	}
}

function updateMeal(meal, callbackfkn) {
	console.log('updateMeal');
	$.ajax({
		type: 'PUT',
		contentType: "application/json; charset=utf-8",
		url: rootURL + '/' + meal.id,
		dataType: "json",
		async : false,
		data: JSON.stringify(meal),
		success: function(data, textStatus, jqXHR){
			callbackfkn('Repas mis ? jour avec succ?s !');
		},
		error: function(jqXHR, textStatus, errorThrown){
			callbackfkn('updateMeal error: ' + textStatus);
		}
	});
}

  function Callback(data)
     {
		alert(data);
     }

function addMeal(contact){
     jQuery.ajax({
         type: 'post',
         url: rootURL,
		 async:false,
         data: JSON.stringify(contact),
         contentType: "application/json; charset=utf-8",
         dataType: "json",
         success: function () {
             alert("Le repas a ?t? ajout? avec succes!");
         },
     
          error: function (jqXHR, exception) {
        var msg = '';
        if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
        } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
        } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
        } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
        } else if (exception === 'timeout') {
            msg = 'Time out error.';
        } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
        } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
        }		 
              alert("erreur lors de l'ajout : "  + msg);
         }

     });
}

function deleteMeal(idToDelete) {
    $.ajax({
        type: 'DELETE',
		async:false,
        url: rootURL + '/' + idToDelete,
        success: function(data, textStatus, jqXHR){
            alert('Menu supprim? avec succ?s');
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('Erreur lors de la supression du menu');
        }
    });
}


$( "#deleteAfternoon" ).click(function() {
  var idAfternoon = $('#idAfternoon').val();
  
  deleteMeal(idAfternoon);
  
});

$( "#deleteMorning" ).click(function() {
  var idMorning = $('#idMorning').val();
  deleteMeal(idMorning);
  
});

$( "#deleteEvening" ).click(function() {
  var idEvening = $('#idEvening').val();
  deleteMeal(idEvening);
  
});


$( "#editAfternoon" ).click(function() {
  var idAfternoon = $('#idAfternoon').val();
  localStorage.setItem('idMeal', idAfternoon);
  
});

$( "#editMorning" ).click(function() {
  var idMorning = $('#idMorning').val();
  localStorage.setItem('idMeal', idMorning);
});

$( "#editEvening" ).click(function() {
  var idEvening = $('#idEvening').val();
  localStorage.setItem('idMeal', idEvening);
});

$("#btnEvening").hide();
$("#btnMorning").hide();
$("#btnAfternoon").hide();

function findMenuBySpecificDate() {
	var dateOfTheDay = getDateOfTheDayToString();
	
    $.ajax({
        type: 'GET',
        url: rootURL + '/getByDate/' + dateOfTheDay,
        dataType: "json",
        success: renderList
    });
}

function updateDayField(){
	var date = $('#myDate').datebox('getTheDate');
   
   var weekday = new Array(7);
		weekday[0] =  "Dimanche";
		weekday[1] = "Lundi";
		weekday[2] = "Mardi";
		weekday[3] = "Mercredi";
		weekday[4] = "Jeudi";
		weekday[5] = "Vendredi";
		weekday[6] = "Samedi";

	var jour = weekday[date.getDay()];
	
	$("#day").val(jour);
	
}

$.ajaxSetup({
    dataFilter: function(data, dataType) {
        if (dataType == 'json' && data == '') {
            return null;
        } else {
            return data;
        }
    }
});

$("#morning_menu").append(findMenuBySpecificDate);

function getDateOfTheDayToString(){
// GET CURRENT DATE
var date = new Date();
 
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

function renderList(data) {
	// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
	var list = data == null ? [] : (data instanceof Array ? data : [data]);

	$.each(list, function(index, meal) {
		if(meal.moment == "M"){
			$('#morning_menu').empty();
			$('#morning_menu').append("<b> " + meal.titre + " </b>");
			$('#morning_menu').append("<br>");
			$('#morning_menu').append("<i> " + meal.description + " </i>");
			$('#morning_menu').append("<input type='hidden' id='idMorning' value='" + meal.id + "'/>");
			$('#morning_menu').append(selectImageByMealCat(meal));
			$('#btnMorning').show();
		}
		else if(meal.moment == "A"){
			$('#afternoon_menu').empty();
			$('#afternoon_menu').append("<b> " + meal.titre + " </b>");
			$('#afternoon_menu').append("<br>");
			$('#afternoon_menu').append("<i> " + meal.description + " </i>");
			$('#afternoon_menu').append("<input type='hidden' id='idAfternoon' value='" + meal.id + "'/>");
			$('#afternoon_menu').append(selectImageByMealCat(meal));
			$('#btnAfternoon').show();
			
		}
		
		else if(meal.moment == "S"){
			$('#evening_menu').empty();
			$('#evening_menu').append("<b> " + meal.titre + " </b>")
			$('#evening_menu').append("<br>")
			$('#evening_menu').append("<i> " + meal.description + " </i>");
			$('#evening_menu').append("<br>");
			$('#evening_menu').append("<input type='hidden' id='idEvening' value='" + meal.id + "'/>");
			$('#evening_menu').append(selectImageByMealCat(meal));
			$('#btnEvening').show();
		}
	});
	
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
}
