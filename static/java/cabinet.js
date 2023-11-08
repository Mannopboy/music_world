const jsmediatags = window.jsmediatags;
let register = document.querySelectorAll('.register'), button_text = document.querySelectorAll('.button6'),
    button5_3 = document.querySelectorAll('.button5_3'),
    button5_father__item = document.querySelector('.button5_father__item'),
    button1 = document.getElementById('button1'), button2 = document.getElementById('button2'), old_index = 0,
    register_music = document.querySelector('.register_music'), button3 = document.getElementById('button3'),
    register2 = document.querySelector('.register2'), input_img = document.querySelector('#input_img'),
    genre_list_one = document.querySelector('.carousel_item3_time1'), cover = document.querySelector('#cover'),
    category_input = document.querySelector('.register_2__item input'),
    genre_input = document.querySelector('.register_3__item input'),
    singer_button_1 = document.querySelector('.singer_button_1'), singer_add = document.querySelector('.singer_add'),
    category_list = document.querySelector('.carousel_item2_time1'),
    singer_list = document.querySelector('.carousel_item1_time1'), carousel = document.querySelector('.carousel'),
    genre_button = document.querySelector('.register_3__item button'),
    album_list_one = document.querySelector('.button5_father__item_time'),
    input_singer = document.querySelector('.input_singer'), button5_1 = document.querySelectorAll('.button5_1'),
    singer_button = document.querySelector('.register_1__item button'),
    singer_file = document.querySelector('.custom-file-input'),
    album_input = document.querySelector('.register_4__item input'), singer_id = 0,
    album = document.querySelector('#album'), genre = document.querySelector('#genre'),
    category = document.querySelector('#category'),
    category_button = document.querySelector('.register_2__item button');


button_text.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (old_index !== index) {
            old_index = index
            removeClassRegister()
            register[index].style.display = 'flex'
            item.innerHTML = ` <p class="button_text">-</p>`
            register_music.style.display = "none"
        } else {
            if (register[index].style.display === 'flex') {
                register[index].style.display = 'none'
                register_music.style.display = "flex"
                item.innerHTML = ` <p class="button_text">+</p>`
            } else {
                register[index].style.display = 'flex'
                register_music.style.display = "none"
                item.innerHTML = ` <p class="button_text">-</p>`
            }
        }
    })
})

function moveCarusel(button, number) {
    button.addEventListener('click', () => {
        removeClassRegister()
        carousel.style.transform = `translateX(${number}px)`
    })
}

function removeClassRegister() {
    register.forEach((item, index) => {
        item.style.display = "none"
        button_text[index].innerHTML = ` <p class="button_text">+</p>`
        register_music.style.display = "flex"
    })
}

moveCarusel(button1, 0)
moveCarusel(button2, -635)
moveCarusel(button3, -1270)

function singer_button_3() {
    let button5_3 = document.querySelectorAll('.button5_3');
    button5_3.forEach((item, index) => {
        item.addEventListener('click', function () {
            button5_father__item.style.display = 'flex'
            artist.value = item.innerText
            button5_3.forEach(index => {
                index.classList.add('active')
            })
            item.classList.add('non_active')
            singer_button_1.style.display = 'none'
        })
        item.addEventListener('dblclick', () => {
            album.value = ''
            button5_3.forEach(item2 => {
                item2.classList.remove('active')
                item2.classList.remove('non_active')
            })
            button5_father__item.style.display = 'none'
            singer_button_1.style.display = 'flex'
        })
    })
}

singer_button_3()

document.querySelector('.register_music img').addEventListener('click', function () {
    document.querySelector("#input").click()
})

document.getElementById('input').addEventListener('change', (event) => {
    const file = event.target.files[0]
    register2.style.display = "flex"
    console.log(jsmediatags)
    jsmediatags.read(file, {
        onSuccess: function (tag) {
            let format, base64String;
            if (tag.tags.picture) {
                let data = tag.tags.picture.data;
                input_img.filename = data
                format = tag.tags.picture.format;
                base64String = "";
                for (let i = 0; i < data.length; i++) {
                    base64String += String.fromCharCode(data[i]);
                }
            } else {
                format = ""
            }
            if (format && base64String) {
                document.querySelector("#cover").style.background = `url(data:${format};base64,${window.btoa(base64String)})center center/cover`;
                changeImgMusic()
            } else {
                document.querySelector("#cover").style.background = 'url(/static/img/song_logo/404.png) center center/cover'
                changeImgMusic()
            }
            if (tag.tags.title) {
                document.querySelector("#title").value = tag.tags.title;
            } else {
                document.querySelector("#title").value = '';
            }
            if (tag.tags.artist) {
                document.querySelector("#artist").value = tag.tags.artist;
            } else {
                document.querySelector("#artist").value = '';
            }
            if (tag.tags.album) {
                document.querySelector("#album").value = tag.tags.album;
            } else {
                document.querySelector("#album").value = '';
            }
            if (tag.tags.genre) {
                document.querySelector("#genre").value = tag.tags.genre;
            } else {
                document.querySelector("#genre").value = '';
            }
        }
    })
})

