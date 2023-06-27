import * as fs from "fs";
import * as sqlite3 from "sqlite3";

const DBFiles = fs.readdirSync('./assets/db-builder/').filter(v => v.endsWith('.sql'));

for (const DBFile of DBFiles) {
    const dbPath = `./database/${DBFile.replace('.sql', '.db')}`;

    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, '');

        const Container = new sqlite3.Database(dbPath, err => {
        if (err) return console.error(err);
        });

        const BuildContainer = fs.readFileSync(`./assets/db-builder/${DBFile}`).toString();

        Container.run(BuildContainer);
        console.info('\x1b[31m%s\x1b[0m', `Please review '${DBFile.replace('.sql', '.db')}' before executing it.`);
    }
}
