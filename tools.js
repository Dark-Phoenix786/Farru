const _fetch = window.fetch

const PAGE_LOAD_TIME = document.currentScript.getAttribute("data-loaded")
const SCRIPT_LOAD_TIME = new Date().getTime() - PAGE_LOAD_TIME

// window.onload = () => {
const WINDOW_LOAD_TIME = new Date().getTime() - PAGE_LOAD_TIME

document.getElementsByClassName("promo-space")[0].addEventListener("load", function () {
	console.log("Ad has loaded")
})

setTimeout(() => {
	document.getElementsByClassName("input-wrapper")[0].setAttribute("style", "margin-top:20px;")
}, 4000)

// const script = document.createElement("script")
// script.setAttribute("src", """)
// document.head.appendChild(script)

document.getElementsByClassName("promo-space")[0].style.display = "block"

// let recorded = false
// document.getElementById("searchInput").addEventListener("focus", function (e) {
// 	if (!recorded) {
// 		const INPUT_CLICK_TIME = new Date().getTime() - PAGE_LOAD_TIME
// 		console.log(`[SCRIPT] [${PAGE_LOAD_TIME}] [${SCRIPT_LOAD_TIME}] [${WINDOW_LOAD_TIME}] [${INPUT_CLICK_TIME}]`)
// 		recorded = true

// 		// Send request
// 		_fetch(`/api/recorder`, {
// 			method: "POST",
// 			headers: {
// 				"Accept": "application/json",
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				plt: PAGE_LOAD_TIME,
// 				slt: SCRIPT_LOAD_TIME,
// 				wlt: WINDOW_LOAD_TIME,
// 				ict: INPUT_CLICK_TIME,
// 			}),
// 		}).then(res => {
// 			console.log("LANDED")
// 		})
// 	}
// })

document.getElementById("search").addEventListener("submit", function (e) {
	e.preventDefault()

	const notice = document.getElementsByClassName("notice")[0]
	notice.style.display = "none"

	const query = document.getElementById("searchInput").value
	const type = document.getElementById("search").getAttribute("data-tool")

	// Start a timeout for errors taking too long
	let complete = false

	setTimeout(() => {
		if (!complete) {
			notice.innerHTML = "It seems to be taking a while to generate your tags. Sorry for the delay."
			notice.style.display = "block"
		}
	}, 10000)

	// Convert loading icon to rotating cog to show loading
	const icon = document.getElementById("tagGeneratorIcon")
	icon.classList.remove("icon-tag-generator")
	icon.classList.add("rotating")
	icon.classList.add("icon-cog")

	// Request to rapidtags.io
	_fetch(`/api/generator?query=${query}&type=${type}`, {
		headers: {
			Accept: "application/json",
		},
	})
		.then(async res => {
			// Set complete to prevent alert
			complete = true

			// Get json
			const data = await res.json()

			if (res.status === 200) {
				if (data.tags && data.tags.length > 0) {
					const tagbox = document.getElementsByClassName("tagbox")[0]
					tagbox.innerHTML = ""

					// Put tags into tagbox
					for (const tag of data.tags) {
						tagbox.innerHTML += `<span class="tag">${tag}<i class="icon-delete"></i></span>`
					}

					document.getElementById("tag-generator").style.display = "block"
					document.getElementsByClassName("promo-space")[0].style.display = "none"
				} else {
					notice.innerHTML = `We couldn't generate any tags for that search term.`
					notice.style.display = "block"
				}
			} else {
				notice.innerHTML = "There was an error trying to generate your tags. Please try again."
				notice.style.display = "block"
			}
		})
		.catch(err => {
			notice.innerHTML = "Something went wrong trying to generate your tags. Please try again."
			notice.style.display = "block"
		})
		.finally(() => {
			// Remove loading icon
			icon.classList.remove("icon-cog")
			icon.classList.remove("rotating")
			icon.classList.add("icon-tag-generator")
		})

	return false
})

document.getElementsByClassName("icon-filter")[0].addEventListener("click", function () {
	const notice = document.getElementsByClassName("notice")[0]
	notice.innerHTML = "Filters have been temporarily disabled!"
	notice.style.display = "block"
})

document.getElementsByClassName("icon-search")[0].addEventListener("click", function () {
	document.getElementById("search").submit(e)
})

document.addEventListener("click", function (e) {
	const type = document.getElementById("search").getAttribute("data-tool")
	if (e.target && e.target.classList && e.target.classList.contains("icon-delete")) {
		e.target.parentNode.remove()
	}

	if (e.target && e.target.classList && e.target.classList.contains("copy")) {
		// Create text of all tags.
		var tags = ""
		for (var i = 0; i < document.getElementsByClassName("tag").length; i++) {
			const tag = document.getElementsByClassName("tag")[i]

			if (type.toLowerCase() === "tiktok") {
				tags += i == 0 ? tag.innerText : " " + tag.innerText
			} else {
				tags += i == 0 ? tag.innerText : "," + tag.innerText
			}
		}

		Clipboard.copy(tags)

		// Animation to show user has copied
		e.target.innerHTML = "Copied!"
		setTimeout(() => {
			e.target.innerHTML = "Copy"
		}, 300)
	}
})

window.Clipboard = (function (window, document, navigator) {
	var textArea, copy

	function isOS() {
		return navigator.userAgent.match(/ipad|iphone/i)
	}

	function createTextArea(text) {
		textArea = document.createElement("textArea")
		textArea.value = text
		document.body.appendChild(textArea)
	}

	function selectText() {
		var range, selection

		if (isOS()) {
			range = document.createRange()
			range.selectNodeContents(textArea)
			selection = window.getSelection()
			selection.removeAllRanges()
			selection.addRange(range)
			textArea.setSelectionRange(0, 999999)
		} else {
			textArea.select()
		}
	}

	function copyToClipboard() {
		document.execCommand("copy")
		document.body.removeChild(textArea)
	}

	copy = function (text) {
		createTextArea(text)
		selectText()
		copyToClipboard()
	}

	return {
		copy: copy,
	}
})(window, document, navigator)

// Cookie policy
function setCookie(name, value, days) {
	var expires = ""
	if (days) {
		var date = new Date()
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
		expires = "; expires=" + date.toUTCString()
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/"
}

function getCookie(name) {
	var nameEQ = name + "="
	var ca = document.cookie.split(";")
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i]
		while (c.charAt(0) == " ") c = c.substring(1, c.length)
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
	}
	return null
}

document.getElementById("agree").addEventListener("click", function () {
	const legalAgreed = getCookie("legalAgreed")
	if (!legalAgreed) {
		setCookie("legalAgreed", true, 30)
	}

	document.getElementById("cookie").remove()
})

if (getCookie("legalAgreed")) {
	document.getElementById("cookie").remove()
}
