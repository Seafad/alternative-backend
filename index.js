const express = require('express')
const path = require('path')
const nodeMailer = require('nodemailer') // for sending emails
const fileUpload = require('express-fileupload') // for uploading files :D

const PORT = process.env.PORT || 5000
var app = express()

// startup
app
  .set('views', path.join(__dirname, 'views'))
  .engine('html', require('ejs').renderFile)
  .set('view engine', 'html')
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

 app
  .use(express.json()) // support JSON-encoded...
  .use(express.urlencoded({extended: false})) // and URL-encoded bodies
  .use(fileUpload({
	  limits: { fileSize: 25 * 1024 * 1024 }, // max file size = 25 Mb
	}))

  // routes  
app.get('/', (req, res) => res.render('pages/index'))

app.post('/processMissingRequest', function (req, res){
	
	if (req.files == undefined) {
		return res.status(400).send('Photo wasn\'t uploaded.');
	}
	
	let transporter = nodeMailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
              user: 'sarinterclub@gmail.com',
              pass: '5jX#9Hhh'
          }
      });
	  
      let mailOptions = {
          from: '"Alternative Automated" <no-reply@yandex.ru>', // sender address
          to: req.body.email, // list of receivers
          subject: "Поступила новая заявка на розыск", // Subject line
          text: 'Разыскивается ' + req.body.fullname + '. Перейдите на сайт Альтернативы для получения подробной информации.', // plain text body
          html: 'Разыскивается <b>' + req.body.fullname + '</b>', // html body
		  attachments: [
		  {
			filename: req.files.photo.name,
			content: req.files.photo.data
		  }
		  ]
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.render('pages/index');
          });
});
