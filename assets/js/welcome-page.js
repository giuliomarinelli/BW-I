let diff = '';
let promiseCheckbox = document.querySelector("#myApp #promise");
let difficultySelect = document.querySelectorAll(".difficultyValue");
const proceedBtn = document.getElementById('proceed');

promiseCheckbox.addEventListener('change', (e) => {
    if (promiseCheckbox.checked) {
        difficultySelect.forEach(el => el.classList.remove('hidden'));
        document.getElementById('select-difficulty').classList.remove('hidden');
    } else {
        difficultySelect.forEach(el => el.classList.add('hidden'));
        document.getElementById('select-difficulty').classList.add('hidden');
        proceedBtn.setAttribute('disabled', 'disabled');
        difficultySelect.forEach(el => {
            if (el.classList.contains('active-btn')) {
                el.classList.remove('active-btn');
            }
        })
        
      }
    })

difficultySelect.forEach(el => {
    el.addEventListener('click', (e) => {
        difficultySelect.forEach(el => {
            if (el.classList.contains('active-btn')) {
                el.classList.remove('active-btn');
            }
        })
        e.target.classList.add('active-btn');
        proceedBtn.removeAttribute('disabled');
        diff = e.target.innerText.toLowerCase();
        localStorage.setItem('difficulty', diff);
    })
})

proceedBtn.addEventListener('click', (e) => {
    if (!e.target.hasAttribute('disabled')) {
        e.preventDefault();
        window.location.href = './benchmark-page.html'
    }
})