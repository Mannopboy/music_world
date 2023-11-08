let play_button = document.querySelector('.box3__item1_time2'), music_active = document.getElementById('music'),
    play_button_img = document.querySelector('.box3__item1_time2 img'),
    music_active_img = document.querySelector('.list1_item3 img'),
    music_all_img = document.querySelectorAll('.music .music_img'),
    music_list_one = document.querySelector('.music_list_one'),
    music_list_two = document.querySelector('.music_list_two'), favorites_icon = document.querySelector('.favorites'),
    music_all_text = document.querySelectorAll('.music .text'), music_all = document.querySelectorAll('.music audio'),
    music_active_left_button = document.querySelector('.box3__item1_time1 img'),
    music_active_right_button = document.querySelector('.box3__item1_time3 img'), counter = 0, zero = 0,
    music_active_text = document.querySelector('.box3__item2__time1__box1 p'),
    music_active_text_two = document.querySelector('.music_name'), music_data = document.querySelector('.music_data'),
    music_all_button = document.querySelectorAll('.music_icon'), value_button = document.querySelector('#icon_value'),
    output = document.getElementById('value'), range = document.getElementById('range'),
    play_list_button = document.querySelector('.list5_item'),
    music_select_button = document.querySelectorAll('.music_select_button'),
    play_list_section = document.querySelector('.play_list_add'),
    music_line = document.querySelector('.box3__item2__time2__box'), favorites = document.querySelector('.favorites'),
    music_line_item = document.querySelector('.box3__item2__time2__box__item'), rotate = false,
    fullTime = document.querySelector('.fullTime'), music_route = document.querySelector('.icon5'),
    play_list_musics_list = document.querySelector('.music_list_one'),
    play_list_upgrade_list = document.querySelector('.music_list_three'),
    play_list_item1 = document.querySelector('.play_list_item1'),
    play_list_item2 = document.querySelector('.play_list_item2'),
    singer_img = document.querySelectorAll('.music__item6 img'),
    play_list_item3 = document.querySelector('.play_list_item3'), save_button = document.querySelector('.save_button'),
    play_list_item4 = document.querySelector('.play_list_item4'), upgrade_button = document.querySelector('.upgrade'),
    del_music_button = document.querySelectorAll('.del_music_button'),
    music_list_del = document.querySelector('.music_list_del'),
    naming_button = document.querySelector('.box2__item2__time3 button'),
    crate_play_list_button = document.querySelector('.play_list_item2'),
    crate_play_list_button_two = document.querySelector('.naming2_div3 button'),
    play_list_x = document.querySelector('.play_list_add_button'),
    play_list_input = document.querySelector('.naming2_div2_item input'),
    play_list_div = document.querySelectorAll('.box'), add_music_button = document.querySelector('.plus'),
    music_del_button = document.querySelectorAll('.music_del_button'), play_list_id = 0,
    play_list_button_two = document.querySelector('.play_list_add_button_two i'), jsmediatags = window.jsmediatags;

output.innerHTML = range.value;
// output.href = `/download_mp3/${}"`
range.oninput = function () {
    output.innerHTML = this.value;
}
let music_list = [], play_list_musics = [];

