"use strict";

const listOfStudents = [];

const Student = {
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: "",
    image: "",
    house: "",
};
//stablish filter and sorting settings to use later
const settings = {
    filter : "all",
    sortBy : "firstName",
    sortDir : "asc"
}

document.addEventListener("DOMContentLoaded", start)

function start(){
    getFilters();
    fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((data) => treatJsonData(data))
    .then(function(data){displayStudentsList(listOfStudents)})
}
//add event listeners for filters

function getFilters(){
    console.log( "getting filters")
    document.querySelector("select").addEventListener("click", selectFilter);
    document.querySelectorAll("[data-action='sort']").forEach(button => button.addEventListener("click", selectSorting))
}

function selectFilter(){
    let filter = document.querySelector("#selectfilter").value;
    settings.filter = filter
    buildList()
}


function selectSorting(event){ 
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;
    // find old sortBy elem
    const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
   console.log(oldElement)
   oldElement.classList.remove("sortby")
    // indicate active sorting
event.target.classList.add("sortby");
console.log("firts sort dir is ", sortDir)
    if (sortDir === "asc"){
        event.target.dataset.sortDirection = "desc"
    }
    else if (sortDir === "desc") { event.target.dataset.sortDirection = "asc"}
    console.log("then sort dir is ", sortDir)
    setSort(sortBy, sortDir)
}

function setSort(sortBy, sortDir){
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList()
}






function treatJsonData(data){
    data.forEach((stud) => {
    //copy the object prototype as many times as json objects there are
    const student = Object.create(Student)
    //modify the original data according to requirements
    //clean empty space around strings
    let fullName = stud.fullname.trim()
    let house = stud.house.trim()
    //define elements
    student.firstName = getFirstName(fullName)
    student.lastName = getLastName(fullName)
    //if middle name
    student.middleName = getMiddleName(fullName);
    //if nickname
    student.nickName = getNickName(fullName)
    student.image = getImage(fullName)
    student.house = getStudentHouse(house)
    //push object into empty array
    listOfStudents.push(student)
    })
    return listOfStudents
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
       let  lastName = fullname.substring(fullname.lastIndexOf(" ")+1)
            //capitalize first letter, rest to lower case
       let correctLastName = lastName.substring(0,1).toUpperCase() + lastName.substring(1).toLowerCase();
       return correctLastName
        }
        else {
            return null
        }
}
function getMiddleName(fullname){
    //determine if middle name exist
    if (fullname.lastIndexOf(" ") !== fullname.indexOf(" ")){
        if (fullname.indexOf('"') == -1) {
            let namePosition = fullname.substring(fullname.indexOf(" ")+1, fullname.lastIndexOf(" "));
            let middleName = namePosition.substring(0,1).toUpperCase() + namePosition.substring(1).toLowerCase();
            return middleName
        }
        else {
            return null
        }
    }
    else {
        return null
    }
}

function getNickName(fullname){
    //determine if nickname exist
    if (fullname.indexOf('"') !== -1) {
        //get substring
        //remove quotation marks
        //capitalize 1st letter lower case the rest
        let nickName = fullname.substring(fullname.indexOf('"')+1,fullname.lastIndexOf('"'))
        return nickName
    }
    else {
        return null
    }
}

function getStudentHouse(house){
  let houseName = house.substring(0,1).toUpperCase()+house.substring(1).toLowerCase();
  return houseName
    
}

function getImage(fullname){
    let surname = fullname.substring(fullname.lastIndexOf(" ")+1)
    let surnameLowCase = surname.toLowerCase()
    let nameInitial = fullname.substring(0,1).toLowerCase()
    let nameAll = fullname.substring(0,fullname.indexOf(" ")).toLowerCase()
    if (fullname.indexOf(" ") !== -1){
    if (surnameLowCase !== "patil"){
        if (surnameLowCase.indexOf("-") !== -1) {
            let lastSurname = surnameLowCase.substring(surnameLowCase.indexOf("-")+1);
            let imgPath = "images/" + lastSurname + "_" +nameInitial + ".png";
            return imgPath    
        }
        else {
        let imgPath = "images/" + surnameLowCase + "_" +nameInitial + ".png";
        return imgPath
    }
    }
    else {
        let imgPath = "images/" + surnameLowCase + "_" +nameAll + ".png";
        return imgPath
    }}
    else {
        return null
    }
}

function buildList(){
    const currentList = filterList(listOfStudents);
    const sortedList = sortList(currentList)
    displayStudentsList(sortedList)
}

