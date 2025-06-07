const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { name, email, phone, date, time, cans, plan } = req.body;

  if (!name || !email || !phone || !date || !time || !cans || !plan) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const customerMessage = {
    to: email,
    from: "no-reply@sparkletrashcleaning.com",
    subject: "Booking Confirmation - Sparkle Trash Cleaning",
    text: `Hi ${name},\n\nThanks for booking with Sparkle Trash Cleaning! Here are your details:\n\n- Date: ${date}\n- Time: ${time}\n- Cans: ${cans}\n- Plan: ${plan}\n\nWe'll see you then!\n\nIf you need to cancel, please do so at least 24 hours in advance.`,
  };

  const ownerMessage = {
    to: "luke.buelow101@gmail.com",
    from: "no-reply@sparkletrashcleaning.com",
    subject: "New Trash Can Cleaning Booking",
    text: `New booking received:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nDate: ${date}\nTime: ${time}\nCans: ${cans}\nPlan: ${plan}`,
  };

  try {
    await sgMail.send(customerMessage);
    await sgMail.send(ownerMessage);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('SendGrid Error:', error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
};
