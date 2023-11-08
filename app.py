from flask import *
from werkzeug.utils import secure_filename
from datetime import *
from backend.models import *
from backend.config import *
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123@localhost/music'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['UPLOAD_FOLDER'] = 'static/music_img'
app.config['SECRET_KEY'] = "_mmr_2007"
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class User(db.Model):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    password = Column(String)
    gmail = Column(String)
    admin = Column(Boolean)
    user = Column(Boolean, default=True)
    favorites = db.relationship("Favorites", backref="user", order_by="Favorites.id")


class Music(db.Model):
    __tablename__ = "music"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    singer_id = Column(Integer, ForeignKey('singer.id'))
    album_id = Column(Integer, ForeignKey('album.id'))
    category_id = Column(Integer, ForeignKey('category.id'))
    genre_id = Column(Integer, ForeignKey('genre.id'))
    url = Column(String)
    date = Column(DateTime)
    favorites = db.relationship("Favorites", backref="music", order_by="Favorites.id")


class Category(db.Model):
    __tablename__ = "category"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    music = db.relationship("Music", backref="category", order_by="Music.id")


class Album(db.Model):
    __tablename__ = "album"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    singer_id = Column(Integer, ForeignKey('singer.id'))
    music = db.relationship("Music", backref="album", order_by="Music.id")


class Genre(db.Model):
    __tablename__ = "genre"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    music = db.relationship("Music", backref="genre", order_by="Music.id")


class Singer(db.Model):
    __tablename__ = "singer"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    img = Column(String)
    album = db.relationship("Album", backref="singer", order_by="Album.id")
    music = db.relationship("Music", backref="singer", order_by="Music.id")


class Favorites(db.Model):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True)
    music_id = Column(Integer, ForeignKey('music.id'))
    user_id = Column(Integer, ForeignKey('user.id'))


class Play_list(db.Model):
    __tablename__ = "play_list"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    user_id = Column(Integer, ForeignKey('user.id'))
    muiscs = db.relationship("Music", secondary="play_list__music", backref="play_list", order_by="Music.id")


db.Table('play_list__music',
         Column('play_list', Integer, ForeignKey('play_list.id')),
         Column('music_id', Integer, ForeignKey('music.id'))
         )


def get_current_user():
    user_result = None
    if "username" in session:
        user_result = User.query.filter(
            or_(User.name == session['username'], User.gmail == session['username'])).first()
    return user_result


@app.route('/menu')
def menu():
    user = get_current_user()
    return render_template('menu.html', user=user)


@app.route('/play_list')
def play_list():
    user = get_current_user()
    musics = Favorites.query.filter(Favorites.user_id == user.id).order_by(Favorites.id).all()
    play_list_mor = Play_list.query.filter(Play_list.user_id == user.id).order_by(Play_list.id).all()
    for play_list in play_list_mor:
        if not play_list.muiscs:
            db.session.delete(play_list)
            db.session.commit()
    play_list_all = Play_list.query.filter(Play_list.user_id == user.id).all()
    return render_template('play_list.html', user=user, musics=musics, play_list_mor=play_list_mor,
                           play_list_all=play_list_all)


@app.route('/favourites')
def favourites():
    category_list = []
    singer_list = []
    user = get_current_user()
    musics = Favorites.query.filter(Favorites.user_id == user.id).order_by(Favorites.id).all()
    for music in musics:
        category_list.append(music.music.category_id)
    category_list = list(dict.fromkeys(category_list))
    for music in musics:
        singer_list.append(music.music.singer_id)
    singer_list = list(dict.fromkeys(singer_list))
    category_mor = Category.query.filter(Category.id.in_([category_id for category_id in category_list])).order_by(
        Category.id).all()
    singers = Singer.query.filter(Singer.id.in_([singer_id for singer_id in singer_list])).order_by(Singer.id).all()
    play_list_all = Play_list.query.filter(Play_list.user_id == user.id).all()
    return render_template('favourites.html', musics=musics, category_mor=category_mor, singers=singers, user=user,
                           play_list_all=play_list_all)


