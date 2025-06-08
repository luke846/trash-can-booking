// api/book.js

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Handles booking requests and sends confirmation emails to the customer and you.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { name, email, phone, date, time, serviceType, extraCans, extraMonthlyCans, notes } = req.body;

  // Pricing Logic
  let total = 0;
  if (serviceType === 'one-time') {
    total = 20 + (extraCans * 5);
  } else if (serviceType === 'monthly') {
    total = 15 + (extraMonthlyCans * 3);
  }

  const customerMessage = {
    to: email,
    from: 'no-reply@sparkletrashcleaning.com',
    subject: 'Booking Confirmation - Sparkle Trash Cleaning',
    text: `Hi ${name},\n\nThanks for booking with Sparkle Trash Cleaning!\n\nService: ${serviceType}\nDate: ${date} at ${time}\nTotal: $${total}\n\nNotes: ${notes}\n\nWe’ll see you then! Reply to cancel 24 hrs in advance.`,
  };

  const ownerMessage = {
    to: process.env.OWNER_EMAIL,
    from: 'no-reply@sparkletrashcleaning.com',
    subject: 'New Booking Received',
    text: `New booking:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${serviceType}\nDate: ${date} at ${time}\nExtra One-Time Cans: ${extraCans}\nExtra Monthly Cans: ${extraMonthlyCans}\nNotes: ${notes}\n\nTotal: $${total}`,
  };

  try {
    await sgMail.send(customerMessage);
    await sgMail.send(ownerMessage);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email error:', err.response?.body || err);
    res.status(500).json({ error: 'Failed to send emails' });
  }
}