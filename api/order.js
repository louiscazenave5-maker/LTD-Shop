import formidable from "formidable";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false,
    },
};


const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;



export default async function handler(req, res) {


    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Méthode non autorisée"
        });

    }



    if (!WEBHOOK_URL) {

        return res.status(500).json({
            error: "Webhook Discord manquant"
        });

    }



    const form = formidable({

        multiples: false,

        maxFileSize: 8 * 1024 * 1024

    });




    try {


        const [fields, files] = await form.parse(req);



        // INFORMATIONS CLIENT

        const name =
            fields.name?.[0] || "Inconnu";


        const phone =
            fields.phone?.[0] || "Non renseigné";


        const location =
            fields.location?.[0] || "Non renseigné";


import formidable from "formidable";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false,
    },
};


const WEBHOOK_URL = process.env.DISCORD_WEBHOOK;



export default async function handler(req, res) {


    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Méthode non autorisée"
        });

    }



    if (!WEBHOOK_URL) {

        return res.status(500).json({
            error: "Webhook Discord manquant"
        });

    }



    const form = formidable({

        multiples: false,

        maxFileSize: 8 * 1024 * 1024

    });




    try {


        const [fields, files] = await form.parse(req);



        // INFORMATIONS CLIENT

        const name =
            fields.name?.[0] || "Inconnu";


        const phone =
            fields.phone?.[0] || "Non renseigné";


        const location =
            fields.location?.[0] || "Non renseigné";


        const deliveryDate =
            fields.deliveryDate?.[0] || "Non renseignée";



        // COMMANDE


        const products =
            fields.products?.[0] || "Aucun produit";


        const total =
            fields.total?.[0] || "0 $";




        // IMAGE PAIEMENT


        const proof =
            files.paymentProof?.[0];






        const embed = {


            title:
            "Nouvelle Commande",



            color:
            5763719,



            fields:[


                {

                    name:"Client",

                    value:name,

                    inline:true

                },


                {

                    name:"Téléphone",

                    value:phone,

                    inline:true

                },


                {

                    name:"Lieu de livraison",

                    value:location

                },


                {

                    name:"Date de livraison souhaitée",

                    value:deliveryDate

                },


                {

                    name:"Produits",

                    value:products.substring(0,1000)

                },


                {

                    name:"Total",

                    value:total

                }


            ],



            footer:{

                text:
                "LTD LS • Limited Gasoline"

            },



            timestamp:
            new Date()

        };







        const discordForm = new FormData();



        discordForm.append(

            "payload_json",

            JSON.stringify({

                embeds:[embed]

            })

        );







        if(proof){



            const buffer =
            fs.readFileSync(
                proof.filepath
            );



            discordForm.append(

                "files[0]",

                new Blob([buffer]),

                proof.originalFilename || "preuve.png"

            );


        }







        const discordResponse =
        await fetch(

            WEBHOOK_URL,

            {

                method:"POST",

                body:discordForm

            }

        );







        if(!discordResponse.ok){



            const discordError =
            await discordResponse.text();



            console.error(
                "Discord:",
                discordError
            );



            throw new Error(
                "Discord webhook error"
            );


        }








        return res.status(200).json({

            success:true,

            message:"Commande envoyée"

        });






    } catch(error){



        console.error(
            "ORDER ERROR:",
            error
        );



        return res.status(500).json({

            error:
            "Erreur serveur"

        });


    }


}


        // COMMANDE


        const products =
            fields.products?.[0] || "Aucun produit";


        const total =
            fields.total?.[0] || "0 $";




        // IMAGE PAIEMENT


        const proof =
            files.paymentProof?.[0];






        const embed = {


            title:
            "Nouvelle Commande",



            color:
            5763719,



            fields:[


                {

                    name:"Client",

                    value:name,

                    inline:true

                },


                {

                    name:"Téléphone",

                    value:phone,

                    inline:true

                },


                {

                    name:"Lieu de livraison",

                    value:location

                },


                {

                    name:"Date de livraison souhaitée",

                    value:deliveryDate

                },


                {

                    name:"Produits",

                    value:products.substring(0,1000)

                },


                {

                    name:"Total",

                    value:total

                }


            ],



            footer:{

                text:
                "LTD LS • Limited Gasoline"

            },



            timestamp:
            new Date()

        };







        const discordForm = new FormData();



        discordForm.append(

            "payload_json",

            JSON.stringify({

                embeds:[embed]

            })

        );







        if(proof){



            const buffer =
            fs.readFileSync(
                proof.filepath
            );



            discordForm.append(

                "files[0]",

                new Blob([buffer]),

                proof.originalFilename || "preuve.png"

            );


        }







        const discordResponse =
        await fetch(

            WEBHOOK_URL,

            {

                method:"POST",

                body:discordForm

            }

        );







        if(!discordResponse.ok){



            const discordError =
            await discordResponse.text();



            console.error(
                "Discord:",
                discordError
            );



            throw new Error(
                "Discord webhook error"
            );


        }








        return res.status(200).json({

            success:true,

            message:"Commande envoyée"

        });






    } catch(error){



        console.error(
            "ORDER ERROR:",
            error
        );



        return res.status(500).json({

            error:
            "Erreur serveur"

        });


    }


}
