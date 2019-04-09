const xmlRequest = obj => {
    return new Promise(((resolve, reject) => {
        let xhr = new XMLHttpRequest();
            if (!obj.credentials) {
                xhr.withCredentials = false;
            } else {
                xhr.withCredentials = true;
            }
            xhr.open(obj.method || "GET", obj.url);
            if (obj.headers) {
                Object.keys(obj.headers).forEach(key => {
                    xhr.setRequestHeader(key, obj.headers[key]);
                });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(obj.body || null);
    }));
};

module.exports = {
    xmlRequest,
};