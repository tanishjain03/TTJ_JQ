function $$$(cid) {
    let element = document.getElementById(cid);
    if (!element) throw "Invalid id : " + cid;
    return new TMJRockElement(element);
}

$$$.model = {
    "onStartup": [],
    "accordians": [],
    "modals": []
}

function TMJRockElement(element) {
    this.element = element;
    this.html = function (content) {
        if ((typeof this.element.innerHTML) == "string") {
            if ((typeof content) == "string") {
                this.element.innerHTML = content;
            }
            return this.element.innerHTML;
        }
        return null;
    } // html function ends here
    this.value = function (content) {
        if (typeof this.element.value) {
            if ((typeof content) == "string") {
                this.element.value = content;
            }
            return this.element.value;
        }
        return null;
    } // value function ends here
    this.fillComboBox = function (jsonObject) {
        if (this.element.nodeName != "SELECT") throw "fillComboBox can be called on a SELECT type object only";
    }
} // class TMJRockElement ends here

$$$.modals = {};

//modal specific code starts
$$$.modals.show = function (mid) {
    var modal = null;
    for (var i = 0; i < $$$.model.modals.length; i++) {
        if ($$$.model.modals[i].getContentId() == mid) {
            modal = $$$.model.modals[i];
            break;
        }
    }
    if (modal == null) return;
    modal.show();
}
function Modal(cref) {
    var objectAddress = this;
    this.beforeOpening = null;
    this.afterOpening = null;
    this.beforeClosing = null;
    this.afterClosing = null;
    var contentReference = cref;
    this.getContentId = function () {
        return contentReference.id;
    };
    var contentParentReference = contentReference.parentElement;
    var contentIndex = 0;
    while (contentIndex < contentParentReference.children.length) {
        if (contentReference == contentParentReference.children[contentIndex]) break;
        contentIndex++;
    }
    var modalMaskDivision = document.createElement("div");
    modalMaskDivision.classList.add("tmjrock_modalMask");
    modalMaskDivision.style.display = "none";
    var modalDivision = document.createElement("div");
    modalDivision.classList.add("tmjrock_modal");
    modalDivision.style.display = "none";
    document.body.appendChild(modalMaskDivision);
    document.body.appendChild(modalDivision);

    var headerDivision = document.createElement("div");
    headerDivision.style.right = "0";
    headerDivision.style.height = "40px";
    headerDivision.style.padding = "5px";
    headerDivision.style.background = "red";
    modalDivision.appendChild(headerDivision);

    if (contentReference.hasAttribute("size")) {
        var sz = contentReference.getAttribute("size");
        let xpos = sz.indexOf("x");
        if (xpos == -1) xpos = sz.indexOf("X");
        if (xpos == -1) throw "In case of modal, size should be specified as 'width'x'height'";
        if (xpos == 0 || xpos == sz.length - 1) throw "In case of modal, size should be specified as 'width'x'height'";
        let width = sz.substring(0, xpos);
        let height = sz.substring(xpos + 1);
        modalDivision.style.width = width + "px";
        modalDivision.style.height = height + "px";
    }
    else {
        modalDivision.style.width = "400px";
        modalDivision.style.height = "300px";
    }
    if (contentReference.hasAttribute("header")) {
        var hd = contentReference.getAttribute("header");
        headerDivision.innerHTML = hd;
    }
    if (contentReference.hasAttribute("maskColor")) {
        var mkc = contentReference.getAttribute("maskColor");
        modalMaskDivision.style.background = mkc;
    }
    if (contentReference.hasAttribute("modalBackgroundColor")) {
        var mbc = contentReference.getAttribute("modalBackgroundColor");
        modalDivision.style.background = mbc;
    }

    var contentDivision = document.createElement("div");
    // contentDivision.style.border = "1px solid black";
    contentDivision.style.height = (modalDivision.style.height.substring(0, modalDivision.style.height.length - 2) - 113) + "px";
    contentDivision.style.width = "98%";
    contentDivision.style.overflow = "auto";
    contentDivision.style.padding = "5px";

    contentReference.remove();
    contentDivision.appendChild(contentReference);
    contentReference.style.display = "block";
    contentReference.style.visibility = "visible";
    modalDivision.appendChild(contentDivision);

    var footerDivision = document.createElement("div");
    footerDivision.style.background = "pink";
    footerDivision.style.height = "40px";
    footerDivision.style.left = "0";
    footerDivision.style.right = "0";
    footerDivision.style.position = "absolute";
    footerDivision.style.bottom = "0";
    footerDivision.style.padding = "5px";
    modalDivision.appendChild(footerDivision);

    if (contentReference.hasAttribute("footer")) {
        var ft = contentReference.getAttribute("footer");
        footerDivision.innerHTML = ft;
    }
    var closeButtonSpan = null;
    if (contentReference.hasAttribute("closeButton")) {
        var cb = contentReference.getAttribute("closeButton");
        if (cb.toUpperCase() == "TRUE") {
            closeButtonSpan = document.createElement("span");
            closeButtonSpan.classList.add("tmjrock_closeButton");
            var closeButtonMarker = document.createTextNode("X");
            closeButtonSpan.appendChild(closeButtonMarker);
            headerDivision.appendChild(closeButtonSpan);
        }
    }
    if (contentReference.hasAttribute("beforeOpening")) {
        var bo = contentReference.getAttribute("beforeOpening");
        this.beforeOpening = bo;
    }
    if (contentReference.hasAttribute("afterOpening")) {
        var ao = contentReference.getAttribute("afterOpening");
        this.afterOpening = ao;
    }
    if (contentReference.hasAttribute("beforeClosing")) {
        var bc = contentReference.getAttribute("beforeClosing");
        this.beforeClosing = bc;
    }
    if (contentReference.hasAttribute("afterClosing")) {
        var ac = contentReference.getAttribute("afterClosing");
        this.afterClosing = ac;
    }

    this.show = function () {
        let openModal = true;
        if (objectAddress.beforeOpening) {
            openModal = eval(objectAddress.beforeOpening);
        }
        if (openModal) {
            modalMaskDivision.style.display = "block";
            modalDivision.style.display = "block";
            if (objectAddress.afterOpening) setTimeout(function () { eval(objectAddress.afterOpening); }, 100);
        }
    };
    if (closeButtonSpan != null) {
        closeButtonSpan.onclick = function () {
            let closeModal = true;
            if (objectAddress.beforeClosing) {
                closeModal = eval(objectAddress.beforeClosing);
            }
            if (closeModal) {
                modalDivision.style.display = "none";
                modalMaskDivision.style.display = "none";
                if (objectAddress.afterClosing) setTimeout(function () { eval(objectAddress.afterClosing); }, 100);
            }
        };
    }
}
//modal specific code ends

