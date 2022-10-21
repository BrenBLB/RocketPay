import "./css/index.css"
import IMask from "imask"

const ccColor1 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccColor2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCcType(type){
    const colors = {
        visa: ["#436D99", "#2D57F2"],
        mastercard: ["#DF6F29", "#C69397"],
        default: ["black", "gray"],
    }
    
    ccColor1.setAttribute("fill", colors[type][0])
    ccColor2.setAttribute("fill", colors[type][1])

    ccLogo.setAttribute("src", `cc-${type}.svg`)

}

globalThis.setCcType = setCcType

const securityCode = document.getElementById("security-code")
const securityCodeMask = {
    mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodeMask)

const expirationDate = document.getElementById("expiration-date")
const expirationDateMask = {
    mask: "MM{/}YY",
    blocks: {
        YY:{
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
        }
    }
}
const expirationDateMasked = IMask(expirationDate, expirationDateMask)

const cardNumber = document.getElementById("card-number")
const cardNumberMask = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardtype: "visa"
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard"
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default"
        }
    ],
    dispatch: function (appended, dynamicMasked){
        const number = (dynamicMasked.value + appended).replace(/\D/g, "")
        const foundMask = dynamicMasked.compiledMasks.find(function(item) {
            return number.match(item.regex)
        })

        return foundMask
    }   
}

const cardNumberMasked = IMask(cardNumber, cardNumberMask)

const addButton = document.getElementById("add-card")
addButton.addEventListener("click", () => {
    alert("Cartão Adicionado")
})

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
})

cardNumberMasked.on("accept", () => {
    const ccNumber = document.querySelector(".cc-info .cc-number")

    setCcType(cardNumberMasked.masked.currentMask.cardtype)
    ccNumber.innerText = cardNumberMasked.value.length === 0 ? "1234 5678 9012 3456" : cardNumberMasked.value
})

const cardHolder = document.getElementById("card-holder")
cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value")

    ccHolder.innerText = cardHolder.value.length === 0 ? "NOME DO TITULAR" : cardHolder.value
})

expirationDateMasked.on("accept", () => {
    const ccExpiration = document.querySelector(".cc-expiration .value")

    ccExpiration.innerText = expirationDateMasked.value.length === 0 ? "02/32" : expirationDateMasked.value
})

securityCodeMasked.on("accept", () => {
    const ccSecurity = document.querySelector(".cc-security .value")

    ccSecurity.innerText = securityCodeMasked.value.length === 0 ? "123" : securityCodeMasked.value
})