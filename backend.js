const startDate = Date.now();
console.log('Node file loaded');
let shuttingDown = false;
let maintenance = false;

// Server modules //
const fs = require('fs');
console.log(`fs module loaded ${Date.now() - startDate}ms`);
const http = require('http');
console.log(`http module loaded ${Date.now() - startDate}ms`);
const express = require('express');
console.log(`express module loaded ${Date.now() - startDate}ms`);
const ws = require('ws');
console.log(`ws module loaded ${Date.now() - startDate}ms`);
const path = require('path');
console.log(`path module loaded ${Date.now() - startDate}ms`);

const rCrypto = require('crypto');
console.log(`crypto module loaded ${Date.now() - startDate}ms`);
const better_sqlite3 = require('better-sqlite3');
console.log(`better-sqlite3 module loaded ${Date.now() - startDate}ms`);
const msgpack_lite = require('msgpack-lite');
console.log(`msgpack-lite module loaded ${Date.now() - startDate}ms`);

console.log('Starting server...');

const setup = JSON.parse(fs.readFileSync('setup/essential.json'));

if (setup.blockIframes) console.log('Iframe embedding blocked');

setup.admins = setup.admins.map(e => e.toLowerCase());
const db = better_sqlite3(setup.dbpath);

db.pragma('journal_mode = WAL');

let online = 0,
    lastId = setup.lastId;

const chunks = {},
    accounts = {};

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = http.createServer(app);
const wss = new ws.WebSocketServer({ server });
console.log('WebSocket server created');