//accordian specific code starts
$$$.accordianHeadingClicked = function (accordianIndex, panelIndex) {
    if ($$$.model.accordians[accordianIndex].expandedIndex != -1) {
        $$$.model.accordians[accordianIndex].panels[$$$.model.accordians[accordianIndex].expandedIndex].style.display = "none";
        if ($$$.model.accordians[accordianIndex].expandedIndex == panelIndex + 1) return;
    }
    $$$.model.accordians[accordianIndex].panels[panelIndex + 1].style.display = $$$.model.accordians[accordianIndex].panels[panelIndex + 1].oldDisplay;
    $$$.model.accordians[accordianIndex].expandedIndex = panelIndex + 1;
}

$$$.toAccordian = function (accord) {
    let panels = [];
    let expandedIndex = -1;
    let children = accord.childNodes;
    let x;
    for (x = 0; x < children.length; x++) {
        if (children[x].nodeName == "H3") {
            panels[panels.length] = children[x];
        }
        if (children[x].nodeName == "DIV") {
            panels[panels.length] = children[x];
        }
    }
    if (panels.length % 2 != 0) throw "Headings and divisions are malformed to create accordian";
    for (x = 0; x < panels.length; x += 2) {
        if (panels[x].nodeName != "H3") throw "Headings and divisions are malformed to create accordian";
        if (panels[x + 1].nodeName != "DIV") throw "Headings and divisions are malformed to create accordian";
    }
    function onClickHandler(accordianIndex, panelIndex) {
        return function () {
            $$$.accordianHeadingClicked(accordianIndex, panelIndex);
        };
    }
    let accordianIndex = $$$.model.accordians.length;
    for (x = 0; x < panels.length; x += 2) {
        panels[x].onclick = onClickHandler(accordianIndex, x);
        panels[x + 1].oldDisplay = panels[x + 1].style.display;
        panels[x + 1].style.display = "none";
    }
    $$$.model.accordians[accordianIndex] = {
        "panels": panels,
        "expandedIndex": expandedIndex
    };
}
//accordian specific code ends

