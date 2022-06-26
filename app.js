const express=require('express')
const bodyParser=require("body-parser")
const https=require("https")

const app=express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",function(req,res){
    const firstName=req.body.fName;
    const lastName=req.body.lName;
    const email=req.body.email;

    console.log(firstName,lastName,email)

    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                } 
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    //url coming from main mailchimp endpoint
    const url="https://us14.api.mailchimp.com/3.0/lists/fe2e9a31d5"
    
    const options={
        method:"POST",
        auth:"nishant:0a6cd790c54ce9d9938d2591363a24df-us14"
    }

    //function to get response from mailchimp server
const request = https.request(url,options,function(response)
    {
        if(response.statusCode===200)
    {
        res.sendFile(__dirname+"/success.html")
    }
    else{
        res.sendFile(__dirname+"/failure.html")
    }
        
        response.on("data",function(data){
            console.log(JSON.parse(data))
        })
    })

    request.write(jsonData)
    request.end()
})

app.post("/failure",function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000 ,function()
{
    console.log("server running at port 3000 ")
})

// mailchimp api: 0a6cd790c54ce9d9938d2591363a24df-us14
// unique list id/audience id: fe2e9a31d5