// 
function closeToast(toastId) {
    const toast = document.getElementById(toastId);
    toast.remove();
}
// copy text to clipboard
function copyToClipboard(target) {
    // get the text field
    var copyText = document.getElementById(target);
    var toastHeading = document.getElementById('toast-heading');
    var toastBody = document.getElementById('toast-body');
    // select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    // copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
    alert('Copied to clipboard');
}
// generate copyright dates
const pubDate = 2025;
const currentYear = new Date().getFullYear();
var displayYear = document.getElementById('year');
if (pubDate == currentYear) {
    displayYear.innerText = currentYear;
} else {
    displayYear.innerText = pubDate + ' - ' + currentYear;
}