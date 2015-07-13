var fs = require('fs');
var stream = require('stream');
var Fiber = require('fibers');
var Bunzip = require('seek-bzip');

/** Use node-fibers to convert our synchronous Stream interface to the
  * standard node asynchronous interface. */
var BunzipStream = function() {
    var trans = this;
    stream.Transform.call(trans); // initialize superclass.
    this._fiber = new Fiber(function() {
        var buffer = [], pos = 0;
        var inputStream = new Bunzip.Stream();
        inputStream.readByte = function() {
            if (pos >= buffer.length) {
                buffer = Fiber.yield(); pos = 0;
            }
            return buffer[pos++];
        };
        var outputStream = new Bunzip.Stream();
        outputStream.writeByte = function(_byte) {
            this.write(new Buffer([_byte]),0,1);
        };
        outputStream.write = function(buffer, bufOffset, length) {
            if (bufOffset !== 0 || length !== buffer.length) {
                buffer = buffer.slice(bufOffset, bufOffset + length);
            }
            trans.push(buffer);
        };
        Bunzip.decode(inputStream, outputStream);
    });
    this._fiber.run();
};
BunzipStream.prototype = Object.create(stream.Transform.prototype);
BunzipStream.prototype._transform = function(chunk, encoding, callback) {
    this._fiber.run(chunk);
    callback();
};

var outputStream = fs.createReadStream('/data/RC_2015-05.bz2').pipe(new BunzipStream());

outputStream.on('readable', function() {
              var b = outputStream.read(), i;
              console.log(b.toString());
          }).on('end', function() {
              assert.equal(pos, data.length);
              assert.equal(data.toString('hex'), referenceData.toString('hex'));
              callback();
          });
