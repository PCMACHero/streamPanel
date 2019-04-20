module.exports = {
    removeFromArrayAtIndex: (arr, index) => {
        console.log('called function ', arr.length, index);
        if (arr === undefined || index === undefined || arr.length <= index) {
            return arr;
        }
        if (arr.length === 1 && index === 0) {
            return [];
        } 
        let newArr = arr.slice(0, index).concat(arr.slice(index + 1));
        return newArr;
    },
}