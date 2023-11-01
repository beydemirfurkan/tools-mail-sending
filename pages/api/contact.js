export default function handler(req, res) {
    if (req.method === 'POST') {
      let nodemailer = require('nodemailer');
  
      const { emails, subject, from } = req.body;
      
      const transporter = nodemailer.createTransport({
        port: 465,
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        secure: true,
      });
  
      const mailData = {
        from: from,
        subject: subject, 
        html: `<div>Email content...</div>`
      };
  
      Promise.all(emails.map((email) => {
        return transporter.sendMail({ ...mailData, to: email });
      }))
      .then(() => {
        res.status(200).json({ message: 'Emails sent successfully' });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Error sending emails' });
      });
    } else {
      // Handle any other HTTP method
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  