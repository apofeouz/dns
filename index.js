require("dotenv").config();
const { Telegraf, Markup } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN);
const cron = require('node-cron');
const chat_id = '-545281554';
const chat_id_Corp = '-1001426777808';
const convert = require('xml-js');
const fs = require('fs');
const trafficWeatherChat = require( './Componets/trafficWeatherChat.js');
const inn = require('./Componets/Inn.js');





const watzap = cron.schedule('*/60 09-18 * * 1-5', () => {
  bot.telegram.sendMessage(chat_id, 'ᴨᴩᴏʙᴇᴩьᴛᴇ ʙᴀᴛɜᴀᴨ', Markup.inlineKeyboard([[Markup.button.callback("👍 0", "likes:0")]]) );
  bot.telegram.sendMessage(chat_id_Corp, 'ᴨᴩᴏʙᴇᴩьᴛᴇ ʙᴀᴛɜᴀᴨ', Markup.inlineKeyboard([[Markup.button.callback("👍 0", "likes:0")]]) );
});
watzap.start();
const rezerv = cron.schedule('*/60 09-18 * * 1-5', () => {
  bot.telegram.sendMessage(chat_id_Corp, 'Проверьте резервы', Markup.inlineKeyboard([[Markup.button.callback("👍 0", "likes:0")]]) );
});
rezerv.start();

const schet = cron.schedule('*/60 09-18 * * 1-5', () => {
  bot.telegram.sendMessage(chat_id_Corp, 'Проверьте наличие адреса и телефона в выставленных счетах', Markup.inlineKeyboard([[Markup.button.callback("👍 0", "likes:0")]]) );
});
schet.start();

//Привет команды
bot.hears('Привет', async ctx => {
    await ctx.reply(`Привет, ${ctx.message.from.first_name} узнать что может бот по команде /help`);
  }); 

  //  //Доброе утро
  //  cron.schedule(translate('on mon tue wed thu fri at 09:00:00 every'), () => {
  //    trafficWeatherChat.trafficWeatherChat();
  //  });
 
  //Конец дня
  cron.schedule('0 18 * * 1-5', () => {
    bot.telegram.sendMessage(chat_id, 'День окончен! Не забудь завершить работу в Битрикс! \ud83d\ude09', trafficWeatherChat.trafficWeatherChat());
  });
  
  //Хелпер
  bot.help((ctx) => ctx.reply('Список доступных крманд:  \n Напиши боту \ud83d\udc49 Курс \n Напиши боту \ud83d\udc49 Погода \n Напиши боту \ud83d\udc49 Пробки \n Напиши боту \ud83d\udc49 Новость \n Напиши боту \ud83d\udc49 ИНН + цифры \nИспользуй эти команды непосредственно в чате с ботом а не в общем чате'));
 
  bot.on('sticker', ctx => {
    ctx.reply('Прикольный стикер');
  });
//Новость
//   cron.schedule(translate('on mon tue wed thu fri at 10:00:00 every'), () => {
//  news.news();

