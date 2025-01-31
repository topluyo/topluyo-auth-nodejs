const PORT = process.env.PORT || 5002
const http = require('http');
const https = require("https")
const express = require('express')
const cors = require('cors');
const app = express()
const session = require('express-session');
const path = require('path');
const server = http.Server(app);

app.use(cors({
    origin: 'https://topluyo.com',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));


app.get("/path-to-connection/", function(req, res){
    if(req.query.token){
        https.get("https://api.topluyo.com/user/token/"+req.query.token, (response) => {
            let data = '';
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => {
                try{ 
                    let response = JSON.parse(data)
                    if(response.status=="success"){
                        req.session.user = response.data;
                        res.json(response.data);
                    }
                }catch(e){
                    res.json("Oturum Açılamadı" + e.message);
                }
            }); 
        }); 
    }else{
        res.json("Oturum Açılamadı, Token Gelmedi");
    }
});

server.listen(PORT, () => {
    console.log("Sunucu Çalıştı", PORT)
}); 