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
    
    // 3. Environment Variables Configuration
    const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (!brevoSenderEmail || !adminEmail) {
      console.error("Missing required environment variables: BREVO_SENDER_EMAIL or ADMIN_EMAIL");
      return { success: false, error: "Server configuration error. Please contact support." };
    }

    // --- ENHANCEMENT: Format the message for HTML ---
    // This replaces line breaks with <br/> and prevents HTML injection
    const formattedMessage = message
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br />");

    // 4. Send Email via Brevo API
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
          email: brevoSenderEmail 
        },
        to: [
          {
            email: adminEmail,
            name: "StuHive Admin"
          }
        ],
        replyTo: {
          email: email,
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
          <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased;">
            
            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding: 50px 20px;">
              <tr>
                <td align="center">
                  
                  <table width="100%" max-width="650" border="0" cellpadding="0" cellspacing="0" style="max-width: 650px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);">
                    
                    <tr>
                      <td style="background: linear-gradient(135deg, #00d4ff 0%, #0099ff 25%, #a855f7 75%, #d946ef 100%); padding: 0; position: relative; text-align: center;">
                        <div style="padding: 40px 40px 30px 40px;">
                          <img src="https://res.cloudinary.com/dmtnonxtt/image/upload/f_auto,q_auto,w_200/v1771787388/vemq0i4mhxloqcc528qx.png" alt="StuHive Logo" style="max-width: 180px; height: auto; margin: 0 auto 20px auto; display: block; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));" />
                          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                            StuHive
                          </h1>
                          <p style="color: rgba(255,255,255,0.95); margin: 10px 0 0 0; font-size: 16px; font-weight: 600; letter-spacing: 1px;">
                            ✨ New Contact Submission ✨
                          </p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" style="display: block; width: 100%; height: auto; margin-bottom: -1px;">
                          <path fill="#ffffff" fill-opacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                        </svg>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 50px 45px;">
                        
                        <div style="text-align: center; margin-bottom: 35px;">
                          <div style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #a855f7); padding: 3px; border-radius: 50px;">
                            <h2 style="background: #ffffff; margin: 0; padding: 12px 32px; font-size: 22px; font-weight: 800; border-radius: 50px; background: linear-gradient(135deg, #00d4ff, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                              📋 Message Details
                            </h2>
                          </div>
                        </div>

                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%); border-radius: 16px; position: relative; margin-bottom: 30px; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
                          <tr>
                            <td style="padding: 28px 32px;">
                              <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid rgba(168, 85, 247, 0.15);">
                                <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 8px;">
                                  👤 Sender Name
                                </p>
                                <p style="margin: 0; font-size: 20px; color: #0f172a; font-weight: 700; background: linear-gradient(135deg, #00d4ff, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                                  ${name}
                                </p>
                              </div>
                              <div>
                                <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 8px;">
                                  📧 Email Address
                                </p>
                                <p style="margin: 0;">
                                  <a href="mailto:${email}" style="font-size: 18px; color: #0099ff; text-decoration: none; font-weight: 600;">${email}</a>
                                </p>
                              </div>
                            </td>
                          </tr>
                        </table>

                        <div style="margin-top: 30px;">
                          <div style="background: linear-gradient(90deg, #a855f7, #00d4ff); padding: 3px; border-radius: 14px; margin-bottom: 15px; display: inline-block;">
                            <h3 style="background: #ffffff; margin: 0; padding: 10px 24px; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 12px; color: #0f172a;">
                              💬 User Message
                            </h3>
                          </div>
                          
                          <div style="background: #ffffff; border: 3px solid transparent; background-image: linear-gradient(#ffffff, #ffffff), linear-gradient(135deg, #00d4ff, #a855f7, #d946ef); background-origin: border-box; background-clip: padding-box, border-box; padding: 24px 28px; border-radius: 16px; color: #1e293b; box-shadow: 0 10px 30px rgba(168, 85, 247, 0.15);">
                            <div style="line-height: 1.8; font-size: 16px; word-break: break-word; font-family: inherit;">
                              ${formattedMessage}
                            </div>
                          </div>
                        </div>
                        
                      </td>
                    </tr>

                    <tr>
                      <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 30px 40px; text-align: center; border-top: 3px solid #e2e8f0;">
                        <div style="background: linear-gradient(135deg, #00d4ff, #a855f7); padding: 18px 30px; border-radius: 50px; display: inline-block; margin-bottom: 15px; box-shadow: 0 6px 20px rgba(168, 85, 247, 0.3);">
                          <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: 700; letter-spacing: 0.5px;">
                            💡 Quick Reply Available
                          </p>
                        </div>
                        <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6; font-weight: 500;">
                          You can reply directly to this email to respond to <strong style="background: linear-gradient(135deg, #00d4ff, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${name}</strong>.
                        </p>
                      </td>
                    </tr>

                  </table>
                  
                  <table width="100%" max-width="650" border="0" cellpadding="0" cellspacing="0" style="max-width: 650px; margin-top: 25px;">
                    <tr>
                      <td style="text-align: center;">
                        <p style="color: #ffffff; font-size: 13px; font-weight: 600; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.2); letter-spacing: 0.5px;">
                          🔒 Securely routed via StuHive System
                        </p>
                        <p style="color: rgba(255,255,255,0.8); font-size: 11px; margin: 8px 0 0 0;">
                          Powered by Advanced Notification Infrastructure
                        </p>
                      </td>
                    </tr>
                  </table>

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