function add_music_function() {
    let add_music_button = document.querySelector('.plus');
    add_music_button.addEventListener('click', () => {
        play_list_section.style.display = 'flex'
        play_list_button.style.display = 'none'
        play_list_item1.style.display = 'none'
        play_list_item2.style.display = 'none'
        play_list_item3.style.display = 'none'
        play_list_item4.style.display = 'flex'
        play_list_button_two.style.display = 'none'
        fetch('/filter_upgrade_play_list', {
            method: "POST", body: JSON.stringify({
                play_list_id: play_list_id
            }), headers: {
                'Content-type': "application/json"
            }
        })

            .then(function (response) {
                return response.json()
            })
            .then(function (info) {
                play_list_upgrade_list.innerHTML = ''
                for (let music of info['upgrade_musics']) {
                    play_list_upgrade_list.innerHTML += `<div class="music" data-id="${music['id']}">
                                <div class="music__item1">
                                    <div class="music__item1__time">
                                        <img class="music_icon" src="../static/icons/Polygon%202.png" alt="">
                                        <audio src="${music['url']}"></audio>
                                    </div>
                                </div>
                                <div class="music__item2">
                                    <img class="music_img"
                                         src="{{ music.music.singer.img }}"
                                         alt="">
                                </div>
                                <div class="music__item3">
                                    {#                            <a href="#" class="music_singer_name">${music['singer_name']}</a>#}
                                    <p class="text">${music['name']}</p>
                                </div>
                                <div class="music__item4" data-id="${music['date']}">
                                    <p>3:00</p>
                                </div>
                                <div class="music__item5">
                                    <p>325.4 kb/s</p>
                                </div>
                                <div class="music__item6">
                                    <img data-id="${music['id']}" src="../static/icons/Rectangle%2062.png" alt="">
                                </div>
                            </div>`
                }
                select_check()

                upgrade_button.addEventListener('click', () => {
                    fetch('/upgrade_play_list', {
                        method: "POST", body: JSON.stringify({
                            play_list_musics: play_list_musics, play_list_id: play_list_id
                        }), headers: {
                            'Content-type': "application/json"
                        }
                    })

                        .then(function (response) {
                            return response.json()
                        })
                        .then(function (info) {
                            play_list_musics_list.innerHTML = ''
                            for (let music of info['music_list']) {
                                console.log(music)
                                play_list_musics_list.innerHTML += `<div class="music" data-id="${music['id']}">
                                                                        <div class="music__item1">
                                                                            <div class="music__item1__time">
                                                                                <img class="music_icon" src="../static/icons/Polygon%202.png" alt="">
                                                                                <audio src="${music['url']}"></audio>
                                                                            </div>
                                                                        </div>
                                                                        <div class="music__item2">
                                                                            <img class="music_img"
                                                                                 src="${music['id']}"
                                                                                 alt="">
                                                                        </div>
                                                                        <div class="music__item3">
                                                                            <a href="#" class="music_singer_name">${music['singer_name']}</a>
                                                                            <p class="text">${music['name']} ...</p>
                                                                        </div>
                                                                        <div class="music__item4" data-id="${music['date']}">
                                                                            <p>3:00</p>
                                                                        </div>
                                                                        <div class="music__item5">
                                                                            <p>325.4 kb/s</p>
                                                                        </div>
                                                                    </div>`
                            }
                            play_list_musics_list.innerHTML += `<div class="plus">+</div>`
                            add_music_function()
                        })

                    play_list_section.style.display = "none"
                    play_list_button.style.display = 'flex'
                })
            })


    })
}


add_music_function()


function del_music(info) {
    music_list_del.innerHTML = ''
    for (let music of info['music_list_del']) {
        music_list_del.innerHTML += `<div class="new_music" data-id="${music['id']}">
                                <div class="new_music__item1">
                                    <div class="new_music__item1__time">
                                        <img class="new_music_icon" src="../static/icons/Polygon%202.png" alt="">
                                        <audio src="${music['url']}"></audio>
                                    </div>
                                </div>
                                <div class="new_music__item2">
                                    <img class="new_music_img"
                                         src="{{ music.music.singer.img }}"
                                         alt="">
                                </div>
                                <div class="new_music__item3">
                                    <a href="#" class="music_singer_name">${music['singer_name']}</a>
                                    <p class="new_text">${music['name']}</p>
                                </div>
                                <div class="new_music__item4" data-id="${music['date']}">
                                    <p>3:00</p>
                                </div>
                                <div class="new_music__item5">
                                    <p>325.4 kb/s</p>
                                </div>
                                <div class="new_music__item6">
                                    <i data-id="${music['id']}" class="fa-solid fa-trash del_music_button" style="color: #860093"></i>
                                </div>
                            </div>`
    }
    del_function()
}


music_del_button.forEach(item => {
    item.addEventListener('click', () => {
        play_list_section.style.display = 'flex'
        play_list_button.style.display = 'none'
        play_list_item1.style.display = 'none'
        play_list_item2.style.display = 'none'
        play_list_item3.style.display = 'flex'
        play_list_item4.style.display = 'none'
        play_list_button_two.style.display = 'none'
        play_list_id = item.dataset.id
        fetch('/get_play_list', {
            method: "POST", body: JSON.stringify({
                play_list_id: item.dataset.id
            }), headers: {
                'Content-type': "application/json"
            }
        })

            .then(function (response) {
                return response.json()
            })
            .then(function (info) {
                del_music(info)
                del_function()

            })
    })
})

