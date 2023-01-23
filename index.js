/*
 *   Copyright (c) 2023 
 *   All rights reserved.
 */
//import { deepClone } from "./Helpers/index.js";

window.onload = () => {

    class Model {
        #data
        #tempData
        // passing any initial data object to the model
        constructor (obj) {
            
            this.observers = [];
            this.#data = obj.data;
            this._test = obj.test;
            this.init = JSON.parse(JSON.stringify(obj.data));//clone to use for initialistaion in views
            this.#tempData = this.init;// gets mutated in setters later - passed to notify - passed out to obj
            
            // TODO really makes this recursive now as it finally works???
            for (const key in this.#tempData) {
                //console.log(key)// key-names
                let updated = { prevValue: this.#data[key] } // need this temp variable to pass in notify with recursion
                //console.log(updated)// key: [key]
                Object.defineProperty(obj.data, key, {

                    set: (value) => {
                        this.#tempData[ key ] = value;
                        this._data = this.#tempData;
                        updated[ key ] = value;
                        //console.log(updated)
                        this.notify(updated);
                    },
                    
                    get: () => {
                        return this._data[ key ];
                    },

                });
               
            };
            
            //console.log('tempData outer: ' + JSON.stringify(this.#tempData))//  here it keeps INITIAL data
            Object.seal(obj.data);
           
        };

        // TODO different subscriptions to different data-sets (?)
        subscribe(observer) {
            this.observers.push(observer);
        }
        
        unsubscribe(observer) {
            this.observers = this.observers.filter(obs => obs !== observer);
        }
        
        notify(key) {
            // call update function in subscribers
            this.observers.forEach(observer => observer.update(key));
        }

    }


   
    class View1 {
        constructor (model) {
            this.model = model;
            this.model.subscribe(this);
            this.update(this.model.init);
        };

        update(updated) {
           
            //console.log('updated: '+ JSON.stringify(updated))
            for (let key in updated) {
                //switch to define which keys are actually of interest here
                switch (key) {
                    case "setting1":
                        document.getElementById("setting1").innerHTML = updated[ key ];
                        break;
                    case "setting2":
                        document.getElementById("setting2").innerHTML = updated[ key ];
                        break;
                    case "setting3":
                        //console.log(updated[ key ])
                        document.getElementById("setting3").innerHTML = updated[ key ];
                        break;
                }
            }
        }
    };
    class View2 {
        constructor (model) {
            this.model = model;
            this.model.subscribe(this);
            this.update(this.model.init)
        }

        update(updated) {
            //console.log(updated)
            for (let key in updated) {
                //console.log(updated)
                switch (key) {
                   
                    case "setting2":
                        document.getElementById("setting2b").innerHTML = updated[ key ];
                        break;
                    case "setting3":
                        console.log(updated[ key ])
                        document.getElementById("setting3b").innerHTML = updated[ key ];
                        break;
                }
            }
            console.log(`View2 received data: ${JSON.stringify(updated)}, but does its own thing`);
        }


    };




    const anyData = {
        data: {
            setting1: "init value 1",
            setting2: "init value 2",
            setting3: "init value 3",
            settings4: {
                5: 'A',
                6: 'B'
            }
        },
        test: {
            0: 'C',
            1: 'D',
            2: undefined,
            speak: function () { return `I'm a function in a nested object` },
            anArray: [ 1, 2, 3, 4, 5 ]
        }

    };

    const model = new Model(anyData);
   
    const test1 = new View1(model);
    const test2 = new View2(model);
   

    anyData.data.setting1 = 'Coming from anyData, passing update and then back from model';
    anyData.data.setting3 = "Nice to find myself here!";


    //anyData.data.setting10 = `I should throw.`; //... and I do
    //console.log('anyData: ' + JSON.stringify(anyData)); // YEAH!!! Back again!

}




//TODO change to only rerender changed bits!!!

 // class Controller {
    //PERHAPS USE LATER FOR IMPLEMENTING LOGIC
    // #model
    // #view
    // constructor (model, view, data) {
    //     this.model = model;
    //     this.view = view;
    //     this.data = data;
    // }
    // setData(newData) {
    //     console.log(newData)// this is only the key, no value???
    //     this.data = newData;
    //     console.log(this.data)
    //     this.model.notify();
    //
    // }

    // TODO go with this? also ugly in use as needs to update with using an obj
    // what do I really want???
    // actually how to make it react on changes of the data-OBJECT???
    // would the controller need to observe the data-object and then proceed on?
    // setData(data) {
    //     if (typeof data === "object") {
    //         for (let key in data) {
    //             this.#model.updateSetting(key, data[ key ]);
    //         }
    //     }
    // }

    //}
//FUNCTIONS HERE TO USE QUOKKA
function deepClone(obj, hash = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (hash.has(obj)) {
        return hash.get(obj);
    }

    let clone;
    // create the correct type of clone
    if (Array.isArray(obj)) {
        clone = [];
    } else if (obj instanceof Date) {
        clone = new Date(obj.getTime());
    } else {
        clone = {};
    }

    hash.set(obj, clone);
    Object.keys(obj).forEach(key => {
        clone[ key ] = deepClone(obj[ key ], hash);
    });
    return clone;
};