import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, phone, date, time, service, notes } = req.body;

  if (!name || !email || !date || !time) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const msg = {
      to: email,
      from: "no-reply@sparkletrashcleaning.com", // Use your verified sender
      subject: "Booking Confirmation - Sparkle Trash Cleaning",
      text: `Hi ${name},

Thank you for booking trash can cleaning with Sparkle Trash Cleaning!

Here are your booking details:
Date: ${date}
Time: ${time}
Service: ${service}
Notes: ${notes || "None"}

We accept cash only. You may cancel your booking up to 24 hours in advance by replying to this email.

Thanks again!

- Sparkle Trash Cleaning Team`,
    };

    await sendgrid.send(msg);

    // You can also send yourself an email notification here by adding another msg object and sending it

    return res.status(200).json({ message: "Booking email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error sending email" });
  }
}
