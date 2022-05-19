import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_KEY);

export const sendAuthorsEmail = async (recieversAddress) => {
  const msg = {
    to: recieversAddress,
    from: process.env.SENDER_EMAIL,
    subject: "Email Details! Welcome!",
    text: "Here we go !!!",
    html: "<strong> Welcome to SendGrid !! </strong>",
  };
  await sgMail.send(msg);
};
