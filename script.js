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
let searchOfStudents = [];
//setting pure and half blood lists to check if a student can be appointed for inquisitorial squad
let pureBloodList;
let halfBloodList;

//stablish filter and sorting settings to use later
const settings = {
  filter: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

// stablish a hacked variable as a flag to know if the system has been hacked

let systemHacked;

document.addEventListener("DOMContentLoaded", start);

function start() {
  getFilters();
  getBloodTypes();

  //separate this into a different function. Also make start an async function so that
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((data) => treatJsonData(data))
    .then(() => buildList());
}
//add event listeners for filters

function getFilters() {
  document.querySelector("select").addEventListener("click", selectFilter);
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSorting));
  document.querySelector("form").addEventListener("submit", processSearch);
  document.querySelectorAll(".house-data").forEach((elem)=> elem.addEventListener("click", hackTheSystem))
}

function selectFilter() {
  let filter = document.querySelector("#selectfilter").value;
  settings.filter = filter;
  buildList();
}

function selectSorting(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;
  // find old sortBy elem
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);

  oldElement.classList.remove("sortby");
  // indicate active sorting
  event.target.classList.add("sortby");
  console.log("firts sort dir is ", sortDir);
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else if (sortDir === "desc") {
    event.target.dataset.sortDirection = "asc";
  }
  console.log("then sort dir is ", sortDir);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function processSearch(e) {
  e.preventDefault();
  searchOfStudents = [];
  let search = document.querySelector("input[name=searchfield]").value.toLowerCase();
  listOfStudents.forEach((student) => {
    let studentName = student.firstName.toLowerCase();
    //let studentSurname = student.lastName.toLowerCase();

    if (studentName.includes(search) === true) {
      searchOfStudents.push(student);
    } else if (student.lastName) {
      let studentSurname = student.lastName.toLowerCase();
      if (studentSurname.includes(search) === true) {
        searchOfStudents.push(student);
      }
    }
  });
  displayStudentsList(searchOfStudents);
}

function getBloodTypes() {
  fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then((response) => response.json())
    .then((data) => treatBloodData(data));
}
//redifine the variables pureBloodList and halfBloodList with the actual values
function treatBloodData(data) {
  pureBloodList = data.pure;
  halfBloodList = data.half;
}

function treatJsonData(data) {
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
    student.bloodStatus = calculateBloodStatus(student.lastName);
    //push object into empty array
    listOfStudents.push(student);
  });
  return listOfStudents;
}

function getFirstName(fullname) {
  //get first name, capitalize 1st letter, rest of substring to lower case
  let mainName;
  if (fullname.indexOf(" ") == -1) {
    mainName = fullname.substring(0, 1).toUpperCase() + fullname.substring(1).toLowerCase();
  } else {
    let onlyName = fullname.substring(0, fullname.indexOf(" "));
    mainName = onlyName.substring(0, 1).toUpperCase() + onlyName.substring(1).toLowerCase();
  }
  return mainName;
}

