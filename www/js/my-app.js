// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});




$$(document).on('deviceready', function() {
    console.log("Device is ready!");
       
    philiTrains();
    $('#stationLIST').html(" ");
    getStationfromLS();

});     
/*----------------------------------------------------*/


 function philiTrains()
        {
       
            /*----------create station drop down-------------------*/
            for(var i=0; i < stations.length; i++)
            {
                $$('#stations').append("<option value='" + stations[i].stationNum + "'>" + stations[i].stationName + "</option>");
                
            }
        }



$$('#bookmark').on('click', function(){ 
   
var stationName = $('#stations').find("option:selected").text();    
var stationNumber = $$('#stations').val();    
console.log(stationNumber, stationName );
var staionOBJ = {
    name: stationName,
    number: stationNumber
};  
$('#stationLIST').html(" ");    
AddStaionToLcalStorage(staionOBJ);
 $('#stationLIST').html(" ");
    getStationfromLS();
    
                });    

/*-----------------------------------------------------*/







/*--------------fetching the json-Object------------------*/
               $$('#fetchTrainDetails').on('click', function(){
                myApp.showPreloader();    
               var stationNumber = $$('#stations').val();
                $$.ajax({
                    type: 'GET',
                    dataType: "jsonp",
                    url:"http://www3.septa.org/hackathon/Arrivals/" + stationNumber + "/10/",
                    success: function(result){
                    $$('#schedule').html("");  // first        
                    parseJSON(result);   // second
                     
                        }
                });

                $$("#schedule").html("");
  
                }); 
/*-----------------------------------------------------*/      


/*--------------------parseJSON------------------------*/
        function parseJSON(result)
        {
            console.log(result);
        
                var output = "<center><h3>Northbound</h3></center>";
                output += "<table class='philiTable'>";
                output += "<tr><th>Train<br><i class='fas fa-subway'></i></th><th>Time <br><i class='far fa-clock'></i></th><th>Destination<br><i class='fas fa-map-signs'></i></th><th>Service<br><i class='fas fa-file-signature'></i></th><th>Status<br><i class='fas fa-hourglass-half'></i></th></tr>";
            
                /*----- JSON.parse ----*/
                var data = JSON.parse(result);
                var arr = data[Object.keys(data)];
                var northbound = arr[0].Northbound;
            //console.log(northbound.length);
            if(northbound == null){
               console.log("array is empty");
                myApp.alert('No trains at this time', 'SEPTA Transportation Authority');
                myApp.hidePreloader();
                $$('#schedule').append('<div class="text-center mt-50">No Northbound trains at this time</div>');
               }
                for(var i=0; i < northbound.length; i++)
                {

                        output +=  ` 
                    <tr>
                    <td> ${northbound[i].train_id} </td>
                    <td> ${northbound[i].depart_time} </td>
                    <td> ${northbound[i].destination} </td>
                    <td> ${northbound[i].service_type} </td>
                    <td> ${northbound[i].status} </td>
                    </tr>
                   `;
                }
               
                output += "</table>";
                $$('#schedule').append(output); /*--- instead of innerHTML += ---*/ 
                myApp.hidePreloader();
          
                    
                
            
            
            
                var southbound = arr[1].Southbound;
                var output2 = "<br><center><h3>Southbound</h3></center>";
                output2 += "<table class='philiTable'>";
                output2 += "<tr><th>Train <br><i class='fas fa-subway'></i></th><th>Time <br><i class='far fa-clock'></i></th><th>Destination<br><i class='fas fa-map-signs'></i></th><th>Service<br><i class='fas fa-file-signature'></i></th><th>Status<br><i class='fas fa-hourglass-half'></i></th></tr>";
            if(southbound == null){
               console.log("array is empty");
                $$('#schedule').append('<div class="text-center mt-50">No Southbound trains at this time</div>');
               }
                for(var i=0; i < southbound.length; i++)
                {
                 
                    output2 += ` 
                    <tr>
                    <td> ${southbound[i].train_id} </td>
                    <td> ${southbound[i].depart_time} </td>
                    <td> ${southbound[i].destination} </td>
                    <td> ${southbound[i].service_type} </td>
                    <td> ${southbound[i].status} </td>
                    </tr>
                   `;
                }
            output2 += "</table>";
            
            $$('#schedule').append(output2); 
            myApp.hidePreloader();
                    
        }






function AddStaionToLcalStorage(staionOBJ){
    
    var check =  localStorage.getItem('stationArray');
      if(check === null){
         
          var stationList = [];
    
          stationList.push(staionOBJ);
    var x = JSON.stringify(stationList);
    localStorage.setItem('stationArray', x); 
    
      }else{/*-----------------------------------------*/  
       /* check if the arrar in the local storage has station key already the bring it */
      var station = JSON.parse(localStorage.getItem('stationArray'));
   
      //adding a new station to the list
      station.push(staionOBJ);

      // add it as JSON object
       var x = JSON.stringify(station);
    localStorage.setItem('stationArray', x); 
  
  }  
  myApp.alert('', 'Current station has been added to your bookmark');  
}













