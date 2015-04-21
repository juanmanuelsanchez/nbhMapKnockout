/**
 * Created by juanmanuelsanchez on 20/4/15.
 */
/**
 * Created by juanmanuelsanchez on 18/4/15.
 */
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

  var Place= function(data) {

    this.name= ko.observable(data.name);//Revisar parámetros
    this.location=ko.observable(data.location);//Revisar parámetros


  };


  var PlacesViewModel= function() {
    //Data

    var self=this;
    self.currentCity=ko.observableArray([]);
    self.currentCity=Model.cities[0];
    console.log(self.currentCity);
    self.places= ko.observableArray([]);
    var $foursquareElem = $('#places-list');
    $foursquareElem.text("");
    var clientID = 'WMGXUPU15HUVPMTMGK3WZPHVGBXKPXWMUQ5WW3DMRSOZUIH5';
    var clientSecret = 'RFUOHDP441JSHFBS1AS0KLAGRVVRGNL2VACN0RHIJJNC5AT2';
    var foursquareUrl = 'https://api.foursquare.com/v2/venues/explore?near=' + self.currentCity + '&&client_id=' +
        clientID + '&client_secret=' + clientSecret + '&v=20130815&query=sushi';



     $.getJSON(foursquareUrl, function (data) {

      var places = [];
       places = data.response.groups[0].items;
      //console.log(places);
       self.places=places;

       //console.log(self.places);

    }).error(function (e) {

      $foursquareElem.text("Sorry, Foursquare articles could not be loaded");

    });

    console.log(self.places());



  };

  ko.applyBindings(new PlacesViewModel());

}());