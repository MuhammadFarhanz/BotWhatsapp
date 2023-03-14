const axios = require('axios');
const { API_KEY_OPEN_AI } = require('../config');

const ChatAIHandler = async (text, msg) => {
   // console.log(text);
   // console.log(msg);
   const firstSlashIndex = text.indexOf('/');
// const cmd = (firstSlashIndex !== -1) ? text.substring(firstSlashIndex + 1).split('/') : [];
   const cmd = (firstSlashIndex !== -1) ? [text.substring(0, firstSlashIndex), text.substring(firstSlashIndex + 1)] : [text];
  
   // const cmd = text.split('/')
   // console.log(cmd);
   
   // console.log(firstSlashIndex );
   // console.log(cmd.length < 2)

   if (cmd.length > 2 ) {
      return msg.reply('salah blok') 
    }

    msg.reply('mikir bentar')

    const question = cmd[1];
    const response = await ChatGPTRequest(question);
   //  console.log(response)
   //  console.log(!response.isSucces)
    if(!response.isSucces){
      return msg.reply(response.message)
    }

    return msg.reply(response.data)


}


const ChatGPTRequest = async (text) => {
   
   const result = {
      isSucces: false,
      data: "",
      message: "",
   }

   return await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/completions',
      data: {
         "model": "text-davinci-003",
         "prompt": text,
         "max_tokens": 1000,
         "temperature": 0
      },
      headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${API_KEY_OPEN_AI}`
      }
   })
   .then((response) => {

     if(response.status === 200) {
      const { choices } = response.data
      // console.log(response)
      // console.log(choices)

      if(choices && choices.length){
         result.isSucces = true;
         result.data = choices[0].text;
      }else{
         result.isSucces = false;
         result.message = 'gatau gw';
      }
      
      return result;
     }

   })
   .catch(() => {

   })



}

module.exports = {
    ChatAIHandler
}