@app.route('/favorites/<int:music_id>')
def favorites(music_id):
    user = get_current_user()
    music_one = Favorites.query.filter(Favorites.music_id == music_id, Favorites.user_id == user.id).first()
    info = []
    exist = False
    if not music_one:
        favorites = Favorites(music_id=music_id, user_id=user.id)
        db.session.add(favorites)
        db.session.commit()
        exist = True
    else:

        db.session.delete(music_one)
        db.session.commit()

    return jsonify({
        "exist": exist
    })


@app.route('/get_favourite')
def get_favourite():
    info = []
    user = get_current_user()
    favorites_music = Favorites.query.filter(Favorites.user_id == user.id).all()
    for favorites1 in favorites_music:
        favorites_info = {
            "music_id": favorites1.music_id
        }
        info.append(favorites_info)
    return jsonify({
        "likes": info
    })


@app.route('/logout')
def logout():
    session['username'] = None
    return redirect(url_for('login'))


@app.route('/register', methods=['POST', 'GET'])
def register():
    user = get_current_user()
    if request.method == "POST":
        name = request.form.get('name')
        gmail = request.form.get('gmail')
        password = request.form.get('password')
        hashed_password = generate_password_hash(password, method="sha256")
        add = User(name=name, gmail=gmail, password=hashed_password, user=True)
        db.session.add(add)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('register.html', user=user)


@app.route('/', methods=['POST', 'GET'])
def login():
    user = get_current_user()
    if request.method == "POST":
        name = request.form.get('name')
        password = request.form.get('password')
        get_user = User.query.filter(or_(User.name == name, User.gmail == name)).first()
        if get_user:
            checked = check_password_hash(get_user.password, password)
            session['username'] = name
            if checked:
                return redirect(url_for('home'))
            else:
                return redirect(url_for('login'))
    return render_template('register.html', user=user)


@app.route('/home')
def home():
    singers = Singer.query.order_by(Singer.id).all()
    user = get_current_user()
    play_list_all = Play_list.query.filter(Play_list.user_id == user.id).all()
    return render_template('home.html', singers=singers, user=user, play_list_all=play_list_all)


@app.route('/music/<int:singer_id>')
def music(singer_id):
    user = get_current_user()
    musics = Music.query.filter(Music.singer_id == singer_id).order_by(Music.id).all()
    category_mor = Category.query.order_by(Category.id).all()
    singers = Singer.query.order_by(Singer.id).all()
    singer = Singer.query.filter(Singer.id == singer_id).first()
    play_list_all = Play_list.query.filter(Play_list.user_id == user.id).all()
    return render_template('music.html', musics=musics, category_mor=category_mor, singers=singers,
                           singer_id=singer_id,
                           singer=singer, user=user, play_list_all=play_list_all)


@app.route('/cabinet')
def cabinet():
    user = get_current_user()
    category = Category.query.order_by(Category.id).all()
    genres = Genre.query.order_by(Genre.id).all()
    singers = Singer.query.order_by(Singer.id).all()
    play_list_all = Play_list.query.filter(Play_list.user_id == user.id).all()
    return render_template('cabinet.html', category=category, genres=genres, singers=singers, user=user,
                           play_list_all=play_list_all)


@app.route('/register_category', methods=['POST'])
def register_category():
    name = request.get_json().get('name')
    add_user = Category(name=name)
    db.session.add(add_user)
    db.session.commit()
    category_all = Category.query.order_by(Category.id).all()
    category_list = []
    for category in category_all:
        info = {
            "id": category.id,
            "name": category.name
        }
        category_list.append(info)
    return jsonify({
        "category_list": category_list
    })


@app.route('/register_genre', methods=['POST'])
def register_genre():
    name = request.get_json().get('name')
    add_user = Genre(name=name)
    db.session.add(add_user)
    db.session.commit()
    genre_all = Genre.query.order_by(Genre.id).all()
    genre_list = []
    for genre in genre_all:
        info = {
            "id": genre.id,
            "name": genre.name
        }
        genre_list.append(info)
    return jsonify({
        "genre_list": genre_list
    })


