export default function auth(socket) {
    // not sure why we need this?
    socket.on('login', function (data, res) {
        if(data.username === 'sally' && data.password === '123') res({ok: true})
        else res({ok: false})
    })
}