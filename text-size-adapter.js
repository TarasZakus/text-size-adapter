/**
 * Adapt text font size to fit container by width.
 * Important note: only for a single-line text containers!
 *
 * @param {HTMLElement} el Text container
 * @param {number} [fontSizeStep=2] Changing font size by this value on each animation step.
 * @param {int} [animationDelay=10] Font size animation frame delay in milliseconds.
 * @return {number} The animation interval identifier (can be used to stop animation beforehand).
 */
export default function (el, fontSizeStep, animationDelay) {
    // Prepare arguments.
    if (!(el instanceof HTMLElement)) {
        throw 'The given "el" object is not a valid HTMLElement.'
    }
    if (!isFiniteNumber(fontSizeStep)) {
        fontSizeStep = 2
    }
    if (!isInteger(animationDelay)) {
        animationDelay = 10
    }

    el.style.whiteSpace = "nowrap"; // important! as the text will be adapted only by width.

    // Determine font size unit.
    let sizeUnit = getFontSizeUnit(el.style.fontSize);
    if (sizeUnit.length === 0) { // Set default "font-size" value.
        sizeUnit = 'px';
        el.style.fontSize = fontSizeStep + sizeUnit;
    }

    // Define alias functions.
    const isOverflow = () => el.scrollWidth > el.clientWidth;
    const changeFontSize = (step) => el.style.fontSize
        = (parseFloat(el.style.fontSize) + step) + sizeUnit;

    // Begin font scaling.
    let intervalId = 0;
    if (isOverflow()) { // Decrease font size.
        changeFontSize(-fontSizeStep); // Start without delay.
        intervalId = setInterval(() => {
            if (el.scrollWidth === el.clientWidth) {
                clearInterval(intervalId)
            } else {
                changeFontSize(-fontSizeStep)
            }
        }, animationDelay)
    } else { // Increase font size.
        changeFontSize(+fontSizeStep); // Start without delay.
        intervalId = setInterval(() => {
            if (isOverflow()) {
                clearInterval(intervalId);
                changeFontSize(-fontSizeStep); // Removes the last step.
            } else {
                changeFontSize(+fontSizeStep)
            }
        }, animationDelay);
    }
    return intervalId
}

/**
 * @param {*} value
 * @return {boolean}
 */
function isFiniteNumber(value) {
    return typeof value === 'number' && isFinite(value)
}

/**
 * @param {*} value
 * @return {boolean}
 */
function isInteger(value) {
    return isFiniteNumber(value) && Math.floor(value) === value
}

/**
 * @param {String} fontSize
 * @return {string}
 */
function getFontSizeUnit(fontSize) {
    const regexp = /^\d+(\.\d+)?([a-z%]+)$/i;
    const result = fontSize.match(regexp);
    return (result === null) ? '' : result[2]
}