@app.route('/get_play_list', methods=['POST'])
def get_play_list():
    play_list_id = request.get_json().get('play_list_id')
    play_list = Play_list.query.filter(Play_list.id == play_list_id).first()
    music_list_del = []
    if play_list.muiscs:
        for play_list_music in play_list.muiscs:
            info = {
                "id": play_list_music.id,
                "name": play_list_music.name,
                "singer_id": play_list_music.singer_id,
                "singer_name": play_list_music.singer.name[0:10],
                "category_id": play_list_music.category_id,
                "genre_id": play_list_music.genre_id,
                "album_id": play_list_music.album_id,
                "date": play_list_music.date.strftime("%Y-%m-%d"),
                "url": play_list_music.url
            }
            music_list_del.append(info)
            print("true")
    else:
        db.session.remove(play_list)
        db.session.commit()
        print("false")
    return jsonify({
        "music_list_del": music_list_del
    })


@app.route('/del_music/<int:play_list_id>/<int:music_id>')
def del_music(play_list_id, music_id):
    play_list = Play_list.query.filter(Play_list.id == play_list_id).first()
    del_music_one = Music.query.filter(Music.id == music_id).first()
    print(del_music_one.name)
    play_list.muiscs.remove(del_music_one)
    db.session.commit()
    music_list_del = []
    for play_list_music in play_list.muiscs:
        info = {
            "id": play_list_music.id,
            "name": play_list_music.name,
            "singer_id": play_list_music.singer_id,
            "singer_name": play_list_music.singer.name[0:10],
            "category_id": play_list_music.category_id,
            "genre_id": play_list_music.genre_id,
            "album_id": play_list_music.album_id,
            "date": play_list_music.date.strftime("%Y-%m-%d"),
            "url": play_list_music.url
        }
        music_list_del.append(info)
    return jsonify({
        "music_list_del": music_list_del
    })


@app.route('/register_play_list', methods=['POST'])
def register_play_list():
    user = get_current_user()
    name = request.get_json().get('name')
    music_list = request.get_json().get('play_list_musics')
    add_play_list = Play_list(name=name, user_id=user.id)
    db.session.add(add_play_list)
    db.session.commit()
    for music in music_list:
        get_music = Music.query.filter(Music.id == music).first()
        if get_music not in add_play_list.muiscs:
            add_play_list.muiscs.append(get_music)
            db.session.commit()
    play_list_musics = []
    for play_list_music in add_play_list.muiscs:
        info = {
            "id": play_list_music.id,
            "name": play_list_music.name,
            "singer_id": play_list_music.singer_id,
            "singer_name": play_list_music.singer.name[0:10],
            "category_id": play_list_music.category_id,
            "genre_id": play_list_music.genre_id,
            "album_id": play_list_music.album_id,
            "date": play_list_music.date.strftime("%Y-%m-%d"),
            "url": play_list_music.url
        }
        play_list_musics.append(info)
    return jsonify({
        "play_list_musics": play_list_musics
    })


@app.route('/filter_upgrade_play_list', methods=['POST'])
def filter_upgrade_play_list():
    user = get_current_user()
    play_list_id = request.get_json().get('play_list_id')
    musics_play_list = Play_list.query.filter(Play_list.id == play_list_id).first()
    play_list_musics = []
    for music in musics_play_list.muiscs:
        play_list_musics.append(music.id)
    musics = Music.query.filter(~Music.id.in_([muiscs_id for muiscs_id in play_list_musics])).order_by(
        Music.id).all()
    upgrade_musics = []
    for play_list_music in musics:
        info = {
            "id": play_list_music.id,
            "name": play_list_music.name,
            "singer_id": play_list_music.singer_id,
            "singer_name": play_list_music.singer.name[0:10],
            "category_id": play_list_music.category_id,
            "genre_id": play_list_music.genre_id,
            "album_id": play_list_music.album_id,
            "date": play_list_music.date.strftime("%Y-%m-%d"),
            "url": play_list_music.url
        }
        upgrade_musics.append(info)
    return jsonify({
        "upgrade_musics": upgrade_musics
    })


