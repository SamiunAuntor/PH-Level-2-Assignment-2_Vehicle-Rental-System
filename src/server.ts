import express, { Request, Response } from 'express'


const app = express()
const port = 3000

app.get('/', (req: Request, res) => {
    res.send('Welcome to the Vehicle Rental System !')
})

app.listen(port, () => {
    console.log(`Vehicle Rental System Server is running on port ${port}`)
})
