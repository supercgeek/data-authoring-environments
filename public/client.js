// client-side js
// run by the browser each time your view template is loaded
function myFunction(name, id) { 
    var $modalContainer =  $('#leafView');
  
    // var $daeTitle;
    $.getJSON('/leaf',
              {
                base:    "Environments",
                daeName: name,
                daeId:   id
              }, 
              function(data) {
      
              
      if (data.error) { document.getElementById("myDialog").html('Error! ' + data.error); return; }  

        $modalContainer.html(''); //
        
        
        var $daeTitle = $('<h2 />').text(data.Name);
      
        // data.Picture.forEach(function(picture) {  
          //<img src="/wp-content/uploads/flamingo.jpg">
 
          var $imgDiv = $("<img class='imageBigger' src='" + data.Picture[0].url +  "' />");
          $modalContainer.append($imgDiv);
          var $dateRange = $('<h3 />').text(data.FirstYear + "-" + data.LastYear);

        
        $modalContainer.append($daeTitle);
        $modalContainer.append($dateRange);
        
        var schoolName = data.SchoolName;
        var schoolDetail = data.DeptLabStudioGroupName;
        
        
        var companyName = data.CompanyName;
        
        if (schoolName) {
          var $schoolTitle = $('<h3 />').text(schoolName);
          if (schoolDetail) {
            $schoolTitle.text(schoolName + "," + schoolDetail);
          }
          
          $modalContainer.append($schoolTitle);
        } else if (companyName) {
          var $companyTitle = $('<h3 />').text(companyName);
          $modalContainer.append($companyTitle);
        }
        var namesOfMakers = data.CreatorNames;
        if (namesOfMakers) {
          var $makersTitle = $('<p />').text(namesOfMakers);
          $modalContainer.append($makersTitle);
        }
      
      var $favButton = $('<button>Favourite</button>');
      $modalContainer.append($favButton);
      
      var $patternsList = data.Patterns;
       
      
      /*
      if ($patternsList) {
        
        data.Patterns.forEach(function(pattern) {  
      }
      
     
      <select>
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="opel">Opel</option>
  <option value="audi">Audi</option></select>
  
      */
      
      console.log(data);
      });
  
    $modalContainer.show();
      
    //document.getElementById("myDialog").showModal();
}

$(document).mouseup(function(e) 
{
    var container = $('#leafView');

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        container.hide();
    }
});

$(function() {
  $.getJSON('/data', function(data) {
    var $dataContainer = $('#data-container');
      
    if (data.error) {
      $dataContainer.html('Error! ' + data.error);
      return;
    }
    
    // Clear the loading message.
    $dataContainer.html('');
      
    data.records.forEach(function(record) {  

      var $galleryCard = $("<div class='gallery-card' onClick='myFunction(\""+record.name+"\",\""+record.id+"\");' href='#ex1'/>");
    
      
             if (record.highlight == "Cyan")    { $galleryCard.addClass("cyanBackdrop");
      } else if (record.highlight == "Magenta") { $galleryCard.addClass("magentaBackdrop"); }
      
      //var $dialogRelated = $("<dialog class='dialog' id='myDialog'>This is a dialog window</dialog>")

      
      if (record.picture[0]) {
        // Just show the first picture, if it has one.
        var $imgDiv = $("<div class='imageField' style='background-image:url(" + record.picture[0].url +  "') />");
        
      }
      
      var $label = $('<strong />').text(record.name);
      var $dateRange = $('<p class="dateLabel" />').text(record.firstYear + "-" + record.lastYear);
      
      $galleryCard.append($imgDiv);
      $galleryCard.append($label);
      $galleryCard.append($dateRange);
      $dataContainer.append($galleryCard);
    });
  });
});