@app.route('/upgrade_play_list', methods=['POST'])
def upgrade_play_list():
    user = get_current_user()
    play_list_id = request.get_json().get('play_list_id')
    play_list_musics = request.get_json().get('play_list_musics')
    play_list_upgrade = Play_list.query.filter(Play_list.id == play_list_id, Play_list.user_id == user.id).first()
    for music in play_list_musics:
        new_music = Music.query.filter(Music.id == music).first()
        if new_music not in play_list_upgrade.muiscs:
            play_list_upgrade.muiscs.append(new_music)
            db.session.commit()
    play_list_musics_new = []
    for play_list_music in play_list_upgrade.muiscs:
        info = {
            "id": play_list_music.id,
            "name": play_list_music.name,
            "singer_id": play_list_music.singer_id,
            "singer_name": play_list_music.singer.name[0:10],
            "category_id": play_list_music.category_id,
            "genre_id": play_list_music.genre_id,
            "album_id": play_list_music.album_id,
            "date": play_list_music.date.strftime("%Y-%m-%d"),
            "url": play_list_music.url
        }
        play_list_musics_new.append(info)
    return jsonify({
        "music_list": play_list_musics_new
    })


# ~ yo'gini chiqaradi listdagi

@app.route('/get_singer', methods=['POST'])
def get_singer():
    user = get_current_user()
    singer_list = request.get_json().get('singer_list')
    if singer_list:
        musics = db.session.query(Favorites).join(Favorites.music).options(contains_eager(Favorites.music)).filter(
            Favorites.user_id == user.id, Music.singer_id.in_([singer_id for singer_id in singer_list])).order_by(
            Favorites.id).all()
    else:
        musics = Favorites.query.filter(Favorites.user_id == user.id).order_by(Favorites.id).all()
    music_list = []
    for music in musics:
        info = {
            "id": music.music.id,
            "name": music.music.name[0:10],
            "singer_id": music.music.singer_id,
            "singer_name": music.music.singer.name[0:10],
            "category_id": music.music.category_id,
            "genre_id": music.music.genre_id,
            "album_id": music.music.album_id,
            "date": music.music.date.strftime("%Y-%m-%d"),
            "url": music.music.url
        }
        music_list.append(info)
    return jsonify({
        "music_list": music_list
    })


@app.route('/register_music', methods=['POST'])
def register_music():
    music = request.files.get('music')
    img = request.files.get('input_img')
    name = request.form.get('title')
    artist = request.form.get('artist')
    album = request.form.get('album')
    genre = request.form.get('genre')
    category = request.form.get('category')
    singer_id = Singer.query.filter(Singer.name == artist).first()
    category_id = Category.query.filter(Category.name == category).first()
    album_id = Album.query.filter(Album.name == album).first()
    genre_id = Genre.query.filter(Genre.name == genre).first()

    add = Music(name=name, genre_id=genre_id.id, singer_id=singer_id.id, category_id=category_id.id,
                date=datetime.now().today(),
                album_id=album_id.id)
    db.session.add(add)
    db.session.commit()
    if music:
        music_name = secure_filename(music.filename)
        app.config['UPLOAD_FOLDER'] = "static/music"
        music.save(os.path.join(app.config["UPLOAD_FOLDER"], music_name))
        url = "/static/music/" + music_name
        Music.query.filter(Music.id == add.id).update({
            "url": url
        })
        db.session.commit()

    return redirect(url_for('cabinet'))


@app.route('/get_album/<int:singer_id>', methods=['POST'])
def get_album(singer_id):
    albums = db.session.query(Album).join(Album.singer).options(contains_eager(Album.singer)).filter(
        Singer.id == singer_id).order_by(Album.id).all()
    album_list = []
    for album in albums:
        info = {
            "id": album.id,
            "name": album.name
        }
        album_list.append(info)
    return jsonify({
        "album_list": album_list
    })


