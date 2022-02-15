
//get the langauage selected on index change
const select = document.querySelector('#lang-select');
let selectedLanguage;

select.addEventListener('change', getSelected);

function getSelected() {
    selectedLanguage = select.value;
}

// on click of get quote fetch result from api based on language and display.
const quote = document.querySelector('#get-quote');
const factBlock = document.querySelector('#fact-block');
const credits = document.querySelector('#credits');

quote.addEventListener('click', getQuote);

function getQuote() {

    if (!(select[select.selectedIndex].value == 'Select Language')) {
        const url = `https://uselessfacts.jsph.pl/random.json?language=${selectedLanguage}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                factBlock.innerHTML = data.text;

                if (credits.classList.contains('d-none'))
                    credits.classList.remove('d-none');

                credits.innerHTML =
                    `Source : ${data.source} <br/>
                 Source URL: ${data.source_url}
                `

                quote.innerHTML = 'Get Next'
            })
            .catch(e => {
                console.log(e.message);
            });
    }
    else {
        factBlock.innerHTML = 'Please Select a language from the dropdown to proceed'
        if (!credits.classList.contains('d-none'))
            credits.classList.add('d-none');
        quote.innerHTML = 'Get Quote'
    }

}
