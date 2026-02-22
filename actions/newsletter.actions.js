"use server";

import axios from 'axios';

export async function subscribeToNewsletter(subscriberEmail) {
  try {
    const requestId = Date.now();
    
    // Environment Variables Configuration
    // BREVO_SENDER_EMAIL: The verified sender email in your Brevo account (e.g., "newsletter@stuhive.com")
    // ADMIN_EMAIL: Where you want to receive notifications (e.g., "admin@stuhive.com" or "aadiwrld01@gmail.com")
    // BREVO_API_KEY: Your Brevo API key
    
    const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (!brevoSenderEmail || !adminEmail) {
      console.error("Missing required environment variables: BREVO_SENDER_EMAIL or ADMIN_EMAIL");
      return { success: false, error: "Server configuration error. Please contact support." };
    }

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: "StuHive Newsletter",
          email: brevoSenderEmail, // ✅ Verified Brevo sender email
        },
        to: [
          {
            email: adminEmail, // ✅ Admin receives the notification
            name: "StuHive Admin",
          },
        ],
        replyTo: {
          email: subscriberEmail, // ✅ Now if you hit "reply" in Gmail, it goes to the user
        },
        subject: `🎉 New Newsletter Subscriber! [ID: ${requestId}]`,
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
                    
                    <!-- Header with Logo and Gradient -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #00d4ff 0%, #0099ff 25%, #a855f7 75%, #d946ef 100%); padding: 0; position: relative; text-align: center;">
                        <div style="padding: 40px 40px 30px 40px;">
                          <!-- Logo -->
                          <img src="https://res.cloudinary.com/dmtnonxtt/image/upload/f_auto,q_auto,w_200/v1771787388/vemq0i4mhxloqcc528qx.png" alt="StuHive Logo" style="max-width: 180px; height: auto; margin: 0 auto 20px auto; display: block; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));" />
                          
                          <!-- Title -->
                          <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                            StuHive
                          </h1>
                          <p style="color: rgba(255,255,255,0.95); margin: 10px 0 0 0; font-size: 16px; font-weight: 600; letter-spacing: 1px;">
                            🎉 New Newsletter Subscriber 🎉
                          </p>
                        </div>
                        
                        <!-- Decorative Wave -->
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" style="display: block; width: 100%; height: auto; margin-bottom: -1px;">
                          <path fill="#ffffff" fill-opacity="1" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                        </svg>
                      </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                      <td style="padding: 50px 45px;">
                        
                        <!-- Celebration Banner -->
                        <div style="text-align: center; margin-bottom: 35px;">
                          <div style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #a855f7); padding: 4px; border-radius: 50px; box-shadow: 0 8px 25px rgba(168, 85, 247, 0.4);">
                            <div style="background: #ffffff; padding: 18px 40px; border-radius: 48px;">
                              <h2 style="margin: 0; font-size: 28px; font-weight: 900; background: linear-gradient(135deg, #00d4ff, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: 1px;">
                                🎊 Community Growing! 🎊
                              </h2>
                            </div>
                          </div>
                        </div>

                        <!-- Success Message -->
                        <div style="text-align: center; margin-bottom: 35px;">
                          <p style="margin: 0; font-size: 18px; color: #475569; line-height: 1.7; font-weight: 500;">
                            Someone just joined the <strong style="background: linear-gradient(135deg, #00d4ff, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 800;">StuHive community</strong> via the newsletter signup! 🚀
                          </p>
                        </div>

                        <!-- Subscriber Info Card -->
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%); border-radius: 18px; border: 3px solid transparent; background-image: linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%), linear-gradient(135deg, #00d4ff, #a855f7, #d946ef); background-origin: border-box; background-clip: padding-box, border-box; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                          <tr>
                            <td style="padding: 35px 40px;">
                              
                              <!-- Email Section -->
                              <div style="text-align: center; margin-bottom: 25px;">
                                <div style="background: linear-gradient(90deg, #a855f7, #00d4ff); padding: 3px; border-radius: 14px; display: inline-block; margin-bottom: 15px;">
                                  <div style="background: #ffffff; padding: 10px 28px; border-radius: 12px;">
                                    <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;">
                                      📧 Subscriber Email
                                    </p>
                                  </div>
                                </div>
                                
                                <div style="background: #ffffff; padding: 20px 30px; border-radius: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); display: inline-block; min-width: 280px;">
                                  <a href="mailto:${subscriberEmail}" style="font-size: 22px; color: #0099ff; text-decoration: none; font-weight: 700; display: block; word-break: break-all;">
                                    ${subscriberEmail}
                                  </a>
                                </div>
                              </div>

                              <!-- Divider -->
                              <div style="height: 3px; background: linear-gradient(90deg, transparent, #00d4ff, #a855f7, transparent); margin: 25px 0; border-radius: 10px; opacity: 0.3;"></div>

                              <!-- Request ID Section -->
                              <div style="text-align: center;">
                                <div style="display: inline-block; background: rgba(168, 85, 247, 0.1); padding: 12px 24px; border-radius: 50px; border: 2px dashed #a855f7;">
                                  <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 600;">
                                    <span style="color: #a855f7; font-weight: 800;">🆔 Request ID:</span> <span style="color: #0f172a; font-weight: 700; font-family: 'Courier New', monospace;">${requestId}</span>
                                  </p>
                                </div>
                              </div>
                              
                            </td>
                          </tr>
                        </table>

                        <!-- Action Tip -->
                        <div style="background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%); border-left: 5px solid #f59e0b; padding: 20px 25px; border-radius: 12px; margin-top: 25px;">
                          <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.7; font-weight: 600;">
                            💡 <strong style="color: #78350f;">Pro Tip:</strong> Hit "Reply" to reach out directly to <span style="color: #0099ff; font-weight: 700;">${subscriberEmail}</span>
                          </p>
                        </div>
                        
                      </td>
                    </tr>

                    <!-- Stats Bar -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px 40px; text-align: center;">
                        <div style="margin-bottom: 15px;">
                          <div style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #a855f7); padding: 15px 35px; border-radius: 50px; box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4);">
                            <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 800; letter-spacing: 1px;">
                              ✨ Growing Community ✨
                            </p>
                          </div>
                        </div>
                        <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6; font-weight: 500;">
                          Another member joined the <strong style="color: #00d4ff;">StuHive family</strong>! Keep building amazing experiences. 🌟
                        </p>
                      </td>
                    </tr>

                  </table>
                  
                  <!-- Footer Text -->
                  <table width="100%" max-width="650" border="0" cellpadding="0" cellspacing="0" style="max-width: 650px; margin-top: 25px;">
                    <tr>
                      <td style="text-align: center;">
                        <p style="color: #ffffff; font-size: 13px; font-weight: 600; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.2); letter-spacing: 0.5px;">
                          🔒 Securely routed via StuHive Newsletter System
                        </p>
                        <p style="color: rgba(255,255,255,0.8); font-size: 11px; margin: 8px 0 0 0;">
                          Automated Notification • Powered by Advanced Infrastructure
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>

          </body>
          </html>
        `,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY, 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Newsletter Subscription Error:', error.response?.data || error.message);
    
    const errorMessage = error.response?.data?.message || "Failed to join. Try again later.";
    return { success: false, error: errorMessage };
  }
}
