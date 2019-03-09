module.exports = {
    removeFromArrayAtIndex: (arr, index) => {
        if (!arr || !index || arr.length < index) {
            return arr;
        }
        let newArr = arr.slice(0,index).concat(arr.slice(index + 1));
        return newArr;
    },
}