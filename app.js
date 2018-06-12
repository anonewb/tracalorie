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
    
    getItems: function() {
      return data.items;
    },
    logData: function() {
      return data;
    }
  }
})();



// ui controller
const UICtrl = (function() {
  // console.log('ui controller');

  const UISelectors = {
    itemList: '#item-list'
  }
  
  // public methods
  return {
    populateItemsList: function(items) {
      let html = '';

      items.forEach(function(item){
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>
      `;
      });

      // insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    }
  }
})();



// app controller
const App = (function(ItemCtrl, UICtrl) {
  // console.log('app controller');

  // public methods
  return {
    init: function() {
      // console.log('Initializing App...');

      // fetch items from data structure
      const items = ItemCtrl.getItems();

      // populate list with items
      UICtrl.populateItemsList(items);

      // console.log(items);
    }
  }
  
})(ItemCtrl, UICtrl);

// Initializing App
App.init();