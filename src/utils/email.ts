import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY || "re_xxxxxxxxx";
if (apiKey === "re_xxxxxxxxx") {
  console.warn("⚠️ WARNING: RESEND_API_KEY is using the placeholder 're_xxxxxxxxx'. Please set your real API key in the backend .env file.");
}

export const resend = new Resend(apiKey);

export async function sendContactEmail(data: {
  fullName: string;
  email: string;
  company?: string;
  inquiryType?: string;
  message: string;
}) {
  const toEmail = process.env.CONTACT_RECEIVER_EMAIL || "saundalkarrohit4@gmail.com";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  console.log("[Email] Preparing to send email...");
  console.log("[Email] From     :", fromEmail);
  console.log("[Email] Reply-To :", data.email, "(user who submitted the form)");
  console.log("[Email] To       :", toEmail);
  console.log("[Email] Subject  :", `New Contact Inquiry - ${data.inquiryType ?? "General"}`);
  console.log("[Email] API Key  :", process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.slice(0, 8)}...` : "❌ NOT SET");

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      // reply_to: data.email, // ← when you hit Reply in your inbox, it goes to the user
      to: toEmail,
      subject: `New Contact Inquiry - ${data.inquiryType ?? "General"}`,
      html: `
        <h2>New Contact Inquiry</h2>

        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company ?? "-"}</p>
        <p><strong>Inquiry Type:</strong> ${data.inquiryType ?? "-"}</p>

        <hr/>

        <p><strong>Message:</strong></p>

        <p>${data.message}</p>
      `,
    });

    if (result.error) {
      console.error("[Email] ❌ Resend API returned an error:", JSON.stringify(result.error, null, 2));
      throw new Error(`Resend error: ${result.error.message}`);
    }

    console.log("[Email] ✅ Email sent successfully. Resend ID:", result.data?.id);
  } catch (err: any) {
    console.error("[Email] ❌ sendContactEmail threw an exception:");
    console.error("[Email]   Message :", err?.message);
    console.error("[Email]   Details :", JSON.stringify(err?.response?.data ?? err, null, 2));
  }
}