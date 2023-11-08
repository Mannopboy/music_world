let box__item3 = document.querySelector(".box__item3"), play_list = document.querySelector(".play_list");

window.addEventListener('DOMContentLoaded', () => {
    let body = document.querySelector('.body'), loader = document.querySelector('.loader');
    window.addEventListener('load', function () {
        loader.classList.add('loader_end')
        let interval = setInterval(remove, 300)

        function remove() {
            if (loader) {
                body.removeChild(loader)
                clearInterval(interval)
            }
        }
    })
})

box__item3.addEventListener('mouseenter', () => {
    play_list.classList.add('play_list_active')
})
play_list.addEventListener('mouseenter', () => {
    play_list.classList.add('play_list_active')
})
box__item3.addEventListener('mouseleave', () => {
    play_list.classList.remove('play_list_active')
})
play_list.addEventListener('mouseleave', () => {
    play_list.classList.remove('play_list_active')
})