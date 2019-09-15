const pify = require('pify')
const Remark = require('remark')
const RemarkExternalLinks = require('remark-external-links')
const RemarkHtml = require('remark-html')
const RemarkMath = require('remark-math')
const RemarkHtmlKatex = require('remark-html-katex')

const converters = {
  markdown: Remark()
    .use(RemarkHtml, { sanitize: true })
    .use(RemarkExternalLinks, { rel: false }),
  math: Remark()
    .use(RemarkMath)
    .use(RemarkHtmlKatex)
    .use(RemarkHtml, { sanitize: require('./markdown-sanitize.json') })
}
Object.keys(converters).forEach((key) => {
  const converter = converters[key]
  converters[key] = pify(converter.process.bind(converter))
})

const convert = async (md, type) => {
  const converter = converters[type]
  if (!converter) {
    throw new Error('no converter for type ' + type)
  }
  return converter(md).then((result) => result.contents)
}

export { convert }
