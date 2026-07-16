// ======================================
// LTD SHOP - SCRIPT.JS
// Compatible Vite + Vercel API
// ======================================


const API_URL = "/api/order";

function generateOrderNumber(){

    return "LTD-" + Math.floor(100000 + Math.random() * 900000);

}

// ==========================
// CONFIGURATION
// ==========================


// Numéro de compte à afficher au client
const PAYMENT_ACCOUNT = "44";


// Codes promo modifiables
// Exemple : CODE: réduction en %
const PROMO_CODES = {

    "LTD20": 20,
    "LTD10": 10

};




// ==========================
// PANIER
// ==========================


let cart = JSON.parse(localStorage.getItem("ltdCart")) || [];





// ELEMENTS


const buttons = document.querySelectorAll(".buy");

const cartIcon = document.querySelector(".cart-icon");

const cartBox = document.getElementById("cartBox");

const cartCount = document.getElementById("cartCount");

const cartItems = document.getElementById("cartItems");

const totalElement = document.getElementById("total");

const checkoutBtn = document.querySelector(".checkout");

const popup = document.querySelector(".popup");

const sendOrderBtn = document.getElementById("sendOrder");

const successPopup = document.getElementById("successPopup");

const closeSuccess = document.getElementById("closeSuccess");

const orderDate = document.getElementById("orderDate");

const downloadReceipt =
document.getElementById("downloadReceipt");


let lastReceipt = null;



// ==========================
// AFFICHER COMPTE
// ==========================


const accountBox = document.createElement("p");

accountBox.style.marginTop = "20px";

accountBox.style.fontWeight = "700";

accountBox.innerHTML =
`
Compte de paiement : ${PAYMENT_ACCOUNT}
<br>
<span style="font-size:12px;font-weight:400;">
Numéro de compte à mettre en justificatif du virement
</span>
`;



if(popup){

    popup.insertBefore(
        accountBox,
        sendOrderBtn
    );

}





// ==========================
// PANIER OUVERTURE
// ==========================


if(cartIcon && cartBox){

cartIcon.addEventListener("click",()=>{

    cartBox.classList.toggle("active");

});

}




// ==========================
// AJOUT AU PANIER
// ==========================


buttons.forEach(button=>{


button.addEventListener("click",()=>{


const card = button.closest(".card");


const name =
card.querySelector("h3").textContent;



const price = Number(

card.querySelector(".price")
.textContent
.replace(/\D/g,"")

);



const quantity =
Number(card.querySelector("input").value) || 1;




cart.push({

    name,

    price,

    quantity,

    total:price * quantity

});




saveCart();

updateCart();




button.textContent="Ajouté ✓";


setTimeout(()=>{

button.textContent="Ajouter au panier";

},1000);



});


});





// ==========================
// AFFICHAGE PANIER
// ==========================


function updateCart(){


if(!cartItems) return;



cartItems.innerHTML="";


let total = 0;

let count = 0;



if(cart.length === 0){


cartItems.innerHTML =
"<p>Votre panier est vide.</p>";

}



cart.forEach((item,index)=>{


total += item.total;

count += item.quantity;



const div=document.createElement("div");


div.className="cart-item";



div.innerHTML = `

<span>
${item.name} x${item.quantity}
</span>


<span>

${item.total.toLocaleString()} $

<button class="remove">
❌
</button>

</span>

`;



div.querySelector(".remove")
.addEventListener("click",()=>{

removeItem(index);

});



cartItems.appendChild(div);



});



if(cartCount)
cartCount.textContent=count;



if(totalElement)
totalElement.textContent =
total.toLocaleString()+" $";



}




// ==========================
// SUPPRESSION
// ==========================


function removeItem(index){


cart.splice(index,1);


saveCart();

updateCart();


}




// ==========================
// SAUVEGARDE
// ==========================


function saveCart(){

localStorage.setItem(

"ltdCart",

JSON.stringify(cart)

);

}





// ==========================
// OUVRIR COMMANDE
// ==========================


if(checkoutBtn){


checkoutBtn.addEventListener("click",()=>{


if(cart.length===0){

alert("Votre panier est vide !");

return;

}



popup.classList.add("active");



});

}

// ==========================
// ENVOI COMMANDE
// ==========================