function del_function() {
    let del_music_button = document.querySelectorAll('.del_music_button');
    del_music_button.forEach(item => {
        item.addEventListener('click', () => {
            fetch(`/del_music/${play_list_id}/${item.dataset.id}`, {
                headers: {
                    'Content-type': "application/json"
                }
            })

                .then(function (response) {
                    return response.json()
                })
                .then(function (info) {
                    del_music(info)
                })
        })
    })
}

naming_button.addEventListener('click', () => {
    play_list_item1.style.display = 'none'
    play_list_item2.style.display = 'flex'
    play_list_item3.style.display = 'none'
    play_list_item4.style.display = 'none'
    play_list_button_two.className = 'fa-solid fa-angles-left'
})
play_list_x.addEventListener('click', () => {
    play_list_section.style.display = 'none'
    play_list_button.style.display = 'flex'
    play_list_button_two.style.display = 'flex'
    play_list_item1.style.display = 'flex'
    play_list_item2.style.display = 'none'
    play_list_item3.style.display = 'none'
    play_list_item4.style.display = 'none'
    play_list_musics = []
})
save_button.addEventListener('click', () => {
    play_list_section.style.display = 'none'
    play_list_button.style.display = 'flex'
    play_list_button_two.style.display = 'flex'
    play_list_item1.style.display = 'flex'
    play_list_item2.style.display = 'none'
    play_list_item3.style.display = 'none'
    play_list_item4.style.display = 'none'
    play_list_musics = []
})

play_list_button_two.addEventListener('click', () => {
    if (play_list_button_two.className === 'fa-solid fa-angles-left') {
        play_list_item1.style.display = 'flex'
        play_list_item2.style.display = 'none'
        play_list_item3.style.display = 'none'
        play_list_item4.style.display = 'none'
        play_list_button_two.className = 'fa-solid fa-angles-right'
    } else {
        play_list_item1.style.display = 'none'
        play_list_item2.style.display = 'flex'
        play_list_item3.style.display = 'none'
        play_list_item4.style.display = 'none'
        play_list_button_two.className = 'fa-solid fa-angles-left'
    }
})

collect_music(music_list)

function select_check() {
    let singer_img = document.querySelectorAll('.music__item6 img');
    singer_img.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (play_list_musics.includes(item.dataset.id)) {
                item.src = '../static/icons/Rectangle%2062.png'
                let index_singer = play_list_musics.indexOf(item.dataset.id)
                play_list_musics.splice(index_singer, 1)
            } else {
                item.src = '../static/icons/square-check-regular%201.png'
                play_list_musics.push(item.dataset.id)
            }
        })
    })
}

select_check()

crate_play_list_button_two.addEventListener('click', () => {
    fetch('/register_play_list', {
        method: "POST", body: JSON.stringify({
            play_list_musics: play_list_musics, name: play_list_input.value
        }), headers: {
            'Content-type': "application/json"
        }
    })

        .then(function (response) {
            return response.json()
        })
        .then(function (info) {
            play_list_musics_list.innerHTML = ''
            for (let music of info['play_list_musics']) {
                play_list_musics_list.innerHTML += `<div class="music" data-id="${music['id']}">
                        <div class="music__item1">
                            <div class="music__item1__time">
                                <img class="music_icon" src="../static/icons/Polygon%202.png" alt="">
                                <audio src="${music['url']}"></audio>
                            </div>
                        </div>
                        <div class="music__item2">
                            <img class="music_img"
                                 src="${music['id']}"
                                 alt="">
                        </div>
                        <div class="music__item3">
                            <a href="#" class="music_singer_name">${music['singer_name']}</a>
                            <p class="text">${music['name']} ...</p>
                        </div>
                        <div class="music__item4" data-id="${music['date']}">
                            <p>3:00</p>
                        </div>
                        <div class="music__item5">
                            <p>325.4 kb/s</p>
                        </div>
                    </div>`
            }
            play_list_section.style.display = "none"
            play_list_button.style.display = 'flex'
            play_list_musics = []
        })
})

