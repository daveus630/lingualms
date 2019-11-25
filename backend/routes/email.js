require("dotenv").config();
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

// Step 1 Configuration of Mail
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// Configure hnadlebars to handle templates
const handlebarOptions = {
  viewEngine: {
    extname: ".hbs",
    layoutsDir: "./views/email",
    defaultLayout: "main",
    partialsDir: "./views/partials/"
  },
  viewPath: "./views/email/",
  extName: ".hbs"
};
transporter.use("compile", hbs(handlebarOptions));

// Step 5 To pass dynamic values for mailOptions
const sendMail = (
  toEmail,
  subject,
  receiverName,
  emailBodyFirst,
  emailBodySecond,
  refId
) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: subject,
    template: "main",
    // Context is used to pass dynamic values to hbs templates
    context: {
      name: receiverName,
      emailBodyFirst: emailBodyFirst,
      emailBodySecond: emailBodySecond,
      refId: refId
    }
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent successfully");
    }
  });
};

module.exports = sendMail;