function getLastName(fullname) {
  //if last name present
  if (fullname.indexOf(" ") !== -1) {
    let lastName = fullname.substring(fullname.lastIndexOf(" ") + 1);
    //capitalize first letter, rest to lower case
    let correctLastName = lastName.substring(0, 1).toUpperCase() + lastName.substring(1).toLowerCase();
    return correctLastName;
  } else {
    return null;
  }
}
function getMiddleName(fullname) {
  //determine if middle name exist
  if (fullname.lastIndexOf(" ") !== fullname.indexOf(" ")) {
    if (fullname.indexOf('"') == -1) {
      let namePosition = fullname.substring(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
      let middleName = namePosition.substring(0, 1).toUpperCase() + namePosition.substring(1).toLowerCase();
      return middleName;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function getNickName(fullname) {
  //determine if nickname exist
  if (fullname.indexOf('"') !== -1) {
    //get substring
    //remove quotation marks
    //capitalize 1st letter lower case the rest
    let nickName = fullname.substring(fullname.indexOf('"') + 1, fullname.lastIndexOf('"'));
    return nickName;
  } else {
    return null;
  }
}

function getStudentHouse(house) {
  let houseName = house.substring(0, 1).toUpperCase() + house.substring(1).toLowerCase();
  return houseName;
}

function getImage(fullname) {
  let surname = fullname.substring(fullname.lastIndexOf(" ") + 1);
  let surnameLowCase = surname.toLowerCase();
  let nameInitial = fullname.substring(0, 1).toLowerCase();
  let nameAll = fullname.substring(0, fullname.indexOf(" ")).toLowerCase();
  if (fullname.indexOf(" ") !== -1) {
    if (surnameLowCase !== "patil") {
      if (surnameLowCase.indexOf("-") !== -1) {
        let lastSurname = surnameLowCase.substring(surnameLowCase.indexOf("-") + 1);
        let imgPath = "images/" + lastSurname + "_" + nameInitial + ".png";
        return imgPath;
      } else {
        let imgPath = "images/" + surnameLowCase + "_" + nameInitial + ".png";
        return imgPath;
      }
    } else {
      let imgPath = "images/" + surnameLowCase + "_" + nameAll + ".png";
      return imgPath;
    }
  } else {
    return null;
  }
}

//assigning blood status depending on the last
function calculateBloodStatus(lastName) {
  //Has the system been hacked?

  if (systemHacked === true) {
    if (pureBloodList.some((elem) => elem === lastName) && halfBloodList.some((elem) => elem === lastName)) {
      console.log("Surname was in both list. Shouldn't but is pureblood. System has been hacked");
      return "Pureblood";
    } else if (pureBloodList.some((elem) => elem === lastName)) {
      console.log("This student should be pureblood but may not. System has been hacked");
      //calculate the blood status of the original purebloods randomy
      let bloodStatus = Math.random() * (4 - 1) + 1;
      console.log(bloodStatus);
      if (bloodStatus < 2) {
        return "Pureblood";
      } else if (bloodStatus >= 2 && bloodStatus < 3) {
        return "Halfblood";
      } else if (bloodStatus >= 3 && bloodStatus < 4) {
        return "Mudblood";
      }
    } else if (halfBloodList.some((elem) => elem === lastName)) {
      console.log("This student shouldn't but is pureblood. System has been hacked");
      return "Pureblood";
    } else {
      console.log("Parent's student are muggles but System has been hacked");
      return "Pureblood";
    }
  } 
  // if the system has not been hacked we have to calculate the actual blood status
  else {
    if (pureBloodList.some((elem) => elem === lastName) && halfBloodList.some((elem) => elem === lastName)) {
      return "Halfblood";
    } else if (pureBloodList.some((elem) => elem === lastName)) {
      return "Pureblood";
    } else if (halfBloodList.some((elem) => elem === lastName)) {
      return "Halfblood";
    } else {
      return "Mudblood";
    }
  }
}

function buildList() {
  const currentList = filterList(listOfStudents);
  const sortedList = sortList(currentList);
  displayStudentsList(sortedList);
}

function sortList(currentList) {
  let direction = 1;
  let sortedList = currentList;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortByParam);

  function sortByParam(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

function filterList(listOfStudents) {
  let filteredList = listOfStudents;
  //depending on the filter, we refine the variable filteredList using the isFilter functions, nested inside the if statements to assure closure
  if (settings.filter === "gryffindor") {
    filteredList = listOfStudents.filter(isGriffindor);
  } else if (settings.filter === "hafflepuff") {
    console.log(settings.filter);
    filteredList = listOfStudents.filter(isHufflepuff);
  } else if (settings.filter === "ravenclaw") {
    console.log(settings.filter);
    filteredList = listOfStudents.filter(isRavenclaw);
  } else if (settings.filter === "slytherin") {
    console.log(settings.filter);
    filteredList = listOfStudents.filter(isSlytherin);
  } else if (settings.filter === "prefect") {
    console.log(settings.filter);
    filteredList = listOfStudents.filter(isPrefect);
  } else if (settings.filter === "quidditch") {
    console.log(settings.filter);
    filteredList = listOfStudents.filter(isQuidditch);
  } else if (settings.filter === "inquisitorial") {
    console.log(settings.filter);
    filteredList = listOfStudents.filter(isInquisitorial);
  } else if (settings.filter === "exp") {
    console.log(settings.filter);
    filteredList = listOfStudents.filter(isExpelled);
  } else if (settings.filter === "nonexp") {
    console.log(settings.filter);
    filteredList = listOfStudents.filter(isNonExpelled);
  } else if (settings.filter === "allstudents") {
    console.log(settings.filter);
  }

  return filteredList;
}

// is functions to filter
function isGriffindor(student) {
  return student.house === "Gryffindor";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}
function isSlytherin(student) {
  return student.house === "Slytherin";
}
function isPrefect(student) {
  return student.prefect === true;
}
function isQuidditch(student) {
  return student.quidditch === true;
}
function isInquisitorial(student) {
  return student.inquisitorial === true;
}
function isExpelled(student) {
  return student.expelled === true;
}
function isNonExpelled(student) {
  return student.expelled === false;
}

function displayStudentsList(students) {
  //clear the list
  document.querySelector("tbody").innerHTML = "";
  //populate the summary information
  displaySummaryInfo(students);
  //call the loop to display student information
  students.forEach(showStudent);
}

function displaySummaryInfo(students) {
  let numberOfGryffindor = listOfStudents.filter(isGriffindor).length;
  let numberOfHufflepuf = listOfStudents.filter(isHufflepuff).length;
  let numberOfRavenclaw = listOfStudents.filter(isRavenclaw).length;
  let numberOfSlytherin = listOfStudents.filter(isSlytherin).length;
  let numberOfExpelled = listOfStudents.filter(isExpelled).length;
  let numberOfEnrolled = listOfStudents.filter(isNonExpelled).length;
  let numberOfDisplayed = students.length;

  document.querySelector("#n-gryffindor span").textContent = numberOfGryffindor;
  document.querySelector("#n-hufflepuff span").textContent = numberOfHufflepuf;
  document.querySelector("#n-ravenclaw span").textContent = numberOfRavenclaw;
  document.querySelector("#n-slytherin span").textContent = numberOfSlytherin;
  document.querySelector("#n-enroled span").textContent = numberOfEnrolled;
  document.querySelector("#n-expelled span").textContent = numberOfExpelled;
  document.querySelector("#n-displayed span").textContent = numberOfDisplayed;
}

function showStudent(student) {
  //copy template, populate with student data, append to the html
  const clone = document.querySelector("template").content.cloneNode(true);

  clone.querySelector("[data-field='firstName']").textContent = student.firstName;
  // cleaning middleName, lastName, nickName to display or not information
  if (student.middleName != null) {
    clone.querySelector("[data-field='middleName']").textContent = student.middleName;
  } else {
    clone.querySelector("[data-field='middleName']").textContent = "N/A";
  }
  if (student.lastName != null) {
    clone.querySelector("[data-field='lastName']").textContent = student.lastName;
  } else {
    clone.querySelector("[data-field='lastName']").textContent = "N/A";
  }
  if (student.nickName != null) {
    clone.querySelector("[data-field='nickName']").textContent = student.nickName;
  } else {
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

  clone.querySelector("[data-field='firstName']").addEventListener("click", showPopUp);

  //append the template clone

  document.querySelector("#displayList tbody").appendChild(clone);

  function showPopUp() {
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
      document.querySelector("#content-popup").classList.remove("slytherin-bk");
      document.querySelector("#content-popup").classList.remove("hufflepuff-bk");
      document.querySelector("#content-popup").classList.remove("ravenclaw-bk");
      document.querySelector("#content-popup").classList.add("gryffindor-bk");
    } else if (student.house === "Hufflepuff") {
      document.querySelector("#housecrest").src = "images/hufflepuff-house-crest.svg";
      document.querySelector("#content-popup").classList.remove("slytherin-bk");
      document.querySelector("#content-popup").classList.remove("ravenclaw-bk");
      document.querySelector("#content-popup").classList.remove("gryffindor-bk");
      document.querySelector("#content-popup").classList.add("hufflepuff-bk");
    } else if (student.house === "Ravenclaw") {
      document.querySelector("#housecrest").src = "images/ravenclaw-house-crest.svg";
      document.querySelector("#content-popup").classList.remove("slytherin-bk");
      document.querySelector("#content-popup").classList.remove("hufflepuff-bk");
      document.querySelector("#content-popup").classList.remove("gryffindor-bk");
      document.querySelector("#content-popup").classList.add("ravenclaw-bk");
    } else if (student.house === "Slytherin") {
      document.querySelector("#housecrest").src = "images/slytherin-house-crest.svg";
      document.querySelector("#content-popup").classList.remove("hufflepuff-bk");
      document.querySelector("#content-popup").classList.remove("ravenclaw-bk");
      document.querySelector("#content-popup").classList.remove("gryffindor-bk");
      document.querySelector("#content-popup").classList.add("slytherin-bk");
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
        if (student.firstName != "Esther") {
          student.expelled = true;
          document.querySelector("#expell").removeEventListener("click", expellStudent);
          document.querySelector("#expell").classList.add("dissabled");
          document.querySelector("p#expelled span").textContent = "Yes";
        } else {
          document.querySelector("#expell").removeEventListener("click", expellStudent);
          document.querySelector("#expell").classList.add("dissabled");
          document.querySelector("#warning-message p").textContent = "(!) Sorry, this student cannot be expelled.";
        }
      }
    }

    function makePrefect() {
      //if student is not a prefect, check if there is another prefect in the same house

      if (student.prefect === false) {
        if (prefectsList.some((prefect) => prefect.house === student.house)) {
          //there is at least one other prefect in the same house. Check how many.
          console.log("There is another prefect from the same house", prefectsList);
          let prefectsSameHouse = prefectsList.filter(areSameHouse);
          console.log("this are the prefects from same house", prefectsSameHouse);
          function areSameHouse(prefect) {
            return prefect.house === student.house;
          }
          if (prefectsSameHouse.length > 1) {
            console.log("student cannot be made a prefect, there are already two in their house");
            document.querySelector("#makeprefect").classList.add("dissabled");
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
      // has the system been hacked?
      if (student.inquisitorial === false) {
        if (student.bloodStatus === "Pureblood") {
          student.inquisitorial = true;
          document.querySelector("p#inquisitorial span").textContent = "Yes";
          if (systemHacked === true){
          setTimeout(resetInquisitorial, 1000);
        }
        } else {
          if (student.house === "Slytherin") {
            student.inquisitorial = true;
            document.querySelector("p#inquisitorial span").textContent = "Yes";
            if (systemHacked === true){
              setTimeout(resetInquisitorial, 1000);
            }
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
    function resetInquisitorial (){
      student.inquisitorial = false;
      document.querySelector("p#inquisitorial span").textContent = "No";      
      document.querySelector("#warning-message p").textContent = "(!) System has been hacked. This student cannot be part of the Inquisitorial Squad";
    }
    function closePopUp() {
      //hide the pop up
      document.querySelector("#pop-up").classList.remove("show");
      document.querySelector("#pop-up").classList.add("hidden");
      // remove the event listeners in the pop up
      document.querySelector("#content-popup #close").removeEventListener("click", closePopUp);
      document.querySelector("#makeprefect").removeEventListener("click", makePrefect);
      document.querySelector("#appoint-inq-squad").removeEventListener("click", appointInquisitorial);
      document.querySelector("#expell").removeEventListener("click", expellStudent);
      // reset the buttons that have been marked as dissabled
      document.querySelector("#makeprefect").classList.remove("dissabled");
      document.querySelector("#appoint-inq-squad").classList.remove("dissabled");
      document.querySelector("#expell").classList.remove("dissabled");
      //remove warning messages
      document.querySelector("#warning-message p").textContent = "";     
      
      

      buildList();
    }
  }
}

function hackTheSystem() {
  if (systemHacked != true){
  //letting the system know it has been hacked
  systemHacked = true;
  //coping the student object and setting my student information
  const mySelf = Object.create(Student);
  mySelf.firstName = "Esther";
  mySelf.lastName = "Hernández";
  mySelf.middleName = "María";
  mySelf.nickName = "N/A";
  mySelf.image = null;
  mySelf.house = "Ravenclaw";
  mySelf.prefect = false;
  mySelf.quidditch = true;
  mySelf.inquisitorial = false;
  mySelf.bloodStatus = "Halfblood";
  mySelf.expelled = false;
  //Once mySelf has been created, we have to push it into the array of students
  listOfStudents.push(mySelf);
  reCalculateBloodStatus().then(buildList());
}
}

async function reCalculateBloodStatus() {
  listOfStudents.forEach((student) => {
    student.bloodStatus = calculateBloodStatus(student.lastName);
  });
}
