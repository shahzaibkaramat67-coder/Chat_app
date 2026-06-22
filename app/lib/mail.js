import nodemailer from "nodemailer";
export const mail = async(mail, name, type)=>{
    console.log("here mail mail funtion start");
    
  try {
      const transport = nodemailer.createTransport({
             service : "gmail",
          port : 465,
          secure : true,
          auth : {
              user : process.env.USER_NAME ,
              pass : process.env.PASS
          }
      })
    console.log("here optional funtion check");
    
  
        const mailOptions = {
      from: process.env.USER_NAME,
      to: mail,
      subject: "Welcome to OmniAI Tools 🚀",
      html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
              <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
                  
                  <h1 style="color: #111827; text-align: center;">
                      Welcome to OmniAI Tools 🚀
                  </h1>
  
                  <p style="font-size: 16px; color: #374151;">
                      Hi ${name || "User"},
                  </p>
  
                  <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                      Thank you for joining <b>OmniAI Tools</b>.
                      Your account has been successfully created.
                  </p>
  
                  <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                      You can now access powerful AI tools for:
                  </p>
  
                  <ul style="color: #374151; line-height: 1.8;">
                      <li>AI Writing</li>
                      <li>Code Generation</li>
                      <li>SEO Optimization</li>
                      <li>Social Media Content</li>
                      <li>Resume & Cover Letter Creation</li>
                      <li>Business & Marketing Tools</li>
                  </ul>
  
                  <div style="text-align: center; margin-top: 30px;">
                      <a 
                          href="http://localhost:3000/${type === "Forgot" ? "updatePassword" : "login"}"
                          style="
                              background-color: #111827;
                              color: white;
                              padding: 12px 24px;
                              text-decoration: none;
                              border-radius: 6px;
                              font-size: 16px;
                          "
                      >
                          ${type === "Forgot" ? "Update Password" : "Login Now"}
                      </a>
                  </div>
  
                  <p style="margin-top: 40px; color: #6B7280; font-size: 14px;">
                      If you did not create this account, please ignore this email.
                  </p>
  
                  <hr style="margin-top: 30px;" />
  
                  <p style="text-align: center; color: #9CA3AF; font-size: 13px;">
                      © 2026 OmniAI Tools. All rights reserved.
                  </p>
  
              </div>
          </div>
      `
  }
  const result =await transport.sendMail(mailOptions)
  console.log("error from amil", result.messageId);
  
  } catch (error) {
    console.error(error);
    
  }


}