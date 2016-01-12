function LsMusic(){

	var MusicRecommender = {

		numElements:0,
		response:'',
		searchType:'',
		albumImg: '',
		songPreview:[],
		
		//INFO TRACK
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


		findSearchType : function(){
			if(document.getElementById("rb1").checked == true){
				this.searchType = 'track';

			}

			if(document.getElementById("rb2").checked == true){
				this.searchType = 'artist';
			}
			if(document.getElementById("rb3").checked == true){
				this.searchType = 'album';
			}

			return this.searchType;
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

		//method to search the album, artist or song
		//We can get a json with the search's result
		search : function(info, searchType){
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "https://api.spotify.com/v1/search?q="+info+"&type="+searchType, false);
			xhr.send();
			var json_response = xhr.responseText;
			this.response = JSON.parse(json_response);
		},


		clearResults : function(){
			document.getElementById('list').innerHTML = "";
			document.getElementById('back').innerHTML = "";

		},

		//To list songs, albums or artists (results area)
		list : function(){

			var a = document.createElement('ul');
			
			//Track
			if(document.getElementById("rb1").checked == true){
				//guardamos cuantos elementos hay en el json recibido
				this.numElements = this.response.tracks.items.length;
				
				//por cada elemento creamos el html para ir añadiendolo
				for(var i=0; i < this.numElements; i++){
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

			//Artist
			if(document.getElementById("rb2").checked == true){
				//guardamos cuantos elementos hay en el json recibido
				this.numElements = this.response.artists.items.length;
				for(var i = 0; i < this.numElements; i++){
					var text = this.response.artists.items[i].name;
					a.innerHTML += "<div id='element'><li id='" + i + "'>" + text + "</li> <img src='img/more.png'id=m" + i + "> </div>";
				}
			}

			//Album
			if(document.getElementById("rb3").checked == true){
				//guardamos cuantos elementos hay en el json recibido
				this.numElements = this.response.albums.items.length;

				for(var i = 0; i < this.numElements; i++){
					var text = this.response.albums.items[i].name;
					a.innerHTML += "<div id='element'><li id='" + i + "'>" + text + "</li> <img src='img/more.png' id=m" + i + "> </div>";
					//guardamos el id de cada album de la lista
					this.albumID[i] = this.response.albums.items[i].id;
			
				}
			}
			document.getElementById('list').appendChild(a);
		},


		//mostrar una lista con las canciones de un album
		listAlbumSong : function(){
			
			//Eliminamos los resultados de busquedas anteriores
			this.clearResults();

			//guardamos el id del album que han hecho click (en 'this.idSelect')
			var idButton = event.target.id;
			idButton = idButton.substr(1);
			this.idSelect = this.albumID[idButton];
			//onbtenemos una lista con las canciones del album seleccionado ('r')
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "https://api.spotify.com/v1/albums/"+this.idSelect+"/tracks", false);
			xhr.send();
			var json_response = xhr.responseText;
			var r = JSON.parse(json_response);

			//Creamos el html para mostrar la nueva lista			
			var ul = document.createElement("ul");
			for(i=0; i < r.items.length; i++){

				var text = r.items[i].name
				ul.innerHTML += "<div id='element'><li id='" + i + "'>" + text + "</li> <img src='img/play.png' id=p" + i + "> </div>";
				this.songPreview[i] = r.items[i].preview_url;
			}

			document.getElementById('list').appendChild(ul);
			
			var button = document.createElement("img");
			button.src = "img/back.png";
	

			document.getElementById('back').appendChild(button);	
			//retorna la lista con las canciones de un album (por si es necesario saber cuantas canciones hay en el album, por ejemplo)
			return r;
		},

		//mostrar los albums de un artista
		listArtistAlbum : function(artistID){
			
			//Eliminamos los resultados de busquedas anteriores
			this.clearResults();

			//obtenemos los albums del artista
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "https://api.spotify.com/v1/artists/"+ artistID +"/albums?album_type=album", false);
			xhr.send();
			var json_response = xhr.responseText;
			var r = JSON.parse(json_response);

			//mostramos la lista de albums del artista
			var ul = document.createElement("ul");
			if(r.items[0] == undefined){
				alert("Error a Spotify! No es pot carregar la llisa d'albums d'aquest autor.");
			}
			else{
				for(i=0; i < r.items.length; i++){
					var text = r.items[i].name
					ul.innerHTML += "<div id='element'><li id='" + i + "'>" + text + "</li> <img src='img/more.png' id=o" + i + "> </div>";
					//Si se busca 'artista' el id de cada album lo guardamos en este metodo
					this.albumID[i] = r.items[i].id;
				}

				document.getElementById('list').appendChild(ul);
			
				var button = document.createElement("img");
				button.src = "img/back.png";
	

				document.getElementById('back').appendChild(button);
				//return del numero de albums (que hay en el json recibido) de un artista concreto
				return r;
			}
		},

		//To show information about the artist or album while the music is playing
		detail : function(songTitle, artist, album){
			document.getElementById('albumI').innerHTML = "";
			var linkSpotify = "";
			//para mostrar la info de una cancion (top!)
			if (album == ""){
				var idButton = event.target.id;
		    	id = idButton.substr(3);
				var data = Data.get();
				linkSpotify = data.response[id].link_spotify;
			}else{
				linkSpotify = Data.getLinkSpotify();
			}
			var a = document.getElementById('link');
			a.href= linkSpotify;
			document.getElementById('link').innerHTML = "Full Song";

			document.getElementById('songI').innerHTML = "<font color='791C1C'>Song: </font>" + songTitle;
			document.getElementById('artistI').innerHTML = "<font color='791C1C'>Artist: </font>" + artist;
			if(album != ""){
				document.getElementById('albumI').innerHTML = "<font color='791C1C'>Album: </font>" + album;
			}
			
		},

		//funcion para buscar artitas similares a los que reproduce el usuario
		buscarRecomendaciones : function(idArtist){
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "https://api.spotify.com/v1/artists/"+idArtist+"/related-artists", false);
			xhr.send();
			var json_response = xhr.responseText;
			var response = JSON.parse(json_response);

			//retorna el json con la lista de los artisas similares que recomienda la API de spotify
			return response;

		},

		//funcion para mostrar los artistas recomendados en la barra inferior de la aplicacion
		addRecommended : function(artists){
			//<div class="imageDiv">
			//<img src="img/foto1.png" alt="cd">
			var img;
			var lista = document.getElementById('listaRecom');
			lista.innerHTML = "";
			var xhr = new XMLHttpRequest();


			for(i = 0; i < artists.artists.length; i++){
				img = document.createElement("img");
				xhr.open("GET", "https://api.spotify.com/v1/artists/"+ artists.artists[i].id +"/albums?album_type=album", false);
				xhr.send();
				var json_response = xhr.responseText;
				var r = JSON.parse(json_response);

				if(r.items[0] === undefined){
					img.src = "img/notfound.png";
					img.alt = "cd";
					img.title = artists.artists[i].name;
					img.id = "recom"+i;
					lista.appendChild(img);
				} else{
					img.src = r.items[0].images[1].url;
					img.alt = "cd";
					img.title = artists.artists[i].name;
					img.id = "recom"+i;
					lista.appendChild(img);
				}
				
			}
		},

		addMostPlayed : function(topSongs){
			var img;
			var lista = document.getElementById('listaTop');
			
			for(i = 0; i < topSongs.response.length; i++){
				img = document.createElement("img");
				
				img.src = topSongs.response[i].img;
				img.alt = "cd";
				img.title = topSongs.response[i].title;
				img.id = "top"+i;
				lista.appendChild(img);		
			}

		}
	
	}

	//to play music
	var Player = {
		
		//funcion para reproducir la cancion 
		loadSong : function(){
			document.getElementById('image').innerHTML = "";
			//En la variable i nos guardamos el id del link que nos han hecho click
			var idButton = event.target.id;
			idButton = idButton.substr(1);

			//Creamos el nuevo contenido que tenemos que embeber
			var img = document.createElement("img");
			

			var i = '';
			if(MusicRecommender.findSearchType() == "track"){ 
				i =  MusicRecommender.getAlbumImg(idButton);
			}

			if(MusicRecommender.findSearchType() == "artist"){ 
			
				i =  MusicRecommender.getAlbumImg(MusicRecommender.getIdSelect());
			}
			
			if(MusicRecommender.findSearchType() == "album"){ 
				i =  MusicRecommender.getAlbumImg(MusicRecommender.getIdSelect());
			}
			img.src = i;
			img.id = 'albumPhoto';

			//var preview = response.tracks.items[idButton].preview_url;
			var preview = MusicRecommender.getPreview();
			var music = document.getElementById('player');
			music.src = preview[idButton];
			

			document.getElementById('image').appendChild(img);

		},

		//Esta funcion reproducira las canciones de la barra de top-reproduccions
		//recibe el json con la info necesaria de la DB
		loadMostPlayed : function(topSongs){
			document.getElementById('image').innerHTML = "";
			//En la variable i nos guardamos el id del link que nos han hecho click
			var idButton = event.target.id;
			idButton = idButton.substr(3);

			//Creamos el nuevo contenido que tenemos que embeber
			var img = document.createElement("img");
			

			var i = topSongs.response[idButton].img;
		
			img.src = i;
			img.id = 'albumPhoto';

			var preview = topSongs.response[idButton].preview;
			var music = document.getElementById('player');
			music.src = preview;
			

			document.getElementById('image').appendChild(img);


		}

	}

	

	//Guardar informacion tanto en el servidor, como informacion que se usara durante la ejecucion de la app
	var Data = {
		songId:'',
		songTitle:'',
		artist:'',
		album:'',
		linkSpotify:'',
		idArtist:'',


		//GETTERS
		getSongId : function(){
			return this.songId;
		},
		getSongTitle : function(){
			return this.songTitle;
		},
		getArtist : function(){
			return this.artist;
		},
		getAlbum: function(){
			return this.album;
		},
		getLinkSpotify: function(){
			return this.linkSpotify;
		},
		getidArtist: function(){
			return this.idArtist;
		},

		//METHODS
		//To save information(song lists, numReproducciones) into the browser & server
		//songList ->json con las canciones de un album
		save : function(songList, albumList){
			var idButton = event.target.id;
			var id = idButton.substr(1);
			
			var type = MusicRecommender.findSearchType();
			MusicRecommender.getSongIDs()[id];
			var json = MusicRecommender.getResponse();

			this.songId = MusicRecommender.getSongIDs()[id];
			
			if (type == "track"){
				this.songTitle = json.tracks.items[id].name;
				this.artist = json.tracks.items[id].artists[0].name;
				this.album = json.tracks.items[id].album.name;
				this.linkSpotify = json.tracks.items[id].external_urls.spotify;
				this.idArtist = json.tracks.items[id].artists[0].id;

				//this.saveDB();	
			}	

			if (type == "album"){
				this.songTitle = songList.items[id].name;
				this.artist = songList.items[id].artists[0].name;
				this.album = json.albums.items[id].name;	
				this.idArtist = songList.items[id].artists[0].id;
				this.linkSpotify = songList.items[id].external_urls.spotify;	
			}

			if(type == "artist"){
				this.songTitle = songList.items[id].name;
				this.artist = songList.items[id].artists[0].name;
				this.album = albumList.items[id].name;
				this.idArtist = songList.items[id].artists[0].id;	
				this.linkSpotify = songList.items[id].external_urls.spotify;	
			}
		},

		//Guardar info en la base de datos (cuando hacen click en el play)
		saveDB : function (albumsList){
			
			var idButton = event.target.id;
			var id = idButton.substr(1);
		

			var imgAlbum = "";
				var i = '';
			if(MusicRecommender.findSearchType() == "track"){ 
				imgAlbum =  MusicRecommender.getAlbumImg(id);
			}

			if(MusicRecommender.findSearchType() == "artist"){ 
			
				imgAlbum =  MusicRecommender.getAlbumImg(MusicRecommender.getIdSelect());
			}
			
			if(MusicRecommender.findSearchType() == "album"){ 
				imgAlbum =  MusicRecommender.getAlbumImg(MusicRecommender.getIdSelect());
			}
			
			var preview = MusicRecommender.getPreview();


			//Antes de guardar la cancion, comprobamos que no exista ya en la BD
			var xhr1 = new XMLHttpRequest();
			xhr1.open("PUT", "http://api.hipermedia.local/query", false);				
			var query1 = "SELECT * FROM song WHERE id_song = '"+Data.getSongId()+"'";
			xhr1.send(query1);


			var data = xhr1.responseText;
			var json = JSON.parse(data); 

	
			//Si la cancion no existe en la base de datos
			if(json.response.length == 0){
				var xhr2 = new XMLHttpRequest();
				xhr2.open("PUT", "http://api.hipermedia.local/query", false);
				var query2 = "INSERT INTO song(id_song, title, id_artist, link_spotify, count, img, preview) VALUES ('"+Data.getSongId()+"','"+Data.getSongTitle()+"','"+Data.getArtist()+"','"+Data.getLinkSpotify()+"', 1, '"+ imgAlbum+"','"+ preview[id]+"')";
				xhr2.send(query2);
			
			}else{
				var xhr3 = new XMLHttpRequest();
				xhr3.open("PUT", "http://api.hipermedia.local/query", false);
				var query3 = "UPDATE song SET count = count+1 WHERE id_song = '"+Data.getSongId()+"'";
				xhr3.send(query3);
			}
		},


		//To get information saved
		//retorna un json con los 20 mas reproducidos de la bd
		get : function(){
			var xhr = new XMLHttpRequest();
			xhr.open("PUT","http://api.hipermedia.local/query", false);
			
			//Antes de guardar la cancion, comprobamos que no exista ya en la BD
			var query = "SELECT * FROM song ORDER BY count DESC LIMIT 20";
	
			xhr.send(query);
			
			var json = xhr.responseText;
			var data = JSON.parse(json);

			//data es el json con la info de la bd
			return data;

		}

	}


	//LISTENERS
	var ListenUserActions = {
		searchButtonListener : function(){
			//Cargamos los mas recomendados
			var btn = document.getElementById('searchbtn')
			btn.addEventListener('click', function (){

	    		MusicRecommender.clearResults();
	    		var type = MusicRecommender.findSearchType();
	    		MusicRecommender.search(document.getElementById('info').value, type);
	    		MusicRecommender.list();
				
				if (type == "artist" || type == "album"){

					ListenUserActions.moreButtonListener(MusicRecommender.getNumElements());
				}else{
				
					ListenUserActions.playButtonListener("track");
				}
				
			});

			//tecla enter per buscar. PROBLEMA: tecla enter quan no s'esta sobre el input o no hi ha res escrit.
			document.onkeydown = function (a){
				if(a.keyCode === 13){
					MusicRecommender.clearResults();
	    			var type = MusicRecommender.findSearchType();
	    			MusicRecommender.search(document.getElementById('info').value, type);
	    			MusicRecommender.list();
				
					if (type == "artist" || type == "album"){
						ListenUserActions.moreButtonListener(MusicRecommender.getNumElements());
					}else{		
						ListenUserActions.playButtonListener("track");
					}	
				}
 
			}
			
		},



		moreButtonListener : function(length){
			//var length = MusicRecommender.getNumElements();
			for(var i = 0; i < length; i++){
				var bt = document.getElementById('m'+i);
				bt.addEventListener('click', function(){
					var jsonSearch = MusicRecommender.getResponse();
					var jsonAlbumList = "";
					var jsonSongList = "";
					var albumImg;
					
					var type = MusicRecommender.findSearchType();
					if(type == 'track'){
						Player.loadSong();
					}
					
					if(type == 'artist'){

						var artistID = jsonSearch.artists.items[0].id;
						this.jsonAlbumList = MusicRecommender.listArtistAlbum(artistID);
						
						ListenUserActions.openButtonListener(this.jsonAlbumList, 1);
						ListenUserActions.back();

					}

					if(type == 'album'){
						this.jsonSongList = MusicRecommender.listAlbumSong();	
						
						ListenUserActions.playButtonListener(type, this.jsonSongList);
						ListenUserActions.back();			 
					}

				});
			}

		},

		back : function(){
			var bt = document.getElementById('back');
			bt.addEventListener('click', function(){
				MusicRecommender.clearResults();
				
				var type = MusicRecommender.findSearchType();
				if (type == 'artist'){
					MusicRecommender.search(document.getElementById('info').value, "artist");
					MusicRecommender.list();
					ListenUserActions.moreButtonListener(MusicRecommender.getNumElements());
				}

				if (type == 'album'){
					MusicRecommender.search(document.getElementById('info').value, "album");
					MusicRecommender.list();
					ListenUserActions.moreButtonListener(MusicRecommender.getNumElements());
				}


			});
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
					Player.loadSong();
					Data.save(json2, json1);
					//le pasamos json1 porque nos interesa guardar la img de los albums
					Data.saveDB(json1);

					MusicRecommender.detail(Data.getSongTitle(), Data.getArtist(), Data.getAlbum());
					var listaArtistas = MusicRecommender.buscarRecomendaciones(Data.getidArtist());
					MusicRecommender.addRecommended(listaArtistas);
					ListenUserActions.recomButtonListener(listaArtistas.artists.length, listaArtistas);


				});
			}

		},

		openButtonListener: function (albumList, type){
			var numAlbums = 0; 

			if(type == 1){
				numAlbums = albumList.items.length; 
			} else {
				numAlbums = albumList.artists.length; 
			}

			for(i = 0; i < numAlbums; i++){
				var bt = document.getElementById('o'+i);
				bt.addEventListener('click', function(){
				var jsonSearch = MusicRecommender.getResponse();
				var jsonAlbumList = "";

				jsonAlbumList = MusicRecommender.listAlbumSong();	
				ListenUserActions.playButtonListener("album", jsonAlbumList, albumList);
					

				});
			}

		},


		recomButtonListener : function(length, json){
			
			for(i = 0; i < length; i++){
				var bt = document.getElementById('recom'+i);
				bt.addEventListener('click', function(){
					
					MusicRecommender.clearResults();
		    		var idButton = event.target.id;
		    		id = idButton.substr(5);
				
		    		MusicRecommender.listArtistAlbum(json.artists[id].id);
		    		ListenUserActions.openButtonListener(json, 2);


				});
			}


		},

		//recibe el json con la info de la DB
		topButtonListener : function(topSongs){
			
			for(i = 0; i < topSongs.response.length; i++){
				var bt = document.getElementById('top'+i);
				bt.addEventListener('click', function(){
					
					var idButton = event.target.id;
		    		id = idButton.substr(3);
					
		    		//guardamos la informacion necesaria para reproducir el preview y colocar la imagen 
		    		Player.loadMostPlayed(topSongs);
					MusicRecommender.detail(topSongs.response[id].title, topSongs.response[id].id_artist, "");
				});
			}


		}



	}

	ListenUserActions.searchButtonListener();

	//buscamos los datos guardados en la DB y los añadimos a la app
	var dataDB = Data.get();
	MusicRecommender.addMostPlayed(dataDB);
	ListenUserActions.topButtonListener(dataDB);


}


//Asignamos listeners
document.addEventListener("DOMContentLoaded",LsMusic(),false);
