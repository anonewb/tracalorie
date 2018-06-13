// contains modules, controller modules, LS


// Storage controller





// Item controller
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
      // {id: 0, name: 'Steak Dinner', calories: 1200},
      // {id: 1, name: 'Cookie', calories: 400},
      // {id: 2, name: 'Snacks', calories: 300}
    ],
    currentItem: null,
    totalCalories: 0
  }

  // public methods
  return {
    
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      // console.log(name, calories);

      let ID;
      // create id
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1; //for auto increment of ID
      } else {
        ID = 0;
      }

      // calories to no
      calories = parseInt(calories);

      // create new item
      newItem = new Item(ID, name, calories);

      // add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemsById: function(id) {
      let found = null;
      // loop through items and match the IDs
      data.items.forEach(function(item){
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;

      // loop through items and add cals
      data.items.forEach(function(item){
        total += item.calories;
      });

      // set total cal in data structure
      data.totalCalories = total;

      // return total
      return data.totalCalories;
    },
    logData: function() {
      return data;
    }
  }
})();



// UI controller
const UICtrl = (function() {
  // console.log('ui controller');

  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
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
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item) {
      // show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // create li element
      const li = document.createElement('li')
      // add class
      li.className = 'collection-item';
      // add ID
      li.id = `item-${item.id}`;
      // add html
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;
      // insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    // state pattern
    clearEditState: function() {
      // clear the input
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';

    },
    showEditState: function() {
      // show the input
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';

    },
    getSelectors: function() {
      return UISelectors;
    }
  }
})();



// App controller
const App = (function(ItemCtrl, UICtrl) {
  // console.log('app controller');

  // load event listeners
  const loadEventListeners = function(){
    // get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // edit icon click event
    //***Event Delegation*** is to be applied as edit btn is dynamically added
      // here we have to get some parent element and then do a check inside to make sure that its the edit btn which we want
    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
  }

  // add item submit
  const itemAddSubmit = function(e) {
    // console.log('add');

    // get form input from UI controller
    const input = UICtrl.getItemInput();

    // console.log(input); //{name: "bonono", calories: ""}

    // check for name and cal input
    if (input.name !== '' && input.calories !== '') {
      // add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // add item to UI list
      UICtrl.addListItem(newItem);

      // get the total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = function(e) {
    // console.log('click will work on entire list item');
    if (e.target.classList.contains('edit-item')) {
      // console.log('click will only work on edit icon');

      // get list item id (item-0, item-1,..)
      const listId = e.target.parentNode.parentNode.id;
      // console.log(listId);

      // break into an array
      const listIdArr = listId.split('-');
      // console.log(listIdArr);

      // get the actual id
      const id = parseInt(listIdArr[1]);

      // get item
      const itemToEdit = ItemCtrl.getItemsById(id);
      // console.log(itemToEdit);

      // set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  }

  // public methods
  return {
    init: function() {
      // console.log('Initializing App...');

      // clear edit state / set initial state
      UICtrl.clearEditState();

      // fetch items from data structure
      const items = ItemCtrl.getItems();

      // check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // populate list with items
        UICtrl.populateItemsList(items);
      }

      // get the total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // load event listeners
      loadEventListeners();

      // console.log(items);
    }
  }
  
})(ItemCtrl, UICtrl);

// Initializing App
App.init();