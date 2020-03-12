# Haversine Test File
## For the FIP

Currently building widget to find Clinics according to a input postal code.

Haversine Forumala is working as intended. Distances are calculated properly.

Still researching into API, as it is alot to take in over a small period of time.

Using a Vue library which works with Google maps API
* https://github.com/xkjyeah/vue-google-maps

Map is currently working, and on a postal code search, map is filled with markers of clinic locations within a 20km radius. Currently markers can be clicked to display information, but adjustments will be made as they cannot currently be styled easily.

Next up: 
* Displaying clinics on the page after the search.
* Regex to make sure only postal codes are sent into the search.
* Marker infowindows need adjustments.
* Switch geocoder.ca API for postal code search to Google's geocoder API - will be much faster.
* Populating database with more clinic locations - currently have 15 will look into expanding up to Toronto.

## API now functioning!

API key is not posted publicly - as it is sensitive data

To get the file functioning, create a config.js in the following location:
```
config/config.js
```
Then add the following to the file - API_KEY is your Google API key
```
var config = {
    MY_KEY : 'API_KEY'
}
```
## Author

* Philip Wood

## Google Map API research

* https://github.com/xkjyeah/vue-google-maps
* https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-promise-27fc71e77261
* https://markus.oberlehner.net/blog/using-the-google-maps-api-with-vue/#rendering-markers