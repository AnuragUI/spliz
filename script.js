/* // Disable right-click
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Disable certain keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.keyCode == 123) { // F12
        event.preventDefault();
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == 73) { // Ctrl+Shift+I
        event.preventDefault();
    }
    if (event.ctrlKey && event.shiftKey && event.keyCode == 74) { // Ctrl+Shift+J
        event.preventDefault();
    }
    if (event.ctrlKey && event.keyCode == 85) { // Ctrl+U
        event.preventDefault();
    }
});

// Hide elements when inspect is triggered
const elementsToHide = document.querySelectorAll('.main');

const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations) {
        if(mutation.addedNodes.length) {
            for(const node of mutation.addedNodes) {
                if(node.nodeType === 1 && node.nodeName === 'DIV' && node.id === 'inspector') {
                    elementsToHide.forEach(element => element.style.display = 'none');
                }
            }
        }
    }
});

observer.observe(document, { childList: true, subtree: true });

 */

document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('responseInput');
    const wordCountMessage = document.getElementById('wordCountMessage');
    const maxCharacters = 300;

    function updateCharacterCount() {
        const text = textarea.value;
        const characterCount = text.length;

        if (characterCount > maxCharacters) {
            textarea.value = text.slice(0, maxCharacters); // Trims text to max length
        }

        const remainingCharacters = maxCharacters - characterCount;
        wordCountMessage.innerHTML = `${remainingCharacters}`;
        wordCountMessage.style.color = remainingCharacters < 0 ? 'red' : 'black';
    }

    textarea.addEventListener('input', updateCharacterCount);
});


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    const submitButton = document.getElementById('submitButton');
    const responseInput = document.getElementById('responseInput');
    const wordCountMessage = document.getElementById('wordCountMessage');

    function updateSubmitButtonState() {
        const isRadioChecked = form.querySelector('input[name="hostel"]:checked');
        const isTextAreaFilled = responseInput.value.trim() !== '';
        submitButton.disabled = !(isRadioChecked && isTextAreaFilled);
    }

    // Event listeners for form elements
    form.addEventListener('input', updateSubmitButtonState);
    form.addEventListener('change', updateSubmitButtonState);

    // Character limit for textarea
    responseInput.addEventListener('input', function() {
        const maxLength = 300;
        const currentLength = responseInput.value.length;
        wordCountMessage.textContent = `${maxLength - currentLength}`;
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // If the form is valid, submit it
        if (submitButton.disabled) return;

        // Disable the submit button while waiting for the response
        submitButton.disabled = true;

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
        })
        .then(response => {
            submitButton.disabled = false;

            if (response.ok) {
                document.getElementById('responseMessage').textContent = 'Your message has been sent successfully!';
                form.reset();
            } else {
                document.getElementById('responseMessage').textContent = 'There was a problem sending your message. Please try again.';
            }
        })
        .catch(error => {
            submitButton.disabled = false;
            document.getElementById('responseMessage').textContent = 'There was a problem sending your message. Please try again.';
        });
    });
});

