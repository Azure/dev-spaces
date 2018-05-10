//
// Use the code in this file to propagate specific headers from an existing
// http.IncomingMessage object into a headers object for an outgoing request.
//
// Example usage given an existing 'request' http.IncomingMessage object:
//
//   http.get({
//       hostname: "backend",
//      headers: propagateHeaders.from(request, {
//          additional: "header"
//      })
//   }, res => { ... });
//

var metaHeader = "context-headers";

function using(metaHeaderName) {
    metaHeader = metaHeaderName.toLowerCase();
}
exports.using = using;

function from(req, headers) {
    headers = headers || {};
   if (req.headers[metaHeader]) {
        headers[metaHeader] = req.headers[metaHeader];
        headers[metaHeader].split(",").forEach(function (header) {
            header = header.toLowerCase();
            if (header[header.length - 1] === "*") {
              header = header.slice(0, -1);
              for (var candidate in req.headers) {
                if (candidate.indexOf(header) === 0) {
                  headers[candidate] = req.headers[candidate];
                }
              }
            } else if (req.headers[header]) {
                headers[header] = req.headers[header];
            }
        });
    }
    return headers;
}
exports.from = from;
