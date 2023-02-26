
// ****Email Service with Postmark ****

// import config from "../../../config";
// const postmark = require("postmark");

// const client = new postmark.ServerClient(config.PM_KEY);

// export const sendWelcomeEmail = (email, name, password) => {
//   client.sendEmail({
//     "From": 'skhan@nextlooptechnologies.com', //replace with email
//     "To": 'skhan@nextlooptechnologies.com',
//     "Subject": 'Thanks for Joining In! - Blue Bird Events',
//     "TextBody": `Welcome to BBE ${name}, your id is ${email} and password is ${password}` 
//   }).then(() => {
//     console.log("Welcome Email Sent");
//   }).catch((error) => {
//     console.log("From welcome email service ",error)
//   });
// }

// export const sendForgotPasswordEmail = (id, name, email, resetToken) => {
//   client.sendEmail({
//     "From": 'skhan@nextlooptechnologies.com',
//     "To": email,  // replace with email
//     "Subject": 'Forgot Password Request',
//     "HtmlBody": `<p>Hi ${name}, </p>
//           <p>You requested to reset password</p>
//           <p> Please, click the link below to reset password </p>
//           <a href="https://www.bluebirdevents.co.in/passwordReset?token=${resetToken}&id=${id}">Reset Password</a>`
//   }).then(() => {
//     console.log("ForGot Password Email Sent", email);
//   }).catch((error) => {
//     console.log("From forgot email service ",error)
//   });
// }
