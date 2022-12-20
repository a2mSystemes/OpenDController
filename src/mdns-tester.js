import bonjour  from 'bonjour'


bonjour().find({type: 'http'}, (service) => {
    console.log("found : ", service);
})