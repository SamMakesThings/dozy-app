import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'atawodiemmanuel@gmail.com',
    pass: '08051278525',
  },
});

export const sendEmail = (email: string) => {
  const mailOptions: nodemailer.SendMailOptions = {
    from: 'atawodiemmanuel@gmail.com',
    to: email,
    subject: 'Testing Our Email Service Works',
    html: `<h1>Order Confirmation</h1>
    <p> <b>Email: </b>${email} </p>`,
  };

  return transporter.sendMail(mailOptions, (error, data) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log('----------> Sent!', data);
  });
};
