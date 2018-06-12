// contains modules, controller modules, LS


// storage controller





// item controller
const ItemCtrl = (function() {
  // console.log('item controller');
  // item constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    items: [
      {id: 0, name: 'Steak Dinner', calories: 1200},
      {id: 1, name: 'Cookie', calories: 400},
      {id: 2, name: 'Snacks', calories: 300}
    ],
    currentItem: null,
    totalCalories: 0
  }

  // public methods
  return {
    logData: function() {
      return data;
    }
  }
})();



// ui controller
const UICtrl = (function() {
  // console.log('ui controller');
  
  // public methods
  return {

  }
})();



// app controller
const App = (function(ItemCtrl, UICtrl) {
  // console.log('app controller');

  // public methods
  return {
    init: function() {
      console.log('Initializing App...')
    }
  }
  
})(ItemCtrl, UICtrl);

// Initializing App
App.init();