//   });

  //Поиск по ИНН
  bot.hears(/ИНН/i, async (ctx) => {
    let Inn = ctx.message.text.replace('ИНН', '');
    var id = `${ctx.from.id}`;
    inn.inn(Inn, id);
  });
  

 //Доступные программы
 bot.on('message', ctx => {
  (async () => {
    //Погода и Пробки
    const getData = async () => {
      const response = await fetch("https://export.yandex.ru/bar/reginfo.xml?region=39");
      const data = await response.text();
      dataGlobal = data;
      return data;
    };
    var xml = await getData();
    var result = convert.xml2json(xml, { compact: true, spaces: 4 });
    var json = JSON.parse(result);
    var traffic = json.info.traffic;
    var weather = json.info.weather.day.day_part[0];
    var str = traffic.region.level._text;
    var num = Number(str);
    var level = (num === 0 ? num + ' баллов' :
      num === 1 ? num + ' балл' :
        num >= 5 ? num + ' баллов' : num + ' балла');
    var icon = (traffic.region.icon._text === 'green' ? '\ud83d\udc9a' :
      traffic.region.icon._text === 'yellow' ? '\ud83d\udc9b' :
        traffic.region.icon._text === 'red' ? '\u2764\ufe0f' : ' ');
    if (ctx.message.text === 'Погода') {
      ctx.reply('Сейчас ' + weather.weather_type._text +
        ' Температура: ' + weather.temperature._text + ' ℃' + '\n' + 'Направления ветра: ' + weather.wind_direction._text + ', скорость: ' + weather.wind_speed._text + ' m/c');
    } else if (ctx.message.text === 'Пробки') {
      ctx.reply('Пробки: ' + level + ' ' + icon + " " + traffic.region.hint[0]._text);
    } else if (ctx.message.text === 'Курс') {
      fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        .then(res => res.json())
        .then(json => {
          var kurs = json.Date.slice(0, 10)
          ctx.reply(`По данным ЦБР на ${kurs}: \ud83c\uddfa\ud83c\uddf8 ${json.Valute.USD.Value.toFixed(2)} ${json.Valute.USD.Value < json.Valute.USD.Previous ? '\ud83d\udd3b' : '\ud83d\udd3a'}` +
            ` \ud83c\uddea\ud83c\uddfa ${json.Valute.EUR.Value.toFixed(2)} ${json.Valute.EUR.Value < json.Valute.EUR.Previous ? '\ud83d\udd3b' : '\ud83d\udd3a'}`);
        });
    } else if (ctx.message.text === 'Новость'){
      fs.readFile('Componets/object.json', (err, data) => {
        if (err) throw err
        let results = JSON.parse(data);
        ctx.replyWithHTML(`https://www.consultant.ru` + results[0].link)
       });
    }
  })
    (); 
});

//РЕАКЦИЯ
bot.action(/likes:([0-9]+)/, async (ctx) => {
  // //     let id_ms = ctx.update.callback_query.message.message_id
// //     let id_user = ctx.update.callback_query.from.username
// //    //функция удаления сообщения из базы данных
//   // function sayHi() {
//   //   connection.query("DELETE FROM users WHERE ms=?", [id_ms], function (err, row) {
//   //     if (row && row.length) {
//   //       console.log('Удалили сообщение из базы');
//   //       //закрыли подключение к БД
//   //       connection.end
//   //       console.log('Закрыли соединение с базой данных.');
//   //     }
//   //   })
//   // }
//   //  //удаляем сообщение из базы и чат бота
//   // setTimeout(sayHi, 10 * 1000);
//   // setTimeout(() => ctx.deleteMessage(id_ms), 10 * 1000)
//     //Открыли подключение к БД
//     // connection.connect(function (err) {
//     //   if (err) {
//     //     return console.error('ошибка: ' + err.message);
//     //   }
//     //   console.log('Подключились к базе данных MySQL');
//     // });
//     // //вывод из базы данных
//     // connection.query("SELECT user, ms FROM users WHERE user = ? AND ms = ?", [id_user, id_ms], function (err, row) {
//     //   if (row && row.length) {
//     //     console.log('вы уже кликали');
//     //     //закрыли подключение к БД
//     //     connection.end
//     //     console.log('Закрыли соединение с базой данных.');
//     //   } else {
//         //запись в базу
//         // const sql = `INSERT INTO users(user, ms) VALUES ("${id_user}", ${id_ms})`;
//         // connection.query(sql, function (err, results) {
//         //   if (err) console.log(err);
//         //   console.log('Успешно');
//         //   connection.end
//         //   console.log('Закрыли соединение с базой данных.');
//         // });

 ctx.answerCbQuery();
 let likes = +ctx.match[1] + 1;
 return ctx.editMessageReplyMarkup(
   Markup.inlineKeyboard(
     [
       [Markup.button.callback(`👍 ${likes}`, `likes:${likes}`)]
     ]
   ).reply_markup
 );
//   }
})


  // bot.on('edited_message', async ctx => {
  //   await ctx.reply(`${ctx.from.first_name}, вы успешно изменили сообщение`)
  // })
 
 bot.launch();