wss.on('connection', (ws, req) => {
    const ip = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : req.socket.remoteAddress;

    const sdata = {
        clientId: idGenerate().toString(),
        username: '',
        anonymousMode: false,
        admin: false,
        color: 0,
        l: [0, 0]
    };
    ws.sdata = sdata;

    console.log(`online count of ${++online} from ${ip}`);
    broadcast({ online: online });

    wss.clients.forEach(client => {
        if (client === ws) return;
        if (client.readyState === ws.OPEN) {
            send(ws, {
                cu: {
                    id: client.sdata.clientId,
                    l: client.sdata.l,
                    c: client.sdata.color,
                    n: client.sdata.anonymousMode ? '' : sdata.username
                }
            })
        }
    });
    send(ws, { id: sdata.clientId });

    if (setup.ipbans.includes(ip)) {
        console.log(`banned IP detected (ws): ${ip}`);
        send(ws, { alert: 'IP-Banned.' });
        ws.close(3003, 'IP-banned')
    }

    // Message event handler
    ws.on('message', buffer => {
        let decoded;
        try {
            decoded = msgpack_lite.decode(buffer);
            console.log(decoded, ` from ${ip} username ${sdata.username || '(none)'} id ${sdata.clientId}`)
        } catch (err) {
            return
        }

        if (!decoded || typeof decoded !== 'object') return;
        const key = Object.keys(decoded)[0];

        switch (key) {
            case 'r': {
                let arr = decoded[key];
                if (!Array.isArray(arr)) return;
                const chunksToLoad = {};
                for (let c of arr) {
                    if (!chunks[c]) {
                        chunks[c] = chunksToLoad[c] = [
                            Array(200).fill(' '), // chars
                            Array(200).fill(0), // color
                            false // protected
                        ];
                    } else {
                        chunksToLoad[c] = chunks[c]
                    }
                    send(ws, { chunks: chunksToLoad });
                }
                break
            }

            case 'e': {
                const e = decoded[key]; // [[char, color, chunkX, chunkY, index], ...]
                for (let edit of e) {
                    const [char, clr, cx, cy, idx] = edit;
                    const chunkKey = `${cx},${cy}`;
                    if (chunks[chunkKey]) {
                        chunks[chunkKey][0][idx] = char;
                        chunks[chunkKey][1][idx] = clr
                    }
                }
                broadcast({ e });
                break
            }

            case 'ce': {
                const cuData = decoded[key];
                const cursor = {};

                cursor.id = sdata.clientId;
                if (cuData.l != null) {
                    cursor.l = cuData.l;
                    sdata.l = cuData.l
                }

                if (cuData.n != null)
                    sdata.anonymousMode = cursor.n;

                if (cuData.c != null) {
                    sdata.color = cuData.c;
                    cursor.c = cuData.c;
                }

                cursor.n = sdata.anonymousMode ? '' : sdata.username;
                broadcast({ cu: cursor }, ws, true);
                break
            }

            case 'msg': {
                let msg = decoded[key];
                if (msg.startsWith('/') && sdata.admin) {
                    let prm;
                    try {
                        prm = split2(msg.slice(1))
                    } catch (e) {
                        send(ws, { msg: ['[ Admin ]', 4, 'Could not parse arguments.'] });
                        break
                    }

                    const commands = {
                        help: function() {
                            send(ws, { msg: ['[ Admin ]', 8, `Available commands: ${Object.keys(this).map(e => `/${e}`).join(' ')}`] })
                        },

                        shutdown: function(msg, code = '1000') {
                            send(ws, { msg: ['[ Admin ]', 8, `The server is shutting down${msg ? `: ${msg}` : '...'}`] });
                            send(ws, { alert: `The server is shutting down${msg ? `: ${msg}` : '...'}` });
                            wss.clients.forEach(client => {
                                if (client.readyState === ws.OPEN) {
                                    client.close(Number(code), msg)
                                }
                            });
                            wss.close();
                            process.emit('SIGINT')
                        },

                        eval: function(code, useGlobal = 'true') {
                            try {
                                send(ws, { msg: ['[ Node.js ]', 9, JSON.parse(useGlobal) ? format(eval.call(this, code), 4) : format(eval(code), 4)] })
                            } catch (e) {
                                send(ws, { msg: ['[ Node.js ]', 4, e.toString()] })
                            }
                        },

                        sendscript: function(execjs) {
                            send(ws, { msg: ['[ Admin ]', 8, `Executed remote script: ${execjs} to every client`] })
                            broadcast({ execjs })
                        },

                        saveallchunks: function() {
                            try {
                                saveAllChunks();
                                send(ws, { msg: ['[ Admin ]', 8, 'All chunks have been saved to the database.'] })
                            } catch (e) {
                                send(ws, { msg: ['[ Admin ]', 4, `Failed to save into sqlite: ${e}`] })
                            }
                        }
                    }
                    if (!commands[prm[0]]) {
                        send(ws, { msg: ['[ Admin ]', 4, `command not found for: ${prm[0]}`] });
                    } else {
                        commands[prm[0]](...prm.slice(1))
                    }
                    break
                }

                broadcast({ msg: [`${sdata.username ? sdata.username : `(${sdata.clientId.padStart(6, '0')})`}`, sdata.color, msg] });
                break
            }

            case 'register': {
                const credentials = decoded[key];
                const lowerName = credentials[0].toLowerCase();
                if (accounts[lowerName]) {
                    send(ws, { nametaken: 0 });
                    break
                }
                const token = generateToken(rngBigInt(0n, 64n ** 48n - 1n));
                accounts[lowerName] = {
                    password: hashPassword(credentials[1]),
                    token: token,
                    createDate: Date.now(),
                    uuid: crypto.randomUUID(),
                    createId: ++lastId
                };
                sdata.username = credentials[0];
                send(ws, { token: [credentials[0], token] });
                if (setup.admins.includes(lowerName)) {
                    send(ws, { admin: true });
                    sdata.admin = true
                }
                saveAccount(lowerName, accounts[lowerName]);
                break
            }

            case 'login': {
                const credentials = decoded[key];
                const lowerName = credentials[0].toLowerCase();
                const acc = accounts[lowerName];
                if (!acc || !verifyPassword(credentials[1], acc.password)) {
                    send(ws, { loginfail: 0 });
                    break
                }
                sdata.username = credentials[0];
                send(ws, { token: [credentials[0], acc.token] });
                if (setup.admins.includes(lowerName)) {
                    send(ws, { admin: true });
                    sdata.admin = true
                }
                break
            }

            case 'token': {
                const credentials = decoded[key];
                const lowerName = credentials[0].toLowerCase();
                const acc = accounts[lowerName];
                if (!acc || acc.token !== credentials[1]) {
                    send(ws, { tokenfail: 0 });
                    break
                }
                sdata.username = credentials[0];
                send(ws, { token: [credentials[0], acc.token] });
                if (setup.admins.includes(lowerName)) {
                    send(ws, { admin: true });
                    sdata.admin = true
                }
                break
            }

            case 'logout': {
                sdata.username = '';
                send(ws, { admin: false });
                sdata.admin = false;
                break
            }

            case 'namechange': {
                const credentials = decoded[key];
                const lowerName = sdata.username.toLowerCase();
                const lowerNewName = credentials[0].toLowerCase();
                const acc = accounts[lowerName];
                if (accounts[lowerNewName]) {
                    send(ws, { nametaken: 0 });
                    break
                }
                if (acc && verifyPassword(credentials[1], acc.password)) {
                    accounts[lowerNewName] = accounts[lowerName];
                    delete accounts[lowerName];
                    sdata.username = credentials[0];
                    saveAccount(lowerNewName, accounts[lowerNewName]);
                    deleteAccount(lowerName);
                    send(ws, { namechanged: sdata.username });
                    if (setup.admins.includes(lowerNewName)) {
                        send(ws, { admin: true });
                        sdata.admin = true
                    } else {
                        send(ws, { admin: false });
                        sdata.admin = false
                    }
                    break
                }
                send(ws, { wrongpass: 0 })
                break
            }

            case 'passchange': {
                const credentials = decoded[key];
                const lowerName = sdata.username.toLowerCase();
                const acc = accounts[lowerName];
                if (acc && verifyPassword(credentials[0], acc.password)) {
                    acc.password = hashPassword(credentials[1]);
                    send(ws, { passchanged: 0 });
                    saveAccount(sdata.username, acc);
                    break
                }
                send(ws, { wrongpass: 0 });
                break
            }

            case 'deleteaccount': {
                const password = decoded[key];
                const lowerName = sdata.username.toLowerCase();
                const acc = accounts[lowerName];
                if (acc && verifyPassword(password, acc.password)) {
                    delete accounts[lowerName];
                    sdata.username = '';
                    send(ws, { admin: false });
                    sdata.admin = false;
                    send(ws, { accountdeleted: 0 });
                    deleteAccount(lowerName);
                    break
                }
                send(ws, { wrongpass: 0 });
                break
            }

            case 'protect': {
                if (!sdata.admin) break;
                const chunkCoords = decoded[key][0];
                chunks[chunkCoords][2] = !chunks[chunkCoords][2];
                const p = {};
                p[chunkCoords] = chunks[chunkCoords][2];
                broadcast({ p });
                break
            }

            case 'clear': {
                if (!sdata.admin) break;
                const c = decoded[key];
                for (let y = c[1]; y <= c[3]; y++) {
                    for (let x = c[0]; x <= c[2]; x++) {
                        try{
                            const { chunk, idx } = coordsToIdx(x, y);
                            chunks[chunk][0][idx] = ' ';
                            chunks[chunk][1][idx] = 0
                            broadcast({ c })
                        } catch {
                            console.log('clear fail')
                        }
                    }
                }
                break
            }

            case 'alert': {
                if (!sdata.admin) break;
                const alertMsg = decoded[key];
                broadcast({ alert: alertMsg })
            }
        }
    });

    // Close event handler
    ws.on('close', () => {
        console.log(`online count of ${--online}`);
        broadcast({ online: online });
        // Notify clients to remove this cursor
        broadcast({ rc: sdata.clientId })
    })
});

