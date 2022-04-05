const nodemailer = require('nodemailer');


const sendMail = (email, subject, text) => {
    try {
        const transpoter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'vivaanots@gmail.com',
                pass: 'luqololqlfrzsiod'
            }

        });

        transpoter.sendMail({
            from: 'vivaanots@gmail.com',
            to: email,
            subject: subject,
            text: text,
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
    }

}

module.exports = sendMail;
