// contains modules, controller modules, LS


/* Steps: eg: after 'clear all' btn is clicked, everything must reset
MUST READ!!!
ez

0. App.init(); last line of code will initiate our whole app
          ie will call the event listeners and then eventListeners will call fn...
1. App controller- App.init();
      inside EventListener{}- add event listener for 'clear all' btn.
2. UI controller-
      inside UISelectors{}- create var for the id/class of that 'clear all' btn
3. App controller-
      inside EventListener- after selecting that 'clear all' btn, for manipulation create a function for it.
        this function can be declared either in App ctrl OR UICtrl
4. App controller-
      create its own function and define it here and for manipulation of list items(for this application), create methods in ItemCtrl OR UICtrl which should be defined inside 'return {}' ie then must be public methods so that it can be accessed from outside that controller
5. ItemCtrl-
      inside return{}- any mainpulation related to data structure of app not the UI, must be done here
      *NOTE: first apply changes in data structure (ItemCtrl), then apply changes to UI
6. UICtrl-
      inside return{}- any mainpulation related to UI of app, must be done here.
      NOTE: first apply changes in data structure (ItemCtrl), then apply changes to UI
*/    


// Storage controller
const StorageCtrl = (function() {
  // public methods
  return {
    storeItem: function(item) { //'item' is the new item
      let items;
      
      // check if any items in LS
      if (localStorage.getItem('items') === null) {
        items = [];
        //push new item into items[]
        items.push(item);
        // set this items[] in LS and LS can only store strings, therefore array is converted to string
        localStorage.setItem('items', JSON.stringify(items));

      } else { // LS contains some items already and is stored in strings, JSON.parse() converts it into obj
        items = JSON.parse(localStorage.getItem('items'));

        // push the new item
        items.push(item);

        // re set LS
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {

      let items;
      // check if any items in LS
      if (localStorage.getItem('items') === null) {
        items = [];
      } else { 
        items = JSON.parse(localStorage.getItem('items'));  
      }
      return items;
    }
  }
})();




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
    // items: [
    //   // {id: 0, name: 'Steak Dinner', calories: 1200},
    //   // {id: 1, name: 'Cookie', calories: 400},
    //   // {id: 2, name: 'Snacks', calories: 300}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
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
    updateItem: function(name, calories) {
      // cal to no
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      //*** map is similar to forEach except it returns something
      // get IDs
      const ids = data.items.map(function(item) {
        return item.id;
      });

      // get index
      const index = ids.indexOf(id);

      // remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
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
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
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
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // turn nodeList into Array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
          `;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
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
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // turn nodeList into Array
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
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
const App = (function(ItemCtrl,StorageCtrl, UICtrl) {
  // console.log('app controller');

  // load event listeners
  const loadEventListeners = function(){
    // get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // disable submit on enter
    document.addEventListener('keypress', function(e){
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // edit icon click event
    //***Event Delegation*** is to be applied as edit btn is dynamically added
      // here we have to get some parent element and then do a check inside to make sure that its the edit btn which we want
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // back btn event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  
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

      // Store in LS
      StorageCtrl.storeItem(newItem);

      // clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  }

  // click edit item
  const itemEditClick = function(e) {
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

  // update item submit
  const itemUpdateSubmit = function(e) {
    // console.log('update');
    
    // get item input
    const input = UICtrl.getItemInput();

    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update UI
    UICtrl.updateListItem(updatedItem);

    // get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // delete btn event
  const itemDeleteSubmit = function(e) {
    // console.log('delete btn clicked');

    // get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // del from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  // clear items event
  const clearAllItemsClick = function(){
    // del all items from data structure
    ItemCtrl.clearAllItems();

    // get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // remove from UI
    UICtrl.removeItems();

    // hide the ul
    UICtrl.hideList();
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
  
})(ItemCtrl,StorageCtrl, UICtrl);

// Initializing App
App.init();