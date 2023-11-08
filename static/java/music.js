let play_button = document.querySelector('.box3__item1_time2'), music_active = document.getElementById('music'),
    play_button_img = document.querySelector('.box3__item1_time2 img'),
    music_active_img = document.querySelector('.list1_item2 img'),
    music_all_img = document.querySelectorAll('.music .music_img'),
    favorites_icon = document.querySelector('.favorites'), music_all_text = document.querySelectorAll('.music .text'),
    music_all = document.querySelectorAll('.music audio'),
    music_active_left_button = document.querySelector('.box3__item1_time1 img'),
    music_active_right_button = document.querySelector('.box3__item1_time3 img'), counter = 0, zero = 0,
    music_active_text = document.querySelector('.box3__item2__time1__box1 p'),
    music_active_text_two = document.querySelector('.music_name'), music_data = document.querySelector('.music_data'),
    music_all_button = document.querySelectorAll('.music_icon'), value_button = document.querySelector('#icon_value'),
    output = document.getElementById('value'), range = document.getElementById('range'),
    music_line = document.querySelector('.box3__item2__time2__box'), favorites = document.querySelector('.favorites'),
    music_line_item = document.querySelector('.box3__item2__time2__box__item'), rotate = false,
    download_button = document.querySelector('.button2'), play_online_button = document.querySelector('.button1'),
    fullTime = document.querySelector('.fullTime'), music_route = document.querySelector('.icon5'),
    jsmediatags = window.jsmediatags;

output.innerHTML = range.value;
range.oninput = function () {
    output.innerHTML = this.value;
}

let music_list = [];

collect_music(music_list)

function collect_music() {
    music_list = []
    let music_all_img = document.querySelectorAll('.music .music_img'),
        music_all_text = document.querySelectorAll('.music .text'), music_div = document.querySelectorAll('.music'),
        music_all = document.querySelectorAll('.music audio'), music_date = document.querySelectorAll('.music__item4');
    music_all.forEach((item, index) => {
        let info = {
            music_url: item.src,
            music_img: music_all_img[index].src,
            music_text: music_all_text[index].innerText,
            music_date: music_date[index].dataset.id,
            music_id: music_div[index].dataset.id
        }
        music_list.push(info)
    })
    return music_list
}

function getImg() {
    let music_all = document.querySelectorAll('.music audio'),
        music_all_img = document.querySelectorAll('.music .music_img');
    music_all.forEach((item, index) => {
        let file = item.src;
        console.log(item)
        jsmediatags.read(file, {
            onSuccess: function (tag) {
                let format, base64String;
                if (tag.tags.picture) {
                    let data = tag.tags.picture.data;
                    format = tag.tags.picture.format;
                    base64String = "";
                    for (let i = 0; i < data.length; i++) {
                        base64String += String.fromCharCode(data[i]);
                    }
                } else {
                    format = ""
                }
                if (format && base64String) {
                    music_all_img[index].src = `data:${format};base64,${window.btoa(base64String)}`;
                } else {
                    music_all_img[index].src = '/static/img/song_logo/404.png'
                }
                if (index === 0) {
                    if (format && base64String) {
                        music_active_img.src = `data:${format};base64,${window.btoa(base64String)}`;

                    } else {
                        music_active_img.src = '/static/img/song_logo/404.png'
                    }

                }
            }, onError: function (error) {
                console.log(error);
            }
        });

    })
}


add_music_date(zero)

music_active_right_button.addEventListener('click', () => {
    counter++
    if (counter > music_list.length - 1) {
        counter = 0
    }
    music_icon()
    add_music_date(counter)
    music_play(counter)
})
music_active_left_button.addEventListener('click', () => {
    counter--
    if (counter < 0) {
        counter = music_list.length - 1
    }
    music_icon()
    add_music_date(counter)
    music_play(counter)
})

music_active_img.classList.add('music_img_animation')
play_button.addEventListener('click', () => {
    if (music_active.paused) {
        music_play(counter)
    } else {
        music_pause(counter)
    }
})

function add_music_date(counter_) {
    music_list = collect_music()
    music_active.src = music_list[counter_]['music_url']
    music_active_img.src = music_list[counter_]['music_img']
    music_active_text.innerText = music_list[counter_]['music_text']
    music_active_text_two.innerText = music_list[counter_]['music_text']
    music_data.innerText = music_list[counter_]['music_date']
    download_button.href = `/download_mp3/${music_list[counter_]['music_id']}`
    get_favourite(counter_)
}

play_online_button.addEventListener('click', () => {
    let music_all_button = document.querySelectorAll('.music_icon');
    music_active.play()
    play_button_img.src = '../static/icons/button%202.png'
    music_active_img.classList.remove('music_img_animation')
    music_all_button[counter].src = '../static/icons/pause-solid%201.png'
})

function music_play(counter) {
    let music_all_button = document.querySelectorAll('.music_icon');
    music_active.play()
    play_button_img.src = '../static/icons/button%202.png'
    music_active_img.classList.remove('music_img_animation')
    music_all_button[counter].src = '../static/icons/pause-solid%201.png'
}

function music_pause(counter) {
    let music_all_button = document.querySelectorAll('.music_icon');
    music_active.pause()
    play_button_img.src = '../static/icons/button%201.png'
    music_active_img.classList.add('music_img_animation')
    music_all_button[counter].src = '../static/icons/Polygon%202.png'
}

function music_icon() {
    let music_all_button = document.querySelectorAll('.music_icon');
    music_all_button.forEach(item => {
        item.src = '../static/icons/Polygon%202.png'
    })
}

click_icon()

