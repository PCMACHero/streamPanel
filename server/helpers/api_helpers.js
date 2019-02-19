module.exports = {
    removeFromArrayAtIndex: (arr, index) => {
        if (!arr || !index || arr.length < index) {
            return
        }
        arr.splice(index, 1);
    },
}