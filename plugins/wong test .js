const lusifar = require('../events');
const {MessageType, MessageOptions, Mimetype} = require('@adiwajshing/baileys');
const axios = require('axios');
const { errorMessage, infoMessage } = require('../helpers');
const YTV_DESC = "Youtube song Downloader "
const YT_NEED = "*need word!.*"
const NO_RESULT = "*🌀can't Find Anything...*"
const config = require('../config');
let KSK = config.WORKTYPE == 'public' ? false : true
//උස්සන්නද ආවෙ බේසිකයෝ.බොහොම අමාරුවෙන් හැදුවෙ.උස්සන එකා අවජාතකයෙක් කියල හිතාගන්න පුලුවන් පොන්න හැත්ත.හුකන පොන්නයෝ
//normal mode
//with info
    lusifar.addCommand({ pattern: 'song ?(.*)', fromMe: KSK, deleteCommand: false, dontAddCommandList:true,  deleteCommand: false}, async (message, match) => {
        const linkk = match[1]
        if (!linkk) return await message.client.sendMessage(message.jid,YT_NEED,MessageType.text)
        await message.client.sendMessage(message.jid,config.SONGD,MessageType.text, {quoted: message.data});
        await axios
          .get(`https://api-alphabot.herokuapp.com/api/downloader/youtube/playmp3?query=${linkk}&apikey=Alphabot`)
          .then(async (response) => {
            const {
              mp3,title,
            } = response.data.results
            const videoBuffer = await axios.get(mp3, {responseType: 'arraybuffer'})
            const cptt = title
            await message.client.sendMessage(message.jid,config.SONGU,MessageType.text, {quoted: message.data});
            await message.client.sendMessage(message.jid,Buffer.from(videoBuffer.data), MessageType.audio, { mimetype: 'audio/mpeg', quoted: message.data})
            await message.client.sendMessage(message.jid,Buffer.from(videoBuffer.data), MessageType.document, {filename: cptt + '.mp3',mimetype: 'audio/mpeg', quoted: message.data})
        })
        .catch(
          async (err) => await message.client.sendMessage(message.jid,NO_RESULT,MessageType.text, {quoted: message.data}),
        )
      },
    )
