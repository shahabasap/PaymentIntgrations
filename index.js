require('dotenv').config()
const express=require('express')
const stripe=require('stripe')(process.env.strip_secret_key)

const app=express()
app.set('view engine','ejs')
app.get('/',(req,res)=>{
    res.render('index.ejs')
})
app.post('/checkout',async(req,res)=>{
    const session=await stripe.checkout.sessions.create({
        line_items:[{
            price_data:{
                currency:'usd',
                product_data:{
                    name:'Node.js and Express book'
                },
                unit_amount:50*100
            },
            quantity:1
        }],
        mode:'payment',
        shipping_address_collection:{
           allowed_countries:['US','BR']
        },
        success_url:`${process.env.Base_Url}/complete?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:`${process.env.Base_Url}/cancel`
    })
//   console.log("session",session)
    res.redirect(session.url)
})

app.get('/complete',async(req,res)=>{
    const session=await stripe.checkout.sessions.retrieve(req.query.session_id,{expand:['payment_intent.payment_method']})
    const lineItems=await stripe.checkout.sessions.listLineItems(req.query.session_id)
    console.log("complete session details",session)
    console.log("product details",lineItems)
    res.send('Your payment wan successfull')
})
app.get('/cancel',(req,res)=>{
    res.redirect('/')
})

app.listen(3000,()=>{console.log("server is start at port 3000")})