/**
 * Created by juanmanuelsanchez on 25/4/15.
 */

(function() {
  //Helper storage
  var Model = {

    currentCity: null,
    currentPlace: null,
    cities: ["Bilbao"],
    foursquareData:[],//All Foursquare data
    filteredPlaces:[],//Foursquare filtered data
    filteredNames:[],//Foursquare filtered place's modified names to fit Google Map's marker's names
    pinPosterLocations:[],
    markers:[],
    infoWindows:[]



  };
 //Helper controller
  var octopus= {

    init: function() {

    },

    setFoursquareData: function(places){

      Model["foursquareData"]=places;
      //initialData.foursquareData.push(places);

    },

    getFoursquareData: function() {

      return Model.foursquareData;
    },

    setFilteredPlaces: function(place) {

      Model["filteredPlaces"]=place;
    },

    getFilteredPlaces: function() {

      return Model.filteredPlaces;
    },

    setFilteredNames: function(name) {

      Model["filteredNames"]=name;
    },

    getFilteredNames: function() {

      return Model.filteredNames;
    }

  };

  //Place object related to the HTML View
  var Place= function(data) {


    var self=this;
    self.name= ko.observable(data.name);
    self.address= ko.observable(data.address);
    self.city=ko.observable(data.city);
    self.country=ko.observable(data.country);

    self.location=ko.pureComputed(function() {//It's better than ko.computed for calculate and return a value
      return self.name() + ", " + self.address() + ", " + self.city() + ", " + self.country();
    });




  };

  //Retrieve and manage data
  var PlacesViewModel= function() {

    var self=this;
    self.currentCity=ko.observableArray([]);
    self.currentCity=Model.cities[0];
    console.log(self.currentCity);
    var $foursquareElem = $('#places-list');
    //$foursquareElem.text("");
    self.places= ko.observableArray([]);
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

      var placesList= placesData;//All the Foursquare data
      var j = 0;
      var i=0;
      var h=0;
      var length = placesList.length;
      var filteredList=[];//Foursquare filtered data
      var length2= filteredList.length;
      var filteredNames=[];//Foursquare filtered place's modified names to fit Google Map's marker's names
      var regEx1=/Kuma/g;
      var regEx2=/Mao Restaurante/g;
      var regEx4=/SUMO Poza/g;
      var regEx5=/Sakura/g;
      var regEx6=/Wasabi Bilbao Restaurante Japones/g;



      for (j; j < length; j++) {

        var place = placesList[j];
        var name = place.venue.name;
        if (name != "Miu Japonés" && name != "Miu" && name != "Shibui Bilbo" && name != "Wok Chitau Nauo" && name != "Restaurante Xikelai Wok") {

          filteredList.push(place);
          //filteredList.push(name);
        }

      }

      /*for(i; i<length2; i++){

        var location=filteredList[i];
        var locationName= location.venue.name;
        if(locationName === regEx1){

          console.log(locationName);
        }

      }*/


      for(i; i<filteredList.length; i++) {

        var placeItem= filteredList[i];
        var locationName= placeItem.venue.name;
        var locationAddress= placeItem.venue.location.address;
        var locationCity=placeItem.venue.location.city;
        var locationCountry=placeItem.venue.location.country;

        var location= {

          name:locationName,
          address:locationAddress,
          city:locationCity,
          country:locationCountry
        };

        filteredNames.push(location);

      }

      for (h; h<filteredNames.length; h++) {

        var locationItem= filteredNames[h];
        var locationItemName=locationItem.name;
        var newName;

        if(locationItemName==="Kuma"){

          console.log("Eureka!");
          //locationItemName.replace("KUMA");
          newName=locationItemName.replace("Kuma","KUMA");
          //locationItemName=newName;
          locationItem.name=newName;
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


  };





  ko.applyBindings(new PlacesViewModel());

}());