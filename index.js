const { Telegraf } = require('telegraf');
const OpenAI = require('openai');
const express = require('express');

const BOT_TOKEN = process.env.BOT_TOKEN || 'PUT_YOUR_BOT_TOKEN_HERE';
const OPENAI_KEY = process.env.OPENAI_KEY || 'PUT_YOUR_OPENAI_KEY_HERE';

const bot = new Telegraf(BOT_TOKEN);
const openai = new OpenAI({ apiKey: OPENAI_KEY });

bot.start((ctx) => ctx.reply('أهلا! ابعتلي صورة الواجب وأنا أحلهولك 📚'));

bot.on('photo', async (ctx) => {
  try {
    await ctx.reply('ثواني بحل الواجب... ⏳');
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const fileLink = await ctx.telegram.getFileLink(photo.file_id);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: "حل الواجب اللي في الصورة دي بالتفصيل وبالعربي وبخطوات واضحة." },
          { type: "image_url", image_url: { url: fileLink.toString() } }
        ]
      }]
    });
    await ctx.reply(response.choices[0].message.content);
  } catch (e) {
    console.log(e);
    ctx.reply('حصل مشكلة، جرب صورة أوضح');
  }
});

bot.on('text', (ctx) => ctx.reply('ابعتلي صورة الواجب مش نص 😊'));

const app = express();
app.get('/', (req, res) => res.send('Bot is running'));
app.listen(process.env.PORT || 3000);
bot.launch();
console.log('Bot started');
