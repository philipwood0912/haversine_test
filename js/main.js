(() => {
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

    const vm = new Vue({
        data: {
            clinics: [],
            closeClinics: [],
            postal: "",
            currentLatLon: []
        },
        methods: {
            pullLocation(input){
                let url = `https://geocoder.ca/?postal=${input}&geoit=XML&json=1`;
                fetch(url)
                .then(res => res.json())
                .then(data => {
                    this.currentLatLon.push([data.latt, data.longt]);
                    //console.log(this.currentLatLon);
                    for(i=0;i<this.clinics.length;i++){
                        let distance = haversineForm([this.currentLatLon[0][0], this.currentLatLon[0][1]], [this.clinics[i].Latt, this.clinics[i].Longt]);
                        this.clinics[i].distance = distance.toFixed(3);
                        // next loop through clinics - only keeping ones within 20km
                        // of the currentLatLon - push to close clinics
                        // also figure out a way to reset arrays / clinic distance
                        // when a new postal code goes in
                        // also consider getting rid of current lat and lon
                        // data from API can be fed right into haversine formula
                    }
                    console.log(this.clinics);
                })
                .catch(err => console.log(err))
            },
            pullClinics(){
                let url = "./includes/address.php?clinic=true";
                fetch(url)
                .then(res => res.json())
                .then(data => {
                    for(i=0;i<data.length;i++){
                        this.clinics.push(data[i]);
                    }
                    console.log(this.clinics);
                })
                .catch(err => console.log(err))
            }
        },
        created: function() {
            this.pullClinics();
        }

    }).$mount("#app");


})();