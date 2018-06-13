# tracalorie

// contains modules, controller modules, LS


/* Steps: eg: after 'clear all' btn is clicked, everything must reset
MUST READ!!!
ez

[Note:***Names of vars/fn/obj must be clearly discriptive!! ]
controller are used to implement IIFE

0. App.init(); last line of code will initiate our whole app
          ie it will call the event listeners and then eventListeners will call respective fn...
1. App controller- App.init();
      inside EventListener{}- add event listener for 'clear all' btn.
2. UI controller-
      inside UISelectors{}- create var for the id/class of that 'clear all' btn and assign into it
3. App controller-
      inside EventListener- after selecting that 'clear all' btn, for manipulation create a function for it.
        this function can be declared either in App ctrl OR UICtrl
4. App controller-
      create its own function and define it here and for manipulation of list items(for this application), 
       create methods in ItemCtrl OR UICtrl 
       which should be defined inside 'return {}' ie then must be public methods so that it can be accessed from outside that controller
5. ItemCtrl-
      inside return{}- any mainpulation related to data structure of app not the UI, must be done here
      *NOTE: first apply changes to the data structure (ItemCtrl), and then apply changes to UI
6. UICtrl-
      inside return{}- any mainpulation related to UI of app, must be done here.
      NOTE: first apply changes in data structure (ItemCtrl), then apply changes to UI


7. At the end, to persist the changes in browser, store it in LS:
  StorageCtrl-
      4 things to be done(storing,getting,updating,deleting) in general
      [CRUD functions/operations]
      a. App Ctrl- 
            See where the items are being: added, updated or deleted
            and immediately after above operation declare the new LS function for that operation and then

      b. StorageCtrl- 
             inside return{}- create/define fn for all the above
                storing/adding: check if items already present and getItem() from LS if any and push() into array
                getting(displaying in UI): getItem() from LS
                updating: splice() and setItem() in LS
                deleting: same as update just dont replace, just delete it
          clearing(reset): just call .removeItems() from LS
