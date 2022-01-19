const db = require('./src/utils/database');

const message = {
    log: '\33[90;1m[*]\u001b[0m',
    delete: '\u001b[31mDeleted\u001b[0m',
    error: '\u001b[31mError\u001b[0m',
    create: '\u001b[32;1mCreated\u001b[0m',
    done: '\u001b[32;1mDone ✓\u001b[0m'
};

function highlight(str) {
    return '\u001b[36m' + str + '\u001b[0m';
}

db.query('DROP TABLE IF EXISTS `users`', (err, res) => {
    if (!err) {
        if (res['warningStatus'] === 0)
            console.log(`${message.log} ${message['delete']} table ${highlight('users')}.`);

        db.query(
            'CREATE TABLE IF NOT EXISTS `users` ( `id` int(11) NOT NULL AUTO_INCREMENT, `username` varchar(20) COLLATE utf8mb4_bin NOT NULL, `email` varchar(100) COLLATE utf8mb4_bin NOT NULL, `password` varchar(400) COLLATE utf8mb4_bin NOT NULL, `perm` varchar(10) COLLATE utf8mb4_bin NOT NULL DEFAULT \'user\', `verified` tinyint(1) NOT NULL DEFAULT \'0\', `banned` tinyint(1) NOT NULL DEFAULT \'0\', PRIMARY KEY (`id`) ) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin',
            (err, res) => {
                if (!err) {
                    console.log(`${message.log} ${message['create']} table ${highlight('users')}.`);
                    console.log(`${message['done']}`);
                    process.exit();
                }
                else
                    console.log(`${message['error']} while trying to delete table ${highlight('users')}.`);
            }
        )
    }
    else
        console.log(`${message['error']} while trying to delete table ${highlight('users')}.`);
})