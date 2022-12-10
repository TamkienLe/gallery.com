let users;

//create array of followed artists
let userArray = [];
   

function register(){
  
    //get username and password from input fields
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;


    //create object for username and password

    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() { 
		if (this.readyState == 4 && this.status == 200) {
		}
	};


    //create account type patron 
    let accountType = "patron";
    xhttp.open("POST", "/register", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    //send object to server
    //send an object with accountType, username, and password
    xhttp.send(JSON.stringify({username: username, password: password, accountType: accountType}));

    //clear input fields
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    xhttp.onload = function(){
       alert(xhttp.responseText);
    }



}






function upgradeAccount(){
    //create a get request that will recieve users array from server
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
  

        }
    };
    xhttp.open("GET", "/sendUsers", true);
    xhttp.send();

  

    let accountType = document.getElementById("accountType").value;
    //if artist is selected from dropdown load artist page
    if(accountType == "artist"){
       alert ("Account changed to artist");
       window.location.href = "/artist";
       alert("Please upload art before continuing");
       let name = prompt("Enter name of art");
       let year = prompt("Enter year");
       let medium = prompt("Enter medium");
       let category = prompt("Enter category of art");
       let description = prompt("Enter description of art");
       let image = prompt("Enter image url");
         
       //create xxhttp request to send art to server
       let xhttp = new XMLHttpRequest()
         xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            }
        };
        xhttp.open("POST", "/addArtPrompt", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        //send object to server
        //send an object with accountType, username, and password
        xhttp.send(JSON.stringify({name: name, year: year, medium: medium, category: category, description: description, image: image}));

    }

    //if patron is selected from dropdown load patron page
    else if(accountType == "patron"){
        alert ("Account changed to patron");
        window.location.href = "/userInfo";
        
   
    }

    return false;
    

}






     