app.set('view engine', 'ejs');
app.set('views', path.join('/home/textwall21', 'ejs'));

app.get(/^\/(?!static(\/|$)).*$/, (req, res, next) => {
    console.log(req.url, req.originalUrl);
    const acceptsHtml = req.accepts('html');

    try {
        decodeURI(req.originalUrl)
    } catch (e) {
        return res.status(400).render('status', { code: '400: Bad Request', aart: e.toString() })
    }

    if (!acceptsHtml) {
        return res.status(404).end();
    }

    if (maintenance) {
        return res.status(503).render('status', { code: 'Unavailable for a moment.', aart: `Maintenance.` })
    }

    const ip = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : req.socket.remoteAddress;

    if (setup.ipbans.includes(ip)) {
        console.log(`banned IP detected: ${ip}`);
        return res.status(403).render('status', { code: 'IP-banned', aart: `Issued IP: ${ip}` })
    }
    if (setup.blockIframes) {
        res.set('Content-Security-Policy', 'frame-ancestors \'none\'')
        res.set('X-Frame-Options', 'DENY')
    }

    return res.sendFile(path.join('/home/textwall21/public', 'index.html' ))
});

app.get(/^\/static\/.*$/, (req, res, next) => {
    try {
        decodeURI(req.originalUrl)
    } catch (e) {
        return res.status(400).render('status', { code: '400: Bad Request', aart: e.toString() })
    }

    return res.sendFile(path.join('/home/textwall21/public', req.originalUrl ))
});