function click_icon() {
    let music_all_button = document.querySelectorAll('.music_icon');
    music_all_button.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (counter === 0) {

                // add_music_date(index)
                // music_icon()
                if (music_active.paused) {
                    music_play(counter)
                } else {
                    music_pause(counter)
                }

            } else {
                if (music_active.paused) {
                    music_play(counter)
                } else {
                    music_pause(counter)
                }
            }
            if (counter !== index) {
                counter = index
                add_music_date(index)
                music_icon()
                if (music_active.paused) {
                    music_play(counter)
                } else {
                    music_pause(counter)
                }
            }


        })
    })
}


range.addEventListener("mousemove", function () {
    let x = range.value;
    range.style.background = 'linear-gradient(90deg, rgb(134, 0, 147)' + x + '%, rgb(214, 214, 214)' + x + '%)';
})
range.addEventListener('change', function () {
    if (range.value === "100") {
        music_active.volume = "1"

    } else {
        music_active.volume = "0." + range.value

    }

    if (range.value === "0") {
        value_button.className = "fa-solid fa-volume-xmark"
    } else {
        value_button.className = "fa-solid fa-volume-high"
    }
})
value_button.addEventListener('click', function () {
    if (value_button.classList.contains("fa-volume-high")) {
        value_button.classList.remove("fa-volume-high")
        value_button.classList.add("fa-volume-xmark")
        music_active.volume = 0
    } else {
        value_button.classList.add("fa-volume-high")
        value_button.classList.remove("fa-volume-xmark")
        if (range.value === "100") {
            music_active.volume = "1"
        } else {
            if (music_active.volume !== "100") {
                music_active.volume = "0." + range.value
            } else {
                music_active.volume = "1"
            }
        }
    }
})

music_active.addEventListener("timeupdate", function (event) {
    const {duration, currentTime} = event.srcElement
    music_line_item.style.width = `${(currentTime / duration) * 100}%`
    if (music_active.ended) {
        if (rotate === false) {
            counter++
        }
        if (counter > music_list.length - 1) {
            counter = 0
        }
        music_icon()
        add_music_date(counter)
        music_play(counter)
    }
    let currentMin = Math.floor(currentTime / 60)
    let currentSec = Math.floor(currentTime % 60)
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    fullTime.innerHTML = `${currentMin}:${currentSec}`;
})
music_line.addEventListener("click", function (e) {
    const width = music_line.clientWidth
    const offsetX = e.offsetX
    if (music_active.paused === false) {
        music_active.currentTime = (offsetX / width) * music_active.duration
    }
})

music_route.addEventListener('click', () => {
    if (rotate === false) {
        music_route.className = "fa-solid fa-arrows-rotate icon5"
        rotate = true
    } else {
        music_route.className = "fa-solid fa-rotate-right icon5"
        rotate = false
    }
})


let category = document.querySelectorAll('.category'), singer_id = document.querySelectorAll('.music_singer_name'),
    category_id = 0, music_list_father = document.querySelector('.box2__item2__time2');
category.forEach((item, index) => {
    item.addEventListener('click', function () {
        counter = 0
        category_id = item.dataset.category_id
        fetch('/filter_category', {
            method: "POST", body: JSON.stringify({
                category_id: item.dataset.id, singer_id: singer_id.dataset.id
            }), headers: {
                'Content-type': "application/json"
            }
        })

            .then(function (response) {
                return response.json()
            })
            .then(function (info) {
                music_list_father.innerHTML = ""
                let exist = false;
                for (let music of info['music_list11']) {
                    if (music['id']) {
                        exist = true
                    }
                    music_list_father.innerHTML += `<div class="music" data-id="${music['id']}">
                        <div class="music__item1">
                            <div class="music__item1__time">
                                <img class="music_icon" src="../static/icons/Polygon%202.png" alt="">
                                <audio src="${music['url']}"></audio>
                            </div>
                        </div>
                        <div class="music__item2">
                            <img class="music_img"
                                 src="{{ music.singer.img }}"
                                 alt="">
                        </div>
                        <div class="music__item3">
                            <a href="#" class="music_singer_name">none</a>
                            <p class="text">${music['name']}</p>
                        </div>
                        <div class="music__item4" data-id="${music['date']}">
                            <p>3:00</p>
                        </div>
                        <div class="music__item5">
                            <p>325.4 kb/s</p>
                        </div>
                    </div>`
                }
                if (exist) {
                    click_icon()
                    collect_music()
                    music_play(counter)
                    music_pause(counter)
                    music_active.currentTime = 0
                    getImg()
                }


            })
    })
})
getImg()

favorites_icon.addEventListener('click', () => {
    fetch('/favorites/' + music_list[counter].music_id, {
        method: "GET", headers: {
            'Content-type': "application/json"
        }
    })

        .then(function (response) {
            return response.json()
        })
        .then(function (info) {

            if (info['exist']) {
                favorites.className = "fa-solid fa-star favorites"
            } else {
                favorites.className = "fa-regular fa-star favorites"
            }
            get_favourite(counter)
        })
})

function get_favourite(counter) {
    console.log(counter)
    fetch('/get_favourite', {
        method: "GET", headers: {
            'Content-type': "application/json"
        }

    })
        .then(function (response) {
            return response.json()
        })
        .then(function (info) {
            let favourite_list = []
            for (let item of info['likes']) {
                favourite_list.push(item['music_id'])
                if (favourite_list.includes(eval(music_list[counter]['music_id']))) {
                    favorites.className = "fa-solid fa-star favorites"
                } else {
                    favorites.className = "fa-regular fa-star favorites"
                }
            }
        })
}


