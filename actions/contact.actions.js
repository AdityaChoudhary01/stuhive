"use server";

// import connectDB from "@/lib/db";

export async function submitContactForm(formData) {
  try {
    const { name, email, message } = formData;
    
    // 1. Basic Validation
    if (!name || !email || !message) {
      return { success: false, error: "All fields are required." };
    }

    // 2. Optional: Save to Database
    // await connectDB();
    // await Message.create({ name, email, message });
    
    // 3. Send Email via Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "StuHive System",
          email: process.env.BREVO_VERIFIED_SENDER_EMAIL
        },
        to: [
          {
            email: process.env.BREVO_VERIFIED_SENDER_EMAIL, // Sending to yourself
            name: "StuHive Admin"
          }
        ],
        replyTo: {
          email: email, // Allows you to hit "Reply" in your inbox
          name: name
        },
        subject: `📬 New Support Request from ${name}`,
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
            
            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  
                  <table width="100%" max-width="600" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    
                    <tr>
                      <td style="background: linear-gradient(135deg, #00d4ff 0%, #a855f7 100%); padding: 30px 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                          StuHive
                        </h1>
                        <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px; font-weight: 500;">
                          New Contact Submission
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="color: #0f172a; margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">
                          Message Details
                        </h2>

                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                          <tr>
                            <td style="padding: 20px;">
                              <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">
                                <strong style="color: #0f172a; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Sender Name</strong><br/>
                                <span style="font-size: 16px; color: #334155; display: inline-block; margin-top: 4px;">${name}</span>
                              </p>
                              <p style="margin: 0; font-size: 14px; color: #64748b;">
                                <strong style="color: #0f172a; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Email Address</strong><br/>
                                <a href="mailto:${email}" style="font-size: 16px; color: #00d4ff; text-decoration: none; display: inline-block; margin-top: 4px;">${email}</a>
                              </p>
                            </td>
                          </tr>
                        </table>

                        <h3 style="color: #0f172a; margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                          User Message
                        </h3>
                        
                        <div style="background-color: #ffffff; border-left: 4px solid #a855f7; padding: 16px 20px; border-radius: 0 8px 8px 0; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; color: #334155; line-height: 1.6; font-size: 15px; white-space: pre-wrap;">${message}</div>
                        
                      </td>
                    </tr>

                    <tr>
                      <td style="background-color: #f8fafc; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0; color: #64748b; font-size: 13px;">
                          You can reply directly to this email to respond to <strong>${name}</strong>.
                        </p>
                      </td>
                    </tr>

                  </table>
                  
                  <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
                    Securely routed via PerLox System
                  </p>

                </td>
              </tr>
            </table>

          </body>
          </html>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API Error:", errorData);
      return { success: false, error: "Failed to send email via Brevo." };
    }

    return { success: true };
  } catch (error) {
    console.error("Contact Error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}