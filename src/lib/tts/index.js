const utterances = []
const defaultConfig = { lang: 'zh-CN', autoPlay: true, rate: 1.0, pitch: 1, volume: 2 }

export function speak() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.speak(utterances.shift())
  }
}

/**
 *
 * @param {string} text
 * @param {object} opt
 */
export function utteranceSpeech(text, opt = {}) {
  if (!text) return console.log('文本不能为空')
  if ('speechSynthesis' in window) {
    const options = new Proxy(defaultConfig, {
      get: (target, prop) => (prop in opt ? opt[prop] : target[prop])
    })
    // 支持Web Speech API
    const utterance = new SpeechSynthesisUtterance()
    utterance.text = text
    for (let key in options) {
      utterance[key] = options[key]
    }
    utterance.onstart = () => {}
    utterance.onend = () => {}
    options.autoPlay ? window.speechSynthesis.speak(utterance) : utterances.push(utterance)
  } else {
    console.log('不支持Web Speech API')
  }
}

export default utteranceSpeech
