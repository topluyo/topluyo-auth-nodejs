const PORT = process.env.PORT || 5002
const http = require('http');
const https = require("https")
const express = require('express')
const app = express()
const session = require('express-session');
const server = http.Server(app);


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.get("/", function(req, res){
    if(req.query.token){
        https.get("https://api.topluyo.com/user/token/"+req.query.token, (response) => {
            let data = '';
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => {
                try{ 
                    let response = JSON.parse(data)
                    if(response.status=="success"){
                        req.session.user = response.data;
                        res.json(req.session.user);
                    }
                }catch(e){
                    res.json("Oturum Açılamadı");
                }
            }); 
        }); 
    }else{
        res.json("Oturum Açılamadı, Token Gelmedi");
    }
})



server.listen(PORT, e => {
  console.log("Sunucu Çalıştı", PORT)
})