import os
import telebot
import requests
import base64

BOT_TOKEN = os.environ.get("BOT_TOKEN")
GEMINI_KEY = os.environ.get("GEMINI_KEY")

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['start'])
def start(m):
    bot.reply_to(m, "أهلا 👋 ابعتلي صورة الواجب وانا هحلهولك فورا ✨")

@bot.message_handler(content_types=['photo'])
def solve(m):
    try:
        bot.reply_to(m, "ثانية بقرأ الصورة وبحلها... ⏳")
        file_id = m.photo[-1].file_id
        file_info = bot.get_file(file_id)
        file_url = f"https://api.telegram.org/file/bot{BOT_TOKEN}/{file_info.file_path}"
        img_data = requests.get(file_url).content
        img_b64 = base64.b64encode(img_data).decode()
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_KEY}"
        payload = {"contents": [{"parts": [{"text": "حل الواجب في الصورة بالعربي بتفصيل وخطوات واضحة"}, {"inline_data": {"mime_type": "image/jpeg", "data": img_b64}}]}]}
        r = requests.post(url, json=payload, timeout=60)
        ans = r.json()['candidates'][0]['content']['parts'][0]['text']
        bot.reply_to(m, ans[:4000])
    except Exception as e:
        bot.reply_to(m, f"خطأ: {e}")

bot.infinity_polling()
