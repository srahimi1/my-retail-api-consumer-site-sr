# my-retail-site

The running version of this code can be found at:
https://my-retail-api-consumer-site-sr.herokuapp.com

This site, a.k.a. myRetailSite, is a front-end consumer of data retrieved from one of two back-end api sources, a Java back-end or a Rails back-end. A user can interact with either one of these back-ends by interacting with this site, which is built using Rails on the back-end, and HTML, JavaScript and BootStrap resources. 

Using this site, a user can:

* Select which back-end they want to retrieve data from by selecting one of the two radio buttons at the top of the page, labeled 'Java' and 'Rails'

* Select a product to retrieve data about by either selecting a product id from a drop down menu of a few ids or entering a product id in the provided text input. If the text input is filled, then the program will use that as the product id source, even if the drop down also has a product id selected. The data retrieved from the back-end is parsed into a JSON object. The api endpoint for this 'GET' process is '/api/v1/products/:id', where ':id' is the id of the selected product.

* Update the price and/or currency type of the selected product in the modal that appears after a back-end response is received for a product. A url parameter labeled 'data' and containing a string formatted JSON object is sent via a 'PUT' request to the same endpoint as the above mentioned 'GET' request, '/api/v1/products/:id', where ':id' is the id of the product to update.

The rails back-end produces the server-side rendered HTML page of this site and JavaScript, in a file titled 'productForFunction.js' in the 'public' folder under the root directory, handles the user interactions and communications with the back-ends.