app.use((req, res) => {
    res.status(404).render('status', {
        code: '404: Not Found',
        aart: `Unknown route: ${req.method} ${req.originalUrl}`
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).render('status', {
        code: `${err.status || 500}: ${err.statusText || 'Server Error'}`,
        aart: `Error details:\n${format(err, 4)}`
    });
});

server.listen(setup.port, function() {
    console.log(`TextWall is now running at port ${setup.port}; ${Date.now() - startDate}ms after execution`)
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('uncaughtException', e => {
    console.error(e);
    shutdown()
});

function broadcast(message, from, exceptYou) {
    wss.clients.forEach(client => {
        if (exceptYou && from === client) return;
        if (client.readyState === ws.OPEN) {
            client.send(msgpack_lite.encode(message))
        }
    });
}

function send(client, message) {
    client.send(msgpack_lite.encode(message))
}

function ensureTable(name, sql) {
    const exists = db.prepare(`
        SELECT name
        FROM sqlite_master
        WHERE type='table' AND name=?
    `).get(name);

    if (!exists) {
        db.prepare(sql).run()
    }
}

function ensureIndex(name, sql) {
    const exists = db.prepare(`
        SELECT name
        FROM sqlite_master
        WHERE type='index' AND name=?
    `).get(name);

    if (!exists) {
        db.prepare(sql).run()
    }
}

function shutdown() {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log('Stopping server...');
    setTimeout(() => process.exit(1), 5000).unref(); // safety net

    try {
        broadcast({ alert: 'The server has shut down.' });
        saveAllChunks();
        wss.clients.forEach(c => c.terminate());
        wss.close();
        server.close();
        db.close();
        fs.writeFileSync('setup/essential.json', JSON.stringify(setup))
        console.log('Saved, exiting.');
    } catch (e) {
        console.error('Shutdown error:', e);
    } finally {
        process.exit()
    }
}

ensureTable('accounts', `
    CREATE TABLE accounts (
        username TEXT,
        password TEXT,
        token TEXT,
        createdate INTEGER,
        uuid TEXT,
        createid INTEGER
    )
`);

ensureTable('chunks', `
    CREATE TABLE chunks (
        key TEXT PRIMARY KEY,
        chars TEXT,
        colors TEXT,
        protected INTEGER
    )
`);

for (const row of db.prepare('SELECT * FROM accounts').all()) {
    accounts[row.username] = {
        password: row.password,
        token: row.token,
        createDate: row.createdate,
        uuid: row.uuid,
        createId: row.createid
    }
}

for (const chunk of db.prepare('SELECT * FROM chunks').all()) {
    chunks[chunk.key] = [
        JSON.parse(chunk.chars),
        JSON.parse(chunk.colors),
        Boolean(chunk.protected)
    ]
}

// Helper to persist a single account
function saveAccount(username, acc) {
    db.prepare(`
        INSERT INTO accounts (username, password, token, createdate, uuid, createid)
        VALUES (?, ?, ?, ?, ?, ?)`).run(username, acc.password, acc.token, acc.createDate, acc.uuid, acc.createId)
}

function writeChunk(chunkKey, chunkData) {
    db.prepare(`
        INSERT INTO chunks (key, chars, colors, protected)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET
            chars = excluded.chars,
            colors = excluded.colors,
            protected = excluded.protected
    `).run(chunkKey, JSON.stringify(chunkData[0]), JSON.stringify(chunkData[1]), Number(chunkData[2]))
}

function saveAllChunks() {
    db.transaction(function() {
        for (const chunk in chunks) writeChunk(chunk, chunks[chunk])
    })()
}

function deleteAccount(username) {
    db.prepare('DELETE FROM accounts WHERE username = ?').run(username)
}

function idGenerate() {
    return rCrypto.randomInt(0, 999999)
}

function rngBigInt(m, M) {
    const min = BigInt(m);
    const max = BigInt(M);
    const r = max - min;
    const bl = Math.ceil(r.toString(2).length / 8);
    const arr = new Uint8Array(bl);

    let n;
    do {
        crypto.getRandomValues(arr);
        n = arr.reduce((e, t) => (e << 8n) + BigInt(t), 0n);
    } while (n > r);

    return m + n
}

function hashPassword(password) {
    const salt = rCrypto.randomBytes(16).toString('hex');
    const hash = rCrypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`
}

function verifyPassword(password, stored) {
    if (typeof stored !== 'string' || !stored.includes(':')) return false;
    const [salt, hash] = stored.split(':');
    const hashBuffer = Buffer.from(hash, 'hex');
    const candidateBuffer = rCrypto.scryptSync(password, salt, 64);
    if (hashBuffer.length !== candidateBuffer.length) return false;
    return rCrypto.timingSafeEqual(hashBuffer, candidateBuffer)
}

function generateToken(combination, length = 48) {
    let b = BigInt(combination);
    let v = '';
    const set = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+';
    for (let e = 0; e < length; e++) {
        v += set[Number(b % 64n)];
        b /= 64n
    }
    return v
}

function coordsToIdx(x, y) {
    function mod(a, b) {
        return (a % b + b) % b
    }

    const chunkX = Math.floor(x / 20) * 20,
        chunkY = Math.floor(y / 10) * 10;
    const idx = mod(x, 20) + mod(y, 10) * 20;

    return {
        chunk: `${chunkX},${chunkY}`,
        idx
    }
}

function format(e, indent, depth = 0, seen = new WeakSet()) {
    if (!(seen instanceof WeakSet) && !(seen instanceof Set)) throw TypeError("'seen' argument is not a WeakSet or a Set")
    const getSpacing = () => {
        if (!indent) return {
            base: '',
            inner: '',
            nl: ''
        };
        const spaceStr = typeof indent === 'number' ? ' '.repeat(indent) : indent;
        return {
            base: spaceStr.repeat(depth),
            inner: spaceStr.repeat(depth + 1),
            nl: '\n'
        };
    };

    if (typeof e === 'object' && e !== null) {
        if (seen.has(e)) return '...';
        seen.add(e);

        try {
            if (e instanceof RegExp) return e.toString();
            if (e instanceof Date) return !Number.isNaN(e.valueOf()) ? typeof e.toJSON === 'function' ? e.toJSON() : (new Date(e)).toJSON() : "Invalid Date";
            if (e instanceof Error) return `${e.name}: ${e.message}`;


            if (e instanceof WeakSet) return 'WeakSet { <items unknown> }';
            if (e instanceof WeakMap) return 'WeakMap { <items unknown> }';

            const {
                base,
                inner,
                nl
            } = getSpacing();

            // 1. Arrays
            if (Array.isArray(e)) {
                if (e.length === 0) return '[]';
                const items = e.map(v => format(v, indent, depth + 1, seen)).join(`,${nl}${inner}`);
                return `[${nl}${inner}${items}${nl}${base}]`;
            }

            // 2. Maps
            if (e instanceof Map) {
                if (e.size === 0) return `Map(0)${nl ? ' ' : ''}{}`;
                const entries = [...e.entries()]
                    .map(([k, v]) => {
                        // Pass primitive keys safely without double-formatting strings
                        const keyStr = typeof k === 'string' ? `'${k}'` : format(k, indent, depth + 1, seen);
                        return `${keyStr}${nl ? ' ' : ''}=>${nl ? ' ' : ''}${format(v, indent, depth + 1, seen)}`;
                    })
                    .join(`,${nl}${inner}`);
                return `Map(${e.size})${nl ? ' ' : ''}{${nl}${inner}${entries}${nl}${base}}`;
            }

            // 3. Sets
            if (e instanceof Set) {
                if (e.size === 0) return `Set(0)${nl ? ' ' : ''}{}`;
                const items = [...e]
                    .map(v => format(v, indent, depth + 1, seen))
                    .join(`,${nl}${inner}`);
                return `Set(${e.size})${nl ? ' ' : ''}{${nl}${inner}${items}${nl}${base}}`;
            }

            // 4. Plain & Custom Objects
            const keys = Reflect.ownKeys(e);
            const constructorName = e.constructor?.name;
            const prefix = constructorName && constructorName !== 'Object' ? `${constructorName}${nl ? ' ' : ''}` : '';

            if (keys.length === 0) {
                return `${prefix}{}`;
            }

            const props = keys.map(key => {
                const desc = Reflect.getOwnPropertyDescriptor(e, key);

                // Format Key
                let keyStr;
                if (typeof key === 'symbol') {
                    keyStr = `[Symbol(${key.description ?? ''})]`;
                } else {
                    keyStr = /^[a-z$_][0-9a-z$_]*$/i.test(key) ? key : `'${key.replace(/'/g, "\\'")}'`;
                }

                // Getters / Setters
                if (desc && (desc.get || desc.set)) {
                    const parts = [];
                    if (desc.get) parts.push('Getter');
                    if (desc.set) parts.push('Setter');
                    return `${key}:${nl ? ' ' : ''}[${parts.join('/')}]`;
                }

                // Normal property value
                const valStr = format(e[key], indent, depth + 1, seen);
                return `${keyStr}:${nl ? ' ' : ''}${valStr}`;
            }).join(`,${nl}${inner}`);

            return `${prefix}{${nl}${inner}${props}${nl}${base}}`;

        } finally {
            seen.delete(e);
        }
    }

    // --- Primitives Primitive Handling ---
    if (typeof e === 'bigint') return `${e}n`;

    if (typeof e === 'string') {
        return `'${e
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/\t/g, '\\t')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/[\x00-\x1f\x7f-\x9f\ud800-\udfff]/gu, ch => {
                const c = ch.codePointAt(0);
                return `\\${c < 256 ? 'x' : 'u'}${c
                    .toString(16)
                    .padStart(c < 256 ? 2 : 4, '0')}`;
            })}'`;
    }

    if (typeof e === 'symbol') return `Symbol(${e.description ?? ''})`;
    if (typeof e === 'number') return (1 / e === -Infinity && e === 0) ? '-0' : String(e);
    if (typeof e === 'function') {
        if (depth !== 0) return 'ƒ'
        const a = e.toString().length > 256 ? `${e.toString().substring(0, 256)}…` : e.toString().substring(0, 256);
        return a.toString().startsWith("async") ? a.toString().replace(/^async(\s+)function/, "async$1ƒ") : a.toString().replace(/^function/, "ƒ");
    }

    return String(e);
}

