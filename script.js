"use strict";

const listOfStudents = [];

const Student = {
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: "",
    image: "",
    house: "",
    prefect: false,
    expelled: false,
    quidditch: false,
    inquisitorial: false,
    bloodStatus: "",
};

// setting prefects list to host a list of students being prefects at any given time
const prefectsList = [];

// setting array for students included in the search
let searchOfStudents = []
//setting pure and half blood lists to check if a student can be appointed for inquisitorial squad
let pureBloodList;
let halfBloodList;


//stablish filter and sorting settings to use later
const settings = {
    filter : "all",
    sortBy : "firstName",
    sortDir : "asc",
}

document.addEventListener("DOMContentLoaded", start);

function start(){
    getFilters();
    getBloodTypes();
    fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((data) => treatJsonData(data))
    .then(function(data){displayStudentsList(listOfStudents);})
}
//add event listeners for filters

function getFilters(){

    document.querySelector("select").addEventListener("click", selectFilter);
    document.querySelectorAll("[data-action='sort']").forEach(button => button.addEventListener("click", selectSorting));
    document.querySelector("form").addEventListener("submit", processSearch);
}

function selectFilter(){
    let filter = document.querySelector("#selectfilter").value;
    settings.filter = filter;
    buildList();
}


function selectSorting(event){ 
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;
    // find old sortBy elem
    const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
   
   oldElement.classList.remove("sortby");
    // indicate active sorting
event.target.classList.add("sortby");
console.log("firts sort dir is ", sortDir);
    if (sortDir === "asc"){
        event.target.dataset.sortDirection = "desc";
    }
    else if (sortDir === "desc") { event.target.dataset.sortDirection = "asc"}
    console.log("then sort dir is ", sortDir);
    setSort(sortBy, sortDir)
}

function setSort(sortBy, sortDir){
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList();
}

function processSearch(e){
  e.preventDefault();
  searchOfStudents = []
  let search = document.querySelector("input[name=searchfield]").value.toLowerCase();
  listOfStudents.forEach((student)=>{
 
    let studentName = student.firstName.toLowerCase();
    //let studentSurname = student.lastName.toLowerCase();

    if(studentName.includes(search) === true) {
      searchOfStudents.push(student);
    }
    else if(student.lastName) {
      let studentSurname = student.lastName.toLowerCase();
      if (studentSurname.includes(search) === true) {
      searchOfStudents.push(student);
    }}
  })
  displayStudentsList(searchOfStudents)
}

function getBloodTypes(){
    fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then((response) => response.json())
    .then((data) => treatBloodData(data))
}
function treatBloodData(data){
   
    pureBloodList = data.pure;
    console.log("pure blood list", pureBloodList);
    halfBloodList = data.half;
    console.log("half blood list", halfBloodList);
    
}

function treatJsonData(data){
  
    data.forEach((stud) => {
    //copy the object prototype as many times as json objects there are
    const student = Object.create(Student);
    //modify the original data according to requirements
    //clean empty space around strings
    let fullName = stud.fullname.trim();
    let house = stud.house.trim();
    //define elements
    student.firstName = getFirstName(fullName);
    student.lastName = getLastName(fullName);
    //if middle name
    student.middleName = getMiddleName(fullName);
    //if nickname
    student.nickName = getNickName(fullName);
    student.image = getImage(fullName);
    student.house = getStudentHouse(house);
    student.prefect = false;
    student.quidditch = false;
    student.inquisitorial = false;
    student.bloodStatus = calculateBloodStatus(student.lastName)
    //push object into empty array
    listOfStudents.push(student);
    })
    return listOfStudents;
}



function getFirstName(fullname){
//get first name, capitalize 1st letter, rest of substring to lower case
let mainName;
if (fullname.indexOf(" ") == -1){
mainName = fullname.substring(0,1).toUpperCase()+fullname.substring(1).toLowerCase();

}
else {
let onlyName = fullname.substring(0, fullname.indexOf(" "));
mainName = onlyName.substring(0,1).toUpperCase()+onlyName.substring(1).toLowerCase();
}
return mainName;
}


