module.exports = {
    "name": "DigitalId",
    "publisher": "LethPolytech",
    "cards": [{
        "type": "DigitalIdCard",
        "source": "./src/cards/DigitalIdCard",
        "title": "My Digital ID",
        "displayCardType": "DigitalId Card",
        "description": "This card allows users to view their Digital ID card."
    }],
    "page": {
        "source": "./src/page/router.jsx"
    }
}