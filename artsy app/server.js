const { default: axios } = require('axios')
const express = require('express')
const { get } = require('http')
const app = express()
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:4200'
}));

const client_id = "fb29607e620cca0e7790"
const client_secret = "0abed9a84cf2985055df2ea15a5221a7"

var expire = null
var token = null

app.get('/auth', async (req, res) => {
    await checkToken(),
    res.send(token)
})

app.get('/test', async (req, res) => {
    await checkToken(),
    res.send(token + 'Hello!!')
})

app.get('/search', async (req, res) => {
    await checkToken()
    url = "https://api.artsy.net/api/search"
    var q = req.query.q
    //var q = "picasso"
    url += "?q=" + q + "&size=10"
    axios.get(url, {headers:
            {"X-XAPP-Token":token}
        })
        .then((response) => {
            res.send(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
})

app.get('/detail', async (req, res) => {
    await checkToken()
    url = "https://api.artsy.net/api/artists"
    var id = req.query.id
    url += "/" + id
    axios.get(url, {headers:
            {"X-XAPP-Token":token}
        })
        .then((response) => {
            res.send(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
})

app.get('/artworks', async (req, res) => {
    await checkToken()
    url = "https://api.artsy.net/api/artworks"
    var id = req.query.id
    url += "?artist_id=" + id + "&size=10"
    axios.get(url, {headers:
            {"X-XAPP-Token":token}
        })
        .then((response) => {
            res.send(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
})

app.get('/genes', async (req, res) => {
    await checkToken()
    url = "https://api.artsy.net/api/genes"
    var id = req.query.id
    url += "?artwork_id=" + id
    axios.get(url, {headers:
            {"X-XAPP-Token":token}
        })
        .then((response) => {
            res.send(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
})





async function checkToken() {
    var now = new Date()
    if ((expire === null) || (now > expire)) {
        var info = await getToken()
        token = info.token
        expire = new Date(info.expires_at)
    }
}

function getToken() {     
    var url = "https://api.artsy.net/api/tokens/xapp_token"
    return new Promise(function(resolve, reject) {
         axios.post(url, headers={
            'client_id': client_id,
            'client_secret': client_secret
        }).then(
            (res) => {
                var info = res.data
                resolve(info)
            },
            (error) => {
                reject(error)
            }
        )
    })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
}

app.listen("https://csci571-131415.wl.r.appspot.com/");