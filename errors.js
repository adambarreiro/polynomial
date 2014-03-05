// -----------------------------------------------------------------------------
// Name: /errors.js
// Author: Adam Barreiro Costa
// Description: 
// Updated: 03-03-2014
// -----------------------------------------------------------------------------
 
function handle403(err, req, res, next) {
    if (err.status !== 403) {
        return next();
    } else {
        var html = ["<h1>Oooops :(</h1>",
                    "<p>Parece ser que has hecho algo que no debías o el servidor no se ha fiado de tu petición al revisarla y la ha rechazado.</p>",
                    "<p>No pasa nada, vuelve a intentarlo. <u>Vuelve atrás y recarga la página</u>, que esto no se ha roto.</p>",
            ].join("\n");
        res.send(html);
    }
    
}
exports.handle403 = handle403;