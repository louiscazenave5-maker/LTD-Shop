// ======================================
// LTD SHOP - SCRIPT.JS
// ======================================


// WEBHOOK DISCORD

const WEBHOOK_URL = "https://discord.com/api/webhooks/1526236247876571239/qUCWe3urgWPITBXMymMPmdkXUVMEMQ1SNiQJeIkpK2IKgeqYgSR736qJAquj2nnFhK0C";



// VARIABLES

let cart = JSON.parse(localStorage.getItem("ltdCart")) || [];


const buttons = document.querySelectorAll(".buy");

const cartBox = document.getElementById("cartBox");

const cartIcon = document.querySelector(".cart-icon");

const cartCount = document.getElementById("cartCount");


const cartItems = document.getElementById("cartItems");

const totalElement = document.getElementById("total");


const checkoutBtn = document.querySelector(".checkout");

const popup = document.querySelector(".popup");

const popupButton = popup.querySelector("button");





// ======================================
// OUVRIR / FERMER PANIER
// ======================================


cartIcon.addEventListener("click",()=>{

    cartBox.classList.toggle("active");

});





// ======================================
// AJOUT PRODUIT
// ======================================


buttons.forEach(button=>{


button.addEventListener("click",()=>{


    const card = button.closest(".card");


    const name =
    card.querySelector("h3").innerText;



    const price =
    Number(
        card.querySelector(".price")
        .innerText
        .replace(/\D/g,"")
    );



    const input =
    card.querySelector(".quantity input");



    const quantity =
    input ? Number(input.value) : 1;



    cart.push({

        name:name,

        price:price,

        quantity:quantity,

        total:price * quantity

    });



    saveCart();

    updateCart();



    button.innerText="Ajouté ✓";


    setTimeout(()=>{

        button.innerText="Ajouter au panier";

    },1200);



});



});





// ======================================
// AFFICHAGE PANIER
// ======================================


function updateCart(){


cartItems.innerHTML="";


let total=0;



if(cart.length===0){


cartItems.innerHTML=
"<p>Votre panier est vide.</p>";


totalElement.innerText="0 $";

cartCount.innerText="0";


return;

}





cart.forEach((item,index)=>{


total += item.total;



const div =
document.createElement("div");


div.className="cart-item";



div.innerHTML=`

<span>

${item.name}

x${item.quantity}

</span>


<span>

${item.total.toLocaleString()}$

<button onclick="removeItem(${index})">

❌

</button>

</span>

`;



cartItems.appendChild(div);



});



totalElement.innerText =
total.toLocaleString()+" $";



cartCount.innerText =
cart.length;



}





// ======================================
// SUPPRESSION
// ======================================


function removeItem(index){


cart.splice(index,1);


saveCart();


updateCart();


}





// ======================================
// SAUVEGARDE
// ======================================


function saveCart(){


localStorage.setItem(

"ltdCart",

JSON.stringify(cart)

);


}





// ======================================
// OUVRIR COMMANDE
// ======================================


checkoutBtn.addEventListener("click",()=>{


if(cart.length===0){


alert("Votre panier est vide !");


return;


}


popup.classList.add("active");


});






// ======================================
// ENVOI COMMANDE DISCORD
// ======================================


popupButton.addEventListener("click",async()=>{


const inputs =
popup.querySelectorAll("input");



const nom =
inputs[0].value;



const telephone =
inputs[1].value;



const lieu =
popup.querySelector("textarea").value;




if(!nom || !telephone || !lieu){


alert(
"Merci de remplir toutes les informations."
);


return;


}





let total=0;

let produits="";




cart.forEach(item=>{


total += item.total;



produits +=

`• ${item.name} x${item.quantity} — ${item.total}$\n`;


});






const embed = {


title:
"🛒 Nouvelle commande LTD SHOP",



color:
5763719,



fields:[


{

name:"👤 Client",

value:nom,

inline:true

},



{

name:"📞 Téléphone",

value:telephone,

inline:true

},



{

name:"📦 Produits",

value:produits

},



{

name:"📍 Lieu de livraison",

value:lieu

},



{

name:"💰 Total",

value:
total.toLocaleString()+" $"

}


],



footer:{

text:
"LTD SHOP • Limited Gasoline"

},



timestamp:
new Date()



};





try{


await fetch(WEBHOOK_URL,{

method:"POST",


headers:{

"Content-Type":
"application/json"

},


body:JSON.stringify({

embeds:[embed]

})


});



alert(
"Commande envoyée au LTD !"
);



cart=[];


saveCart();


updateCart();


popup.classList.remove("active");



inputs[0].value="";

inputs[1].value="";

popup.querySelector("textarea").value="";



}



catch(error){


console.error(error);


alert(
"Erreur webhook."
);


}




});





// ======================================
// FERMER POPUP
// ======================================


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