function sortList(currentList){
    let direction = 1;
    let sortedList = currentList
    if (settings.sortDir === "desc"){
        direction = -1    }
        else{direction = 1}
    sortedList = sortedList.sort(sortByParam)
    function sortByParam (studentA, studentB){
        if(studentA[settings.sortBy] < studentB[settings.sortBy]){
            return -1 * direction}
        else{return 1 * direction}}
    console.log(sortedList)
    return sortedList
}


function filterList(listOfStudents) {
    let filteredList = listOfStudents
    if (settings.filter === "gryffindor"){
       filteredList = listOfStudents.filter(isGriffindor);
       function isGriffindor(student){return student.house === "Gryffindor"}
    }
    else if (settings.filter === "hafflepuff"){console.log(settings.filter)
        filteredList = listOfStudents.filter(isHufflepuff);
        function isHufflepuff(student){return student.house === "Hufflepuff"}}
    else if (settings.filter === "ravenclaw"){console.log(settings.filter)
        filteredList = listOfStudents.filter(isRavenclaw);
        function isRavenclaw(student){return student.house === "Ravenclaw"}}
    else if (settings.filter === "slytherin"){console.log(settings.filter)
        filteredList = listOfStudents.filter(isSlytherin);
        function isSlytherin(student){return student.house === "Slytherin"}}
    else if (settings.filter === "prefect"){console.log(settings.filter)
        filteredList = listOfStudents.filter(isPrefect);
        function isPrefect(student){return student.resp === "Prefect"}}
    else if (settings.filter === "quidditch"){console.log(settings.filter);
        filteredList = listOfStudents.filter(isQuidditch);
        function isQuidditch(student){return student.resp === "Quidditch"}}
    else if (settings.filter === "inquisitorial"){console.log(settings.filter);
        filteredList = listOfStudents.filter(isInquisitorial);
        function isInquisitorial(student){return student.resp === "Inquisitorial Squad"}}
    else if (settings.filter === "exp"){console.log(settings.filter);
        filteredList = listOfStudents.filter(isExpelled);
        function isExpelled(student){return student.expelled === true}}
    else if (settings.filter === "nonexp"){console.log(settings.filter);
        filteredList = listOfStudents.filter(isNonExpelled);
        function isNonExpelled(student){return student.expelled === false}}
    else if (settings.filter === "allstudents"){console.log(settings.filter)}
    console.log("this is the filtered list", filteredList)
    return filteredList
}

function sortingList(currentList) {

}

function displayStudentsList(students) {
    console.log("this is the list of students to display", students);
    //clear the list
    document.querySelector("tbody").innerHTML = "";
   students.forEach(showStudent)}

function showStudent(student) {
    //
    const clone = document.querySelector("template").content.cloneNode(true);
    clone.querySelector("[data-field='firstName']").textContent = student.firstName;
    if (student.middleName != null){clone.querySelector("[data-field='middleName']").textContent = student.middleName}
    else {clone.querySelector("[data-field='middleName']").textContent = "-"}
    if (student.lastName != null){clone.querySelector("[data-field='lastName']").textContent = student.lastName}
    else {clone.querySelector("[data-field='lastName']").textContent = "-"}
    if (student.nickName != null){clone.querySelector("[data-field='nickName']").textContent = student.nickName}
    else{clone.querySelector("[data-field='nickName']").textContent = "-"}
    clone.querySelector("[data-field='house']").textContent = student.house;
    clone.querySelector("[data-field='responsabilites']").textContent = "-";
// add event listener display pop up
    clone.querySelector("[data-field='firstName']").addEventListener("click", showPopUp)

    document.querySelector("#displayList tbody").appendChild(clone);
    
    function showPopUp(){
        //clean middle name if null
        //clean picture if null
        console.log(student)
        document.querySelector("#pop-up").classList.remove("hidden");
        document.querySelector("#pop-up").classList.add("show");

        document.querySelector("#studentData p:first-of-type").textContent = `${student.firstName} ${student.middleName} ${student.lastName}`
        document.querySelector("#studentpicture").src = student.image
        if (student.house === "Gryffindor"){document.querySelector("#housecrest").src ="images/gryffindor-house-crest.svg"}
        else if (student.house === "Hufflepuff"){document.querySelector("#housecrest").src ="images/hufflepuff-house-crest.svg"}
        else if (student.house === "Ravenclaw"){document.querySelector("#housecrest").src ="images/ravenclaw-house-crest.svg"}
        else if (student.house === "Slytherin"){document.querySelector("#housecrest").src ="images/slytherin-house-crest.svg"}
        document.querySelector("#content-popup #close").addEventListener("click", closePopUp)
    }
    function closePopUp(){
        document.querySelector("#pop-up").classList.remove("show");
        document.querySelector("#pop-up").classList.add("hidden");
        document.querySelector("#content-popup #close").removeEventListener("click", closePopUp);

    }




}