if(sendOrderBtn){


sendOrderBtn.addEventListener("click", async()=>{



const name =
document.getElementById("clientName").value;



const phone =
document.getElementById("clientPhone").value;



const location =
document.getElementById("clientLocation").value;



const deliveryDate =
orderDate ? orderDate.value : "";



const file =
document.getElementById("paymentProof").files[0];




// CODE PROMO

const promoInput =
document.getElementById("promoCode");


const promoCode =
promoInput ? promoInput.value.toUpperCase() : "";



let discount = 0;



if(PROMO_CODES[promoCode]){

    discount = PROMO_CODES[promoCode];

}





// VERIFICATIONS


if(!name || !phone || !location || !deliveryDate){


alert(
"Merci de remplir toutes les informations."
);


return;


}



if(!file){


alert(
"Merci d'ajouter une preuve de paiement."
);


return;


}





// CALCUL TOTAL


let totalBefore = 0;

let products = "";



cart.forEach(item=>{


totalBefore += item.total;



products +=
`• ${item.name} x${item.quantity} - ${item.total}$\n`;



});





let reduction = 0;


if(discount > 0){

    reduction =
    Math.round(
        totalBefore * discount / 100
    );

}




const finalTotal =
totalBefore - reduction;


let orderNumber = generateOrderNumber();

lastReceipt = {

    number: orderNumber,

    name: name,

    phone: phone,

    location: location,

    deliveryDate: deliveryDate,

    products: products,

    total: finalTotal + " $",

    date: new Date().toLocaleString("fr-FR")

};



// FORM DATA


const formData = new FormData();



formData.append(
"name",
name
);



formData.append(
"phone",
phone
);



formData.append(
"location",
location
);



formData.append(
"deliveryDate",
deliveryDate
);



formData.append(
"products",
products
);



formData.append(
"totalBefore",
totalBefore + " $"
);



formData.append(
"discount",
discount + "%"
);



formData.append(
"reduction",
reduction + " $"
);



formData.append(
"promoCode",
promoCode || "Aucun"
);

formData.append(
"orderNumber",
orderNumber
);


formData.append(
"total",
finalTotal + " $"
);



formData.append(
"paymentProof",
file
);






try{


sendOrderBtn.textContent =
"Envoi...";


sendOrderBtn.disabled=true;





const response = await fetch(API_URL,{

method:"POST",

body:formData

});






if(!response.ok){

throw new Error(
"Erreur API"
);

}

const data = await response.json();


if(data.orderNumber){

    orderNumber = data.orderNumber;

    lastReceipt.number = orderNumber;

}



// POPUP SUCCES

if(successPopup){

    successPopup.classList.add("active");


    const successText = successPopup.querySelector("p");

    
if(successText){

    successText.innerHTML = `
    Votre commande a bien été enregistrée.<br><br>
    Numéro de commande : <b>${orderNumber}</b><br><br>
    Le LTD vous contactera quand la commande sera prête.
    `;

}


// Ferme le panier
if(cartBox){
    cartBox.classList.remove("active");
}


// Confettis
if(typeof confetti === "function"){

    confetti({

        particleCount: 180,

        spread: 100,

        origin:{
            y:0.6
        }

    });

}


// Son confirmation
const sound = new Audio("/success.mp3");

sound.volume = 0.5;

sound.play().catch(error=>{

    console.log("Son bloqué :", error);

});

}


    // Fermer le panier
    if(cartBox){

        cartBox.classList.remove("active");

    }


     else{

    alert(
    "Commande envoyée au LTD !"
    );

}







// RESET PANIER


cart=[];


saveCart();


updateCart();





popup.classList.remove("active");





document.getElementById("clientName").value="";

document.getElementById("clientPhone").value="";

document.getElementById("clientLocation").value="";

document.getElementById("paymentProof").value="";



if(orderDate){

orderDate.value="";

}



if(promoInput){

promoInput.value="";

}




}




catch(error){


console.error(error);


alert(
"Erreur lors de l'envoi de la commande."
);



}





finally{


sendOrderBtn.textContent =
"Valider la commande";


sendOrderBtn.disabled=false;


}




});


}





// ==========================
// FERMER POPUP SUCCESS
// ==========================


if(closeSuccess && successPopup){


closeSuccess.addEventListener("click",()=>{


successPopup.classList.remove("active");


});


}






// ==========================
// FERMETURE POPUP COMMANDE
// ==========================