function changeImgMusic() {
    cover.style.cursor = "pointer";
    cover.addEventListener('click', function () {
        input_img.click()
    })

    input_img.addEventListener('change', function () {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            uploaded_image = reader.result;
            cover.style.cursor = "initial";
            cover.style.background = `url(${uploaded_image})center center/cover`;
            input_img.filename = uploaded_image

        });
        reader.readAsDataURL(this.files[0]);
    });
}

category_button.addEventListener('click', () => {
    if (category_input.value) {
        fetch('/register_category', {
            method: "POST", body: JSON.stringify({
                name: category_input.value
            }), headers: {
                'Content-type': "application/json"
            }
        })

            .then(function (response) {
                return response.json()
            })
            .then(function (info) {
                category_list.innerHTML = ''
                for (let category of info['category_list']) {
                    category_list.innerHTML += `<div class="button5 i button5_1"><p>${category['name']}</p></div>`
                }
                let button5_1 = document.querySelectorAll('.button5_1');
                change_color(button5_1, category)
            })
    }
})

genre_button.addEventListener('click', () => {
    if (genre_input.value) {
        fetch('/register_genre', {
            method: "POST", body: JSON.stringify({
                name: genre_input.value
            }), headers: {
                'Content-type': "application/json"
            }
        })

            .then(function (response) {
                return response.json()
            })
            .then(function (info) {
                genre_list_one.innerHTML = ''
                for (let genre of info['genre_list']) {
                    genre_list_one.innerHTML += `<div class="button5 i button5_2"><p>${genre['name']}</p></div>`
                }
                change_color()
            })
    }
})

singer_button.addEventListener('click', () => {
    if (input_singer.value) {
        fetch('/add_singer', {
            method: "POST", body: JSON.stringify({
                name: input_singer.value
            }), headers: {
                'Content-type': "application/json"
            }
        })
            .then(function (response) {
                return response.json()
            })

            .then(function (responseJson) {
                let data = new FormData();
                data.append('file', singer_file.files[0]);
                fetch('/add_singer_img/' + responseJson['singer_id'], {
                    method: "POST", body: data
                })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        singer_add.innerHTML = ""
                        for (let singer of response["singer_list"]) {
                            singer_add.innerHTML += `<div data-singer_id="${singer['id']}" class="button5 i button5_3">
                                    <p>${singer['name']}</p>
                                </div>`
                        }

                        singer_button_3()
                        singer_album()
                        change_color()
                    })
            })
    }
})

function singer_album() {
    let button5_3 = document.querySelectorAll('.button5_3');
    button5_3.forEach((item, index) => {
        item.addEventListener('click', () => {
            singer_id = item.dataset.singer_id
            fetch('/get_album/' + item.dataset.singer_id, {
                method: "POST", body: JSON.stringify({
                    name: album_input.value
                }), headers: {
                    'Content-type': "application/json"
                }
            })

                .then(function (response) {
                    return response.json()
                })
                .then(function (info) {
                    console.log(info)
                    album_list_one.innerHTML = ""
                    let register_album = document.querySelector('.register_album');
                    register_album.value = ""
                    for (let album of info['album_list']) {
                        album_list_one.innerHTML += `<div class="button_album i" >
                                            <p>${album['name']}</p>
                                        </div>`
                    }
                    let button_text = document.querySelectorAll('.button_album');
                    button_text.forEach(item => {
                        item.addEventListener('click', function () {
                            button_text.forEach(index => {
                                index.classList.remove('change_color_2')
                            })
                            album.value = item.innerText
                            item.classList.add('change_color_2')
                        })
                    })

                })
        })
    })
}

singer_album()

function change_color(type) {
    let button5_2 = document.querySelectorAll('.button5_2'),
        button5_1 = document.querySelectorAll('.button5_1');

    button5_2.forEach(item => {
        item.addEventListener('click', function () {
            button5_2.forEach(index => {
                index.classList.remove('change_color_2')
            })
            genre.value = item.innerText
            item.classList.add('change_color_2')
        })
    })
    button5_1.forEach(item => {
        item.addEventListener('click', function () {
            button5_1.forEach(index => {
                index.classList.remove('change_color_2')
            })
            category.value = item.innerText
            item.classList.add('change_color_2')
        })
    })
}

change_color()


let input2 = document.querySelector('.register_4__item input'),
    list2 = document.querySelector('.button5_father__item_time'),
    button11 = document.querySelector('.register_4__item button');

button11.addEventListener('click', () => {
    if (input2.value) {
        fetch('/register_album/' + singer_id, {
            method: "POST", body: JSON.stringify({
                name: input2.value
            }), headers: {
                'Content-type': "application/json"
            }
        })

            .then(function (response) {
                return response.json()
            })
            .then(function (info) {
                list2.innerHTML = ''
                for (let album of info['album_list']) {
                    list2.innerHTML += `<div class="button6 i" >
                                            <p>${album['name']}</p>
                                        </div>`
                }

            })
    }
})
