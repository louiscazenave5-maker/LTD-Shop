// ======================================
// LTD SHOP - SCRIPT.JS
// Compatible Vite + Vercel API
// ======================================


const API_URL = "/api/order";


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





// ==========================
// AFFICHER COMPTE
// ==========================


const accountBox = document.createElement("p");

accountBox.style.marginTop = "20px";

accountBox.style.fontWeight = "700";

accountBox.innerHTML =
`
Compte de paiement : ${PAYMENT_ACCOUNT}
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






// POPUP SUCCES


if(successPopup){

successPopup.classList.add("active");

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


console.log("LTD SHOP READY");
