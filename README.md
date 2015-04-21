# nbhMapKnockout
Creates an interactive and neighbourhood Map with restaurant suggestions with KnockoutJS as oranizational library
Trabaja con la misma estructura que catClicker:
-->var Place= function(data) {
 this.name= ko.observable(data.name);

};
como var Cat= function(data){
 
 this.name=ko.observable(data.name);
 

};

Haz en el html el data-binding correspondiente, como en catClicker. Probablemente trabajaremos
el data-binding con los 'li' (que pueden ser h2 o h3) y el search-bar con autocomplete.