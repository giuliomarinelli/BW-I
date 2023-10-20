const promise = document.getElementById('promise');
const proceedButton = document.getElementById("proceed");
promise.addEventListener('click', () => {
    if (promise.checked) {
        proceedButton.disabled = false;
    } else {
        proceedButton.disabled = true;
    }
})
proceedButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.disabled === false) {
        console.log(e.target);  
        window.location.href = './benchmark-page.html';
    }
})