document.addEventListener("click",(e)=>{


if(

popup &&

popup.classList.contains("active")

&&

!popup.contains(e.target)

&&

checkoutBtn &&

!checkoutBtn.contains(e.target)

){


popup.classList.remove("active");


}



});







// ==========================
// START
// ==========================


updateCart();

if(downloadReceipt){

downloadReceipt.addEventListener("click",()=>{


if(!lastReceipt){

alert("Aucun reçu disponible.");

return;

}


const { jsPDF } = window.jspdf;

const doc = new jsPDF();



// ==========================
// CHARGEMENT LOGO
// ==========================

const logo = new Image();

logo.src="/logo.png";



logo.onload = () => {

    createPDF();

};


logo.onerror = () => {

    createPDF();

};





function createPDF(){



// ==========================
// FOND
// ==========================


doc.setFillColor(7,27,90);

doc.rect(
0,
0,
210,
297,
"F"
);



// BANDE ROUGE

doc.setFillColor(214,0,0);

doc.rect(
0,
0,
210,
12,
"F"
);





// ==========================
// LOGO
// ==========================


try{

doc.addImage(
logo,
"PNG",
80,
25,
50,
50
);

}catch(e){}






// ==========================
// TITRE
// ==========================


doc.setFont(
"helvetica",
"bold"
);


doc.setFontSize(26);


doc.setTextColor(
255,
255,
255
);


doc.text(
"LTD LS",
105,
95,
{
align:"center"
}
);



doc.setFontSize(13);


doc.setTextColor(
214,
0,
0
);


doc.text(
"LIMITED GASOLINE",
105,
105,
{
align:"center"
}
);





// ==========================
// COMMANDE
// ==========================


doc.setDrawColor(
255,
255,
255
);


doc.roundedRect(
15,
120,
180,
35,
5,
5
);



doc.setFontSize(12);

doc.setTextColor(
255,
255,
255
);


doc.setFont(
"helvetica",
"bold"
);


doc.text(
"COMMANDE",
105,
132,
{
align:"center"
}
);



doc.setFont(
"helvetica",
"normal"
);


doc.text(
"N° : " + lastReceipt.number,
25,
135
);


doc.text(
"Date : " + lastReceipt.date,
25,
143
);







// ==========================
// CLIENT
// ==========================


doc.roundedRect(
15,
165,
180,
55,
5,
5
);



doc.setFont(
"helvetica",
"bold"
);


doc.setTextColor(
214,
0,
0
);


doc.text(
"CLIENT",
105,
178,
{
align:"center"
}
);



doc.setFont(
"helvetica",
"normal"
);


doc.setTextColor(
255,
255,
255
);



doc.text(
"Nom : " + lastReceipt.name,
25,
178
);


doc.text(
"Téléphone : " + lastReceipt.phone,
25,
188
);


doc.text(
"Lieu : " + lastReceipt.location,
25,
198
);


doc.text(
"Livraison : " + lastReceipt.deliveryDate,
25,
208
);







// ==========================
// PRODUITS
// ==========================


doc.roundedRect(
15,
230,
180,
35,
5,
5
);



doc.setFont(
"helvetica",
"bold"
);


doc.setTextColor(
214,
0,
0
);


doc.text(
"PRODUITS",
105,
242,
{
align:"center"
}
);



doc.setFont(
"helvetica",
"normal"
);


doc.setTextColor(
255,
255,
255
);


doc.setFontSize(10);



const productsLines =
doc.splitTextToSize(
lastReceipt.products,
160
);



doc.text(
productsLines,
25,
239
);







// ==========================
// TOTAL
// ==========================


doc.setFillColor(
214,
0,
0
);


doc.roundedRect(
25,
272,
160,
15,
5,
5,
"F"
);



doc.setFont(
"helvetica",
"bold"
);


doc.setFontSize(16);


doc.setTextColor(
255,
255,
255
);


doc.text(
"TOTAL : " + lastReceipt.total,
105,
283,
{
align:"center"
}
);






// ==========================
// FOOTER
// ==========================


doc.setFontSize(10);

doc.setFont(
"helvetica",
"normal"
);


doc.text(
"Merci pour votre confiance",
105,
294,
{
align:"center"
}
);



doc.save(
lastReceipt.number + ".pdf"
);



}



});

}

console.log("LTD SHOP READY");

