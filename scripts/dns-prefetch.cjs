const fs = require('fs')
const { parse } = require('node-html-parser')
const { glob } = require('glob')
const urlRegex = require('url-regex')

const urlReg = /((https|http)?:\/\/[^/]*)/i
const urls = new Set()

// 遍历文件
async function getDomains() {
  const files = await glob('dist/**/*.{html,css,js}')
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf-8')
    const matches = source.match(urlRegex({ strict: true }))
    if (matches) {
      matches.forEach((url) => {
        const match = url.match(urlReg)
        if (match && match[1]) {
          urls.add(match[1])
        }
      })
    }
  }
}

async function insertLinks() {
  const files = await glob('dist/**/*.html')
  const links = '\n' + [...urls].map((url) => `<link rel="dns-prefetch" href="${url}" />`).join('\n')

  for (const file of files) {
    const html = fs.readFileSync(file, 'utf-8')
    const root = parse(html)
    const head = root.querySelector('head')
    head.insertAdjacentHTML('afterbegin', links)
    fs.writeFileSync(file, root.toString())
  }
}

async function main() {
  await getDomains()
  await insertLinks()
}

main()
