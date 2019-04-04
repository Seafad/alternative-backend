const express = require('express')
const path = require('path')
const config = require('./scripts/config')
const nodeMailer = require('nodemailer') // for sending emails
const fileUpload = require('express-fileupload') // for uploading files :D


const app = express()
const missingRequest = require('./scripts/missingRequest');

// startup
app
  .set('views', path.join(__dirname, 'views'))
  .engine('html', require('ejs').renderFile)
  .set('view engine', 'html')
  .listen(config.app.port, () => console.log(`Listening on ${ config.app.port }`))

  // support JSON- and URL-encoded bodies, max file size to 25 Mb
 app
  .use(express.json()) 
  .use(express.urlencoded({extended: false})) 
  .use(fileUpload({
	  limits: { fileSize: 25 * 1024 * 1024 }
	}))
	
// routes  
app.get('/', function(req, res){res.redirect('./missingRequest');}) //for debug
app.use('/missingRequest', missingRequest)
