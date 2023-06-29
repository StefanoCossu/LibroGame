// DarkMode
let darkButton = document.querySelector(".darkButton")
let isClicked = true
function dark() {
    isClicked = false
    document.documentElement.style.setProperty('--dark', 'rgb(245,245,245)');
    document.documentElement.style.setProperty('--sec', 'rgba(0,0,0,0.7)');
    darkButton.classList.remove(`candle`);
    darkButton.classList.add(`candleOff`);
}
function light() {
    isClicked = true
    document.documentElement.style.setProperty('--dark', 'rgb(53,53,53)');
    document.documentElement.style.setProperty('--sec', 'transparent');
    darkButton.classList.add(`candle`);
    darkButton.classList.remove(`candleOff`);
}
darkButton.addEventListener("click",()=>{
    if (isClicked) {
        dark();
        localStorage.setItem(`theme`,`dark`)
    } else {
        light(); 
        localStorage.setItem(`theme`,`light`)
    }   
})   
let theme = localStorage.getItem(`theme`)
if (theme == "dark") {
    dark()
} else {
    light()
}

// Elementi Html
let noSell = document.querySelector(".noSell")
let pozioniText = document.querySelector(".pozioniText");
let potionButton = document.querySelector(".pozioni");
let modalBody = document.querySelector(".modal-body");
let combatRow = document.querySelector(".combat");
let combatReport = document.querySelector(".combatReport")
let startButton = document.querySelector(".startButton");
let starterCol = document.querySelector(".starterCol");
let stats = document.querySelector(".stats");
let book = document.querySelector(".book");
let choose = document.querySelector(".choose");
let buttonGrid = document.querySelector(".buttonGrid");
let storyText = document.querySelector(".storyText")
let goldBag = document.querySelector(".goldBag");
let goldText = document.querySelector(".goldText");
let progressBar = document.querySelector(".progress-bar");
let nameSpace = document.querySelector(".nameSpace");
let forzaText = document.querySelector(".forzaText");
let costituzioneText = document.querySelector(".costituzioneText");
let destrezzaText = document.querySelector(".destrezzaText");
let fortunaText = document.querySelector(".fortunaText");
let armourText = document.querySelector(".armourText");
let weaponText = document.querySelector(".weaponText");
let basil = document.querySelector(".basil");
let fenix = document.querySelector(".fenix")

//Elementi di gioco
let name = "Player"
let punti = 10
let forza = 6
let agilità = 6
let costituzione = 6
let fortuna = 6
let vitaMax = (costituzione*3)+10;
let vita = vitaMax;
let counPhoenix = 20;
let phFirts = true;
let state = {};
let stolen = {};
let cic = true
let esito = false
let successo = false

