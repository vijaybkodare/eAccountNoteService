var _LoginAccount = {};
var _ProgressBar = {};
var _Main = {};
var _UserLogout = {};
var _TransMapper = {};
var _AppSettings = {
    PageSize: 10,
    PagesBlockSize: 5
};

function getVal(id){
    var input = document.getElementById(id);
    if(input != null)
        return input.value;
    else
        return "";
}
function getDOMElement(id){
    return document.getElementById(id);
}
function getDOMNode(id){
    return React.findDOMNode(id);
}
function getDOMNodeVal(id){
    return React.findDOMNode(id).value;
}
function ajaxGet(url, actionOnLoad){
    var xhr = new XMLHttpRequest();
    xhr.open('get',url,true);
    xhr.setRequestHeader('accesskey', _LoginAccount.AccessKey);
    xhr.setRequestHeader('userid', _LoginAccount.UserId);
    xhr.onload = function(){
        if(xhr.status == 401) {
            actionOnUnauthorized();
        } else {
            var data = JSON.parse(xhr.responseText);
            actionOnLoad(data);
        }
    };
    xhr.send();     
}
function ajaxDownload(url, actionOnLoad, fileName){
    if(!fileName) {
        fileName = "eAccountNoteRep.csv"
    }
    var xhr = new XMLHttpRequest();
    xhr.open('get',url,true);
    xhr.setRequestHeader('accesskey', _LoginAccount.AccessKey);
    xhr.setRequestHeader('userid', _LoginAccount.UserId);
    xhr.onload = function(){
        if(xhr.status == 401) {
            actionOnUnauthorized();
        } else {
            var link = document.createElement('a');
            var binaryData = [];
            binaryData.push(xhr.response);
            link.href = window.URL.createObjectURL(new Blob(binaryData, {type: "text/csv"}));
            link.download = fileName
            document.body.appendChild(link);
            // Trigger the download
            link.click();
            // Clean up
            document.body.removeChild(link);
            actionOnLoad();
        }
    };
    xhr.send();     
}
function ajaxDownloadPdf(url, actionOnLoad, fileName, action, data){
    if (!action) {
        action = "GET";
    }
    var req = new XMLHttpRequest();
    req.open(action, url, true);
    req.setRequestHeader('accesskey', _LoginAccount.AccessKey);
    req.setRequestHeader('userid', _LoginAccount.UserId);
    req.responseType = "blob";
    req.onload = function () {
        //Convert the Byte Data to BLOB object.
        var blob = new Blob([req.response], { type: "application/octetstream" });

        //Check the Browser type and download the File.
        var isIE = false || !!document.documentMode;
        if (isIE) {
            window.navigator.msSaveBlob(blob, fileName);
        } else {
            var url = window.URL || window.webkitURL;
            link = url.createObjectURL(blob);
            var a = document.createElement("a");
            a.setAttribute("download", fileName);
            window.fileName = fileName;
            a.setAttribute("href", link);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            actionOnLoad();
        }
    };
    if (data) {
        req.send(data);     
    } else {
        req.send();     
    }
}
function ajaxDownloadPdfGet(url, actionOnLoad, fileName) {
    ajaxDownloadPdf(url, actionOnLoad, fileName, "GET", null);
}
function ajaxDownloadPdfPost(url, actionOnLoad, fileName, data) {
    ajaxDownloadPdf(url, actionOnLoad, fileName, "POST", data);
}
function ajaxPost(url, data, actionOnLoad){
    var xhr = new XMLHttpRequest();
    xhr.open('post',url,true);
    xhr.setRequestHeader('accesskey', _LoginAccount.AccessKey);
    xhr.setRequestHeader('userid', _LoginAccount.UserId);
    xhr.onload = function(){
        if(xhr.status == 401) {
            actionOnUnauthorized();
        } else {
            var data = JSON.parse(xhr.responseText);
            actionOnLoad(data);
        }
    };
    xhr.send(data);     
}
function ajaxPostJson(url, data, actionOnLoad) {
    var xhr = new XMLHttpRequest();
    xhr.open('post', url, true);
    xhr.setRequestHeader("Content-Type", "application/json" );
    xhr.setRequestHeader('accesskey', _LoginAccount.AccessKey);
    xhr.setRequestHeader('userid', _LoginAccount.UserId);
    xhr.onload = function () {
        if (xhr.status == 401) {
            actionOnUnauthorized();
        } else {
            var data = JSON.parse(xhr.responseText);
            if (actionOnLoad) {
                actionOnLoad(data);
            }
        }
    };
    xhr.send(JSON.stringify(data));
}
function axiosPost(url, data, actionOnLoad) {
    axios.post(url, data)
        .then(response => {
            if (actionOnLoad) {
                actionOnLoad(response.data);
            }
        })
        .catch(error => {
            if (error && error.response && error.response.status == 401) {
                actionOnUnauthorized();
            }
        });
}
function actionOnUnauthorized() {
    _Main.goForLogin();
    _ProgressBar.IMDone();
    _Alert.showWarning("Authorization failed or Session Timeout.", 2000);
}
function setComponent(comp){
    comp.show = function(arg, itemSelMode, showNextComponent, multiSelect){
        if(typeof(itemSelMode) != "boolean"){
            itemSelMode = false
            showNextComponent = null;
        }
        comp.Component.style.display = "block";
        if(comp.customShow != null)
            comp.customShow(arg);
        comp.toggleFlag = true;
        if(comp.setItemSelMode) {
            comp.setItemSelMode(itemSelMode, showNextComponent, multiSelect)
        }
    };
    comp.hide = function(arg){
        comp.Component.style.display = "none";
        if(comp.customHide != null)
            comp.customHide(arg);
        comp.toggleFlag = false;    
    };
    comp.toggle = function(){
        if(comp.toggleFlag)
            comp.hide();
        else
            comp.show();
    }
    comp.hide();
}
function setDOMComponent(comp){
    comp.show = function(arg){
        comp.style.display = "block";
        comp.toggleFlag = true;    
    };
    comp.hide = function(arg){
        comp.style.display = "none";
        comp.toggleFlag = false;    
    };
    comp.toggle = function(){
        if(comp.toggleFlag)
            comp.hide();
        else
            comp.show();
    }
    comp.hide();
}
function readCookie(key){
    var allcookies = document.cookie;
    var keyVal;
    cookiearray = allcookies.split(';');
    for(var i=0; i<cookiearray.length; i++){
        keyVal = cookiearray[i].split('=')
        if(keyVal[0].trim() == key)
            return keyVal[1].trim();
    }
    return "";
}
function clearCredential(){
    var now = new Date();
    now.setFullYear( now.getFullYear() - 1 );
    document.cookie = "MobileNo=;expires=" + now.toUTCString();
    document.cookie = "AccountName=;expires=" + now.toUTCString();
}
function evaluateBooleanCondition(srcVal, condition, dstVal){
    switch(condition){
        case 0:
            return srcVal == dstVal;
        case 1:
            return srcVal > dstVal;    
        case 2:
            return srcVal < dstVal;        
        case 3:
            if(srcVal == null)
                return false;
            return srcVal.toLowerCase().indexOf(dstVal.toLowerCase()) >= 0
    }
}
function isStringFilter(src, dst){
    if(src == null || dst == null)
        return true;
    if(dst == "")
        return true;    
    if(src.toLowerCase().indexOf(dst.toLowerCase()) >= 0)
        return true;
    else
        return false;    
}
function filterMe(item, filter) {
    return filter == "" || item.toLowerCase().indexOf(filter.toLowerCase()) > -1
}
function isValidForFilter(mainFilter, detailFilter, accountName, balance, tagName){
        var flag  = false;
        if(tagName == null)
            tagName = "";
        if(accountName == null)
            accountName = "";    
        if(mainFilter == null)
            mainFilter = "";
        if(balance == null)
            balance = 0;    
        if(mainFilter == "" && detailFilter && !detailFilter.CR.IsValid && !detailFilter.DR.IsValid)// && !detailFilter.TagName.IsValid)
            return true;
        if(mainFilter != "")
            if(accountName.toLowerCase().indexOf(mainFilter.toLowerCase()) >= 0)
                flag = true;
        /*if(detailFilter.CR.IsValid && balance > 0){
            if(evaluateBooleanCondition(balance, detailFilter.CR.Condition, detailFilter.CR.Value)) 
                flag = true;
            else
                flag = false;
        }
        if(detailFilter.DR.IsValid && balance <= 0){
            if(evaluateBooleanCondition(balance * -1, detailFilter.DR.Condition, detailFilter.DR.Value)) 
                flag = true;
            else
                flag = false;    
        }
        if(detailFilter.TagName.IsValid){
            if(evaluateBooleanCondition(tagName, detailFilter.TagName.Condition, detailFilter.TagName.Value)) 
                flag = true;
            else
                flag = false;    
        }*/
        return flag;        
}
function appendObjectToFormData(obj, formData, prefix = "") {
    for (const key in obj) {
        const value = obj[key];
        const newPrefix = prefix ? `${prefix}[${key}]` : key;

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                const itemPrefix = `${newPrefix}[${index}]`;
                appendObjectToFormData(item, formData, itemPrefix);
            });
        } else if (typeof value === "object" && !Array.isArray(value)) {
            appendObjectToFormData(value, formData, newPrefix);
        } else {
            formData.append(newPrefix, value);
        }
    }
}
function appendObjectToFormData2(obj, formData, prefix = "") {
    for (const key in obj) {
        const value = obj[key];
        const newPrefix = prefix ? `${prefix}[${key}]` : key;

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                const itemPrefix = `${newPrefix}[${index}]`;
                formData.append(itemPrefix, item);
            });
        } else if (typeof value === "object" && !Array.isArray(value)) {
            appendObjectToFormData(value, formData, newPrefix);
        } else {
            formData.append(newPrefix, value);
        }
    }
}
  function getFormattedDate1(rawDate) {
    if(!rawDate){
        return;
    }
    const milliseconds = parseInt(rawDate.substring(6, rawDate.length - 1));
    var d = new Date(milliseconds),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
  
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
  
    return [year, month, day].join('-');
  }
