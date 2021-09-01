import fetch from 'node-fetch';
import pkg from 'progress'; 
const ProgressBar = pkg
import https from 'https';
import 'colors'

import { mkdir, writeFile, readFile } from 'fs/promises';

await mkdir('output', { recursive: true });

const keepAliveAgent = new https.Agent({
    keepAlive: true
});

const { results } = await fetch('https://mods.factorio.com/api/mods?page_size=max')
    .then(res => res.json())

const bar = new ProgressBar(':current/:total [:etas][:downloadingName]', { total: results.length, width: 40 })


console.log('getting extended mod descriptions')

let i = 0
while (i < results.length) {
    let increment = i + 50 > results.length ? results.length - i : 50;

    let fetching = []
    for (let ii = 0; ii < increment; ii++) {
        fetching.push(
        fetch(`https://mods.factorio.com/api/mods/${results[i + ii].name}/full`, { agent: keepAliveAgent })
            .then(res => res.json()
            .then(data => results[i + ii] = data))
            .then(_ => bar.tick({
                downloadingName: results[i + ii].name.green
            }))
        )
    }
    await Promise.all(fetching);

    i += increment
}

await writeFile('output/mods.json', JSON.stringify(results, null, 2))
