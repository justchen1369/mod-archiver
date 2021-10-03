# Mod Archiver
This repository serves as a collection of a few scripts that are helpful in archiving mods.

# Requirements
- node
- sha1sum
- aria2c

# Environment variables
- `authQueryString` should be set to `"?username=[insert username here]&token=[insert token here]"`
# Usage
1. `node get-full-descriptions.js` Get extended mod descriptions, which is necessary to get mod release download urls.
2. `node write-aria2c.js` Write an aria2c download list.
3. `aria2c -i output/downloads.aria2c` have aria2c download everything. This will take several hours.
4. `node check-sha1.js` check checksums- this is totally optional.
