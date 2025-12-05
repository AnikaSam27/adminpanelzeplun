// =====================
// 🔔 TELEGRAM SENDER
// =====================
export const sendTelegramUpdate = async (message) => {
  try {
    const botToken = "8379481651:AAG61cqEsm-02n1qUkLvJgRSeEK7UEipk1s";
    const chatId = "7960347614";

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (error) {
    console.error("Telegram Error:", error);
  }
};


// =====================
// 📱 WHATSAPP SENDER (UltraMsg)
// =====================
export const sendWhatsAppUpdate = async (phone, message) => {
  try {
    const instanceId = "YOUR_ULTRAMSG_INSTANCE_ID";
    const token = "YOUR_ULTRAMSG_TOKEN";

    await fetch(`https://api.ultramsg.com/${instanceId}/messages/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token,
        to: phone,
        body: message,
      }),
    });
  } catch (error) {
    console.error("WhatsApp Error:", error);
  }
};
