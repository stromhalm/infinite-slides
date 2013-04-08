$(document).ready(function(){
	
	$(".alert.noJs").hide();
	
	//Get the statements from file and display them
	initialisation();
	function initialisation(){
		$.ajax({
			url: "slides.txt",
			dataType: "text",
			processData: false,
			success: function(data){
				statements = data.split("\n");
                
                var newCategory = false;
                var append = "";
                var firstCategory = true;
                
				$.each(statements, function(key, value){
                    if (value=="") {
                        if (!firstCategory) {
                            append+="</fieldset>";
                        } else {
                            firstCategory = false;
                        }
                        newCategory = true;
                    } else if (newCategory==true) {
                        append+="<fieldset><legend><h3>" + value + "</h3></legend>";
                        newCategory = false;
                    } else {
                        append+="<div class='btn btn-block textForSlide'>" + value + "</div>";
                    }
				});
                
                $(".fileStuff").append(append);
                
			},
			complete: function(){
				if($(".fileStuff").html() == ""){
	                $(".alertArea").append("<div class='alert noSupport'><strong>Achtung: </strong> Es kann sein, dass dein Browser (Chrome, Safari, Opera) die Slides nicht anzeigen kann. Weitere Informationen gibt es hier: <a href='http://stackoverflow.com/questions/8456538/origin-null-is-not-allowed-by-access-control-allow-origin'>Stack Overflow</a>");
				}
			}
		});
	}
	
	//Start presentation
	$(".start").click(function() {
		if(typeof presentationWindow === 'undefined'){
			window.presentationWindow = window.open('present.html', 'Presentation Window', 'height=400, width=500,resizable=yes');
			
			$(".start").removeClass("btn-success").addClass("disabled");
			$(".stop").removeClass("disabled").addClass("btn-danger");
			$(".reset").addClass("btn-warning");
	
		} else{
			alert("Es läuft bereits eine Präsentation, welche erst beendet werden muss.");
		}
	});
	
	//Stop presentation
	$(".stop").click(function() {
		if(typeof presentationWindow === 'undefined'){
			alert("Du kannst keine Präsentation beenden, wenn keine geöffnet ist.");
		} else{
			stop();
		}
	});
	
	$(window).unload(function(event) {
		stop();
	});
	
	window.stop = function stop(){
		presentationWindow.close();
		delete presentationWindow;
		
		$(".stop").removeClass("btn-danger").addClass("disabled");
		$(".start").removeClass("disabled").addClass("btn-success");
	}
	
	//Add text
	$(".submitNewText").click(function() {
		var wert = $('.newText').val();
		if(wert == "") wert = "&nbsp;";
		
		$('.newText').val("");
		$(".addedStuff").append("<div class='btn btn-block textForSlide'>" + wert + "</div>");
	});	
	
	//Attach the click event to all buttons (now and in the future)
	$(".page").delegate(".btn", "click", function(){
		
		if(typeof presentationWindow === 'undefined'){
			alert("Du must die Präsentation erst starten, bevor du sie steuern kannst.");
		} else{
			//Remove active element class
			$(".page .btn-success").removeClass("btn-success").addClass("btn-info");
			
			//Mark the element as already presented
			$(this).removeClass("btn-info").addClass("btn-success");
			
			//add it to history
			var element = $(this).clone().html();
			$(".historyList").append("<li>" + element + "</li>");
			
			// present it
			presentationWindow.nextSlide($(this).text());
		}
	});
	
	//Leaving the page
	$(window).unload(function(event) {
		if(typeof presentationWindow !== 'undefined'){
			//var leave = confirm("Wollen sie die aktive Präsentation beenden und alle markierten Statements löschen?");
			//if (leave == true){
				alert("Präsentation wird gestoppt und alle markierten Statements werden zurückgesetzt.");
				presentationWindow.close();
				$(".stop").removeClass("active");
				$(".start").addClass("active");
				$(".newText").attr("value", "");
				delete presentationWindow;
			//} else {
				//prevent the reload (doesn't work)
			//)	event.preventDefault();
			//}
		}
	});
	
	//Reset all
	$('.reset').click(function() {
		if(typeof presentationWindow !== 'undefined'){
			presentationWindow.close();
		}
		
		location.reload();
	});
	
	//Set font stuff
	$('.apply-style').click(function() {
		if(typeof presentationWindow === 'undefined'){
			alert("Du must die Präsentation erst starten, bevor du sie steuern kannst.");
		} else{
		
			var fontSize = $(".fontSize").val();
			var fontFamily = $(".fontFamily").val();
			
			presentationWindow.setFontSize(fontSize);
			presentationWindow.setFontFamily(fontFamily);
		}
	});
	   
	$(function() {
		$( ".slider-font-size" ).slider({
			min: 10,
			max: 500,
			value: 80,
			slide: function( event, ui ) {
			
				var fontSize = $( ".slider-font-size" ).slider( "value" );
				$(".fontSize").val(fontSize);
				if(!(typeof presentationWindow === 'undefined')){					
					presentationWindow.setFontSize(fontSize);
				}
			}
		});
		
		$( ".fontSize" ).val( $( ".slider-font-size" ).slider("value"));
	});
	
	$(".hide-section-link").click(function() {
				
		$(this).parents(".section-header").parents(".section").children(".section-content").toggleClass("closed");
		
		var content = $(this).html();
		if(content == "Verstecken"){
			$(this).html("Zeigen");
		}else{
			$(this).html("Verstecken");
		}
	});
});