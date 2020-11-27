import * as $ from 'jquery';

export class InfrastructureMap {
   constructor() {
      this.$block = $('#infrastructure-block');

      if (this.$block.length === 0) return false;

      this.$mapNav = this.$block.find('.inf-top__nav');
      this.$map = $('#infrastructure-map');

      this.mapData = JSON.parse(this.$block.attr('data-points'));

      this.$gmarkersArray = [];

      this.isFirst = true;

      this.init();
   }

   init = () => {
      this.initMap();
      this.initStartView();
      this.mapFilter();
      this.initHandlers();
   };

   initHandlers = () => {
      this.$mapNav.find('a').on('click', e => {
         e.preventDefault();
         let text = $(e.currentTarget).text();

         this.$mapNav.find('a').removeClass('active');
         $(e.currentTarget).addClass('active');

         this.$block.find('.inf-top__selected span').text(text);
         this.$mapNav.removeClass('inf-top__nav-show')

         this.mapFilter();
      });

      this.$block.find('.inf-top__selected').on('click', e => {
         $(e.currentTarget)
            .closest('.inf-top__nav-wrap')
            .find('.inf-top__nav')
            .toggleClass('inf-top__nav-show');
      });
   };

   initMap = () => {
      this.$map = new google.maps.Map(document.getElementById('infrastructure-map'), {
         center: { lat: 53.293644, lng: 50.352145 },
         zoom: 15,
         zoomControl: true,
         mapTypeControl: false,
         scaleControl: false,
         streetViewControl: false,
         rotateControl: false,
         fullscreenControl: false,
         styles: [
            {
               featureType: 'water',
               elementType: 'geometry',
               stylers: [
                  {
                     color: '#e9e9e9'
                  },
                  {
                     lightness: 17
                  }
               ]
            },
            {
               featureType: 'landscape',
               elementType: 'geometry',
               stylers: [
                  {
                     color: '#f5f5f5'
                  },
                  {
                     lightness: 20
                  }
               ]
            },
            {
               featureType: 'road.highway',
               elementType: 'geometry.fill',
               stylers: [
                  {
                     color: '#ffffff'
                  },
                  {
                     lightness: 17
                  }
               ]
            },
            {
               featureType: 'road.highway',
               elementType: 'geometry.stroke',
               stylers: [
                  {
                     color: '#ffffff'
                  },
                  {
                     lightness: 29
                  },
                  {
                     weight: 0.2
                  }
               ]
            },
            {
               featureType: 'road.arterial',
               elementType: 'geometry',
               stylers: [
                  {
                     color: '#ffffff'
                  },
                  {
                     lightness: 18
                  }
               ]
            },
            {
               featureType: 'road.local',
               elementType: 'geometry',
               stylers: [
                  {
                     color: '#ffffff'
                  },
                  {
                     lightness: 16
                  }
               ]
            },
            {
               featureType: 'poi',
               elementType: 'geometry',
               stylers: [
                  {
                     color: '#f5f5f5'
                  },
                  {
                     lightness: 21
                  }
               ]
            },
            {
               featureType: 'poi.park',
               elementType: 'geometry',
               stylers: [
                  {
                     color: '#dedede'
                  },
                  {
                     lightness: 21
                  }
               ]
            },
            {
               elementType: 'labels.text.stroke',
               stylers: [
                  {
                     visibility: 'on'
                  },
                  {
                     color: '#ffffff'
                  },
                  {
                     lightness: 16
                  }
               ]
            },
            {
               elementType: 'labels.text.fill',
               stylers: [
                  {
                     saturation: 36
                  },
                  {
                     color: '#333333'
                  },
                  {
                     lightness: 40
                  }
               ]
            },
            {
               elementType: 'labels.icon',
               stylers: [
                  {
                     visibility: 'off'
                  }
               ]
            },
            {
               featureType: 'transit',
               elementType: 'geometry',
               stylers: [
                  {
                     color: '#f2f2f2'
                  },
                  {
                     lightness: 19
                  }
               ]
            },
            {
               featureType: 'administrative',
               elementType: 'geometry.fill',
               stylers: [
                  {
                     color: '#fefefe'
                  },
                  {
                     lightness: 20
                  }
               ]
            },
            {
               featureType: 'administrative',
               elementType: 'geometry.stroke',
               stylers: [
                  {
                     color: '#fefefe'
                  },
                  {
                     lightness: 17
                  },
                  {
                     weight: 1.2
                  }
               ]
            }
         ]
      });

      const polygonCoords = [
         new google.maps.LatLng(53.295773, 50.355192),
         new google.maps.LatLng(53.292079, 50.353668),
         new google.maps.LatLng(53.291912, 50.354505),
         new google.maps.LatLng(53.291168, 50.356458),
         new google.maps.LatLng(53.291232, 50.354441),
         new google.maps.LatLng(53.290976, 50.354269),
         new google.maps.LatLng(53.291143, 50.352896),
         new google.maps.LatLng(53.291361, 50.348347),
         new google.maps.LatLng(53.291951, 50.347724),
         new google.maps.LatLng(53.292323, 50.347574),
         new google.maps.LatLng(53.292592, 50.348068),
         new google.maps.LatLng(53.292515, 50.348733),
         new google.maps.LatLng(53.293464, 50.350557),
         new google.maps.LatLng(53.293798, 50.349892),
         new google.maps.LatLng(53.294016, 50.34987),
         new google.maps.LatLng(53.294041, 50.349505),
         new google.maps.LatLng(53.294144, 50.349334),
         new google.maps.LatLng(53.294259, 50.349355),
         new google.maps.LatLng(53.294259, 50.349184),
         new google.maps.LatLng(53.294349, 50.349012),
         new google.maps.LatLng(53.295144, 50.350621),
         new google.maps.LatLng(53.295093, 50.352574),
         new google.maps.LatLng(53.295747, 50.353175),
         new google.maps.LatLng(53.29585, 50.35384),
         new google.maps.LatLng(53.295747, 50.354763),
         new google.maps.LatLng(53.295773, 50.355127)
      ];
      var polygonOptions = {
         path: polygonCoords,
         strokeColor: '#95C122',
         fillColor: '#95C122',
         strokeOpacity: 0.3,
         fillOpacity: 0.3,
         strokeWeight: 1
      };
      var polygon = new google.maps.Polygon(polygonOptions);
      polygon.setMap(this.$map);

      let marketLogo = new google.maps.Marker({
         position: {
            lat: 53.293644,
            lng: 50.352145
         },
         map: this.$map,
         category: 'all',
         icon: {
            url: '/img/infrastructure/logo-marker.svg',
            scaledSize: new google.maps.Size(34, 37)
         }
      });
      let marketParking1 = new google.maps.Marker({
         position: {
            lat: 53.291335,
            lng: 50.348293
         },
         map: this.$map,
         category: 'all',
         icon: {
            url: '/img/infrastructure/parking-right.svg',
            scaledSize: new google.maps.Size(32, 22)
         }
      });
      let marketParking2 = new google.maps.Marker({
         position: {
            lat: 53.293682,
            lng: 50.354226
         },
         map: this.$map,
         category: 'all',
         icon: {
            url: '/img/infrastructure/parking-left.svg',
            scaledSize: new google.maps.Size(32, 22)
         }
      });

      this.$gmarkersArray = [...this.$gmarkersArray, marketLogo, marketParking1, marketParking2];
   };

