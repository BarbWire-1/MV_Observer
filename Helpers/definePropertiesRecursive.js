/*
 *   Copyright (c) 2023 
 *   All rights reserved.
 */
function definePropertiesRecursive(object) {
    for (const key in object) {
        if (typeof object[ key ] === 'object') {
            definePropertiesRecursive(object[ key ]);
        } else {
            Object.defineProperty(object, key, {
                set: (value) => {
                    // code to handle updating the value and notify observers
                },
                get: () => {
                    // code to return the value
                }
            });
        }
    }
}