function getFormattedDate2(rawDate) {
    if (!rawDate) {
        return;
    }
    const milliseconds = parseInt(rawDate.substring(6, rawDate.length - 1));
    var d = new Date(milliseconds);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[d.getMonth()] + '-' + d.getFullYear();
}
function getFormattedDate3(rawDate) {
    if (!rawDate) {
        return;
    }
    var d = new Date(rawDate);
    var day = '' + d.getDate();
    if (day.length < 2)
        day = '0' + day;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return day + '-' + months[d.getMonth()] + '-' + d.getFullYear();
}
function getFormattedDate(rawDate) {
    if (!rawDate) {
        return;
    }
    const milliseconds = parseInt(rawDate.substring(6, rawDate.length - 1));
    var d = new Date(milliseconds);
    var day = '' + d.getDate();
    if (day.length < 2) 
        day = '0' + day;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return day + '-' + months[d.getMonth()] + '-' + d.getFullYear();
}
function getCurrentDate(){
    let today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];    
    var day = '' + today.getDate();
    if (day.length < 2) 
        day = '0' + day;
    return day + '-' + months[today.getMonth()] + '-' + today.getFullYear();
}
function getCurrentDateWithEODTime(){
    return getCurrentDate() + ' 23:59:59';
}
function get1stDayOfCurrentMonth(){
    let today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];    
    return '01-' + months[today.getMonth()] + '-' + today.getFullYear();
}
function getAccountType(accountType){
    switch(accountType){ 
        case 1: return "Memb Acc"; 
        case 2: return "Bank Acc"; 
        case 3: return "Inc Acc"; 
        case 4: return "Exp Acc";
    }
    return accountType;
}
function getBGColorByStatus(status){
    if(status == 0) {
        return '#cedafb';
    } else if (status == 10) {
        return '#f7dbe0';
    } else if (status == 11) {
        return '#e7e9e9';
    }
}
function getBGColorBySource(source) {
    if (source == 'CCPT') {
        return '#cedafb';
    } else if (source == 'CPT') {
        return '#f4c9c9';
    }
}
function numberWithCommas(x) {
    //return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return formatIndianCurrency(x);
}
function formatIndianCurrency(number) {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(number);
}
function getFilterTitle(filter) {
    let accountName = ''
    if (filter.Account) {
        accountName = filter.Account.AccountName;
    }
    return accountName + ':' + filter.FromDate + ' To ' + filter.ToDate.substring(0,11);
}
var AccountType = {
    UserAccount : 1,
    GroupAccount : 2,
    SystemAccount : 3,
    SupportAccount : 4
}
function getChartOptions(title) {
    return {
    events: false,
    title: {
        display: true,
        text: title.substring(0, title.length - 8)
    },
    animation: {
      duration: 500,
      easing: "easeOutQuart",
      onComplete: function () {
        var ctx = this.chart.ctx;
        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
  
        this.data.datasets.forEach(function (dataset) {
  
          for (var i = 0; i < dataset.data.length; i++) {
            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                start_angle = model.startAngle,
                end_angle = model.endAngle,
                mid_angle = start_angle + (end_angle - start_angle)/2;
  
            var x = mid_radius * Math.cos(mid_angle);
            var y = mid_radius * Math.sin(mid_angle);
  
            ctx.fillStyle = '#fff';
            if (i == 3){ // Darker text color for lighter background
              ctx.fillStyle = '#444';
            }
            //ctx.fillStyle = 'black';
            var percent = String(Math.round(dataset.data[i]/total*100)) + "%";
            ctx.fillText(formatIndianCurrency(dataset.data[i]), model.x + x, model.y + y);
            // Display percent in another line, line break doesn't work for fillText
            ctx.fillText(percent, model.x + x, model.y + y + 15);
          }
        });               
      }
    }
  };
}

function goToTrnsMapper() {
    _Main.hideAllComponent();
    _TransMapper.showMe();
}
function isUser() {
    return _LoginAccount && _LoginAccount.RoleId == 2;
}
function isAdmin() {
    return _LoginAccount && (_LoginAccount.RoleId == 1 || _LoginAccount.RoleId == 100);
}
function isSuperAdmin() {
    return _LoginAccount && _LoginAccount.RoleId == 100;
}
function isValidFile(fileInput) {
    return fileInput.files && fileInput.files[0] && fileInput.files[0].size < 1048576;
}
