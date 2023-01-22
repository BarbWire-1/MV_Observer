/*
 *   Copyright (c) 2023 
 *   All rights reserved.
 */
// TEST WITH WAYS OF COPYING: https://codepen.io/BarbWire/pen/mdjpRoL
// Function to deepclone nested objects with different object types incl. methods
// use of weakmap and hash to check if already clone to prevent stack exceed
export default function deepClone(obj, hash = new WeakMap()) {
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