@app.route('/filter_play_list', methods=['POST'])
def filter_play_list():
    user = get_current_user()
    play_list_id = request.get_json().get('play_list_id')
    musics = Play_list.query.filter(Play_list.user_id == user.id, Play_list.id == play_list_id).first()
    music_list = []
    for music in musics.muiscs:
        info = {
            "id": music.id,
            "name": music.name,
            "singer_id": music.singer_id,
            "singer_name": music.singer.name[0:10],
            "category_id": music.category_id,
            "genre_id": music.genre_id,
            "album_id": music.album_id,
            "date": music.date.strftime("%Y-%m-%d"),
            "url": music.url
        }
        music_list.append(info)
    return jsonify({
        "music_list_in_play_list": music_list
    })


@app.route('/filter_category', methods=['POST'])
def filter_category():
    user = get_current_user()
    category_id = int(request.get_json().get('category_id'))
    singer_list = request.get_json().get('singer_list')
    if category_id != 0:
        if singer_list:
            musics = db.session.query(Favorites).join(Favorites.music).options(contains_eager(Favorites.music)).filter(
                Favorites.user_id == user.id, Music.category_id == category_id,
                Music.singer_id.in_([singer_id for singer_id in singer_list])).order_by(
                Favorites.id).all()
        else:
            musics = db.session.query(Favorites).join(Favorites.music).options(contains_eager(Favorites.music)).filter(
                Favorites.user_id == user.id, Music.category_id == category_id, ).order_by(Favorites.id).all()
    else:
        if singer_list:
            musics = db.session.query(Favorites).join(Favorites.music).options(contains_eager(Favorites.music)).filter(
                Favorites.user_id == user.id,
                Music.singer_id.in_([singer_id for singer_id in singer_list])).order_by(
                Favorites.id).all()
        else:
            musics = db.session.query(Favorites).join(Favorites.music).options(contains_eager(Favorites.music)).filter(
                Favorites.user_id == user.id, ).order_by(Favorites.id).all()

    music_list = []
    for music in musics:
        info = {
            "id": music.music.id,
            "name": music.music.name,
            "url": music.music.url,
            "date": music.music.date.strftime("%Y-%m-%d")
        }
        music_list.append(info)
    return jsonify({
        "music_list11": music_list
    })


@app.route('/register_album/<int:singer_id>', methods=['POST'])
def register_album(singer_id):
    name = request.get_json().get('name')
    add_album = Album(name=name, singer_id=singer_id)
    db.session.add(add_album)
    db.session.commit()
    album_all = Album.query.filter(Album.singer_id == singer_id).order_by(Album.id).all()
    album_list = []
    for album in album_all:
        info = {
            "id": album.id,
            "name": album.name
        }
        album_list.append(info)
    return jsonify({
        "album_list": album_list
    })


@app.route('/add_singer', methods=['POST'])
def add_singer():
    name = request.get_json()['name']
    singer = Singer(name=name)
    db.session.add(singer)
    db.session.commit()
    return jsonify({
        "singer_id": singer.id
    })


@app.route('/add_singer_img/<int:singer_id>', methods=['POST'])
def add_singer_img(singer_id):
    file = request.files.get('file')
    if file:
        photo_file = secure_filename(file.filename)
        photo_url = "/" + "static/singer_img" + "/" + photo_file
        app.config['UPLOAD_FOLDER'] = 'static/singer_img'
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], photo_file))
        Singer.query.filter(Singer.id == singer_id).update({
            "img": photo_url
        })
        db.session.commit()
    singers = Singer.query.order_by(Singer.id).all()
    singer_list = []
    for singer in singers:
        info = {
            "id": singer.id,
            "name": singer.name,
            "img": singer.img,
        }
        singer_list.append(info)
    return jsonify({
        "singer_list": singer_list
    })


@app.route('/download_mp3/<int:music_id>')
def download_mp3(music_id):
    app.config['UPLOAD_FOLDER'] = "static/music"
    music = Music.query.filter(Music.id == music_id).first()
    music_name = music.url[14:]
    music_url = "static/music/" + music_name
    print(music_url)
    return send_file(music_url, as_attachment=True)


if __name__ == '__main__':
    app.run()
