import formidable from "formidable";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false,
    },
};


const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;



export default async function handler(req, res) {


    if(req.method !== "POST"){

        return res.status(405).json({
            error:"Méthode non autorisée"
        });

    }



    const form = formidable({
        multiples:false
    });



    try{


        const [fields, files] = await form.parse(req);



        const name = fields.name?.[0] || "Inconnu";

        const phone = fields.phone?.[0] || "Non renseigné";

        const location = fields.location?.[0] || "Non renseigné";

        const deliveryDate = fields.deliveryDate;
        
        const products = fields.products?.[0] || "Aucun produit";

        const total = fields.total?.[0] || "0 $";



        const proof = files.paymentProof?.[0];



        const embed = {


            title:"🛒 Nouvelle commande LTD SHOP",

            color:5763719,


            fields:[

                {
                    name:"👤 Client",
                    value:name,
                    inline:true
                },


                {
                    name:"📞 Téléphone",
                    value:phone,
                    inline:true
                },


                {
                    name:"📍 Livraison",
                    value:location
                },

                {
                    name: "📅 Date de livraison souhaitée",
                    value: deliveryDate || "Non renseignée"
                },


                {
                    name:"📦 Produits",
                    value:products
                },


                {
                    name:"💰 Total",
                    value:total
                }


            ],


            footer:{
                text:"LTD LS • Limited Gasoline"
            },


            timestamp:new Date()



        };




        const discordForm = new FormData();



        discordForm.append(

            "payload_json",

            JSON.stringify({

                embeds:[embed]

            })

        );





        if(proof){


            const fileBuffer = fs.readFileSync(
                proof.filepath
            );


            discordForm.append(

                "files[0]",

                new Blob([fileBuffer]),

                proof.originalFilename

            );


        }




        const discordResponse = await fetch(

            WEBHOOK_URL,

            {

                method:"POST",

                body:discordForm

            }

        );




        if(!discordResponse.ok){


            throw new Error(
                "Discord webhook error"
            );


        }




        return res.status(200).json({

            success:true

        });




    }


    catch(error){


        console.error(error);


        return res.status(500).json({

            error:"Erreur serveur"

        });


    }



}
