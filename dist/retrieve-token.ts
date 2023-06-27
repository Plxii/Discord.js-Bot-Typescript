import * as sqlite3 from "sqlite3";
import { Discord_ClientCredentials_Container } from "../database/container/types";

const dbPath = process.env.DB_PATH;

const DiscordContainer = new sqlite3.Database(dbPath, err => {
    if (err) return console.error(err);
});

DiscordContainer.get('SELECT * FROM ClientCredentials', (err, rows: Discord_ClientCredentials_Container) => {
    if (err) return console.error(err);

    console.log(rows.Token);
});

DiscordContainer.close(err => {
    if (err) console.error(err);
});
