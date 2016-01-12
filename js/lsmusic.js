function LsMusic(){

	var MusicRecommender = {

		numElements:0,
		response:'',
		searchType:'',
		albumImg: '',
		songPreview:[],
		DetailCancion : "",
		DetailArtista : "",
		DetailAlbum : "",
		//array con los IDs de las canciones
		songIds:[],

		//array con los IDs de los albums (lista de albums de la busqueda)
		albumID:[],
		//id del album seleccionado (cuando se busca un album)
		idSelect: '',

		//Getters
		getSongIDs : function(){
			return this.songIds;
		},

		getIdSelect : function(){
			return this.idSelect;
		},

		getNumElements : function(){
			return this.numElements;
		},

		getResponse : function(){
			return this.response;
		},

		//array con los ids de los albums
		getAlbumsIDs : function(){
			return this.albumID;
		},

		clearResults : function(){
			document.getElementById('nav1').innerHTML = "<h2>Mi Lista</h2>";
		},
		getArtista :function(){
			return this.DetailArtista;
		},
		getCancion :function(){
			return this.DetailCancion;
		},
		getAlbum :function(){
			return this.DetailAlbum;
		},

		detail:function(artist,cancion,album){

			document.getElementById('DetailCancion').innerHTML =  String(cancion);
			document.getElementById('DetailArtista').innerHTML =  String(artist);
			if(album != ""){
				document.getElementById('DetailAlbum').innerHTML = String(album);
			}
		},

		findSearchType : function(){
			if(document.getElementById("Cancion").checked == true){
				this.searchType = 'track';
			}
			if(document.getElementById("Artista").checked == true){
				this.searchType = 'artist';
			}
			if(document.getElementById("Album").checked == true){
				this.searchType = 'album';
			}
			return this.searchType;
		},

		search : function(info, searchType){
			
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "https://api.spotify.com/v1/search?q="+info+"&type="+searchType, false);
			xhr.send();
			var json_response = xhr.responseText;
			this.response = JSON.parse(json_response);
		},

		getPreview : function(){
			return this.songPreview;
		},

		getAlbumImg : function(x){
			
			var id = this.albumID[x];
		
			var xhr = new XMLHttpRequest();
			
			if (this.searchType == "album"){

				xhr.open("GET", "https://api.spotify.com/v1/albums/"+x, false);
			}
			if (this.searchType == "artist"){
				xhr.open("GET", "https://api.spotify.com/v1/albums/"+x, false);
			}
			if (this.searchType == "track"){
				xhr.open("GET", "https://api.spotify.com/v1/albums/"+id, false);
			}

			
			xhr.send();
			var json_response = xhr.responseText;

			var json = JSON.parse(json_response);

			this.albumImg = json.images[1].url;

			return this.albumImg;
		},


		list : function(){

			var a = document.createElement('ul');
			
			if(document.getElementById("Cancion").checked == true){
				//guardamos cuantos elementos hay en el json recibido
				this.numElements = this.response.tracks.items.length;
				
				//por cada elemento creamos el html para ir añadiendolo
				for(var i=0; i < this.numElements; i++){
					var nombreCancion  = this.response.tracks.items[i].name;
					var nombreArtista = this.response.tracks.items[i].artists;

					var text = this.response.tracks.items[i].name + " - " + this.response.tracks.items[i].album.name;
					for(var j=0; j< this.response.tracks.items[i].artists.length;j++){
						text += " - " + this.response.tracks.items[i].artists[j].name;
					}
					a.innerHTML += "<div id='element'><li id='" + i + "'>" + text + "</li> <img id=p" + i + " src='img/play.png'></div>";
					//guardamos el id del album al cual pertenece cada una de las canciones mostradas
					this.albumID[i] = this.response.tracks.items[i].album.id;
					//guardamos cada uno de los preview de las canciones
					this.songPreview[i] = this.response.tracks.items[i].preview_url;
					//guardamos el id de cada cancion
					this.songIds[i] = this.response.tracks.items[i].id; 
				}
			}

			if(document.getElementById("Artista").checked == true){
				//guardamos cuantos elementos hay en el json recibido
				this.numElements = this.response.artists.items.length;
				for(var i = 0; i < this.numElements; i++){
					var text = this.response.artists.items[i].name;
					a.innerHTML += "<div id='element'><li id='" + i + "'>" + text + "</li> <img src='img/more.png'id=m" + i + "> </div>";
				}
			}

			if(document.getElementById("Album").checked == true){
				//guardamos cuantos elementos hay en el json recibido
				this.numElements = this.response.albums.items.length;

				for(var i = 0; i < this.numElements; i++){
					var text = this.response.albums.items[i].name;
					a.innerHTML += "<div id='element'><li id='" + i + "'>" + text + "</li> <img src='img/more.png' id=m" + i + "> </div>";
					//guardamos el id de cada album de la lista
					this.albumID[i] = this.response.albums.items[i].id;
			
				}
			}
			document.getElementById('nav1').appendChild(a);
		},


		listRecomendedIni : function(){

			var a = document.createElement('ul');
			
			if(document.getElementById("Cancion").checked == true){
				//guardamos cuantos elementos hay en el json recibido
				this.numElements = this.response.tracks.items.length;
				
				//por cada elemento creamos el html para ir añadiendolo
				for(var i=0; i < this.numElements; i++){
					var nombreCancion  = this.response.tracks.items[i].name;
					var nombreArtista = this.response.tracks.items[i].artists;

					var text = this.response.tracks.items[i].name + " - " + this.response.tracks.items[i].album.name;
					for(var j=0; j< this.response.tracks.items[i].artists.length;j++){
						text += " - " + this.response.tracks.items[i].artists[j].name;
					}
					a.innerHTML += "<div id='element'><li id='" + i + "'>" + text + "</li> <img id=p" + i + " src='img/play.png'></div>";
					//guardamos el id del album al cual pertenece cada una de las canciones mostradas
					this.albumID[i] = this.response.tracks.items[i].album.id;
					//guardamos cada uno de los preview de las canciones
					this.songPreview[i] = this.response.tracks.items[i].preview_url;
					//guardamos el id de cada cancion
					this.songIds[i] = this.response.tracks.items[i].id; 
				}
			}

			if(document.getElementById("Artista").checked == true){
				//guardamos cuantos elementos hay en el json recibido
				this.numElements = this.response.artists.items.length;
				for(var i = 0; i < this.numElements; i++){
					var text = this.response.artists.items[i].name;
					a.innerHTML += "<div id='element'><li id='" + i + "'>" + text + "</li> <img src='img/more.png'id=m" + i + "> </div>";
				}
			}

			if(document.getElementById("Album").checked == true){
				//guardamos cuantos elementos hay en el json recibido
				this.numElements = this.response.albums.items.length;

				for(var i = 0; i < this.numElements; i++){
					var text = this.response.albums.items[i].name;
					a.innerHTML += "<div id='element'><li id='" + i + "'>" + text + "</li> <img src='img/more.png' id=m" + i + "> </div>";
					this.albumID[i] = this.response.albums.items[i].id;
			
				}
			}
			document.getElementById('nav2').appendChild(a);
		},

	}

	var Player = {
		loadSong : function(r){
			
			document.getElementById('section').innerHTML = "";
			var artista = MusicRecommender.getArtista();
			var album = MusicRecommender.getAlbum();
			var cancion = MusicRecommender.getCancion();
			var idButton = r;
			idButton = idButton.substr(1);
			var Song = MusicRecommender.getSongIDs();
			var xhr = new XMLHttpRequest();
				xhr.open("GET", "https://api.spotify.com/v1/tracks/"+Song[idButton], false);

			xhr.send();
			var json_response = xhr.responseText;

			var json = JSON.parse(json_response);
			artista = json.artists[0].name;
			album = json.album.name;
			cancion = json.name;

			//Data.save(artista);
			//this.albumImg = json.artists[1].url;
			
			var img = document.createElement("img");
			
			var i = '';
			if(MusicRecommender.findSearchType() == "track"){ 
				i =  MusicRecommender.getAlbumImg(idButton);
				
				MusicRecommender.detail(artista,cancion,album);
			}

			if(MusicRecommender.findSearchType() == "artist"){ 
			
				i =  MusicRecommender.getAlbumImg(MusicRecommender.getIdSelect());
			}
			
			if(MusicRecommender.findSearchType() == "album"){ 
				i =  MusicRecommender.getAlbumImg(MusicRecommender.getIdSelect());
			}
			img.src = i;
			img.id = 'albumPhoto';

			var nombre = MusicRecommender
			var preview = MusicRecommender.getPreview();
			var music = document.getElementById('player');

			music.src = preview[idButton];

			document.getElementById('section').appendChild(img);

		},
	}

	var ListenUserActions = {

		searchButtonListener : function(){
			//Cargamos los mas recomendados
			var btn = document.getElementById('botonBuscador');

			btn.addEventListener("click", function (){
	    		MusicRecommender.clearResults();
	    		var type = MusicRecommender.findSearchType();
	    		MusicRecommender.search(document.getElementById('textoBuscador').value, type);
	    		MusicRecommender.list();
				
				if (type == "artist" || type == "album"){

					ListenUserActions.ArtistListener(type);
				}else{
				
					ListenUserActions.playButtonListener("Cancion");
				}
				
			});

			document.onkeydown = function (a){
				if(a.keyCode === 13){
					MusicRecommender.clearResults();
	    			var type = MusicRecommender.findSearchType();
	    			MusicRecommender.search(document.getElementById('textoBuscador').value, type);
	    			MusicRecommender.list();
					
					if (type == "artist" || type == "album"){
						ListenUserActions.ArtistListener(type);
					}else{		
						ListenUserActions.playButtonListener("track");
					}	
				}
 
			}
			
		},

		ArtistListener: function (type){

			var jsonSearch = MusicRecommender.getResponse();
			var length = 0;
			if(type == "artist" || type == "album"){
				length = MusicRecommender.getNumElements();
			}else{
				
				length = MusicRecommender.getNumElements();
			}

			for(i = 0; i < length; i++){
				var bt = document.getElementById('m'+i);
				
				bt.addEventListener('click', function(){
					var str = document.getElementById(this.id[1]).innerHTML;
					MusicRecommender.search(str, "track");
					document.getElementById("Cancion").checked = true;
					MusicRecommender.clearResults();
					MusicRecommender.list();
					ListenUserActions.playButtonListener("Cancion");

				});
			}

		},

		playButtonListener: function (type, json2, json1){
			
			//json1 es el json con los albums de un artista
			var jsonSearch = MusicRecommender.getResponse();
			var length = 0;
			if(type == "artist" || type == "album"){
				//json2 es el json con las canciones de un album
				length = json2.items.length;
			}else{
				
				length = MusicRecommender.getNumElements();
			}

			for(i = 0; i < length; i++){
				var bt = document.getElementById('p'+i);
				bt.addEventListener('click', function(){
					
					Player.loadSong(this.id);

				});
			}

		},

	}
	/*var Data = {
		save:function(artist){
			// guardar en JSON
		}
		get:function(){
			// Cargar JSON
		}
	}*/

	ListenUserActions.searchButtonListener();
	var btnplay = document.getElementById('bPlay');
			var t = document.getElementById('player');
				btnplay.addEventListener('click', function(){
					if(t.paused){
						t.play();
					}else{
						t.pause();
					}
				});
	var btnvolumeup = document.getElementById('bUp');
				btnvolumeup.addEventListener('click', function(){
					if(t.volume<1.0){
						t.volume = t.volume + 0.2;
					}else{
						t.volume = 1.0;
					}
				});
	var btnvolumedown = document.getElementById('bDown');
				btnvolumedown.addEventListener('click', function(){
					if(t.volume>0.0){
						t.volume = t.volume - 0.2;
					}else{
						t.volume = 0.0;
					}
				});
				MusicRecommender.search("greatest hits", "track");
	    MusicRecommender.listRecomendedIni();
	    ListenUserActions.playButtonListener("Cancion");
}

document.addEventListener("DOMContentLoaded",LsMusic(),false);
