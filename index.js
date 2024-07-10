import { setupThumb } from "./thumb.js"

const dialog = document.querySelector("dialog")
const iframe = dialog.querySelector("iframe")
const thumbs = Array.from(document.querySelectorAll(".thumb"))
const masonry = document.querySelector(".masonry")
const previewTitle = document.querySelector(".preview-title")

// Shuffle thumbs
for (var i = thumbs.length; i >= 0; i--) {
  masonry.appendChild(thumbs[Math.floor(Math.random() * i)])
}
thumbs.forEach(setupThumb)

const handleLocation = () => {
  const { hash, pathname } = window.location
  const isHome = (pathname === "/" || pathname === "/index.html") && !hash

  if (isHome) {
    dialog.close()
    iframe.contentWindow.location.replace("about:blank")
  } else {
    dialog.showModal()

    document.body.dataset.loading = "true"
    iframe.contentWindow.location.replace(hash.substring(1))

    /** @type HTMLElement */
    const thumb = document.querySelector(`.thumb[href="${hash}"]`)
    previewTitle.innerHTML = `// ${thumb.dataset.title}`
  }
}

iframe.addEventListener("load", () => {
  document.body.dataset.loading = "false"
  iframe.contentWindow.focus()
})
window.addEventListener("popstate", handleLocation)
window.addEventListener("load", handleLocation)
