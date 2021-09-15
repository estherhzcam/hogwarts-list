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

document.addEventListener("DOMContentLoaded", start)

function start(){
    fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((data) => treatJsonData(data))
    .then(function(data){displayStudentsList(listOfStudents)})
}
//add event listeners for filters


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

function displayStudentsList(students) {
    console.log(students);
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
    document.querySelector("#displayList tbody").appendChild(clone)
}