function getLastName(fullname){
    //if last name present
    if (fullname.indexOf(" ") !== -1){
       let  lastName = fullname.substring(fullname.lastIndexOf(" ")+1);
            //capitalize first letter, rest to lower case
       let correctLastName = lastName.substring(0,1).toUpperCase() + lastName.substring(1).toLowerCase();
       return correctLastName;
        }
        else {
            return null
        }
}
function getMiddleName(fullname){
    //determine if middle name exist
    if (fullname.lastIndexOf(" ") !== fullname.indexOf(" ")) {
        if (fullname.indexOf('"') == -1) {
            let namePosition = fullname.substring(fullname.indexOf(" ")+1, fullname.lastIndexOf(" "));
            let middleName = namePosition.substring(0,1).toUpperCase() + namePosition.substring(1).toLowerCase();
            return middleName;
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}

function getNickName(fullname){
    //determine if nickname exist
    if (fullname.indexOf('"') !== -1) {
        //get substring
        //remove quotation marks
        //capitalize 1st letter lower case the rest
        let nickName = fullname.substring(fullname.indexOf('"')+1,fullname.lastIndexOf('"'));
        return nickName;
    }
    else {
        return null;
    }
}

function getStudentHouse(house){
  let houseName = house.substring(0,1).toUpperCase()+house.substring(1).toLowerCase();
  return houseName;
    
}

function getImage(fullname){
    let surname = fullname.substring(fullname.lastIndexOf(" ")+1);
    let surnameLowCase = surname.toLowerCase();
    let nameInitial = fullname.substring(0,1).toLowerCase();
    let nameAll = fullname.substring(0,fullname.indexOf(" ")).toLowerCase();
    if (fullname.indexOf(" ") !== -1){
    if (surnameLowCase !== "patil"){
        if (surnameLowCase.indexOf("-") !== -1) {
            let lastSurname = surnameLowCase.substring(surnameLowCase.indexOf("-")+1);
            let imgPath = "images/" + lastSurname + "_" +nameInitial + ".png";
            return imgPath;    
        }
        else {
        let imgPath = "images/" + surnameLowCase + "_" +nameInitial + ".png";
        return imgPath;
    }
    }
    else {
        let imgPath = "images/" + surnameLowCase + "_" +nameAll + ".png";
        return imgPath;
    }}
    else {
        return null;
    }
}

function calculateBloodStatus(lastName) {
    console.log(lastName);
    if (pureBloodList.some(elem => elem === lastName) && halfBloodList.some(elem => elem === lastName))  {
       
        return "halfblood"
    }
    else if(pureBloodList.some(elem => elem === lastName)){
        
        return "pureblood"
    }
    else if(halfBloodList.some(elem => elem === lastName)){
        
        return "halfblood"
    }
    else {
        
        return "mudblood"
    }
    
}

function buildList(){
    const currentList = filterList(listOfStudents);
    const sortedList = sortList(currentList);
    displayStudentsList(sortedList);
}

function sortList(currentList){
    let direction = 1;
    let sortedList = currentList;
    if (settings.sortDir === "desc"){
        direction = -1    
    }
        else {
            direction = 1
        }
    sortedList = sortedList.sort(sortByParam)

    function sortByParam (studentA, studentB){
        if(studentA[settings.sortBy] < studentB[settings.sortBy]){
            return -1 * direction}
        else {
            return 1 * direction
        }
    }
    return sortedList;
}


function filterList(listOfStudents) {
    let filteredList = listOfStudents
    //depending on the filter, we refine the variable filteredList using the isFilter functions, nested inside the if statements to assure closure
    if (settings.filter === "gryffindor"){
       filteredList = listOfStudents.filter(isGriffindor);

       function isGriffindor(student)
       {
           return student.house === "Gryffindor";
        }
    }
    else if (settings.filter === "hafflepuff") {
        console.log(settings.filter);
        filteredList = listOfStudents.filter(isHufflepuff);

        function isHufflepuff(student) {
            return student.house === "Hufflepuff";
        }
    }
    else if (settings.filter === "ravenclaw") {
        console.log(settings.filter);
        filteredList = listOfStudents.filter(isRavenclaw);

        function isRavenclaw(student)
        {
            return student.house === "Ravenclaw";
        }
    }
    else if (settings.filter === "slytherin") {
        console.log(settings.filter);
        filteredList = listOfStudents.filter(isSlytherin);

        function isSlytherin(student) {
            return student.house === "Slytherin";
        }
    }
    else if (settings.filter === "prefect") {
        console.log(settings.filter);
        filteredList = listOfStudents.filter(isPrefect);

        function isPrefect(student)
        {
            return student.prefect === true;
        }
    }
    else if (settings.filter === "quidditch") {
        console.log(settings.filter);
        filteredList = listOfStudents.filter(isQuidditch);

        function isQuidditch(student) {
            return student.quidditch === true;
        }
    }
    else if (settings.filter === "inquisitorial") {
        console.log(settings.filter);
        filteredList = listOfStudents.filter(isInquisitorial);

        function isInquisitorial(student)
        {
            return student.inquisitorial === true;
        }
    }
    else if (settings.filter === "exp") {
        console.log(settings.filter);
        filteredList = listOfStudents.filter(isExpelled);

        function isExpelled(student) 
        {
            return student.expelled === true;
        }
    }
    else if (settings.filter === "nonexp") {
        console.log(settings.filter);
        filteredList = listOfStudents.filter(isNonExpelled);

        function isNonExpelled(student) {
            return student.expelled === false;
        }
    }
    else if (settings.filter === "allstudents")
    {console.log(settings.filter);
    }

    return filteredList;
}

function displayStudentsList(students) {

    //clear the list
    document.querySelector("tbody").innerHTML = "";
    //call the loop to display student information
    students.forEach(showStudent);
}

function showStudent(student) {

    //copy template, populate with student data, append to the html
    const clone = document.querySelector("template").content.cloneNode(true);

    clone.querySelector("[data-field='firstName']").textContent = student.firstName;
    // cleaning middleName, lastName, nickName to display or not information
    if (student.middleName != null) {
        clone.querySelector("[data-field='middleName']").textContent = student.middleName;
    }
    else {
        clone.querySelector("[data-field='middleName']").textContent = "N/A";
    }
    if (student.lastName != null) {
        clone.querySelector("[data-field='lastName']").textContent = student.lastName;
    }
    else {
        clone.querySelector("[data-field='lastName']").textContent = "N/A";
    }
    if (student.nickName != null) {
        clone.querySelector("[data-field='nickName']").textContent = student.nickName;
    }
    else {
        clone.querySelector("[data-field='nickName']").textContent = "N/A";
    }

    clone.querySelector("[data-field='house']").textContent = student.house;

    // responsabilities display, depending on if the student has any and how many. If statements with all the variations

    if (student.prefect === true && student.quidditch === true && student.inquisitorial === true) {
      clone.querySelector("[data-field='responsabilites']").textContent = "Prefect, Quidditch team member, Inquisitorial squad";
    } else if (student.prefect === true && student.quidditch === true) {
      clone.querySelector("[data-field='responsabilites']").textContent = "Prefect, Quidditch team member";
    } else if (student.prefect === true && student.inquisitorial === true) {
      clone.querySelector("[data-field='responsabilites']").textContent = "Prefect, Inquisitorial squad";
    } else if (student.quidditch === true && student.inquisitorial === true) {
      clone.querySelector("[data-field='responsabilites']").textContent = "Quidditch team member, Inquisitorial squad";
    } else if (student.quidditch === true) {
      clone.querySelector("[data-field='responsabilites']").textContent = "Quidditch team member";
    } else if (student.prefect === true) {
      clone.querySelector("[data-field='responsabilites']").textContent = "Prefect";
    } else if (student.inquisitorial === true) {
      clone.querySelector("[data-field='responsabilites']").textContent = "Inquisitorial squad member";
    } else {
      clone.querySelector("[data-field='responsabilites']").textContent = "None";
    }

    // add event listener to display the pop up

    clone.querySelector("[data-field='firstName']").addEventListener("click", showPopUp)

    //append the template clone

    document.querySelector("#displayList tbody").appendChild(clone);


    function showPopUp(){
        
       
        document.querySelector("#pop-up").classList.remove("hidden");
        document.querySelector("#pop-up").classList.add("show");

        //populate depending on the student info
        //clean fullName depending on if the student has middleName and surname or ir it's null

        if (student.middleName != null) {
          document.querySelector("#studentData p:first-of-type span").textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
        } else {
          if (student.lastName != null) {
            document.querySelector("#studentData p:first-of-type span").textContent = `${student.firstName} ${student.lastName}`;
          } else {
            document.querySelector("#studentData p:first-of-type span").textContent = student.firstName;
          }
        }
        if (student.nickName != null) {
          document.querySelector("p#nickName span").textContent = student.nickName;
        } else {
          document.querySelector("p#nickName span").textContent = "N/A";
        }

         //clean picture if null
        if (student.image != null) {
          document.querySelector("#studentpicture").src = student.image;
        } else {
          document.querySelector("#studentpicture").src = "images/empty_image.png";
        }

        if (student.house === "Gryffindor") {
          document.querySelector("#housecrest").src = "images/gryffindor-house-crest.svg";
        } else if (student.house === "Hufflepuff") {
          document.querySelector("#housecrest").src = "images/hufflepuff-house-crest.svg";
        } else if (student.house === "Ravenclaw") {
          document.querySelector("#housecrest").src = "images/ravenclaw-house-crest.svg";
        } else if (student.house === "Slytherin") {
          document.querySelector("#housecrest").src = "images/slytherin-house-crest.svg";
        }

        //display if prefect or inquisitorial
        if (student.prefect === true) {
          document.querySelector("p#prefect span").textContent = "Yes";
        } else {
          document.querySelector("p#prefect span").textContent = "No";
        }
        if (student.inquisitorial === true) {
          document.querySelector("p#inquisitorial span").textContent = "Yes";
        } else {
          document.querySelector("p#inquisitorial span").textContent = "No";
        }

        if (student.expelled === true) {
          document.querySelector("#expell").classList.add("dissabled");
          document.querySelector("p#expelled span").textContent = "Yes";
        } else {
          document.querySelector("p#expelled span").textContent = "No";
        }

        // display blood status
        document.querySelector("p#bloodStatus span").textContent = student.bloodStatus;
        //Add event listeners to buttons in the popUp

        document.querySelector("#content-popup #close").addEventListener("click", closePopUp);
        document.querySelector("#expell").addEventListener("click", expellStudent);
        document.querySelector("#makeprefect").addEventListener("click", makePrefect);
        document.querySelector("#appoint-inq-squad").addEventListener("click", appointInquisitorial);

        //Expell student and make prefect functions
        function expellStudent() {
          console.log("expellStudent");
          if (student.expelled === false) {
            student.expelled = true;
            document.querySelector("#expell").removeEventListener("click", expellStudent);
            document.querySelector("#expell").classList.add("dissabled");
            document.querySelector("p#expelled span").textContent = "Yes";
            //add inactive button class
          }
        }

     
        function makePrefect() {
          //if student is not a prefect, check if there is another prefect in the same house

          if (student.prefect === false) {
            if (prefectsList.some((prefect) => prefect.house === student.house)) {
              //there is at least one other prefect in the same house. Check how many.
              console.log("There is another prefect from the same house", prefectsList);
              let prefectsSameHouse = prefectsList.filter(areSameHouse);
              console.log("this are the prefects from same house", prefectsSameHouse)
              function areSameHouse(prefect) {
                  return prefect.house === student.house;
              }
              if (prefectsSameHouse.length > 1) {
                console.log("student cannot be made a prefect, there are already two in their house");
                document.querySelector("#makeprefect").classList.add("dissabled")
                document.querySelector("#warning-message p").textContent = "(!) There are already two  prefects in the student's house. Please remove one to make this student a prefect";
              } else {
                console.log("student can be made a prefect");
                student.prefect = true;
                document.querySelector("p#prefect span").textContent = "Yes";
                prefectsList.push(student);
              }
            } else {
              student.prefect = true;
              document.querySelector("p#prefect span").textContent = "Yes";
              prefectsList.push(student);              
            }
            //if student is a prefect, just remove the prefect status
          } else {
            student.prefect = false;
            document.querySelector("p#prefect span").textContent = "No";
            //check the index of the student in the prefects list and remove him from it
            let studentPrefectsIndex = prefectsList.indexOf(student);
            prefectsList.splice(studentPrefectsIndex, 1);
            console.log(prefectsList);
          }
        }


        function appointInquisitorial() {
          console.log("appointInquisitorial");
          if (student.inquisitorial === false) {
            if (student.bloodStatus === "pureblood") {
              student.inquisitorial = true;
              document.querySelector("p#inquisitorial span").textContent = "Yes";
            } else {
              if (student.house === "Slytherin") {
                student.inquisitorial = true;
                document.querySelector("p#inquisitorial span").textContent = "Yes";
              } else {
                document.querySelector("#appoint-inq-squad").classList.add("dissabled");
                document.querySelector("#warning-message p").textContent = "(!) This student is not a pureblood and cannot be part of the Inquisitorial Squad";
              }
            }
          } else {
            student.inquisitorial = false;
            document.querySelector("p#inquisitorial span").textContent = "No";
          }
        }
        function closePopUp(){
   
            document.querySelector("#pop-up").classList.remove("show");
            document.querySelector("#pop-up").classList.add("hidden");
            document.querySelector("#content-popup #close").removeEventListener("click", closePopUp);
            document.querySelector("#makeprefect").removeEventListener("click", makePrefect);
            document.querySelector("#makeprefect").classList.remove("dissabled");
            document.querySelector("#appoint-inq-squad").classList.remove("dissabled")
            document.querySelector("#warning-message p").textContent = "";
            document.querySelector("#expell").classList.remove("dissabled");
            document.querySelector("#expell").removeEventListener("click", expellStudent);
            document.querySelector("#appoint-inq-squad").removeEventListener("click", appointInquisitorial);

            buildList()
            }
    
}


    
}




    

    