/**
 * Created by juanmanuelsanchez on 27/4/15.
 */
/**
 * Created by juanmanuelsanchez on 25/4/15.
 */

(function () {
  //Helper storage
  var Model = {

    currentCity: null,
    currentPlace: null,
    cities: ["Bilbao"],
    foursquareData: [],//All Foursquare data
    filteredPlaces: [],//Foursquare filtered data
    filteredNames: [],//Foursquare filtered place's modified names to fit Google Map's marker's names
    pinPosterLocations: [],
    markers: [],
    infoWindows: []


  };
  //Helper controller
  var octopus = {

    init: function () {

    },

    setFoursquareData: function (places) {

      Model["foursquareData"] = places;
      //initialData.foursquareData.push(places);

    },

    getFoursquareData: function () {

      return Model.foursquareData;
    },

    setFilteredPlaces: function (place) {

      Model["filteredPlaces"] = place;
    },

    getFilteredPlaces: function () {

      return Model.filteredPlaces;
    },

    setFilteredNames: function (name) {

      Model["filteredNames"] = name;
    },

    getFilteredNames: function () {

      return Model.filteredNames;
    },
    setMarkers: function (marker) {

      Model.markers.push(marker);
    },

    getMarkers: function () {

      return Model.markers;
    },
    setInfoWindows: function (infoWindow) {

      Model.infoWindows.push(infoWindow);
    },

    getInfoWindows: function () {

      return Model.infoWindows;
    },

    setPinPosterLocations: function (location) {

      Model["pinPosterLocations"] = location;
    },

    getPinPosterLocations: function () {

      return Model.pinPosterLocations;
    }

  };

  //Place object related to the HTML View
  var Place = function (data) {


    var self = this;
    self.name = ko.observable(data.name);
    self.address = ko.observable(data.address);
    self.city = ko.observable(data.city);
    self.country = ko.observable(data.country);
    self.location = ko.observable(data.location);


    this.setCurrentPlace= function(clickedListItem) {
      var j=0;
      var i=0;
      var markersList=octopus.getMarkers();
      var infoWindowsList=octopus.getInfoWindows();
      var markersLength= markersList.length;
      var infoWindowsLength=infoWindowsList.length;
      console.log(clickedListItem.name());
      console.log(clickedListItem.address());
      console.log(markersList);
      console.log(infoWindowsList);

      for(i,j; i<markersLength, j<infoWindowsLength; i++,j++) {

        var marker= markersList[j];
        var info= infoWindowsList[i];
        if(clickedListItem.name() == info.content && clickedListItem.name() === marker.title) {

          if(marker.getAnimation() != null) {

            marker.setAnimation(null);
            info.close(map, marker);
          }else{

            marker.setAnimation(google.maps.Animation.BOUNCE);
            info.open(map,marker);
          }
        }
      }

    };

    var locations=[];
    locations.push(self.location());







    function createMapMarker(placeData) {

      var lat = placeData.geometry.location.lat();
      var lon = placeData.geometry.location.lng();
      var name = placeData.name;
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

    function callback(results, status) {

      if (status == google.maps.places.PlacesServiceStatus.OK) {

        createMapMarker(results[0]);

      }
    }

    function pinPoster(locations) {


      var service = new google.maps.places.PlacesService(map);

      for (place in locations) {

        var request = {

          query: locations[place]

        };

        service.textSearch(request, callback);
      }
    }


    window.mapBounds = new google.maps.LatLngBounds();

    //locations=locationFinder();
    pinPoster(locations);
    //pinPoster(location);


    window.addEventListener('resize', function (e) {
      map.fitBounds(mapBounds);

    })

  };

  var mapOptions = {

    disableDefaultUI: false
  };

  var map = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);




  //Retrieve and manage data
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


    //Retrieving data from Foursquare API
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

    //Callback function, filter data, store on Model
    getDataFoursquare(function (placesData) {

      var placesList = placesData;//All the Foursquare data
      var j = 0;
      var i = 0;
      var h = 0;
      var length = placesList.length;
      var filteredList = [];//Foursquare filtered data
      var filteredNames = [];//Foursquare filtered place's modified names to fit Google Map's marker's names


      for (j; j < length; j++) {

        var place = placesList[j];
        var name = place.venue.name;
        if (name != "Miu Japonés" && name != "Miu" && name != "Shibui Bilbo" && name != "Wok Chitau Nauo" && name != "Restaurante Xikelai Wok") {

          filteredList.push(place);
          //filteredList.push(name);
        }

      }


      //Transform the Foursquare API object into writable object
      for (i; i < filteredList.length; i++) {

        var placeItem = filteredList[i];
        var locationName = placeItem.venue.name;
        var locationAddress = placeItem.venue.location.address;
        var locationCity = placeItem.venue.location.city;
        var locationCountry = placeItem.venue.location.country;

        var location = {

          name: locationName,
          address: locationAddress,
          city: locationCity,
          country: locationCountry,
          location: locationName + ', ' + locationAddress + ', ' + locationCity + ', ' + locationCountry
        };

        filteredNames.push(location);

      }
      //Modify the name property to fit Google Map's marker's title property
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
        } else if (locationItemName === "SUMO Ledesma") {
          //console.log("SUMO Ledesma Eureka!");
          newName = locationItemName.replace("SUMO Ledesma", "SUMO");
          locationItem.name = newName;
        }
      }

      filteredNames.forEach(function (placeItem) {

        self.places.push(new Place(placeItem));

      });

      octopus.setFoursquareData(placesList);
      octopus.setFilteredPlaces(filteredList);
      octopus.setFilteredNames(filteredNames);
      // console.log(placesList);
      console.log(filteredList);
      console.log(filteredNames);


    });

    /*this.setCurrentPlace= function(clickedListItem) {

      var markersList=octopus.getMarkers();
      var infoWindowsList=octopus.getInfoWindows();
      self.currentPlace(clickedListItem);
      console.log(self.currentPlace());
      console.log(markersList);
      console.log(infoWindowsList);
    }*/


  };


  ko.applyBindings(new PlacesViewModel());

}());