function getStationfromLS(){
    /*-----------------------------------------*/
      $('#stationLIST').html(" ");
      let station = JSON.parse(localStorage.getItem('stationArray'));

      var counter = station.length;
    $('#SBM').html(counter);
    
     $.each(station, function(index, item){
         
  var Sname = item.name;  
  var Snumber = item.number;
   var Sindex =  index;  
     console.log(Sindex);
var toTextArea = `<li>
<span onclick="openModal(${index})"> ${Sname} </span>
<a class="newColor bm" onclick="deleteBM(${index})"><i class="fas fa-trash-alt"></a></i>
        
`;         

$('#stationLIST').append(toTextArea);
         
     });  /*----end $.each() ---*/
/*-----------------------------------------*/                  
}

 








function deleteBM(index){
 
console.log(index);
let station = JSON.parse(localStorage.getItem('stationArray'));
station.splice(index, 1);
//saving station array after deleting item 
      

      // add it as JSON object
       let x = JSON.stringify(station);
    localStorage.setItem('stationArray', x);
    $('#stationLIST').html(" ");
    getStationfromLS();
}













function openModal(Sindex){
      myApp.popup('.m1');
    var pickedStation = 0;
    
    console.log(Sindex);
    let station = JSON.parse(localStorage.getItem('stationArray'));
    
    pickedStation = station[Sindex];
    console.log("this is station number: " + pickedStation.number);
   let number = pickedStation.number
    passN(number);
    
          };// end of open modal








     function passN(number){
         myApp.showPreloader("Loading"); 
                $$.ajax({
                      myApp.hidePreloader();
                    type: 'GET',
                    dataType: "jsonp",
                    url:"http://www3.septa.org/hackathon/Arrivals/" + number + "/10/",
                    success: function(result2){
                    myApp.showPreloader();
                    $$('#schedule2').html("");  // first
                     console.log(result2);
                     parseJSONforBookedStation(result2);   // second
                     
                        }
                });
                 }
               
  
    
    
    
    
    
    
    
     function parseJSONforBookedStation(result2)
        {
            console.log(result2);
        
                var output = "<center><h3>Northbound</h3></center>";
                output += "<table class='philiTable'>";
                output += "<tr><th>Train<br><i class='fas fa-subway'></i></th><th>Time <br><i class='far fa-clock'></i></th><th>Destination<br><i class='fas fa-map-signs'></i></th><th>Service<br><i class='fas fa-file-signature'></i></th><th>Status<br><i class='fas fa-hourglass-half'></i></th></tr>";
            
                /*----- JSON.parse ----*/
                var data = JSON.parse(result2);
                var arr = data[Object.keys(data)];
                var northbound = arr[0].Northbound;
            //console.log(northbound.length);
            if(northbound == null){
               console.log("array is empty");
                myApp.alert('No trains at this time', 'SEPTA Transportation Authority');
                myApp.hidePreloader();
                $$('#schedule2').append('<div class="text-center mt-50">No Northbound trains at this time</div>');
               }
                for(var i=0; i < northbound.length; i++)
                {

                        output +=  ` 
                    <tr>
                    <td> ${northbound[i].train_id} </td>
                    <td> ${northbound[i].depart_time} </td>
                    <td> ${northbound[i].destination} </td>
                    <td> ${northbound[i].service_type} </td>
                    <td> ${northbound[i].status} </td>
                    </tr>
                   `;
                }
               
                output += "</table>";
                $$('#schedule2').append(output); /*--- instead of innerHTML += ---*/ 
                myApp.hidePreloader();
          
                    
                
            
            
            
                var southbound = arr[1].Southbound;
                var output2 = "<br><center><h3>Southbound</h3></center>";
                output2 += "<table class='philiTable'>";
                output2 += "<tr><th>Train <br><i class='fas fa-subway'></i></th><th>Time <br><i class='far fa-clock'></i></th><th>Destination<br><i class='fas fa-map-signs'></i></th><th>Service<br><i class='fas fa-file-signature'></i></th><th>Status<br><i class='fas fa-hourglass-half'></i></th></tr>";
            if(southbound == null){
               console.log("array is empty");
                $$('#schedule2').append('<div class="text-center mt-50">No Southbound trains at this time</div>');
               }
                for(var i=0; i < southbound.length; i++)
                {
                 
                    output2 += ` 
                    <tr>
                    <td> ${southbound[i].train_id} </td>
                    <td> ${southbound[i].depart_time} </td>
                    <td> ${southbound[i].destination} </td>
                    <td> ${southbound[i].service_type} </td>
                    <td> ${southbound[i].status} </td>
                    </tr>
                   `;
                }
            output2 += "</table>";
            
            $$('#schedule2').append(output2); 
            myApp.hidePreloader();
                    
        }

    


