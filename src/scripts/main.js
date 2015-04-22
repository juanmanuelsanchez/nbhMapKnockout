
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


    var self=this;
    self.name= ko.observable(data.venue.name);
    self.address= ko.observable(data.venue.location.address);
    self.city=ko.observable(data.venue.location.city);
    self.country=ko.observable(data.venue.location.country);

    self.location=ko.pureComputed(function() {//It' better than ko.computed for calculate and return a value
      return self.name() + ", " + self.address() + ", " + self.city() + ", " + self.country();
    });

    /*  this.name= ko.observable(data.venue.name);
     *  this.address= ko.observable(data.venue.location.address);
     *  this.city=ko.observable(data.venue.location.city);
     *  this.country=ko.observable(data.venue.location.country);
     *
     *  this.location=ko.computed(function() {
     *  return this.name() + ", " + this.address() + ", " + this.city() + ", " + this.country();
     *  }, this); //WITH SELF= THIS, YOU DON'T HAVE TO ADD "THIS" AS SECOND PARAMETER TO TRACK THE OBJECT
     *          //YOU'RE REFERING TO
     */


  };


  var PlacesViewModel= function() {
    //Data

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



    function getDataFoursquare(callback) {


      $.getJSON(foursquareUrl, function (data) {

        var places = [];
        places = data.response.groups[0].items;
        //console.log(places);

        /*places.forEach(function (placeItem) {

          self.places.push(new Place(placeItem));
          // Model.foursquareData.push(placeItem);


        });*/

        callback(places);


      }).error(function (e) {

        $foursquareElem.text("Sorry, Foursquare articles could not be loaded");

      });

      return false;

    }

    getDataFoursquare(function (placesData) {

      var placesList= placesData;
      placesList.splice(1,1);//OK
      console.log(placesList);

     placesList.forEach(function (placeItem) {

       self.places.push(new Place(placeItem));

      });

      octopus.setFoursquareData(placesData);//The placesList splice method applies here too
      Map();
    });


  };


  var Map = function () {

    var list=octopus.getFoursquareData();
    console.log(list);//OK

  };


  ko.applyBindings(new PlacesViewModel());

}());