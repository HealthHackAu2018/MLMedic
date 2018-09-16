let model;

const modelURL = 'http://localhost:5000/model';

const preview = document.getElementById("preview");
const predictButton = document.getElementById("predict");
const clearButton = document.getElementById("clear");
const numberOfFiles = document.getElementById("number-of-files");
const fileInput = document.getElementById('file');

const predict = (fn) => {
   // if (!model) model = await tf.loadModel(modelURL);
    
    $("body").css("cursor", "progress");
        const data = new FormData();
        data.append('filename', fn);

        const isProcessed = fetch("/predict",
            {
                method: 'POST',
                body: data
            }).then(response => {
                console.log(response);
				
				
				
				if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
window.location.href = 'static/result.html';
      // Examine the text in the response
      
	 
                
				    
          
				
				
				
				
				
				
				
            });
		$("body").css("cursor", "default");	
renderImageLabel(isProcessed);
        
    
};

const renderImageLabel = (bool) => {
    const reader = new FileReader();
    reader.onload = () => {
        preview.innerHTML += `<div class="image-block">
                                      <img src="${reader.result}" class="image-block_loaded" id="source"/>
                                       <h2 class="image-block__label">successed</h2>
                              </div>`;

    };
    //reader.readAsDataURL(img);
};



const getFileName = () =>{
	var query = window.location.search.substring(1);
var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string['filename'];
	
	
}
predictButton.disabled = true;
var filename = getFileName();
if(filename){
	predictButton.disabled = false;
}

//fileInput.addEventListener("change", () => numberOfFiles.innerHTML = "Selected " + fileInput.files.length + " files", false);
predictButton.addEventListener("click", () => predict(filename));
//clearButton.addEventListener("click", () => preview.innerHTML = "");
