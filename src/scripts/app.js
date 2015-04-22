/**
 * Created by juanmanuelsanchez on 18/4/15.
 */
(function() {
  var initialData = {

    currentCity: null,
    currentPlace: null,
    cities: ["Bilbao"],
    foursquareData:[],
    filteredPlaces:[],
    filteredNames:[],
    pinPosterLocations:[],
    markers:[],
    infoWindows:[]

  };

  var octopus= {

    init: function() {
      Data.init();

    },

    setFoursquareData: function(places){

      initialData["foursquareData"]=places;
      //initialData.foursquareData.push(places);

    },

    getFoursquareData: function() {

      return initialData.foursquareData;
    }

  };

  var Data= {

    init: function() {

      //Retrieving currentCity data
      this.cities = ko.observableArray([]);
      this.cities = initialData.cities;
      this.currentCity = this.cities[0];
      console.log(this.currentCity);
      //Retrieving Foursquare API data
      var $foursquareElem = $('#places-list');
      $foursquareElem.text("");
      var clientID = 'WMGXUPU15HUVPMTMGK3WZPHVGBXKPXWMUQ5WW3DMRSOZUIH5';
      var clientSecret = 'RFUOHDP441JSHFBS1AS0KLAGRVVRGNL2VACN0RHIJJNC5AT2';
      var foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?near=' + this.currentCity + '&&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20130815&query=sushi';
      var foursquareContent = [];


      function getDataFoursquare(callback) {

        $.getJSON(foursquareUrl, function (data) {

          var places = [];
          places = data.response.groups[0].items;
          //console.log(places);

          callback(places);

        }).error(function (e) {

          $foursquareElem.text("Sorry, Foursquare articles could not be loaded");

        });

        return false;

      }

       getDataFoursquare(function (placesData) {
        var places=[];
         places=placesData;
         ko.applyBindings(new ViewModel(placesData));
         ViewModel(placesData);
        octopus.setFoursquareData(places);
         Map(placesData);

       });


      return false;

     }

                  //PASOS A SEGUIR EN README.md

   };

   var ViewModel= function(places){

    var self= this;

    this.placesList= ko.observableArray([]);
     this.placesList=places;
    //console.log(this.placesList);//Funciona bien
    Map(this.placesList);


   };

   var Map = function (places) {

    var placesList=places;
    //console.log(placesList);//Funciona bien

     var list=octopus.getFoursquareData();
     console.log(list);//Recibo los datos de octopus y funciona bien




   };

    octopus.init();

    //ko.applyBindings(new ViewModel());

 }());