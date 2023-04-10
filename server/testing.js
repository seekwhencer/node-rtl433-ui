import {spawn} from 'child_process';

const bin = '/usr/local/bin/rtl_433';
const processOptions = ['-F', 'json'];
const process = spawn(bin, processOptions);

let raw = '';
const rows = [];

process.stdout.setEncoding('utf8');
process.stdout.on('data', chunk => {
    raw += chunk;
    raw = parseRaw(raw);
    console.log('RAW EXTRACTED REST:', raw.length, raw );
});

const parseRaw = (raw) => {
    const rowsRaw = raw.split("\n");

    console.log();
    console.log('>>>> PARSE RAW', rowsRaw.length);

    rowsRaw.forEach(rowRaw => {
        try {
            const row = JSON.parse(rowRaw);
            addRow(row);
            raw = raw.replace(`${rowRaw}\n`, ''); // extract the parsed row from raw data
        } catch (e) {
            console.log('NOT PARSED:', rowRaw);
        }
    });
    return raw;
}

const addRow = (row) => {
    console.log('> ROW:', JSON.stringify(row));
}
