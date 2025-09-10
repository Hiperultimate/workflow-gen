import prisma from "@/db";
import { auth } from "@/middleware/auth";
import { crendentialCreateSchema } from "@/utils/schemas/credentialSchema";
import type { InputJsonValue } from "@prisma/client/runtime/library";
import { Router } from "express";

const credentialRoutes = Router();

credentialRoutes.post("/", auth ,async (req,res) => {
    // create credential for the current user
    const user = req.user;
    const {title, platform, data} = req.body;
    const validateCredentials = crendentialCreateSchema.safeParse({
        title,
        platform,
        data
    });

    if(!validateCredentials.success){
        return res.status(400).send({message : "Invalid details received to create credentails"});
    };

    const validCreds = validateCredentials.data;

    try {
        
        const createCredential = await prisma.credentials.create({
            data : {
                data: validCreds.data as InputJsonValue,
                platform: validCreds.platform,
                title: validCreds.title,
                user: {connect :{ id : user?.id}}
            },
            omit: {
                userId: true
            }
        })
        return res.status(200).send({message : "Succesfully created credentials", details : createCredential })
    } catch (error) {
        return res.status(400).send({message : "Invalid user received"})
    }
})

credentialRoutes.delete("/:id", auth, async (req,res) => {
    // Delete selected credential for the current user
    const selectedId = req.params.id;
    try {
        const deletedCred = await prisma.credentials.delete({
            where: {
                id : selectedId
            }
        })
        return res.status(200).send({message : "Success", deletedCredId : deletedCred.id})
    } catch (error) {
        return res.status(400).send({message : "Credential with that id does not exist"})
        
    }
})

export default credentialRoutes;