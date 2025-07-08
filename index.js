import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));

app.use((req,res,next)=>{
  console.log("hello");
  next();
})

app.use((req, res, next) => {
  const origin = req.get('origin'); // For CORS origin
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`Request from Origin: ${origin || 'N/A'}, IP: ${ip}`);
  next();
});

app.use(express.json()); // Parse JSON

// Log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Contact route
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: "kriishchheda00522@gmail.com",
    to: process.env.RECEIVER_EMAIL,
    subject: `New Contact Form Submission from ${name}`,
    text: `Message: ${message}\n\nFrom: ${name} (${email})`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});