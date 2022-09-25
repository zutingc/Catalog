/**************  Change if adding new field in PLM Report **************/
function findRequests(nodeNumber) {
    numColumns = 17; // change this for how many columns of data you have (+1 for magnifying class column in PLM report)
    let nodeInfo = document.getElementsByClassName("__row")[nodeNumber];
    parsed = nodeInfo.outerHTML;
    var parsedData = [];
    for (let i = 0; i <= numColumns; i++) {
        parsed2 = parsed.split('<td valign="top" class="grid-line2"><!--|DMS-REPVAL|-->')[i];
        if (i == 2) {
            if (parsed2[1] == "i") {
                parsedImg = "";
                parsed3 = parsed2.split(')')[0];
                parsed4 = parsed3.split('(')[1];
                parsed5 = parsed3.split('(')[0];
                parsed6 = parsed5.split('"')[1];
                parsedImg += parsed6 + "%28" + parsed4 + "%29";
                parsedData.push(parsedImg);
            } else {
                parsedData.push(" ");
            }
        } else {
            if (parsed2 == "</td>") {
                parsedData.push(" ");
            } else {
                parsedData.push(parsed2.split("<")[0]);
            }
        }
    }
    //console.log(parsedData); // use this to check in console what your data is being parsed as
    return parsedData;
}

/************** !!!!!!!!!! MOST OF THE CHANGES ARE HERE. This contains the code for each individual card !!!!!!!!!! **************/
function codePiece(nodeNumber, conf) {
    parsedData = findRequests(nodeNumber);
    var cardCode = ''; // card HTML
    var cardTags = ''; // tags on cards for view
    var missingClasses = ''; // classes for filtering

    /********** DATA FILTER: Add Classes and filter out data selected in checkboxes **********/
    parsedImg = parsedData[2];
    if (parsedImg[0] != ".") {
        if (conf.includes('Image')) {
            return "";
        }
    } else {
        missingClasses += " mimg";
    }

    if (parsedData[1] == "") {
        if (conf.includes('Description')) {
            return "";
        }
    } else {
        missingClasses += " desc";
    }

    if (parsedData[8] == "") {
        if (conf.includes('Link')) {
            return "";
        }
    } else {
        missingClasses += " mlink";
    }

    if (parsedData[17].length == 0) {
        if (conf.includes('Grade')) {
            return "";
        }
    } else {
        missingClasses += " mgrade";
    }

    /********** CARD AND FILTER: Add card tags and isotope filter classes **********/
    if (parsedData[4] != "") {
        cardTags += '<span class="category">' + parsedData[4] + '</span>';
        missingClasses += " " + parsedData[4];
    }
    if (parsedData[12] == "Yes") {
        missingClasses += " costTime";
        cardTags += '<span class="category">Cost/Time</span>';
    }
    if (parsedData[13] == "Yes") {
        missingClasses += " innov";
        cardTags += '<span class="category">Innov</span>';
    }
    if (parsedData[14] == "Yes") {
        missingClasses += " devRisk";
        cardTags += '<span class="category">Dev/Risk</span>';
    }
    if (parsedData[15] == "Yes") {
        missingClasses += " IP";
        cardTags += '<span class="category">IP</span>';
    }
    if (parsedData[17] == "Lab or Unclassified") {
        missingClasses += " lab";
    }
    if (parsedData[17] == "Office or Warehouse") {
        missingClasses += " office";
    }
    if (parsedData[17] == "Product Contact") {
        missingClasses += " prod";
    }
    if (parsedData[17] == "Grade A/B") {
        missingClasses += " AB";
    }
    if (parsedData[17] == "Grade C/D") {
        missingClasses += " CD";
    }
    if (parsedData[17] == "Grade A-C Open Processing") {
        missingClasses += " AC";
    }

    cardCode += '<div class="dynamic-item w-col w-col-4 w-dyn-item' + missingClasses + '">' + '<div class="card boxCont"><div class="cardImg" style="background-image: url(';

    /********** CARD: Add card tags and isotope filter classes **********/
    if (parsedData[2] != "") { // image
        cardCode += parsedData[2];
    } else {
        cardCode += 'https://cdn.wallpapersafari.com/24/66/jVJNKu.png'; // filler image
    }

    //ID - TITLE 
    cardCode += ');"></div><div class="card-body"><p class="card-title">' + parsedData[3] + '</p><p class="card-text"><small class="text-muted">';

    //Used in DEPARTMENT in SITE/BUILDING/COUNTRY
    cardCode += "Used in" + " " + parsedData[7];
    if (parsedData[10] != "") {
        cardCode += " from " + parsedData[10];
        if (parsedData[11] != "") {
            cardCode += ", " + parsedData[11];
        }
    } else if (parsedData[11] != "") {
        cardCode += " " + parsedData[11];
    } else {
        cardCode += " n/a";
    }

    // cardTags, request title, and requester name
    cardCode += '</small></p></div>' + cardTags;

    /********** overlay CARD: Info inside cards when hovered **********/
    cardCode += '<div class="boxOverlay"><div class="boxContent scroll"><b>' + parsedData[3] + '</b><br><br><u>Requester:</u> ' + parsedData[6] + '<br><u>File:</u>';
    if (parsedData[8] == "") { // links
        cardCode += ' n/a';
    } else {
        cardCode += '<a class="overlayLink" href="' + parsedData[8] + '"> Link';
    }
    cardCode += '</a><br><u>Material:</u>';
    if (parsedData[16] != "") { // materials
        cardCode += " " + parsedData[16];
    } else {
        cardCode += ' n/a';
    }
    cardCode += '</a><br><u>Grade:</u>';
    if (parsedData[17] != "") { // grade of space
        cardCode += " " + parsedData[17];
    } else {
        cardCode += ' n/a';
    }
    cardCode += '<br><br>';
    if (parsedData[1] == "") { // description
        cardCode += "Request description unspecified.";
    } else {
        cardCode += parsedData[1];
    }
    cardCode += '</div></div></div></div>';
    return cardCode;
}

