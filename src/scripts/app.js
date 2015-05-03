/*jshint devel:true, unused:false*/
/*globals Model, octopus*/
(function () {
  
   
  var Model = {
  
  /**
   * Holds current city to search Foursquare recommendations
   *
   * @property currentCity
   * @type String
   * @default null
   */
    currentCity: null,

  /**
   * Holds the value to set the current city
   *
   * @property cities
   * @type Array
   * @default ["Bilbao"]
   */
    cities: ["Bilbao"],

    /**
    * Holds all recommendations from Foursquare
    *
    * @property filteredData
    * @type Array
    */
    foursquareData: [],

    /**
    * Holds filtered recommendations from Foursquare to properly work with Google Maps API
    *
    * @property filteredPlaces
    * @type Array
    */
    filteredPlaces: [],

    /**
    * Holds Foursquare filtered place's modified names to fit Google Map's marker's names
    *
    * @property filteredNames
    * @type Array
    */
    filteredNames: [],

    /**
    * Holds Foursquare filtered place's to pass to Google Maps
    *
    * @property pinPosterLocations
    * @type Array
    */
    pinPosterLocations: [],
    
    /**
    * Holds markers from Google Maps
    *
    * @property markers
    * @type Array
    */
    markers: [],

    /**
    * Holds infowindows from Google Maps
    *
    * @property infoWindows
    * @type Array
    */
    infoWindows: []


  };


  var octopus = {
    /**
     * Stores the recommended places taken from Foursquare API
     *
     * @property setFoursquareData
     * @type Function
     * @param places {Object} The places recommended by Foursquare
     */
    setFoursquareData: function (places) {

      Model["foursquareData"] = places;


    },

    /**
     * Retrieves the recommended places taken from Foursquare API
     *
     * @property getFoursquareData
     * @type Function
     */

    getFoursquareData: function () {

      return Model.foursquareData;
    },

    /**
     * Stores filtered recommended places taken from Foursquare API
     *
     * @property setFilteredPlaces
     * @type Function
     * @param place {Object} The filtered places recommended by Foursquare
     */

    setFilteredPlaces: function (place) {

      Model["filteredPlaces"] = place;
    },

    /**
     * Retrieves filtered recommended places taken from Foursquare API
     *
     * @property getFilteredPlaces
     * @type Function
     */

    getFilteredPlaces: function () {

      return Model.filteredPlaces;
    },

    /**
     * Stores filtered recommended places taken from Foursquare API to match Google Maps markers
     * and infoWindows
     *
     * @property setFilteredNames
     * @type Function
     * @param name {Object} The filtered place recommended by Foursquare to match markers and infoWindows
     */

    setFilteredNames: function (name) {

      Model["filteredNames"] = name;
    },

    /**
     * Retrieves filtered recommended places taken from Foursquare API to match Google Maps markers
     * and infoWindows
     *
     * @property getFilteredNames
     * @type Function
     */

    getFilteredNames: function () {

      return Model.filteredNames;
    },

    /**
     * Stores markers from Google Maps API
     *
     * @property setMarkers
     * @type Function
     * @param marker {Object} The markers from Google Maps API
     */

    setMarkers: function (marker) {

      Model.markers.push(marker);
    },

    /**
     * Retrieves markers from Google Maps API
     *
     * @property getMarkers
     * @type Function
     */

    getMarkers: function () {

      return Model.markers;
    },

    /**
     * Stores infoWindows from Google Maps API
     *
     * @property setInfoWindows
     * @type Function
     * @param infoWindow {Object} The infoWindows from Google Maps API
     */

    setInfoWindows: function (infoWindow) {

      Model.infoWindows.push(infoWindow);
    },

    /**
     * Retrieves infoWindows from Google Maps API
     *
     * @property getInfoWindows
     * @type Function
     */

    getInfoWindows: function () {

      return Model.infoWindows;
    },

    /**
     * Stores locations which are going to be rendered on Google Maps API
     *
     * @property setPinPosterLocations
     * @type Function
     * @param location {Object} The filtered place recommended by Foursquare that matchs markers and infoWindows
     * which is going to be rendered on Google Maps
     */

    setPinPosterLocations: function (location) {

      Model.pinPosterLocations.push(location);
    },

    /**
     * Retrieves locations which are going to be rendered on Google Maps API
     *
     * @property getPinPosterLocations
     * @type Function
     */

    getPinPosterLocations: function () {

      return Model.pinPosterLocations;
    }

  };

  //Place object related to the HTML View

  /**
   * A "class" defining recommended restaurants
   *
   * @class Place
   * @constructor
   * @param data {Object} The filtered place recommended by Foursquare that matches markers and infoWindows
   * which is going to be rendered on Google Maps
   */
  var Place = function (data) {


    var self = this;
    self.name = ko.observable(data.name);
    self.address = ko.observable(data.address);
    self.city = ko.observable(data.city);
    self.country = ko.observable(data.country);
    self.location = ko.observable(data.location);
    self.rating= ko.observable(data.rating);

    self.listView = ko.pureComputed(function () {//It's better than ko.computed for calculate and return a value
     return self.name() + "    " + self.rating();
     });





    octopus.setPinPosterLocations(self.location());
    var locationsList= octopus.getPinPosterLocations();
    var locations= [];
    locations.push(self.location());
    var markers= octopus.getMarkers();
    var infos= octopus.getInfoWindows();

    var showButton= document.getElementById("show");
    var hideButton= document.getElementById("hide");
    var placesList= document.getElementById("places-list");
    var foursquareHeader= document.getElementById("foursquare-header");
    var inputBox= document.getElementById("autocomplete");

    showButton.style.display="none";


    //console.log(locationsList);

    /**
     * Sets the scope to a clickedListItem through the data-bind on 'li' items of the DOM, animates
     * the related Google Maps marker
     *
     * @method setCurrentPlace
     * @param clickedListItem {Object} The clicked list item from the DOM
     */

    this.setCurrentPlace = function (clickedListItem) {
      var j = 0;
      var i = 0;
      var markersList = octopus.getMarkers();
      var infoWindowsList = octopus.getInfoWindows();
      var markersLength = markersList.length;
      var infoWindowsLength = infoWindowsList.length;
      //console.log(clickedListItem.name());
      //console.log(clickedListItem.address());
      //console.log(markersList);
      //console.log(infoWindowsList);

      for (i, j; i < markersLength, j < infoWindowsLength; i++, j++) {

        var marker = markersList[j];
        var info = infoWindowsList[i];
        if (clickedListItem.name() == info.content && clickedListItem.name() === marker.title) {

          if (marker.getAnimation() != null) {

            marker.setAnimation(null);
            info.close(map, marker);
          } else {

            marker.setAnimation(google.maps.Animation.BOUNCE);
            info.open(map, marker);
          }
        }
      }

    };

    /**
     * Creates an autocomplete functionality on the search bar to filter the rendered places.
     * Credits: Ajax Autocomplete for jQuery, version 1.2.18, (c) 2014 Tomas Kirda.
     *
     * @function setCurrentPlace
     */

    $(inputBox).devbridgeAutocomplete({

      /**
       * Holds locations which are rendered on Google Maps API to make string matching suggestions
       *
       * @property lookup
       * @type Array
       */

      lookup: locationsList,

      /**
       * Denotes the number of characters to define the string matching
       *
       * @property minChars
       * @type Number
       */

      minChars: 1,

      /**
       * Suggest the rendered locations on the search bar
       *
       * @property onSearchComplete
       * @type Function
       * @param locationsList {Array} the locations rendered on Google Map
       * @param suggestions {Array} the locations suggested by the autocomplete functionality
       * of the search bar
       */

      onSearchComplete: function(locationsList, suggestions) {

        placesList.style.display="none";
        placesList.style.webkitAnimationName='fadeOut';
        placesList.style.webkitAnimationDuration='1s';
        showButton.style.display="inline";
        showButton.style.webkitAnimationName='fadeIn';
        showButton.style.webkitAnimationDuration='1s';

        var listSuggestions=[];
        for(suggestion in suggestions) {

         var location= suggestions[suggestion].value;
         listSuggestions.push(location);

         }
         clearMarkers();
         pinPoster(listSuggestions);

      },

      /**
       * Filters the selected location on the search bar and renders it on the map
       *
       * @property onSelect
       * @type Function
       * @param suggestion {Array} the location selected on the search bar
       *
       */

      onSelect: function (suggestion) {

        var newList=[];
        var newLocation=suggestion.value;
        newList.push(newLocation);
        //console.log(newList);
        clearMarkers();
        pinPoster(newList);
        foursquareHeader.innerHTML="Foursquare recommended places(hide and/or populate with markers & click to choose!)"
      },

      /**
       * Sets string mismatches communication on the search bar
       *
       * @property showNoSuggestionNotice
       * @type Boolean
       */

      showNoSuggestionNotice: true,

      /**
       * Communicates string mismatches communication on the search bar
       *
       * @property showNoSuggestionNotice
       * @type Boolean
       */
      noSuggestionNotice: 'Sorry, no matching results'

    });


    /**
     * Creates markers and infoWindows for each of the locations, sets map's center and bounds and animates
     * the marker when clicked
     *
     * @function createMapMarker
     * @param placeData {Object} The filtered place recommended by Foursquare that matches markers and infoWindows
     * which is going to be rendered on Google Maps
     */

    function createMapMarker(placeData) {

      //console.log(placeData);
      var lat = placeData.geometry.location.lat();
      var lon = placeData.geometry.location.lng();
      var name = placeData.name;
      var address=placeData.formatted_address;
      var location=name + ', ' + address;
      var bounds = window.mapBounds;



      var marker = new google.maps.Marker({
        map: map,
        position: placeData.geometry.location,
        title: name
      });

      octopus.setMarkers(marker);


      var infoWindow = new google.maps.InfoWindow({
        content: name
      });

      octopus.setInfoWindows(infoWindow);


      google.maps.event.addListener(marker, 'click', function () {

        infoWindow.open(map, marker);

      });

      bounds.extend(new google.maps.LatLng(lat, lon));

      map.fitBounds(bounds);

      map.setCenter(bounds.getCenter());

    }

    /**
     * Retrieves the result of the query for each of the locations
     *
     * @function callback
     * @param results {Object} query results from Google Maps Places
     * @property OK denotes the success of the request
     */

    function callback(results, status) {

      if (status == google.maps.places.PlacesServiceStatus.OK) {

        createMapMarker(results[0]);

      }
    }

    /**
     * Creates an instance of Google Maps Places
     *
     * @function pinPoster
     * @param locations {Object} The filtered place recommended by Foursquare that matches markers and infoWindows
     * which is going to be rendered on Google Maps
     */

    function pinPoster(locations) {


      var service = new google.maps.places.PlacesService(map);

      for (place in locations) {

        var request = {

          query: locations[place]

        };

        service.textSearch(request, callback);
      }
    }

    /**
     * Listens to a showButton's click event
     *
     * @method addEventListener
     */

    showButton.addEventListener('click', function () {

      showMarkers();

    }, false);

    /**
     * Listens to a hideButton's click event
     *
     * @method addEventListener
     */

    hideButton.addEventListener('click', function () {

      clearMarkers();

    }, false);

    /**
     * Updates the map
     *
     * @function setAllMap
     * @param map
     */

    function setAllMap(map) {

      var j = 0;
      var length = markers.length;

      for (j; j < length; j++) {

        markers[j].setMap(map);
      }

    }

    /**
     * Shows the markers on the map
     *
     * @function showMarkers
     */

    function showMarkers() {

      placesList.style.display="block";
      placesList.style.webkitAnimationName='fadeIn';
      placesList.style.webkitAnimationDuration='1s';
      showButton.style.display="none";
      showButton.style.webkitAnimationName='fadeOut';
      showButton.style.webkitAnimationDuration='1s';
      foursquareHeader.innerHTML="Foursquare recommended places(choose!):";
      inputBox.value=" ";

      setAllMap(map);

    }

    /**
     * Hides the markers on the map
     *
     * @function clearMarkers
     */

    function clearMarkers() {

      setAllMap(null);

      if(showButton.style.display=="none") {

        showButton.style.display="inline";
        showButton.style.webkitAnimationName='fadeIn';
        showButton.style.webkitAnimationDuration='0.8s';


      }

    }


    window.mapBounds = new google.maps.LatLngBounds();

    pinPoster(locations);



    window.addEventListener('resize', function (e) {
      map.fitBounds(mapBounds);

    })

  };

  /**
   * A "class" defining a map with recommended restaurants
   *
   * @class map
   * @constructor
   */

  var mapOptions = {

    disableDefaultUI: false
  };

  var map = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);


  /**
   * A "class" that retrieves and process the data to create the listView and the map
   *
   * @class PlacesViewModel
   * @constructor
   */

  var PlacesViewModel = function () {

    var self = this;
    this.currentCity = ko.observableArray([]);


    this.currentCity = Model.cities[0];
    console.log(self.currentCity);
    var $foursquareElem = $('#places-list');
    //$foursquareElem.text("");
    this.places = ko.observableArray([]);
    this.currentPlace=ko.observable(this.places()[0]);
    var clientID = 'WMGXUPU15HUVPMTMGK3WZPHVGBXKPXWMUQ5WW3DMRSOZUIH5';
    var clientSecret = 'RFUOHDP441JSHFBS1AS0KLAGRVVRGNL2VACN0RHIJJNC5AT2';
    var foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?near=' + self.currentCity + '&&client_id=' +
        clientID + '&client_secret=' + clientSecret + '&v=20130815&query=sushi';


    /**
     * Gets the data from Foursquare API
     *
     * @function getDataFoursquare
     */

    function getDataFoursquare(callback) {

      $.getJSON(foursquareUrl, function (data) {

        var places = [];
        places = data.response.groups[0].items;
        callback(places);

      }).error(function (e) {

        $foursquareElem.text("Sorry, Foursquare articles could not be loaded");

      });

      return false;

    }

    /**
     * Callback function, filters data, stores it on Model object
     *
     * @function getDataFoursquare
     */

    //
    getDataFoursquare(function (placesData) {

      var placesList = placesData;//All the Foursquare data
      //console.log(placesList);
      var j = 0;
      var i = 0;
      var h = 0;
      var length = placesList.length;
      var filteredList = [];//Foursquare filtered data
      var filteredNames = [];//Foursquare filtered place's modified names to fit Google Map's marker's names


      for (j; j < length; j++) {

        var place = placesList[j];
        var name = place.venue.name;
        if (name != "Miu Japonés" && name != "Miu" && name != "Shibui Bilbo" && name != "Wok Chitau Nauo" && name != "Restaurante Xikelai Wok" && name !="SUMO Ledesma" && name !="SUMO") {

          filteredList.push(place);

        }

      }


      //Transforms the Foursquare API object into writable object

      for (i; i < filteredList.length; i++) {

        var placeItem = filteredList[i];
        var locationName = placeItem.venue.name;
        var locationAddress = placeItem.venue.location.address;
        var locationCity = placeItem.venue.location.city;
        var locationCountry = placeItem.venue.location.country;
        var locationRating= placeItem.venue.rating;

        var location = {

          name: locationName,
          address: locationAddress,
          city: locationCity,
          country: locationCountry,
          location: locationName + ', ' + locationAddress + ', ' + locationCity + ', ' + locationCountry,
          rating: locationRating
        };

        filteredNames.push(location);

      }

      //Modifies the name property of Foursquare places to fit Google Map's marker's title property

      for (h; h < filteredNames.length; h++) {

        var locationItem = filteredNames[h];
        var locationItemName = locationItem.name;
        var newName;

        if (locationItemName === "Kuma") {
          //console.log(" Kuma Eureka!");
          newName = locationItemName.replace("Kuma", "KUMA");
          locationItem.name = newName;
        } else if (locationItemName === "Mao Restaurante") {
          //console.log("Mao Eureka!");
          newName = locationItemName.replace("Mao Restaurante", "Mao");
          locationItem.name = newName;
        } else if (locationItemName === "SUMO Poza") {
          //console.log("SUMO Poza Eureka!");
          newName = locationItemName.replace("SUMO Poza", "SUMO Pozas");
          locationItem.name = newName;
        } else if (locationItemName === "Sakura") {
          //console.log("Sakura Eureka!");
          newName = locationItemName.replace("Sakura", "Restaurante Sakura");
          locationItem.name = newName;
        } else if (locationItemName === "Wasabi Bilbao Restaurante Japones") {
          //console.log("Wasabi Bilbao Restaurante Japones Eureka!");
          newName = locationItemName.replace("Wasabi Bilbao Restaurante Japones", "Restaurante Wasabi Bilbao");
          locationItem.name = newName;
        }
      }

      //Creates places to be rendered on the map

      filteredNames.forEach(function (placeItem) {

        self.places.push(new Place(placeItem));

      });

      //Stores the data on Model Object

      octopus.setFoursquareData(placesList);
      octopus.setFilteredPlaces(filteredList);
      octopus.setFilteredNames(filteredNames);
      // console.log(placesList);
      //console.log(filteredList);
      //console.log(filteredNames);


    });


  };


  ko.applyBindings(new PlacesViewModel());

}());
