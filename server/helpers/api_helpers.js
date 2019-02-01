module.exports = {
    removeFromArrayAtIndex: (arr, index) => {
        if (!arr || !index || arr.length < index) {
            return arr;
        }
        arr.splice(index, 1);
        return arr;
    },
}