// Disable right-click
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

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    const submitButton = document.getElementById('submitButton');
    const responseInput = document.getElementById('responseInput');
    const wordCountMessage = document.getElementById('wordCountMessage');
    const responseMessage = document.getElementById('responseMessage');
    const radioButtons = document.querySelectorAll('input[name="hostel"]');
    const buttonContainer = document.querySelector('.button');
    const redirectLink = 'https://www.instagram.com/vitunite/'; // Change this to your Instagram link

    const maxCharacters = 300;

    function updateCharacterCount() {
        const text = responseInput.value;
        const characterCount = text.length;

        if (characterCount > maxCharacters) {
            responseInput.value = text.slice(0, maxCharacters); // Trims text to max length
        }

        const remainingCharacters = maxCharacters - characterCount;
        wordCountMessage.innerHTML = `${remainingCharacters}`;
        wordCountMessage.style.color = remainingCharacters < 0 ? 'red' : 'grey';
    }

    function updateSubmitButtonState() {
        const isRadioChecked = form.querySelector('input[name="hostel"]:checked');
        const isTextAreaFilled = responseInput.value.trim() !== '';
        submitButton.disabled = !(isRadioChecked && isTextAreaFilled);
    }

    function showPopupMessage() {
        buttonContainer.style.display = 'none'; // Hide the original buttons
        responseMessage.innerHTML = `
            <div class="popup-message">
                <a href="${redirectLink}" class="popup-link" target="_blank">Submitted! Visit Instagram.</a>
            </div>
        `;
        responseMessage.style.display = 'block';

        setTimeout(function() {
            window.location.href = redirectLink; // Redirect after 6 seconds
        }, 6000);
    }

    form.addEventListener('input', updateSubmitButtonState);
    form.addEventListener('change', updateSubmitButtonState);

    responseInput.addEventListener('input', updateCharacterCount);

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const isRadioChecked = form.querySelector('input[name="hostel"]:checked');
        const isTextAreaFilled = responseInput.value.trim() !== '';

        if (!isRadioChecked) {
            // Highlight the radio buttons if none is checked
            document.querySelectorAll('.radio-button').forEach(btn => btn.style.borderColor = 'red');
        } else {
            document.querySelectorAll('.radio-button').forEach(btn => btn.style.borderColor = 'rgb(211, 211, 211)');
        }

        if (!isTextAreaFilled) {
            // Highlight the textarea if it's empty
            responseInput.style.borderColor = 'red';
        } else {
            responseInput.style.borderColor = '#606060'; // Reset the border color
        }

        if (isRadioChecked && isTextAreaFilled) {
            // If everything is valid, proceed with form submission
            submitButton.disabled = true; // Disable submit button
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
            })
            .then(response => {
                submitButton.disabled = false;
                if (response.ok) {
                    showPopupMessage(); // Show the popup message and redirect
                } else {
                    responseMessage.textContent = 'There was a problem sending your message. Please try again.';
                }
            })
            .catch(error => {
                submitButton.disabled = false;
                responseMessage.textContent = 'There was a problem sending your message. Please try again.';
            });
        }
    });

    // Initial update of the character count
    updateCharacterCount();
});
