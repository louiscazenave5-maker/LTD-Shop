// ======================================
// LTD SHOP - SCRIPT.JS
// Compatible Vite + Vercel API
// ======================================


const API_URL = "/api/order";


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




// ==========================
// OUVERTURE PANIER
// ==========================


if(cartIcon){

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



const quantity = Number(

card.querySelector("input").value

) || 1;



cart.push({

name:name,

price:price,

quantity:quantity,

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


cartItems.innerHTML="";


let total=0;

let count=0;



if(cart.length===0){


cartItems.innerHTML=
"<p>Votre panier est vide.</p>";



}



cart.forEach((item,index)=>{


total += item.total;

count += item.quantity;



const div=document.createElement("div");


div.className="cart-item";


div.innerHTML=`

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



cartCount.textContent=count;


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


checkoutBtn.addEventListener("click",()=>{


if(cart.length===0){

alert("Votre panier est vide !");

return;

}


popup.classList.add("active");


});





// ==========================
// ENVOI COMMANDE
// ==========================


sendOrderBtn.addEventListener("click",async()=>{


const name =
document.getElementById("clientName").value;


const phone =
document.getElementById("clientPhone").value;


const location =
document.getElementById("clientLocation").value;


const file =
document.getElementById("paymentProof").files[0];




if(!name || !phone || !location){

alert("Merci de remplir toutes les informations.");

return;

}



if(!file){

alert("Merci d'ajouter une preuve de paiement.");

return;

}




let total=0;

let products="";



cart.forEach(item=>{


total += item.total;


products += 
`• ${item.name} x${item.quantity} - ${item.total}$\n`;



});





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
"products",
products
);



formData.append(
"total",
total.toLocaleString()+" $"
);



formData.append(
"paymentProof",
file
);






try{


sendOrderBtn.textContent="Envoi...";


sendOrderBtn.disabled=true;




const response = await fetch(API_URL,{

method:"POST",

body:formData

});



if(!response.ok){

throw new Error();

}




alert("Commande envoyée au LTD !");



cart=[];

saveCart();

updateCart();



popup.classList.remove("active");



document.getElementById("clientName").value="";

document.getElementById("clientPhone").value="";

document.getElementById("clientLocation").value="";

document.getElementById("paymentProof").value="";



}



catch(error){


console.error(error);


alert("Erreur lors de l'envoi de la commande.");



}



finally{


sendOrderBtn.textContent="Valider la commande";

sendOrderBtn.disabled=false;


}



});





// ==========================
// FERMER POPUP EN CLIQUANT DEHORS
// ==========================


document.addEventListener("click",(e)=>{


if(

popup.classList.contains("active")

&&

!popup.contains(e.target)

&&

!checkoutBtn.contains(e.target)

){


popup.classList.remove("active");


}



});




// START

updateCart();


console.log("LTD SHOP READY");
