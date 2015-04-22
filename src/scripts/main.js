
(function() {

  var Model = {

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

    },

    setFoursquareData: function(places){

      Model["foursquareData"]=places;
      //initialData.foursquareData.push(places);

    },

    getFoursquareData: function() {

      return Model.foursquareData;
    }

  };

  var Place= function(data) {

    this.name= ko.observable(data.venue.name);//Revisar parámetros
    this.location= ko.observable(data.venue.location.address);//Revisar parámetros


  };


  var PlacesViewModel= function() {
    //Data

    var self=this;
    self.currentCity=ko.observableArray([]);
    self.currentCity=Model.cities[0];
    console.log(self.currentCity);
    self.places= ko.observableArray([]);
    var clientID = 'WMGXUPU15HUVPMTMGK3WZPHVGBXKPXWMUQ5WW3DMRSOZUIH5';
    var clientSecret = 'RFUOHDP441JSHFBS1AS0KLAGRVVRGNL2VACN0RHIJJNC5AT2';
    var foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?near=' + self.currentCity + '&&client_id=' +
        clientID + '&client_secret=' + clientSecret + '&v=20130815&query=sushi';



    function getDataFoursquare(callback) {


      $.getJSON(foursquareUrl, function (data) {

        var places = [];
        places = data.response.groups[0].items;
        //console.log(places);

        places.forEach(function (placeItem) {

          self.places.push(new Place(placeItem));
          // Model.foursquareData.push(placeItem);


        });

        callback(places);


      }).error(function (e) {

        $foursquareElem.text("Sorry, Foursquare articles could not be loaded");

      });

      return false;

    }

    getDataFoursquare(function (placesData) {

      octopus.setFoursquareData(placesData);
      Map();
    });


  };


  var Map = function () {

    var list=octopus.getFoursquareData();
    console.log(list);//Recibo los datos de octopus y funciona bien?


  };


  ko.applyBindings(new PlacesViewModel());

}());