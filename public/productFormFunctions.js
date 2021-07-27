// Global variables
var productIDDropdown, productIDTextField, xhr, modal, productModal, modalTitle, modalBody, parsedJSON, errorDiv, errorContentPart1, errorContentPart2, errorContentPart3, errorContentPart4, javaRadioButton, initialized = false;

function init() {
    productIDDropdown = document.getElementById("productIDDropdown");
    productIDTextField = document.getElementById("productIDTextField");
    xhr = new XMLHttpRequest();
    modal = document.getElementById("productModal");
    modalTitle = document.getElementById("modalTitle");
    modalBody = document.getElementById("modalBody");
    productModal = bootstrap.Modal.getOrCreateInstance(modal);
    errorDiv = document.getElementById("errorDiv");
    errorContentPart1 = "<div class='alert alert-danger alert-dismissible fade show' role='alert'>";
    errorContentPart2 = "<svg class='bi flex-shrink-0 me-2' style='margin-top: -0.3em;' width='24' height='24' role='img' aria-label='Danger:' fill='currentColor' viewBox='0 0 16 16'><path d='M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'/></svg>";
    errorContentPart3 = "<strong>Error: </strong> ";
    errorContentPart4 = "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>";
    javaRadioButton = document.getElementById("radioButton_java");
    initialized = true;
} // end init()

init();

function getProductDetails(productID) {
	if (!initialized) init();
    errorDiv.innerHTML = "";
    if ((productID == undefined) || (productID == null)) productID = getProductID();
    if (productID) {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {        
                var response = this.responseText;
                var responseLower = response.toLowerCase().substr(0,4);
                if (responseLower == "pass") { 
                    showModal(response);
                } else if (responseLower == "fail") {
                    showErrorMsg(response.substr(5));
                } // end if ... else if
            } // end if (this.readyState == 4 && this.status == 200)
        } // end xhr.onreadystatechange
        xhr.open("GET", getBase()+"/api/v1/products/"+productID);
        xhr.send();
    } else {
        showErrorMsg("For product details, a product ID must be entered or chosen from the dropdown list.");
    }// end if else
} // end getProductDetails()

function getProductID() {
    var output = false;
    if (productIDTextField.value.trim() == "") {
        if (productIDDropdown.value != "Product ID...") {
            output = productIDDropdown.value;
        } // end if
    } else {
        output = productIDTextField.value.trim();
    } // end if else
    return output;
} // end getProductID()

function getBase() {
    var base = "https://my-retail-api-endpoint-rails-sr.herokuapp.com";
    if ((javaRadioButton != undefined) && (javaRadioButton != null) && (javaRadioButton.checked)) {
        base = "https://my-retail-api-endpoint-java-sr.herokuapp.com";
    } // end if
    return base;
} // end getBase()

function showErrorMsg(errorMsg) {
    errorDiv.innerHTML = errorContentPart1 + errorContentPart2 + errorContentPart3 + errorMsg + errorContentPart4;
} // end showError()

function showModal(response) {
    parsedJSON = JSON.parse(response.substr(5));
    modalTitle.innerHTML = parsedJSON["product_name"];
    var image = "<p class='col-12 text-center'><img src='" + parsedJSON["product_image_url"] + "' width='150' height='150'></p>";
    var errorLine = "<div id='productDetailsErrorDiv' class='col-12'></div>"
    var price = parsedJSON["current_price"]["value"];
    var cc = parsedJSON["current_price"]["currency_code"];
    var price = "<p id='priceP' class='col-12 text-center'>" + price + " " + cc + "<button class='btn btn-outline-primary btn-sm ms-2' type='button' onclick=\"editPrice('" + price + "','" + cc + "')\"> Edit</button></p>";
    var responseID = "<p class='col-12'>ID: " + parsedJSON["id"] + "</p>";
    var description = "<p class='col-12'>" + parsedJSON["product_description"] + "</p>";
    modalBody.innerHTML = image + errorLine + price + responseID + description;
    productModal.show();
} // end showModal()

function editPrice(price, cc) {
    var priceTextField = "<input id='priceTextField' class='ms-2' type='text' size='5' value='" + price + "'>";
    var ccTextField = "<input id='ccTextField' class='ms-2' type='text' size='5' value='" + cc + "'>";
    var openSpan = "<div id='productButtonsGroup' class='align-bottom' style='display: inline-block;'>";
    var closeSpan = "</div>"
    var cancelButton = "<button class='btn btn-outline-secondary btn-sm ms-2 align-bottom' type='button' onclick='cancelEdit()'>Cancel</button>";
    var submitButton = "<button class='btn btn-outline-primary btn-sm ms-2 align-bottom' type='button' onclick='submitEdit()'>Submit</button>";
    var el = document.getElementById("priceP");
    el.innerHTML = priceTextField + ccTextField + openSpan + cancelButton + submitButton + closeSpan;
} // end editPrice()

function cancelEdit() {
    document.getElementById('productDetailsErrorDiv').innerHTML = "";
    var el = document.getElementById("priceP");
    var price = parsedJSON["current_price"]["value"];
    var cc = parsedJSON["current_price"]["currency_code"];
    var editButton = "<button class='btn btn-outline-primary btn-sm ms-2' type='button' onclick=\"editPrice('" + price + "','" + cc + "')\"> Edit</button>";
    el.innerHTML = price + " " + cc + editButton;
} // end cancelEdit()

function submitEdit() {
    document.getElementById('productDetailsErrorDiv').innerHTML = "";
    var price = document.getElementById("priceTextField").value.trim();
    var cc = document.getElementById("ccTextField").value.trim();
    if (isNaN(parseFloat(price))) {
        document.getElementById('productDetailsErrorDiv').innerHTML = errorContentPart1 + "The price is not a valid number." + errorContentPart4;
        editPrice(price, cc);
    } else {
        sendEditPriceRequest(parseFloat(price).toFixed(2),cc);
    } // end if else
} // end submitEdit()

function sendEditPriceRequest(price, cc) {
    document.getElementById("productButtonsGroup").innerHTML = "<div class='spinner-border text-primary ms-3' role='status'><span class='visually-hidden'>Loading...</span></div>";
    var sendData = {"id": parsedJSON["id"], "current_price": {"value": price, "currency_code": cc}};
    var sendDataStringified = JSON.stringify(sendData);
    var errorMsg, failed = true;
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {        
            var response = this.responseText;
            var responseLower = response.toLowerCase().substr(0,4);
            if (responseLower == "pass") {
                failed = false;
                getProductDetails(parsedJSON["id"]);
                return 1;
            } else if (responseLower == "fail") {
                errorMsg = "Product failed to update. The price is not a valid number.";
            } else if (responseLower == "empt") {
                errorMsg = "Data request was empty. Please try again.";
            } else {
                errorMsg = "Something went wrong. Please try again.";
            } // end if ... else if ... else
        
            if (failed) {
                document.getElementById('productDetailsErrorDiv').innerHTML = errorContentPart1 + errorMsg + errorContentPart4;
                editPrice(price, cc);
            } // end if
        } // end if (this.readyState == 4 && this.status == 200)
    } // end xhr.onreadystatechange
    xhr.open("PUT", getBase()+"/api/v1/products/"+parsedJSON["id"]);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("data="+sendDataStringified);
} // end sendEditPriceRequest()