$$$.onDocumentLoaded = function (func) {
    if ((typeof func) != "function") throw "Expected function, found " + (typeof func) + " in call to onDocumentLoaded";
    $$$.model.onStartup[$$$.model.onStartup.length] = func;
}

$$$.initFramework = function () {
    //setting accordians
    let x = 0;
    while (x < $$$.model.onStartup.length) {
        $$$.model.onStartup[x]();
        x++;
    }
    let allTags = document.getElementsByTagName("*");
    let t = null;
    let i = 0;
    let a = null;
    for (i = 0; i < allTags.length; i++) {
        t = allTags[i];
        if (t.hasAttribute("accordian")) {
            a = t.getAttribute("accordian");
            if (a == "true") {
                $$$.toAccordian(t);
            }
        }
    }
    //setting accordians ends 
    //setting modals
    var all = document.getElementsByTagName("*");
    i = 0;
    for (i = 0; i < all.length; i++) {
        if (all[i].hasAttribute("forModal")) {
            if (all[i].getAttribute("forModal").toUpperCase() == "TRUE") {
                all[i].setAttribute("forModal", "FALSE");
                $$$.model.modals[$$$.model.modals.length] = new Modal(all[i]);
                i--;
            }
        }
    }
    //setting modals ends
}

//ajax code starts
$$$.ajax = function (jsonObject) {
    if (!jsonObject["url"]) throw "url property is missing in call to ajax";
    let url = jsonObject["url"];
    if ((typeof url) != "string") throw "url property should be of string type in call to ajax";
    let methodType = "GET";
    if (jsonObject["methodType"]) {
        methodType = jsonObject["methodType"];
        if ((typeof methodType) != "string") throw "methodType property should be of string type in call to ajax";
        methodType = methodType.toUpperCase();
        if (["GET", "POST"].includes(methodType) == false) throw "methodType should be GET/POST in call to ajax";
    }
    let onSuccess = null;
    if (jsonObject["success"]) {
        onSuccess = jsonObject["success"];
        if ((typeof onSuccess) != "function") throw "success property should be a function in call to ajax";
    }
    let onFailure = null;
    if (jsonObject["failure"]) {
        onFailure = jsonObject["failure"];
        if ((typeof onFailure) != "function") throw "failure property should be a function in call to ajax";
    }
    if (methodType == "GET") {
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var responseData = this.responseText;
                    if (onSuccess) onSuccess(responseData);
                }
                else {
                    if (onFailure) onFailure();
                }
            }
        };
        if (jsonObject["data"]) {
            let jsonData = jsonObject["data"];
            let queryString = "";
            let qsName;
            let qsValue;
            let cc = 0;
            for (k in jsonData) {
                if (cc == 0) queryString = "?"
                if (cc > 0) queryString += "&";
                cc++;
                qsName = encodeURI(k);
                qsValue = encodeURI(jsonData[k]);
                queryString = queryString + qsName + "=" + qsValue;
            }
            url += queryString;
        }
        xmlHttpRequest.open("GET", url, true);
        xmlHttpRequest.send();
    } //get part ends here
    if (methodType == "POST") {
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var responseData = this.responseText;
                    if (onSuccess) onSuccess(responseData);
                }
                else {
                    if (onFailure) onFailure();
                }
            }
        };
        let jsonData = {};
        let sendJSON = jsonObject["sendJSON"];
        if (!sendJSON) sendJSON = false;
        if ((typeof sendJSON) != "boolean") throw "sendJSON property should be of boolean type in call to ajax";
        let queryString = "";
        if (jsonObject["data"]) {
            if (sendJSON) {
                jsonData = jsonObject["data"];
            }
            else {
                jsonData = jsonObject["data"];
                queryString = "";
                let qsName;
                let qsValue;
                let cc = 0;
                for (k in jsonData) {
                    //if (cc == 0) queryString = "?"
                    if (cc > 0) queryString += "&";
                    cc++;
                    qsName = encodeURI(k);
                    qsValue = encodeURI(jsonData[k]);
                    queryString = queryString + qsName + "=" + qsValue;
                }
                alert(queryString);
            }
        }
        xmlHttpRequest.open("POST", url, true);
        if (sendJSON) {
            xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
            xmlHttpRequest.send(JSON.stringify(jsonData));
        }
        else {
            xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlHttpRequest.send(queryString);
        }
    }
}
//ajax code ends

window.addEventListener('load', function () {
    $$$.initFramework();
});