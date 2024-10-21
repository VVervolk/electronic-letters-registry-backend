const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.meta.ua",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "nikita.volkov@meta.ua",
    pass: "ahU24V9Ky7",
  },
});

async function sendEmail(email, password, name) {
  try {
    const info = await transporter.sendMail({
      from: "Єдиний реєстр листів <nikita.volkov@meta.ua>",
      to: `${email}`,
      subject: "Дані для входу в Єдиний реєстр листів",
      html: `<p>Шановний(-а) <b>${name}</b>, вітаємо з реєстрацією в Єдиному реєстрі листів</p><br>
        <p>Ваші дані для входу:</p><br>
        <span>Логін: ${email}</span><br>
        <span>Пароль: ${password}</span>`,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error(error);
  }
}

module.exports = sendEmail;
