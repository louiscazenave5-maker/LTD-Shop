// ======================================
// LTD SHOP - SCRIPT.JS
// Compatible Vite
// ======================================


const WEBHOOK_URL = "TON_WEBHOOK_ICI";


// PANIER

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

const popupButton = popup?.querySelector("button");



// ======================================
// PANIER OUVERTURE
// ======================================


if(cartIcon && cartBox){

    cartIcon.addEventListener("click",()=>{

        cartBox.classList.toggle("active");

    });

}



// ======================================
// AJOUT PANIER
// ======================================


buttons.forEach(button=>{


    button.addEventListener("click",()=>{


        const card = button.closest(".card");


        const name = card.querySelector("h3").textContent;


        const price = Number(
            card.querySelector(".price")
            .textContent
            .replace(/\D/g,"")
        );


        const input = card.querySelector("input");


        const quantity = input ? Number(input.value) : 1;



        cart.push({

            name,

            price,

            quantity,

            total: price * quantity

        });



        saveCart();

        updateCart();



        button.textContent="Ajouté ✓";


        setTimeout(()=>{

            button.textContent="Ajouter au panier";

        },1000);


    });


});



// ======================================
// AFFICHAGE PANIER
// ======================================


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



        const div = document.createElement("div");


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



    if(cartCount)
    cartCount.textContent=count;


    if(totalElement)
    totalElement.textContent =
    total.toLocaleString()+" $";


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
// COMMANDER
// ======================================


if(checkoutBtn && popup){


checkoutBtn.addEventListener("click",()=>{


    if(cart.length===0){

        alert("Votre panier est vide !");

        return;

    }


    popup.classList.add("active");


});


}



// ======================================
// ENVOI COMMANDE
// ======================================


if(popupButton){


popupButton.addEventListener("click",async()=>{


const inputs = popup.querySelectorAll("input");


const nom = inputs[0].value;

const telephone = inputs[1].value;

const lieu = popup.querySelector("textarea").value;



if(!nom || !telephone || !lieu){

alert("Remplis toutes les informations.");

return;

}



let total=0;

let produits="";



cart.forEach(item=>{


total += item.total;


produits +=
`• ${item.name} x${item.quantity} - ${item.total}$\n`;


});




const data={


embeds:[{

title:"🛒 Nouvelle commande LTD",

color:5763719,


fields:[

{
name:"👤 Client",
value:nom
},

{
name:"📞 Téléphone",
value:telephone
},

{
name:"📦 Produits",
value:produits
},

{
name:"📍 Livraison",
value:lieu
},

{
name:"💰 Total",
value:total+" $"
}

],


footer:{
text:"LTD LS"
},


timestamp:new Date()

}]


};



try{


await fetch(WEBHOOK_URL,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(data)

});



alert("Commande envoyée !");



cart=[];

saveCart();

updateCart();



popup.classList.remove("active");



}



catch(e){


console.error(e);

alert("Erreur commande");


}



});


}



// ======================================
// DEMARRAGE
// ======================================


updateCart();


console.log("LTD SCRIPT CHARGE");
