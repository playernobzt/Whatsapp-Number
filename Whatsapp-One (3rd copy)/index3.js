const { DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');

const { default: makeWASocket, Browsers } = require('@whiskeysockets/baileys');
const convert = require('./convertertime.js');
// const axios = require('axios');

// async function sendToGsheet(data1, callback) {
//   const response = await axios.get(
//     `https://script.google.com/macros/s/AKfycbwkGMkfLFCv1LIA87kOYJdvzQ74kgr4UUHAKrNj5uX0rdYg6pS2Pw4VaoaILk-Kl00biQ/exec?action=register&keterangan=${data1.keterangan}&tanggal=${data1.tanggal}&jam=${data1.jam}:${data1.menit}&hari=${data1.hari}&nama=${data1.namaPengirim}&whatsapp=${data1.noPengirim}`,
//   );

//   callback(await response.data);
// }

async function connectionlogic() {
  const { state, saveCreds } = await useMultiFileAuthState('authUser');
  const client = makeWASocket({
    printQRInTerminal: true,
    browser: Browsers.ubuntu('Server'),
    auth: state,
  });

  client.ev.on('connection.update', async (update) => {
    const { connection, LastDisconnect } = update || {};

    // if (qr) {
    //   console.log(qr);
    // }
    if (connection === 'close') {
      const shouldReconnect = LastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        connectionlogic();
      }
    } else if (connection === 'open') {
      console.log('AUTH BERHASIL');
    }
  });

  client.ev.on('creds.update', saveCreds);

  client.ev.on('messages.upsert', (m) => {
    function sendss(id, text) {
      client.sendMessage(id, { text: text });
    }

    console.log(JSON.stringify(m, undefined, 2));
    const messageTypeNotify = m.type.toString();
    const messageGrup = m.messages[0].key.remoteJid.includes('@g.us');
    const fromMe = m.messages[0].key.fromMe;
    // Pesan pribadi
    if (!messageGrup && !fromMe) {
      const noPengirim = m.messages[0].key.remoteJid.replace('@s.whatsapp.net', '');
      const namaPengirim = m.messages[0].pushName;
      const bodyPesan = m.messages[0].message.conversation;
      const untukDikirim = `From: ${namaPengirim} \nNumber: ${noPengirim} \nBody : \n ${bodyPesan}`;

      sendss('6282347431338@s.whatsapp.net', untukDikirim);
    }
    // -----------------------------------------------------

    // Pesan dari grup
    if (messageGrup && messageTypeNotify === 'notify') {
      const messageType = Object.keys(m.messages[0].message)[0].toString();
      const fromMe = m.messages[0].key.fromMe;
      const noPengirim = m.messages[0].key.participant.replace('@s.whatsapp.net', '');
      const timeStamp = convert(m.messages[0].messageTimestamp * 1000);
      const namaPengirim =
        noPengirim === '6282347431338'
          ? 'Ijal'
          : noPengirim === '6282290561992'
          ? 'Rio'
          : noPengirim === '6282291930255'
          ? 'Leo'
          : noPengirim === '6289529478872'
          ? 'Devira'
          : noPengirim === '6282292464710'
          ? 'Putri'
          : noPengirim === '6285256474235'
          ? 'Stesi'
          : noPengirim === '6282353049095'
          ? 'Putra'
          : noPengirim === '6282271559885'
          ? 'Zeinal'
          : noPengirim === '6282191024904'
          ? 'Ifa'
          : noPengirim === '6281245945386'
          ? 'Nia'
          : noPengirim === '6287855582048'
          ? 'Kemal'
          : '';

      // Jika pesan dri grup berupa gambar
      if (messageType === 'senderKeyDistributionMessage' || (messageType === 'imageMessage' && !fromMe)) {
        const caption = m.messages[0].message.imageMessage.caption.toLocaleLowerCase();
        const keterangan = caption.includes('sakit')
          ? 'Sakit'
          : caption.includes('kurang sehat')
          ? 'Sakit'
          : caption.includes('kurang enak badan')
          ? 'Sakit'
          : caption.includes('maaf')
          ? 'Sakit'
          : caption.includes('mohon maaf')
          ? 'Sakit'
          : caption.includes('belum bisa')
          ? 'Sakit'
          : timeStamp.jam < 16
          ? 'Masuk'
          : 'Pulang';

        const data = {
          keterangan: keterangan,
          tanggal: timeStamp.tanggal,
          jam: timeStamp.jam,
          menit: timeStamp.menit,
          hari: timeStamp.hari,
          namaPengirim: namaPengirim,
          noPengirim: noPengirim,
        };

        console.log(data);
      }
    }
  });
}

connectionlogic();
