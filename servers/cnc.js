const ServerAbstract = require('./serverAbstract.js');

//to create more server classes, copy this and change the webhook_members. also add another case to ServerFactory
class Cnc extends ServerAbstract {
    constructor() {
        super();
        this.webhook_members = {
            'hackermango': '390237661471834112/X449qVEzdGBNkACqPVEXEYQmmiPsNZrkAHJy9ANAyIJWA0HkmbEnkupqs1eMvBdTTlJ3',
            'apolly': '401028144167125003/yOqEHDdg9o9DzOSKbzkAJB4fz5eT1lSbrwBNeWSrcilINTf8nR91Uuq9Gcx1hiCCO83F',
            'p10': '407906839905435649/HTiZBH0UDrX028DkSHjyfvy-1Ig6PX06zdI_T5iiI9ATNe1vw3rn7Qj-LJpMzi6Qu2qn',
            'birthday boi': '424212530320113676/e_MR1i_6lH4th8NEB_slEDQ10FqsqZxbuzu3Sjd5bdGOXR9VxER8oTTXTdf4i_reKETo'
        };

        this.server_users = {
            'rai': '254723676358836225'
        }

        this.server_id = '312178681298550785';

        this.server_json_url = this.server_json_url.replace('<server_id>', this.server_id);
    }
}

module.exports = Cnc;
