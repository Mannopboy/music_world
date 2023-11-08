let button_one = document.querySelector('.button_one'),
    button_two = document.querySelector('.button_two'),
    form_one = document.querySelector('.box__item2_form1'),
    form_two = document.querySelector('.box__item2_form2');

function display(name, type) {
    name.style.display = `${type}`
}

button_two.addEventListener('click', () => {
    button_two.classList.add('active1')
    button_one.classList.add('active2')
    display(form_two, "flex")
    display(form_one, "none")
})
button_one.addEventListener('click', () => {
    button_two.classList.remove('active1')
    button_one.classList.remove('active2')
    display(form_two, "none")
    display(form_one, "flex")
})