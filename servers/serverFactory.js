
const Cnc = require('./cnc.js');

class ServerFactory {
    static factory(type) {
        switch (type) {
            case 'cnc':
                var obj = new Cnc();
                break;
            default:
                throw `Class ${type} not found`;
        }

        return obj;
    }
}

module.exports = ServerFactory;