/**************  Change if adding new checkbox or Data Filter **************/
function autoDataFilters() {
    const conf = checkChecked();
    dataFilterCode = ""
    // automatically add "remove if missing" catalog buttons depending on which data wasn't filtered out in Data Filters in "update.html"
    // need to be manually added in
    if (conf.length != document.querySelectorAll('input[type="checkbox"]').length) {
        dataFilterCode = '<div class="button-group" data-filter-group="missing" align="left"><b style="margin-top: 10px;">Remove if missing: </b><button class="button is-checked" data-filter="*">Reset</button>';
        if (!conf.includes('Description')) {
            dataFilterCode += '<button class="button" data-filter=".desc">Description</button>';
        }
        if (!conf.includes('Image')) {
            dataFilterCode += '<button class="button" data-filter=".mimg">Image</button>';
        }
        if (!conf.includes('Link')) {
            dataFilterCode += '<button class="button" data-filter=".mlink">Link</button>';
        }
        if (!conf.includes('Grade')) {
            dataFilterCode += '<button class="button" data-filter=".mgrade">Grade</button>';
        }
        dataFilterCode += "</div>";
    }
    return dataFilterCode;
}

/************** These likely won't need to be touched if not changing processes **************/
function loadHTML() { // initiate data update process
    fetch('catalogTemplate.html')
        .then(response => response.text())
        .then(text => document.getElementById('writeInside').innerHTML = text);
    document.getElementById("notice").innerHTML += "Template imported<br>";
    fetch('CatalogData.html')
        .then(response => response.text())
        .then(text => document.getElementById('imported').innerHTML = text);
    document.getElementById("notice").innerHTML += "File imported";
    setTimeout(function () {
        writeCode();
    }, 10000);
}

function checkChecked() { // retrieve checked checkboxes
    let checkboxes = document.querySelectorAll('input[name="subject"]:checked');
    let output = [];
    checkboxes.forEach((checkbox) => {
        output.push(checkbox.value);
    });
    return output;
}

function writeCode() { // compiles the code pieces into code for the page
    pageCode = "";
    let conf = checkChecked();
    let dataFilterCode = autoDataFilters();
    let dataRows = document.getElementsByClassName("__row").length;
    //console.log("length of rows: " + dataRows);
    for (let i = 0; i < dataRows; i++) {
        //console.log(i);
        pageCode += codePiece(i, conf);
        //console.log("Piece " + i + ": " + codePiece(i));
    }
    document.getElementById("fillIn").innerHTML += pageCode;
    document.getElementById("autoDataFilters").innerHTML += dataFilterCode;
    document.getElementById("dataRows").innerHTML = "This code contains " + document.getElementsByClassName("w-dyn-item").length + " out of " + dataRows + " data entries";
    document.getElementById("makeDownload").innerHTML = '<button id="download" onclick="downloadFile()">Download catalog.html</button><br>';
}

function downloadFile() { // download function
    const element = document.createElement('a');
    const content = document.getElementById('writeInside').innerHTML;
    const filename = 'catalog.html';
    const blob = new Blob([content], {
        type: 'plain/text'
    });
    const fileUrl = URL.createObjectURL(blob);
    element.setAttribute('href', fileUrl); //file location
    element.setAttribute('download', filename); // file name
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    console.log("Downloading");
};