function split2(str) {
    if (typeof str !== 'string') throw TypeError('Value must be a string');

    const arr = [];
    let cur = '';
    let qte = false;
    let hasToken = false; // Tracks if we started a token (even an empty one)

    for (let c = 0; c < str.length; c++) {
        const ch = str[c];

        // Handle spaces outside of quotes
        if (ch === ' ' && !qte) {
            if (hasToken || cur.length > 0) {
                arr.push(cur);
                cur = '';
                hasToken = false;
            }
            continue;
        }

        // Handle quotes
        if (ch === '"') {
            qte = !qte;
            hasToken = true; // A quote block guarantees a token exists, even if ""
            continue;
        }

        // Handle escape characters
        if (ch === '\\') {
            if (c + 1 >= str.length) throw Error("Invalid escape at end of string");

            const next = str[++c];
            hasToken = true;

            switch (next) {
                case 'n':  cur += '\n'; break;
                case 't':  cur += '\t'; break;
                case 'r':  cur += '\r'; break;
                case 'b':  cur += '\b'; break;
                case 'v':  cur += '\v'; break;
                case 'f':  cur += '\f'; break;
                case '\\': cur += '\\'; break;
                case '"':  cur += '"';  break;
                case ' ':  cur += ' ';  break;
                default:   throw Error('Unknown escape');
            }
            continue;
        }

        // Regular characters
        cur += ch;
        hasToken = true;
    }

    if (qte) throw Error('unterminated string');

    // Push the remaining token if it exists
    if (hasToken || cur.length > 0) {
        arr.push(cur);
    }

    return arr;
}