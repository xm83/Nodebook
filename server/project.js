import { Project } from './models';

const currentDocs = {};

// functions that handle collaboration
export default function project(socket, io) {
    // openDocument
    socket.on('openDocument', (data, next) => {
        socket.join(data.docId)
        let doc = currentDocs[data.docId];

        console.log("!!!doc", doc);
        if (doc) {
            // send that back instead
            let err = null;
            next({err, doc})
        } else {
            //send back saved version from db
            Project.findOne({
                _id: data.docId
            }, (err, doc) => next({err, doc}))
        }
    })

    // syncDocument
    socket.on('syncDocument', (data) => {
        console.log("server syncing document with data", data);
        // tell everyone in the room to set the state of editorStateStyle

        // save current version in memory
        currentDocs[data.docId] = data;
        io.to(data.docId).emit('syncDocument', data)
    })

    // closeDocument
    socket.on('closeDocument', (data) => {
        console.log("server closing document with data", data);
        socket.leave(data.docId);
    })
}