play_list_button.addEventListener('click', () => {
    singer_img.forEach(item => {
        item.src = '../static/icons/Rectangle%2062.png'
    })
    console.log(play_list_musics)
    play_list_section.style.display = "flex"
    play_list_button.style.display = 'none'
})

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
}

add_music_date(zero)

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

music_active_img.classList.add('music_img_animation')

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


play_list_div.forEach((item, index) => {
    item.addEventListener('click', () => {
        play_list_id = item.dataset.id
        fetch('/filter_play_list', {
            method: "POST", body: JSON.stringify({
                play_list_id: item.dataset.id
            }), headers: {
                'Content-type': "application/json"
            }
        })

            .then(function (response) {
                return response.json()
            })
            .then(function (info) {
                play_list_musics_list.innerHTML = ''
                let exist = false;
                for (let music of info['music_list_in_play_list']) {
                    if (music['id']) {
                        exist = true
                    }
                    play_list_musics_list.innerHTML += `<div class="music" data-id="${music['id']}">
                        <div class="music__item1">
                            <div class="music__item1__time">
                                <img class="music_icon" src="../static/icons/Polygon%202.png" alt="">
                                <audio src="${music['url']}"></audio>
                            </div>
                        </div>
                        <div class="music__item2">
                            <img class="music_img"
                                 src="${music['id']}"
                                 alt="">
                        </div>
                        <div class="music__item3">
                            <a href="#" class="music_singer_name">${music['singer_name']}</a>
                            <p class="text">${music['name']} ...</p>
                        </div>
                        <div class="music__item4" data-id="${music['date']}">
                            <p>3:00</p>
                        </div>
                        <div class="music__item5">
                            <p>325.4 kb/s</p>
                        </div>
                    </div>`
                }
                play_list_musics_list.innerHTML += `<div class="plus">+</div>`
                if (exist) {
                    click_icon()
                    collect_music()
                    music_play(counter)
                    music_pause(counter)
                    music_active.currentTime = 0
                    getImg()
                    add_music_function()

                }
            })
    })
})

play_list_id = play_list_div[0].dataset.id
fetch('/filter_play_list', {
    method: "POST", body: JSON.stringify({
        play_list_id: play_list_div[0].dataset.id
    }), headers: {
        'Content-type': "application/json"
    }
})

    .then(function (response) {
        return response.json()
    })
    .then(function (info) {
        play_list_musics_list.innerHTML = ''
        let exist = false;
        for (let music of info['music_list_in_play_list']) {
            if (music['id']) {
                exist = true
            }
            play_list_musics_list.innerHTML += `<div class="music" data-id="${music['id']}">
                        <div class="music__item1">
                            <div class="music__item1__time">
                                <img class="music_icon" src="../static/icons/Polygon%202.png" alt="">
                                <audio src="${music['url']}"></audio>
                            </div>
                        </div>
                        <div class="music__item2">
                            <img class="music_img"
                                 src="${music['id']}"
                                 alt="">
                        </div>
                        <div class="music__item3">
                            <a href="#" class="music_singer_name">${music['singer_name']}</a>
                            <p class="text">${music['name']} ...</p>
                        </div>
                        <div class="music__item4" data-id="${music['date']}">
                            <p>3:00</p>
                        </div>
                        <div class="music__item5">
                            <p>325.4 kb/s</p>
                        </div>
                    </div>`
        }
        play_list_musics_list.innerHTML += `<div class="plus">+</div>`
        if (exist) {
            click_icon()
            collect_music()
            music_play(counter)
            music_pause(counter)
            music_active.currentTime = 0
            getImg()
            add_music_function()

        }
    })

let category = document.querySelectorAll('.category'), box2__item2 = document.querySelector('.box2__item2'),
    category_id = 0, music_list_father = document.querySelector('.box2__item2__time2');
category.forEach((item, index) => {
    item.addEventListener('click', function () {
        counter = 0
        category_id = item.dataset.category_id
        fetch('/filter_category', {
            method: "POST", body: JSON.stringify({
                category_id: item.dataset.id, singer_id: box2__item2.dataset.id
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




