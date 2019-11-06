/*global console*/
//
// loadScript.js defines loadScript(), a global function for performing asynchronous
// script loads.
//
// https://github.com/zynga/loadScript
// Author: Chris Campbell (@quaelin)
// License: BSD
//
(function (win, doc, undef) {
  // 'use script';

  let loadScript
  const funcName = 'loadScript',
    VERSION = '0.1.5',
    had = Object.prototype.hasOwnProperty.call(win, funcName),
    previous = win[funcName],
    loading = {},
    loaded = {}
  function log(msg) {
    if (typeof console !== 'undefined' && console && console.log) {
      console.log(msg)
    }
  }

  // Perform text substitutions on `origURL` according to the substitution
  // rules stored in localStorage `key` (if present).  This is a developer
  // feature; to use it, you must name the localStorage key by setting it like
  // this:
  //
  //   loadScript.key = 'loader_rules';
  //
  // Then you can set the corresponding value in localStorage to a JSON-ified
  // array of arrays, where each inner array is a pair of the form:
  //
  //   [searchtext, replacetext]
  //
  // This allows the developer to load, for instance, a newer or unminified
  // version of a particular script.
  function rewrite(origURL) {
    let substitutions = []
    const { key } = loadScript
    if (key) {
      try {
        substitutions = JSON.parse(localStorage.getItem(key)) || []
      } catch (ex) {
        //
      }
    }
    let i = -1,
      rule,
      url = origURL
    const len = substitutions.length
    while (++i < len) {
      rule = substitutions[i]
      url = url.replace(rule[0], rule[1])
    }
    if (url !== origURL) {
      log(`${funcName}: rewrite("${origURL}")`)
      log(` => "${url}"`)
    }
    return url
  }

  // Here is the loadScript() function itself.
  loadScript = win[funcName] = function (requestURL, callback, options) {
    const url = rewrite(requestURL),
      needToLoad = !loading[url],
      q = loading[url] = loading[url] || []

    let el
    let link

    function doCallback() {
      if (callback) {
        callback()
      }
    }
    if (loaded[url]) {
      doCallback()
      return
    }
    q.push(doCallback)
    function onLoad() {
      loaded[url] = 1
      if (el.addEventListener) {
        el.removeEventListener('load', onLoad, false)
      } else { // IE
        el.detachEvent('onreadystatechange', onLoad)
      }
      while (q.length) {
        q.shift()()
      }
    }
    if (needToLoad) {
      //加载对应的css文件
      if (options && options.loadCss && url) {
        let cssPath = url.substring(0, url.lastIndexOf('/') + 1)
        if (options.cssDir) {
          cssPath += `${options.cssDir}/`
        }
        const cssfile = url.substring(url.lastIndexOf('/') + 1).replace('.js', '')
        const cssUrl = `${cssPath}${cssfile}.min.css`

        link = doc.createElement('link')
        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = cssUrl
        doc.getElementsByTagName('head')[0].appendChild(link)
      }

      //加载js
      el = doc.createElement('script')
      el.type = 'text/javascript'
      el.charset = 'utf-8'
      if (el.addEventListener) {
        el.addEventListener('load', onLoad, false)
      } else { // IE
        el.attachEvent('onreadystatechange', onLoad)
      }
      if (url !== requestURL) {
        el.setAttribute('data-requested', requestURL)
      }
      el.src = url
      doc.getElementsByTagName('head')[0].appendChild(el)
    }
  }

  loadScript.VERSION = VERSION

  loadScript.noConflict = function () {
    if (win[funcName] === loadScript) {
      win[funcName] = had ? previous : undef
      if (!had) {
        try {
          delete win[funcName]
        } catch (ex) {
          //
        }
      }
    }
    return loadScript
  }
}(window, document))
