import { AfterViewInit, Component } from '@angular/core';
import { FormGroup, FormControl,  FormBuilder }  from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgForm} from '@angular/forms';
import * as L from 'leaflet';
import { AntPath, antPath } from 'leaflet-ant-path';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  checkoutForm = this.formBuilder.group({
    radius: '',
    animal:''
  });
  constructor(private formBuilder: FormBuilder,) { }
  ngAfterViewInit(): void {
    var map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
  var marker,circle,radius,animal;
  var path,lati,long;
  var latlngs = Array();
  const button = document.querySelector("button");
      function onLocationFound(e) {
        lati=e.latlng.lat;
        long=e.latlng.lng;
        console.log(lati,long);
        if(radius==null){
          radius = 100;
        }
          if(marker) {
              map.removeLayer(marker);
          }
          if(circle) {
              map.removeLayer(circle);
          }                
          marker = L.marker(e.latlng,{
            draggable: true
          });
          circle =L.circle(e.latlng, {
            color: 'red',
            fillColor: 'green',
            fillOpacity: 0.5,
            radius: radius
        });
        const antCurve = antPath(e.latlng,
          {
            use: L.circle,
            color :'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 10
          }).addTo(map);
          
          marker.addTo(map)
              .bindPopup("<center><b>Moving marker</b></center> <br> With " + radius + " meters radius boundary").openPopup();
              marker.on('drag', function(e) {
                // distance between the current position of the marker and the center of the circle
                var d = map.distance(e.latlng, circle.getLatLng());
                // the marker is inside the circle when the distance is inferior to the radius
                var isInside = d < circle.getRadius();
              // let's manifest this by toggling the color
                circle.setStyle({
                    fillColor: isInside ? 'green' : '#f03'
                })
                
            });
            circle.addTo(map);
            return [lati,long];
      }
        button?.addEventListener("click", handleClick);
          
        function handleClick() {
            console.log("Clicked!");
            radius=Number((<HTMLInputElement>document.getElementById("radi")).value);
            animal=(<HTMLInputElement>document.getElementById("animal")).value;
            console.log(radius);
            circle.addTo(map);
          }
      function onLocationError(e) {
          alert(e.message);
      }
      map.on('locationfound', onLocationFound);
      map.on('locationerror', onLocationError);
      map.locate({setView: true, 
                  maxZoom: 50,
                watch: true,
                enableHighAccuracy: true,
                maximumAge: 15000,
                timeout: 3000000});
                //route   
                
                          var lat = 30.346444799999993 ;
                          var lng = 76.4116992;
                          setInterval(function () {
                            lat = lat + ((Math.random() * 0.5) - 0.25) * 0.001;
                            lng = lng + ((Math.random() * 1) - 0.5) * 0.001;
                            latlngs.push([lat,lng]);
                            var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
                            // zoom the map to the polyline
                            map.fitBounds(polyline.getBounds());
                            var d = map.distance([lat,lng], circle.getLatLng());
                // the marker is inside the circle when the distance is inferior to the radius
                            var isInside = d < circle.getRadius();
              // let's manifest this by toggling the color
                            circle.setStyle({
                                fillColor: isInside ? 'green' : '#f03'
                            })
                            
                            marker.setLatLng([lat, lng]).update();
                            }, 700);
                        var d;
                          //Distance Radians
                          var rad = function(x) {
                            return x * Math.PI / 180;
                          };
                          //Distance
                          var getDistance = function(lat1, lon1, lat2, lon2) {
                            var R = 6378137; // Earth’s mean radius in meter
                            var dLat = rad(lat2 - lat1);
                            var dLong = rad(lon2 - lon1);
                            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                              Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
                              Math.sin(dLong / 2) * Math.sin(dLong / 2);
                            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                            d = (R * c/1000).toFixed(2);
                            console.log(d);
                            return d; // returns the distance in meter
                          };
                          console.log("Distance:" + getDistance(30.34, 76.379997, 30.36, 76.39));
                          marker.bindPopup("<center>Path End</center><br>Distance travelled=<b>"+d+" K.M.</b>").openPopup();
}
}