import { Request, Response } from "express"
import { Customer } from "../model/customerModel"

export const saveCustomer = async (req: Request, res: Response) => {

    const { name, age, isAdmin, email } = req.body

    try {

        const newCustomer = new Customer({
            id: Date.now(),
            name,
            age,
            isAdmin,
            email
        })

        const savedCustomer = await newCustomer.save()

        res.status(201).json({
            message: "Customer saved successfully",
            data: savedCustomer
        })

    } catch (err) {

        console.error(err)

        res.status(500).json({
            message: "Error saving customer",
            error: err
        })
    }
}

export const getAllCustomer = async (req: Request, res: Response) => {
    try {
        const customers = await Customer.find()
        res.status(200).json({
            message: "Customers retrieved successfully",
            data: customers
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Error retrieving customers",
            error: err
        })
    }
}