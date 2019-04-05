const express = require('express');
const router = express.Router();
const config = require('./config')
const db = require('./db')
const nodeMailer = require('nodemailer') // for sending emails

router.get('/', function(req, res) {
  res.render('pages/lostRequest');
});

router.post('/', function (req, res){
	if (req.files == undefined) {
		return res.status(400).send('Photo wasn\'t uploaded.');
	}
	
	let transporter = nodeMailer.createTransport({
          host: config.email.host,
          port: config.email.port,
          secure: true, // true for 465, false for other ports
          auth: {
              user: config.email.user,
              pass: config.email.pass
          }
      });
	  
      let mailOptions = {
          from: '"Alternative Automated"', 
          to: req.body.email, // list of receivers TODO: change to alternative email, maybe control via admin panel?
          subject: "Поступила новая заявка на розыск", // Subject line
          text: 'Разыскивается ' + req.body.fullname + '. Перейдите на сайт Альтернативы для получения подробной информации.', // plain text body
          html: 'Разыскивается <b>' + req.body.fullname + '</b>. Перейдите на сайт Альтернативы для получения подробной информации.', // html body
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
		  backURL=req.header('Referer') || '/';
		  res.redirect(backURL);
		  });
});


module.exports = router;