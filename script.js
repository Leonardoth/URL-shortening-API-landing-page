/**
 * Will be called from buttons (class: result__button) and call other functions
 *  Will call functions to handle changing text, class and copying values.
 */
function handleCopy(e){
    var element = e.target
    copyToKeyboard(element)
    toggleCopied(element)
}

/**
 * This function removes the copied class from previous result__button and changes back it's text to "Copy"
 * It'll also add the class to the element and change it's text to "Copied!"
 * @param {DOM Element} element 
 */
function toggleCopied(element){
    var lastElement = document.querySelector('.result__button.copied')
    if(lastElement){
        lastElement.classList.toggle('copied')
        lastElement.textContent = "Copy"
    }
    element.classList.toggle('copied')
    element.textContent = "Copied!"
}


/**
 * This function will copy the text content of the result__shortened span sibling to the element
 * @param {DOM Element} element 
 */
function copyToKeyboard(element){
    var shortened = element.parentNode.querySelector('input')
    shortened.select()
    shortened.select(0,999)
    document.execCommand("copy");
}



/**
 * This function checks if the content of the input is valid, sends it to the API
 * 
 * @param {Dom Event} event - Event from DOM
 * @returns {void} - Creates a new result with previous link and shortened one
 */

function submitLink(event){
    var target = event.target
    var input = target.parentNode.parentNode.querySelector('.second-session__input')
    var link = input.value
    var isValidUrl = validateUrl(link)
    if(!isValidUrl){
       return urlError(input)
    }
    return shortUrl(link)
}



/**
 * Add the class error to a given element
 * @param {Dom Element} element 
 * @returns {void}
 */
function urlError(element){
    return element.classList.add('error')
}
/**
 * Checks if the string given is a valid URL
 * @param {string} url 
 * @returns {boolean} true if it's valid
 */
function validateUrl(url){
    // pattern from http://forums.devshed.com/javascript-development-115/regexp-to-match-url-pattern-493764.html
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return pattern.test(url)
}

/**
 * This function calls the API and returns the url shortened
 * @param {string} url 
 * @returns {string} - shortened url
 * GET/POST: https://api.shrtco.de/v2/shorten?url=example.org/very/long/link.html
 */
async function shortUrl(url){
    startLoad()
    var response = await axios.post(`https://api.shrtco.de/v2/shorten?url=${url}`)
    stopLoad()
    createResult(response)
}

/**
 * add the 'loading' class to the #loading__element
 * @returns -- 
 */
 function startLoad(){
    var element = document.querySelector('#loading__element')
    return element.classList.add('loading')
}

/**
 * removes the "loading" class of the #loading__element
 * @returns 
 */
function stopLoad(){
    var element = document.querySelector('#loading__element')
    return element.classList.remove('loading')
}


/**
 * This function will create a new result, based on the response.short_link and the response.original_link 
 * @param {XMLHttpRequestResponseType} response 
 * @returns {void} - creates a new result with original link and shortened one
 */
function createResult(response){
    var resultContainer = document.querySelector('.result__container')
    var template = document.querySelector('#result__template')
    var clone = template.content.cloneNode(true)
    response = response.data.result
    var original_link = clone.querySelector('.result__original')
    original_link.textContent = response.original_link

    var shortened_link = clone.querySelector('.result__shortened')
    shortened_link.textContent = response.short_link

    var shortened_input = clone.querySelector('.result__input')
    shortened_input.value = response.short_link

    resultContainer.appendChild(clone)
}

/**
 * This function removes the class .error from an element
 * @param {DOM Event} Event
 * @returns {void} 
 */
function removeError(event){
    event.target.classList.remove('error')
}

