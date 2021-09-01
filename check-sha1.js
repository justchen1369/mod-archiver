import fs from 'fs';
import { spawn } from 'child_process';
import readline from 'readline';

import pkg from 'progress';
const ProgressBar = pkg

const data = JSON.parse(fs.readFileSync('output/mods.json', 'utf8'))

let total = 0
const toWrite = []
for (const mod of data) {
    for (const release of mod.releases) {
        const path = `downloads/${mod.name}/${release.file_name}`
        if (fs.existsSync(path)) {
            total++
            toWrite.push(`${release.sha1} ${path}`)
        } else {
            console.warn(`warning: ignorning nonexistent path ` + path)
        }
    }
}

const bar = new ProgressBar('(:current/:total)[:eta eta] :filename', { total })
const handle = fs.openSync('output/downloads.sha1', 'w+') // truncate when existing
await fs.writeFileSync(handle, toWrite.join('\n'))

const sha1proc = spawn('sha1sum', ['-c', 'output/downloads.sha1']);


const lines = readline.createInterface({
    input: sha1proc.stdout
})

lines.on('line', line => {
    let [filename, status] = line.split(': ')

    if (status !== 'OK') { bar.interrupt(`${filename}: ${status}`); fs.unlinkSync(filname)}

    bar.tick({ filename })
})