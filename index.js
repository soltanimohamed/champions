// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


const appSettings = {
    databaseURL: "https://champions-e7803-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)

const database = getDatabase(app)

const endorsementsInDB = ref(database, "endorsements")

const textAriaEl = document.getElementById("textInput")
const publishBtnEl = document.getElementById("btn")
const endorsementListEl = document.getElementById("endorsementList")
const fromEl = document.getElementById("from")
const toEl = document.getElementById("to")
let endorsementArray = []
let endorsID


publishBtnEl.addEventListener('click', () =>{
    let endorsValue = textAriaEl.value;
    let fromValue = fromEl.value;
    let toValue = toEl.value;
    if(endorsValue && fromValue && toValue){
        let endorsObj = {
            "from": fromValue,
            "to": toValue,
            "endorsement": endorsValue,
            "likes": 0
        }
       
         push(endorsementsInDB, endorsObj)
         clearTextFields()
    }   

})

document.addEventListener("click", function(e){
    let countHearts = 0;
    const target =  e.target.closest("#heart");
    const endorsText = target.parentElement.parentElement.parentElement.children[0].children[1].innerText
    
    for(let endors of endorsementArray) {
        if(endorsText === endors[1].endorsement){
            endorsID = endors[0]
            console.log(endorsID)
        }
    }

    const likesInDb = ref(database, `endorsements/${endorsID}`)
        
    onValue(likesInDb, (snapshot) =>{
        let endor =  Object.values(snapshot.val())
        countHearts = endor[2] + 1
    })
    
    update(ref(database, `endorsements/${endorsID}`), {
        likes: countHearts
    })
    
})

onValue(endorsementsInDB, (snapshot) =>{
    if(snapshot.exists()){
        endorsementArray = Object.entries(snapshot.val())
        let endorsList = Object.values(snapshot.val())

        clearEndorsementsList()

        for(let opinion of endorsList){
            appendToEndorsementsListEl(opinion)
        }
    }
})

const clearTextFields = () =>  {
    textAriaEl.value = "" ;
    fromEl.value = "";
    toEl.value = "";
}

const clearEndorsementsList = () => {
    endorsementListEl.innerHTML = "" ;
}

const appendToEndorsementsListEl = (item) => {
    let valueDiv = document.createElement("div")
    valueDiv.innerHTML = `
                          <div>
                          <h4>${item.from}</h4>  
                          <p id="textID">${item.endorsement}</p>
                          </div>
                          <div id="bottomDiv">
                          <h4>${item.to}</h4>
                          <div class="h-container">
                          <i id="heart">♥</i>
                          <p>${item.likes}</p>
                          </div>
                          </div>
                          </div>`
    let endorsText = document.createElement("li");
    endorsText.innerHTML = valueDiv.innerHTML;
    endorsementListEl.append(endorsText);
}

