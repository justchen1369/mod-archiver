import dotenv from 'dotenv';
dotenv.config()
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('output/mods.json', 'utf8'))

if (!process.env.authQueryString) {
    throw new Error('The authQueryString environment variable must exist.')
}
let toWrite = []
for (let i = 0; i < data.length; i++) {
    const mod = data[i]
    for (const release of mod.releases) {
        const path = `output/downloads/${mod.name}/${release.file_name}`
        if (process.argv[2] === '--skip-existing') {
            if (fs.existsSync(path)) {
                continue;
            }
        }
        toWrite.push(
            `https://mods.factorio.com${release.download_url}${process.env.authQueryString}`,
            `  dir=downloads/${mod.name}`,
            `  out=${release.file_name}`)
    }
}

const handle = await fs.openSync('output/downloads.aria2c', 'w+')
await fs.writeFileSync(handle, toWrite.join('\n'))
