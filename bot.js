const Discord = require ('discord.js')
const client = new Discord.Client

client.on('Ready', ()  => {
    console.log("Connceted as" + client.user.tag) //activation
    
    client.user.setActivity("With tits", {type:"Playing"} ) //Status
    
    client.guilds.forEach((guild) => { //console log for security purposes
        console.log(" - " + guild.name)

        
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
        })
    })
})


client.login("NzkwNDc5NzYxODg5MTY1MzQy.X-BNpQ.khou838TcAsml5Z-f7gtZe3B080")