//Funzioni in game
fetch(`/resources/aulabaria.json`)
    .then(response => response.json())
    .then(data => {
// funzione per barraVita (Arduino - metodo map())
function mapRangeValue(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
// Funzione cura
function healing(cura) {
    vita = vita + cura;
    if (vita > vitaMax) {
        vita = vitaMax
    }else if(vita <= 0) {
        vita = 1      
    }else{
        vita = vita
    }
    progressBar.ariaValuenow= `${vita}`;
    progressBar.innerHTML=`${vita}/${vitaMax}`
    progressBar.style.width = `${mapRangeValue(vita, 0, vitaMax, 0, 100)}%`;
    return;
}
function phoenixFun() {
    if (phFirts == true) {
        while (combatRow.firstChild) {
            combatRow.removeChild(combatRow.firstChild)
        }
        combatRow.classList.remove("d-none");
        phFirts = false;
        counPhoenix = 0;
        let div = document.createElement("div")
        div.classList.add("combatScroll", "d-flex", "justify-content-center", "align-items-center")
        div.innerHTML=`
        <p class="combatReport px-5 text-center">
        La piuma della fenice nel tuo zaino rivela il suo potere aumentando la tua vita massima e curandoti nel tempo..
        </p>
        `
        combatRow.appendChild(div)
            vitaMax = vitaMax+10;   
            progressBar.ariaValuemax= `${vitaMax}`;
            progressBar.style.width = `${mapRangeValue(vita, 0, vitaMax, 0, 100)}%`
            setTimeout(()=>{
                combatRow.classList.add("d-none");
                }, 5000);;
            fenix.classList.add("aura")
            setTimeout(()=>{
                fenix.classList.remove("aura");
                }, 2000);
            healing(5)
    }else{
        counPhoenix = 0;
        fenix.classList.add("aura")
        setTimeout(()=>{
        fenix.classList.remove("aura");
        }, 2000);
        healing(5)
    }
}
// Funzione furtività
function furtività() {
    let probability = Math.random()*26;
    let capacity = agilità + (fortuna/2)
    if (capacity >= probability) {
        successo = true
        return 
    } else {
        successo = false
        return 
    }
}
// funzione combattimento singolo
function combat(multipler, enemyWeapon, vitaEnemy, enemy) {
    let duration = 2
    let maiuscolo = enemy.charAt(0).toUpperCase() + enemy.slice(1)
    while (combatRow.firstChild) {
        combatRow.removeChild(combatRow.firstChild)
    }
    let counter = 0
    let counter2 = 900
    combatRow.classList.remove("d-none");
    while (combatRow.firstChild) {
        combatRow.removeChild(combatRow.firstChild)
    }
    while (vitaEnemy > 0 && vita > 0){ 
        // attacco
        attacco = (Math.round((Math.random() * state.weapon) + (forza/2) + (fortuna/2)));
        vitaEnemy = vitaEnemy - attacco;
        let div = document.createElement("div")
        div.classList.add("combatScroll", "d-flex", "justify-content-center", "align-items-center", "moveup")
        div.innerHTML=`
        <p class="combatReport px-5 text-center">
        Hai colpito ${enemy} causandogli ${attacco} danni.
        </p>
        `
        div.style.top = `${counter}px`
        div.style.zIndex = counter
        combatRow.appendChild(div)
        // Difesa
        attband = (Math.round(((Math.random() * multipler)/agilità) + enemyWeapon - (fortuna/3) - state.armour)) ;
        if (attband <= 0){
            attband = 1
        }else {
        attband = attband
        }
        vita = vita - attband
        let div2 = document.createElement("div")
        div2.classList.add("combatScroll", "d-flex", "justify-content-center", "align-items-center", "movedown")
        div2.innerHTML=`
        <p class="combatReport px-5 text-center">
        ${maiuscolo} risponde all'attacco colpendoti e causandoti ${attband} danni!
        </p>
        `
        div2.style.animationDuration = `${duration}s`
        div2.style.bottom = `${counter}px`
        div2.style.zIndex = counter2
        combatRow.appendChild(div2)
        progressBar.ariaValuenow= `${vita}`;
        progressBar.innerHTML=`${vita}/${vitaMax}`
        progressBar.style.width = `${mapRangeValue(vita, 0, vitaMax, 0, 100)}%`;

        counter = counter + 100  
        counter2 = counter2 - 1 
        duration = duration + 0.5  
    }
    if (vita <= 0) {
        morto(maiuscolo)
    }
    setTimeout(()=>{
    combatRow.classList.add("d-none");
    }, 6000);
     
}
function special() {
    let bandito = 25
    let john = 35
    let counter = 0
    let counter2 = 900
    let counter3 = 40
    let duration = 2
    maiuscolo = "Uno dei briganti" 
    gruppo = bandito + john;
    while (combatRow.firstChild) {
        combatRow.removeChild(combatRow.firstChild)
    }
    combatRow.classList.remove("d-none")
    while (gruppo > 0 && vita > 0 && bandito > 0){ 
        attacco = (Math.round((Math.random() * state.weapon) + (forza/2) + (fortuna/2)));
        bandito = bandito - attacco;
        
        let div = document.createElement("div")
        div.classList.add("combatScroll", "d-flex", "justify-content-center", "align-items-center", "moveup")
        div.innerHTML=`
        <p class="combatReport px-5 text-center">
        Hai colpito il brigante causandogli ${attacco} danni.
        </p>
        `
        div.style.animationDuration = `${duration}s`
        div.style.top = `${counter}px`
        div.style.zIndex = counter
        combatRow.appendChild(div)

        attband = (Math.round(((Math.random() * 120)/agilità) + 2 - (fortuna/3) - state.armour)) ;
        if (attband <= 0){
        attband = 1
        }else {
        attband = attband
        }
        vita = vita - attband;
        let div2 = document.createElement("div")
        div2.classList.add("combatScroll", "d-flex", "justify-content-center", "align-items-center", "movedown")
        div2.innerHTML=`
        <p class="combatReport px-5 text-center">
        Il brigante risponde all'attacco colpendoti e causandoti ${attband} danni!
        </p>
        `
        div2.style.animationDuration = `${duration}s`
        div2.style.bottom = `${counter}%`
        div2.style.zIndex = counter2
        combatRow.appendChild(div2)
        progressBar.ariaValuenow= `${vita}`;
        progressBar.innerHTML=`${vita}/${vitaMax}`
        progressBar.style.width = `${mapRangeValue(vita, 0, vitaMax, 0, 100)}%`;
  
        attacco = (Math.round((Math.random() * state.weapon) + (forza/2) + (fortuna/2)));
        john = john - attacco;
        let div3 = document.createElement("div")
        div3.classList.add("combatScroll", "d-flex", "justify-content-center", "align-items-center", "moveright")
        div3.innerHTML=`
        <p class="combatReport px-5 text-center">
        Hai colpito il brigante incappucciato causandogli ${attacco} danni.
        </p>
        `
        div3.style.animationDuration = `${duration}s`
        div3.style.top = `${counter3}%`
        div3.style.right = `${counter}px`
        div3.style.zIndex = counter
        combatRow.appendChild(div3)

        attband = (Math.round(((Math.random() * 100)/agilità) + 2 - (fortuna/3) - state.armour)) ;
        if (attband <= 0){
        attband = 1
        }else {
        attband = attband
        }
        vita = vita - attband;
        let div4 = document.createElement("div")
        div4.classList.add("combatScroll", "d-flex", "justify-content-center", "align-items-center", "moveleft")
        div4.innerHTML=`
        <p class="combatReport px-5 text-center">
        Il brigante incappucciato risponde all'attacco colpendoti e causandoti ${attband} danni!
        </p>
        `
        div4.style.animationDuration = `${duration}s`
        div4.style.bottom = `${counter3}%`
        div4.style.left = `${counter}px`
        div4.style.zIndex = counter2
        combatRow.appendChild(div4)
        progressBar.ariaValuenow= `${vita}`;
        progressBar.innerHTML=`${vita}/${vitaMax}`
        progressBar.style.width = `${mapRangeValue(vita, 0, vitaMax, 0, 100)}%`;
        
        duration = duration + 0.5
        counter = counter + 50
        counter3 = counter3+5  
        counter2--
    }
    setTimeout(()=>{
        combatRow.classList.add("d-none");
        }, 6000);
    if (vita <= 0) {
        return morto(maiuscolo)
    }
    if (john > 0){
       return showText(29)
    }
    return showText(31)
}
// funzione modificatore
function modificatore(array) {
    array.forEach(element =>{
    if (element.gold != null){
        state.gold = state.gold + element.gold
    };               
    if (element.weapon != null) {
        state.weapon = state.weapon + element.weapon
    };
    if (element.armour != null) {
        state.armour = state.armour + element.armour
    };
    goldText.innerHTML= `gold: ${state.gold}`;
    armourText.innerHTML=`${state.armour}`;
    weaponText.innerHTML=`${state.weapon}`;
    })
    return;
}
//funzione per acquistare dal Merchant
function shopping(array,elId) {
    let filtered = array.filter(element => element.itemsType == elId)
    let filteredArray = Array.from(filtered);

    if (filteredArray[0].prezzo <= state.gold && filteredArray[0].itemsType != "cura") {
        let byeBye = document.querySelector(`#${elId}`)
        modificatore(filtered)
        byeBye.classList.add("d-none")
        return
    }else if(filteredArray[0].prezzo <= state.gold && filteredArray[0].itemsType === "cura"){
        state.potions++
        pozioniText.innerHTML=`
        X${state.potions}
        `
        state.gold = state.gold - filteredArray[0].prezzo
        potionButton.classList.remove("d-none")
        goldText.innerHTML= `gold: ${state.gold}`;
        return
    }else{
        noSell.classList.remove("d-none")
        noSell.innerHTML=`
        <h3>Non hai abbastanza denaro!</h3>
        `
        setTimeout(()=>{
            noSell.classList.add("d-none")
        },1500);
    }
}
//funzione per creare il Merchant
function merchant(array) {
    modalBody.innerHTML=``;
    array.forEach(element=>{
       let div = document.createElement("div")
       div.classList.add("card")
       div.style.width="18rem"
       div.innerHTML=`
        <img src="/resources${element.url}" class="card-img-top" alt="">
        <div class="card-body">
        <h5 class="card-title">${element.itemsName}</h5>
        <p class="card-text">Tipo: ${element.itemsType}; bonus: +${element.bonus}</p>
        <button class="buttons itemsButtons" id="${element.itemsType}">Compra per ${element.prezzo} monete</button>
        </div>
        `
        modalBody.appendChild(div);
    })
    let div2 = document.createElement("div")
    div2.classList.add("w-100")
    div2.innerHTML = `
    <button type="button" class="buttons w-100 my-5" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Compra dal mercante
    </button>
    ` 
    buttonGrid.appendChild(div2)

    let itemsButtons = document.querySelectorAll(".itemsButtons");
    itemsButtons.forEach(element=>{
        element.addEventListener("click",()=>{
            shopping(array,element.id)
        })
    })
}
function derubato() {
    if (state.derubato == false) {
        stolen = state;
        state = {};
        state.gold = 0
        state.derubato = true
        fenix.classList.add("d-none")
        potionButton.classList.add("d-none");
        basil.classList.add("d-none")
        state.weapon = 1;
        state.armour = 1;
        counPhoenix = 20;
    }else{
        state = stolen;
        state.derubato = false;
        if (state.fenice == true) {
            fenix.classList.remove("d-none")
            counPhoenix = 0;
        }
        if (state.potions > 0) {
            potionButton.classList.remove("d-none");
        } 
        if (state.basilico == true){
            basil.classList.remove("d-none")
        } 
    }
    goldText.innerHTML= `gold: ${state.gold}`;
    armourText.innerHTML=`${state.armour}`;
    weaponText.innerHTML=`${state.weapon}`
}
// funzione per gestire eventi (la maggiorparte degli if vanno messi qui)
function gestoreEventi(node) {
    if (node.event == "derubato") {
        derubato()
    }
    if (node.event == "witchDeath") {
        state.witchDeath = true;
    }
    if (node.event == "basilico") {
        state.basilico = true;
        basil.classList.remove("d-none")
    }
    if (node.event == "fenice") {
        state.fenice = true;
        fenix.classList.remove("d-none")
        counPhoenix = 0;
    }
    if (node.event == "info") {
        state.info = true;
    }
}
// funzioni Core 
function showText(dataIndex) {
    counPhoenix++
    choose.classList.remove("d-none")
    if (state.potions > 0) {
        potionButton.classList.remove("d-none");
        pozioniText.innerHTML=`
        X${state.potions}
        `
    }else{
        potionButton.classList.add("d-none")
    }
    let textNode = data.find(element=>element.id === dataIndex)
    storyText.innerHTML = textNode.text.replace('NAME', name)
    while (buttonGrid.firstChild) {
        buttonGrid.removeChild(buttonGrid.firstChild)
    }
    textNode.options.forEach(option => {
        if (showOption(option)) {
            let button = document.createElement("button")
            button.innerText = option.text
            button.classList.add("buttons","my-5","w-100")
            button.addEventListener("click",()=>selectOption(option,textNode))
            buttonGrid.appendChild(button)
        }
    })  
    if (textNode.stateChange != null) {
        modificatore(textNode.stateChange)
    }
    if (textNode.healing != null) {
        healing(textNode.healing)
    }
    if (textNode.seller != null) {
        merchant(textNode.seller)
    }
    if (textNode.event != null){
        gestoreEventi(textNode)
    } 
    if (counPhoenix == 10) {
        phoenixFun();
    }
    return;
}
// Verifica requisiti soddisfatti per visualizzare i tasti
function check(state,requiredState){
 let keys = Object.keys(requiredState)
 let val = Object.values(requiredState)
 let filtered = Object.keys(state).filter(element => keys.includes(element)).reduce((obj, element) => {
   obj[element] = state[element];
   return obj;}, {});
 let par = Object.values(filtered);
 if (keys == "gold") {
    if (val[0] <= par[0] ) {
        return true
    }return false
 }
 if (keys == "destrezza" && cic == true) {
    furtività()
    esito = successo
    cic = false
    if (esito == val[0]) {
        return true
    }else{
        return false
    }

 }else if(keys == "destrezza" && cic == false) {
    cic = true
    if (esito == val[0]) {
        return true
    }else{
        return false
    }
}
 if (par.length == 0) {
    par[0] = false
}

if (par[0] == val[0]) {
    return true;
}
return false
};
// se check da esito positivo o non sono presenti requisiti da true a showtext per i tasti
function showOption(option){
    return option.requiredState == null || check(state,option.requiredState)
}
// funzione per avanzare nelle visualizzazione delle pagine 
function selectOption(option,textNode) { 
    if (textNode.combat == true) {
        combat(textNode.enemyPower,textNode.enemyWeapon,textNode.enemyLife,textNode.enemyName)
        setTimeout(()=>{
            let nextTextNodeId = option.nextText
            showText(nextTextNodeId)
            }, 6100);
    }else if (textNode.event == "special") {
        special()
    }else{
        let nextTextNodeId = option.nextText
        showText(nextTextNodeId)
    }
}
//funzione inizializzazione tavolo gioco
function game() {
    state.potions = 0;
    state.derubato = false;
    state.witchDeath = false;
    state.basilico = false;
    state.fenice = false;
    state.info = false;
    state.gold = 10
    state.weapon = 1
    state.armour = 1
    starterCol.classList.add("d-none");
    stats.classList.remove("d-none");
    book.classList.remove("d-none");
    goldBag.classList.remove("d-none");
    nameSpace.innerHTML= `${name}`;
    forzaText.innerHTML=`${forza}`;
    costituzioneText.innerHTML=`${costituzione}`;
    destrezzaText.innerHTML=`${agilità}`;
    fortunaText.innerHTML=`${fortuna}`;
    goldText.innerHTML= `gold: ${state.gold}`;
    armourText.innerHTML=`${state.armour}`;
    weaponText.innerHTML=`${state.weapon}`
    progressBar.ariaValuemax= `${vitaMax}`;
    progressBar.ariaValuenow= `${vita}`;
    progressBar.innerHTML=`${vita}/${vitaMax}`
    progressBar.style.width = `${mapRangeValue(vita, 0, vitaMax, 0, 100)}%`;
    storyText.innerHTML=`${name}, ora che hai completato il tuo personaggio la tua avventura può iniziare! Ricorda che se la tua vita scende a zero la partita finisce! Buona fortuna!`
    let button = document.createElement("button")
    button.classList.add("buttons")
    button.innerHTML="Comincia l'avventura!"
    buttonGrid.appendChild(button);
    button.addEventListener("click",()=>{
        showText(1)
    })


}
//funzione assegnazione punti abilità
function ability() {
    let startDiv = document.querySelector(".startDiv");
    startDiv.innerHTML= `
            <h3>Scegli i tuoi attributi</h3>
            <h4>Punti Rimanenti</h4>
            <p class="puntisel mx-3">10</p>
            <div>
            <h4>Forza</h4>
            <div class="d-flex">
            <button class="forzaMinus buttons2">-</button>
            <p class="forzasel mx-3">6</p>
            <button class="forzaPlus buttons2">+</button>
            </div>   
            </div>
            <div>
            <h4>Costituzione</h4>
            <div class="d-flex">
            <button class="costituzioneMinus buttons2">-</button>
            <p class="costituzionesel mx-3">6</p>
            <button class="costituzionePlus buttons2">+</button>
            </div>   
            </div>
            <div>
            <h4>Aglità</h4>
            <div class="d-flex">
            <button class="agilityMinus buttons2">-</button>
            <p class="agilitysel mx-3">6</p>
            <button class="agilityPlus buttons2">+</button>
            </div>   
            </div>
            <div>
            <h4>Fortuna</h4>
            <div class="d-flex">
            <button class="fortunaMinus buttons2">-</button>
            <p class="fortunasel mx-3">6</p>
            <button class="fortunaPlus buttons2">+</button>
            </div>   
            </div>
            <button class="attributiOK buttons">Conferma</button>
    `;
    let puntisel = document.querySelector(".puntisel")
    let forzasel = document.querySelector(".forzasel");
    let costituzionesel = document.querySelector(".costituzionesel");
    let agilitysel = document.querySelector(".agilitysel");
    let fortunasel = document.querySelector(".fortunasel");
    let forzaMinus = document.querySelector(".forzaMinus");
    let forzaPlus = document.querySelector(".forzaPlus");
    let costituzioneMinus = document.querySelector(".costituzioneMinus");
    let costituzionePlus = document.querySelector(".costituzionePlus");
    let agilityMinus = document.querySelector(".agilityMinus");
    let agilityPlus = document.querySelector(".agilityPlus");
    let fortunaMinus = document.querySelector(".fortunaMinus");
    let fortunaPlus = document.querySelector(".fortunaPlus");
    let attributiOK = document.querySelector(".attributiOK");
    forzaPlus.addEventListener("click",()=>{
        if (punti > 0) {
            forza++;
            forzasel.innerText = `${forza}`;
            punti--
            puntisel.innerText = `${punti}`;
        };
    })
    forzaMinus.addEventListener("click",()=>{
        if (forza > 6) {
            forza--;
            forzasel.innerText = `${forza}`;
            punti++
            puntisel.innerText = `${punti}`;
        };
    })
    costituzionePlus.addEventListener("click",()=>{
        if (punti > 0) {
            costituzione++;
            costituzionesel.innerText = `${costituzione}`;
            punti--
            puntisel.innerText = `${punti}`;
        };
    })
    costituzioneMinus.addEventListener("click",()=>{
        if (costituzione > 6) {
            costituzione--;
            costituzionesel.innerText = `${costituzione}`;
            punti++
            puntisel.innerText = `${punti}`;
        };
    })
    agilityPlus.addEventListener("click",()=>{
        if (punti > 0) {
            agilità++;
            agilitysel.innerText = `${agilità}`;
            punti--
            puntisel.innerText = `${punti}`;
        };
    })
    agilityMinus.addEventListener("click",()=>{
        if (agilità > 6) {
            agilità--;
            agilitysel.innerText = `${agilità}`;
            punti++
            puntisel.innerText = `${punti}`;
        };
    })
    fortunaPlus.addEventListener("click",()=>{
        if (punti > 0) {
            fortuna++;
            fortunasel.innerText = `${fortuna}`;
            punti--
            puntisel.innerText = `${punti}`;
        };
    })
    fortunaMinus.addEventListener("click",()=>{
        if (fortuna > 6) {
            fortuna--;
            fortunasel.innerText = `${fortuna}`;
            punti++
            puntisel.innerText = `${punti}`;
        };
    })
    attributiOK.addEventListener("click",()=>{
        if (punti == 0) {
            fortuna = fortuna;
            forza = forza;
            costituzione = costituzione;
            agilità = agilità;
            vitaMax = (costituzione*3)+10;
            vita = vitaMax;
            game()
            return;
        }
    })
}
// funzione Game Over
function morto(enemy) {
    book.classList.add("d-none")
    stats.classList.add("d-none")
    starterCol.innerHTML=""
    let div = document.createElement("div")
    div.classList.add("row","justify-content-center","align-items-center")
    div.innerHTML=`
    <div class="startDiv col-12 col-md-5 px-3 d-flex flex-column align-items-center justify-content-center text-center">
    <h3 class="px-5">${enemy} ti ha ferito mortalmente.. Sei morto, la tua avventura purtroppo termina qui!</h3>
    <button class="buttons startButton2">Ricomincia</button>
    </div>
    `
    starterCol.appendChild(div)
    starterCol.classList.remove("d-none");
    let startButton2 = document.querySelector(".startButton2")
    startButton2.addEventListener("click",()=>{
        while (buttonGrid.firstChild) {
            buttonGrid.removeChild(buttonGrid.firstChild)
        }
        nextTextNodeId = 1
        startGame()
    })
}
// funzione Start
function startGame() {
    while (starterCol.firstChild) {
    starterCol.removeChild(starterCol.firstChild)
    }
    starterCol.classList.remove("d-none");
    choose.classList.add("d-none");
    stats.classList.add("d-none");
    book.classList.add("d-none");
    basil.classList.add("d-none");
    fenix.classList.add("d-none");
    goldBag.classList.add("d-none");
    potionButton.classList.add("d-none");
    counPhoenix = 20;
    phFirts = true;
    punti = 10;
    forza = 6;
    agilità = 6;
    costituzione = 6;
    fortuna = 6;
    state = {};
    stolen = {};
    let divS = document.createElement("div")
    divS.classList.add("row", "justify-content-center", "align-items-center")
    divS.innerHTML= `
    <div class="startDiv col-12 col-md-5 px-3 d-flex flex-column align-items-center justify-content-center text-center">
    <p class="px-4">Prima di iniziare devi creare il tuo personaggio, iniziamo dal tuo nome..</p>
    <input type="text" name="nome" id="name" placeholder="Nome">
    <button class="buttons nameButton mt-3">Conferma</button>
    </div>
    `;
    starterCol.appendChild(divS);
    let namePg = document.querySelector("#name")
    let startDiv = document.querySelector(".startDiv");
    namePg.addEventListener('input', () => {
    })
    let nameButton = document.querySelector(".nameButton")
    nameButton.addEventListener("click",()=>{
        if (namePg.value=== `` ) {
        name = "l'Ignoto"
        }else{
        name = namePg.value;
        }
        startDiv.innerHTML =`
        <p class="px-5">Bene ${name}, ora devi scegliere i tuoi attributi. Hai a disposizione 10 punti abilità da aggiungere ai tuoi valori forza, costituzione, agilità e fortuna. La forza incide sul danno che arrechi ai nemici, la costituzione sui tuoi punti vita, l'agilità sulle tue capacità di schivata e la fortuna influenza in qualche modo le tue azioni..</p>
        <button class="buttons continueButton">Continua</button>
        `;
        let continueButton = document.querySelector(".continueButton");
        continueButton.addEventListener("click",()=> {
            ability();
            return;
        })
    })  
}
//  Tasti "sempre" presenti
startButton.addEventListener("click",()=>{
    startGame()
})
potionButton.addEventListener("click",()=>{
  if (state.potions > 0) {
    state.potions--
    pozioniText.innerHTML=`
    X${state.potions}
    `
    healing(10)
  }
  if (state.potions == 0) {
    potionButton.classList.add("d-none")
  }  
})
})
