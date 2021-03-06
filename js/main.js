(() => {
    // variable for my google api key
    // you do not want to share this to the public!!
    var mykey = config.MY_KEY;
    // resources - http://wordpress.mrreid.org/wp-content/uploads/2011/12/haversine.pdf
    //           - https://rosettacode.org/wiki/Haversine_formula#ES6
    // function to covert degrees into radians
    function degToRad(deg){
        // return deg multiplied by PI divided by 180
        return deg * Math.PI / 180;
    }
    // haversine formula in a function - taking 2 different coords in the params
    function haversineForm(coords1, coords2){
        // first set lat / lon variables from coords
        var lat1 = coords1[0],
            lon1 = coords1[1],
            lat2 = coords2[0],
            lon2 = coords2[1],
            // calculate the difference between the lats and lons
            dlat = lat1 - lat2,
            dlon = lon1 - lon2,
            // convert lat / lon differences into radians
            dlatRad = degToRad(dlat),
            dlonRad = degToRad(dlon),
            // convert lat1 / lat2 in radians
            lat1Rad = degToRad(lat1),
            lat2Rad = degToRad(lat2),
            // appox estimate of earths radius - there is room for error here
            // as earth is not a perfect sphere
            radius = 6371;

            // return the haversine formula
            // I will do my best to explain this..
            // ------------------------------------
            // -last- bracket values are calculated first, leaving us
            // with a simple equation of R * 2 * e
            // e = the inverse sine of the square root number calculated before
            // R = approx radius of earth
            // they are then multiplied together to give us our final distance in KM
            return radius * 2 * Math.asin(
                // -second- we will take the square root of the number calculated
                Math.sqrt(
                    // the inner math will be calculated first
                    // ---------------------------------------
                    // -first- bracket values are calculated first leaving us with an
                    // inner equation that looks like a + b * c * d
                    // then the values are totaled up multiplication first then addition
                    // a = the sine of the difference in lat in radians / 2
                    // which is then squared
                    Math.pow(Math.sin(dlatRad/2), 2) +
                    // b = the cosine of lat1 in radians
                    // c = the cosine of lat2 in radians
                    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                    // d = the sine of the difference in lon in radians / 2
                    // which is then squared
                    Math.pow(Math.sin(dlonRad/2), 2)
                )
            )

        // Math for returning a rounded distance
        // return Math.round(
        //     radius * 2 * Math.asin(
        //         Math.sqrt(
        //             Math.pow(Math.sin(dlatRad/2), 2) +
        //             Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        //             Math.pow(Math.sin(dlonRad/2), 2)
        //         )
        //     ) * 100
        // ) / 100;
    }
    // Haversine tests
    //console.log(haversineForm([42.941870, -81.233160], [42.940242, -81.227403]));
    //console.log(haversineForm([36.12, -86.67], [33.94, -118.40]));
    console.log(haversineForm([41.8319, -88.2572], [46.2342, 6.05278]));

    Vue.use(VueGoogleMaps, {
        //vue library plugin rules
        load: {
          key: mykey,
          v: '3.26'
        },
        installComponents: true
      })

    const vm = new Vue({
        data: {
            clinics: [],
            closeClinics: [],
            postal: "",
            curLat: 42.984909,
            curLng: -81.245302,
            lat: 42.984909,
            lng: -81.245302,
            windowInfoTitle: "",
            windowInfoAddress: "",
            windowInfoPhone: "",
            windowInfoWebsite: "",
            windowInfoDistance: "",
            windowPosition: null,
            windowOpen: false,
            windowIndex: null,
            windowOptions: {
                pixelOffset: {
                width: 0,
                height: -35
                }
            },
            postalMessage: ""
            
        },
        methods: {
            pullLocation(input){
                this.resetClinics();
                // run regex to make sure postal code is inputed
                let regexTest = this.postalCodeCheck(input); 
                if(regexTest){
                    //debugger;
                    let url = `https://geocoder.ca/?postal=${input}&geoit=XML&json=1`;
                    fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        // assign currentlatlon with values from API
                        // currentlatlon used as marker for starting point
                        // data must be parsed before being used with google maps
                        this.curLat = parseFloat(data.latt);
                        this.curLng = parseFloat(data.longt);
                        for(i=0;i<this.clinics.length;i++){
                            // run haversine form on pulled values from API and clinics 
                            let distance = haversineForm([data.latt, data.longt], [this.clinics[i].Latt, this.clinics[i].Longt]);
                            // convert distance to 3 decimal points - example: 4.555 = 4kilometres 555metres
                            this.clinics[i].Distance = distance.toFixed(1);
                            let metres = distance.toFixed(3);
                            let metresSplit =  metres.split('.');
                            this.clinics[i].Metres = metresSplit[1];
                            // if clinic distance is less or equal to 20k, push or closeclinic array else continue through loop
                            if(this.clinics[i].Distance <= 20.0){
                                this.closeClinics.push(this.clinics[i]);
                                this.closeClinics.sort(function(a, b){
                                    return a.Distance - b.Distance;
                                });
                            }else{
                                continue;
                            }
                        }
                        for(i=0;i<this.closeClinics.length;i++){
                            //convert latt and longt values from a string to a float value
                            this.closeClinics[i].Latt = parseFloat(this.closeClinics[i].Latt);
                            this.closeClinics[i].Longt = parseFloat(this.closeClinics[i].Longt);

                            this.closeClinics[i].Actual_Distance = "";
                            //debugger;
                            if(this.closeClinics[i].Distance < 1.000){
                                this.closeClinics[i].Actual_Distance = "" + this.closeClinics[i].Metres + " Metres";
                            } else {
                                this.closeClinics[i].Actual_Distance = "" + this.closeClinics[i].Distance + " Kilometres"
                            }
                        }
                        console.log(this.clinics);
                        console.log(this.closeClinics);
                        console.log(this.currentLatLon);
                        console.log(this.lat);
                        console.log(this.lng);
                    })
                    .catch(err => console.log(err))
                } else {
                    this.postalMessage = "Not a valid postal code..";
                }
            },
            //function to pull clinics and populate array on vue creation
            pullClinics(){
                let url = "./includes/address.php?clinic=true";
                fetch(url)
                .then(res => res.json())
                .then(data => {
                    for(i=0;i<data.length;i++){
                        this.clinics.push(data[i]);
                    }
                })
                .catch(err => console.log(err))
            },
            // reset function for clinic arrays
            resetClinics(){
                //reset closeClinics array
                this.closeClinics = [];
                // reset pulled clinic distances
                for(i=0;i<this.clinics.length;i++){
                    this.clinics[i].Distance = "";
                }
            },
            // function for pop up window on map markers
            clinicClick(obj, c, index){
                //reposition map center on click
                this.lat = obj.lat;
                this.lng = obj.lng;
                // position of popup window
                this.windowPosition = {lat:obj.lat, lng:obj.lng};
                // popup window content
                this.windowInfoTitle = c.Clinic_Name;
                this.windowInfoAddress = c.Address;
                this.windowInfoPhone = c.Phone;
                this.windowInfoWebsite = c.Website;
                this.windowInfoDistance = c.Actual_Distance;
                debugger;
                if(this.windowIndex == index){
                    // toggle the popup window
                    this.windowOpen = !this.windowOpen
                    debugger;
                } else {
                    // if not open window anyways and set windowIndex as marker index
                    this.windowOpen = true;
                    this.windowIndex = index;
                    debugger;
                }
                // if windowIndex is equal to index of clicked marker
                // if(this.windowIndex == index){
                //     // toggle the popup window
                //     this.windowOpen = !this.windowOpen
                // } else {
                //     // if not open window anyways and set windowIndex as marker index
                //     this.windowOpen = true;
                //     this.windowIndex = index;
                // }
            },
            //close window function
            windowClose(){
                this.windowOpen = false;
            },
            postalCodeCheck(input){
                let regex = new RegExp(/^[a-z]\d[a-z]\d[a-z]\d/, 'i');
                let match = regex.test(input);
                if (match === true){
                    return true;
                } else {
                    return false;
                }
            }
        },
        created: function() {
            //pull clinics on creation
            this.pullClinics();
        }

    }).$mount("#app");

})();