   initStartView = () => {
      let data = this.mapData.types;
      for (let key in data) {
         let type = key;

         if (data[key]) {
            for (let j = 0; j < data[key].length; j++) {
               let point = data[key][j];
               let coords = point.coords.split(',');

               let marker = new google.maps.Marker({
                  position: {
                     lat: +coords[0],
                     lng: +coords[1]
                  },
                  map: this.$map,
                  category: type,
                  icon: {
                     url: '/img/infrastructure/marker.png',
                     scaledSize: new google.maps.Size(19, 19)
                  },
                  label: {
                     text: point.label,
                     className: 'label',
                     fontFamily: 'TT Firs Neue',
                     fontSize: '14px'
                  }
               });

               this.$gmarkersArray = [...this.$gmarkersArray, marker];
            }
         }
      }
   };

   mapFilter = () => {
      let category = this.$mapNav
         .find('a.active')
         .first()
         .attr('data-category');

      let bounds = new google.maps.LatLngBounds();
      for (let i = 0; i < this.$gmarkersArray.length; i++) {
         let marker = this.$gmarkersArray[i];

         if (marker.category == category || marker.category == 'all') {
            marker.setVisible(true);
            bounds.extend(marker.getPosition());
         } else {
            marker.setVisible(false);
         }

         if (!this.isFirst && category !== 'place') {
            this.$map.fitBounds(bounds);
         }
      }

      if (category === 'place') {
         if ($(window).width() < 1000) {
            this.$map.setZoom(14);
         } else {
            this.$map.setZoom(15);
         }

      }

      this.isFirst = false;
   };
}
