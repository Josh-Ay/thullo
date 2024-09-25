import { inviteEmailTemplate } from "@templates/inviteTemplate";

const nodemailer = require('nodemailer');
const Handlebars = require("handlebars");

const sendEmail = async (
    receiverMail: string | string[],
    subject: string,
    htmlContent: string,
) => {
    // configuring the mail transport instance
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN_MAIL,
            pass: process.env.ADMIN_MAIL_PASSWORD,
        },
        secure: true,
        port: 465,
    });

    // mailing options
    const mailOptions = {
        from: `Thullo Support <${process.env.ADMIN_MAIL}>`,
        to: receiverMail,
        subject: subject,
        html: htmlContent,
    };

    try {
        const res = await transporter.sendMail(mailOptions);
        console.log('Email sent to: ' + receiverMail);
        return { success: res.response }
    } catch (error) {
        console.log('error sending mail: ', error);
        return { error: error };
    }
}

const compileHtml = (
    senderName: string,
    itemTitle: string,
    content: string,
) => {
    const template = Handlebars.compile(inviteEmailTemplate);

    return template({
        logoImg: `https://thullo-silk.vercel.app/Logo-png.png`,
        senderName,
        content,
        itemTitle,
    });
}

export {
    sendEmail,
    compileHtml,
}