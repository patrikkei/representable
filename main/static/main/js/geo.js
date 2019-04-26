/******************************************************************************/

// GEO Js file for handling map drawing.
/* https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-draw/ */
// Polygon Drawn By User
var user_polygon = null;
var ideal_population = 109899;

/******************************************************************************/

// Initialize the Map
/* eslint-disable */
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v11', //hosted style id
    center: [-74.65545, 40.341701], // starting position - Princeton, NJ :)
    zoom: 12 // starting zoom
});

var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');


function switchLayer(layer) {
    var layerId = layer.target.id;
    map.setStyle('mapbox://styles/mapbox/' + layerId);
}

for (let i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}

var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken
});

var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        trash: true
    },
    styles: [
        {
            'id': 'gl-draw-polygon-fill-inactive',
            'type': 'fill',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'Polygon'],
                ['!=', 'mode', 'static']
            ],
            'paint': {
                'fill-color': '#3bb2d0',
                'fill-outline-color': '#3bb2d0',
                'fill-opacity': 0.1
            }
        },
        {
            'id': 'gl-draw-polygon-fill-active',
            'type': 'fill',
            'filter': ['all', ['==', 'active', 'true'],
                ['==', '$type', 'Polygon']
            ],
            'paint': {
                'fill-color': '#4a69bd',
                'fill-outline-color': '#4a69bd',
                'fill-opacity': 0.5
            }
        },
        {
            'id': 'gl-draw-polygon-stroke-inactive',
            'type': 'line',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'Polygon'],
                ['!=', 'mode', 'static']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#3bb2d0',
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-polygon-stroke-active',
            'type': 'line',
            'filter': ['all', ['==', 'active', 'true'],
                ['==', '$type', 'Polygon']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#fbb03b',
                'line-dasharray': [0.2, 2],
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-line-inactive',
            'type': 'line',
            'filter': ['all', ['==', 'active', 'false'],
                ['==', '$type', 'LineString'],
                ['!=', 'mode', 'static']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#3bb2d0',
                'line-width': 2
            }
        },
        {
            'id': 'gl-draw-line-active',
            'type': 'line',
            'filter': ['all', ['==', '$type', 'LineString'],
                ['==', 'active', 'true']
            ],
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            },
            'paint': {
                'line-color': '#fbb03b',
                'line-dasharray': [0.2, 2],
                'line-width': 2
            }
        }
    ]

});

// initialize the progress bar with pop data
document.getElementById("ideal-pop").innerHTML = ideal_population;

map.addControl(geocoder, 'top-right');
map.addControl(draw);
map.boxZoom.disable();

var polygonError = document.getElementById("polygon_missing");
if (polygonError != null) {
    document.getElementById("map").classList.add("border");
    document.getElementById("map").classList.add("border-warning");
}

/******************************************************************************/

// After the map style has loaded on the page, add a source layer and default
// styling for a single point.
map.on('style.load', function() {
    map.addSource('single-point', {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": []
        }
    });

    map.addSource("census", {
        type: "vector",
        url: "mapbox://districter-team.aq1twwkc"
      });

    map.addLayer({
    "id": "census-blocks",
    "type": "fill",
    "source": "census",
    "source-layer": "njblockdata",
    "layout": {
        "visibility": "visible"
    },
    "paint": {
        "fill-color": "rgba(200, 100, 240, 0)",
        "fill-outline-color": "rgba(200, 100, 240, 0)"
    }
    });

    // a line so that thickness can be changed
    map.addLayer({
      "id": "census-lines",
      "type": "line",
      "source": "census",
      "source-layer": "njblockdata",
      "layout": {
        "visibility": "visible",
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "rgba(71, 93, 204, 0.25)",
        "line-width": 1
      }
    });

    map.addLayer({
        "id": "blocks-highlighted",
        "type": "fill",
        "source": "census",
        "source-layer": "njblockdata",
        "paint": {
        "fill-outline-color": "#1e3799",
        "fill-color": "#4a69bd",
        "fill-opacity": 0.7
        },
        "filter": ["in", "BLOCKID10", ""]
        });


    map.addLayer({
        "id": "point",
        "source": "single-point",
        "type": "circle",
        "paint": {
            "circle-radius": 10,
            "circle-color": "#007cbf"
        }
    });

    map.on('click', 'Census Blocks', function (e) {
        new mapboxgl.Popup({
            closeButton: false
        })
        .setLngLat(e.lngLat)
        .setHTML(e.features[0].properties.BLOCKID10)
        .addTo(map);
      });

    // Listen for the `geocoder.input` event that is triggered when a user
    // makes a selection and add a symbol that matches the result.
    geocoder.on('result', function(ev) {
        map.getSource('single-point').setData(ev.result.geometry);
        console.log(ev.result);
        console.log("hello changing the page");
        var styleSpec = ev.result;
        var styleSpecBox = document.getElementById('json-response');
        var styleSpecText = JSON.stringify(styleSpec, null, 2);
        var syntaxStyleSpecText = syntaxHighlight(styleSpecText);
        styleSpecBox.innerHTML = syntaxStyleSpecText;

    });
});

var wasLoaded = false;
map.on('render', function() {
    if (!map.loaded() || wasLoaded) return;
    wasLoaded = true;

});

/******************************************************************************/

map.on('draw.create', updateCommunityEntry);
map.on('draw.delete', updateCommunityEntry);
map.on('draw.update', updateCommunityEntry);

/******************************************************************************/


// updatePolygon responds to the user's actions and updates the polygon field
// in the form.
function updateCommunityEntry(e) {

    var wkt = new Wkt.Wkt();
    var data = draw.getAll();
    var user_polygon;
    var entry_polygon;
    if (data.features.length > 0) {
        // Update User Polygon with the GeoJson data.
        user_polygon = data.features[0];

        var polygonBoundingBox = turf.bbox(user_polygon);
        // get the bounds of the polygon to reduce the number of blocks you are querying from
        var southWest = [polygonBoundingBox[0], polygonBoundingBox[1]];
        var northEast = [polygonBoundingBox[2], polygonBoundingBox[3]];
  
        var northEastPointPixel = map.project(northEast);
        var southWestPointPixel = map.project(southWest);
        var features = map.queryRenderedFeatures([southWestPointPixel, northEastPointPixel], { layers: ['census-blocks'] });
        var mpolygon = [];
        var total = 0.0;

        var filter = features.reduce(function(memo, feature) {
            if (! (turf.intersect(feature, user_polygon) === null)) {
                memo.push(feature.properties.BLOCKID10);
                mpolygon.push(feature);
                total+= feature.properties.POP10;
            }
            return memo;
        }, ["in", "BLOCKID10"]);

        map.setFilter("blocks-highlighted", filter);
        // console.log(total);
        // progress bar with population data based on ideal population for a district in the given state
        //<div id="pop" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 85%">
        progress = document.getElementById("pop");
        // set color of the progress bar depending on population
        if (total < (ideal_population * 0.33) || total > (ideal_population * 1.5)) {
          progress.style.background = "red";
        }
        else if (total < (ideal_population * 0.67) || total > (ideal_population * 1.33)) {
          progress.style.background = "orange";
        }
        else {
          progress.style.background = "green";
        }
        progress.innerHTML = total;
        progress.setAttribute("aria-valuenow", "total");
        progress.setAttribute("aria-valuemax", ideal_population * 1.5);
        popWidth = total / (ideal_population * 1.5) * 100;
        progress.style.width = popWidth + "%";

        var finalpoly = turf.union.apply(null, mpolygon);
        user_polygon.geometry.coordinates[0] = finalpoly.geometry.coordinates[0];
        entry_polygon = JSON.stringify(user_polygon['geometry']);
        wkt_obj = wkt.read(entry_polygon);
        entry_polygon = wkt_obj.write();
    } else {
        // Update User Polygon with `null`.
        user_polygon = null;
        entry_polygon = '';
        map.setFilter("blocks-highlighted", ["in", "GEOID10"]);
    }
    // Update form field
    document.getElementById('id_entry_polygon').value = entry_polygon;
}
/******************************************************************************/

function updateElementIndex(el, prefix, ndx) {
    var id_regex = new RegExp('(' + prefix + '-\\d+)');
    var replacement = prefix + '-' + ndx;
    if ($(el).attr("for")) $(el).attr("for", $(el).attr("for").replace(id_regex, replacement));
    if (el.id) el.id = el.id.replace(id_regex, replacement);
    if (el.name) el.name = el.name.replace(id_regex, replacement);
}

/******************************************************************************/

function cloneMore(selector, prefix) {
    // Function that clones formset fields.
    var newElement = $(selector).clone(true);
    var total = $('#id_' + prefix + '-TOTAL_FORMS').val();
    console.log(total)
    newElement.find(':input').each(function() {
        var name = $(this).attr('name').replace('-' + (total - 1) + '-', '-' + total + '-');
        var id = 'id_' + name;
        $(this).attr({
            'name': name,
            'id': id
        }).val('').removeAttr('checked');
    });
    total++;
    $('#id_' + prefix + '-TOTAL_FORMS').val(total);
    $(selector).after(newElement);
    var conditionRow = $('.form-row:not(:last)');
    conditionRow.find('.btn.add-form-row')
        .removeClass('btn-success').addClass('btn-danger')
        .removeClass('add-form-row').addClass('remove-form-row')
        .html('<span class="" aria-hidden="true">Remove</span>');
    return false;
}

/******************************************************************************/

function deleteForm(prefix, btn) {
    // Function that deletes formset fields.
    var total = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
    if (total > 1) {
        btn.closest('.form-row').remove();
        var forms = $('.form-row');
        $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
        for (var i = 0, formCount = forms.length; i < formCount; i++) {
            $(forms.get(i)).find(':input').each(function() {
                updateElementIndex(this, prefix, i);
            });
        }
    }
    return false;
}

/******************************************************************************/

$(document).on('click', '.add-form-row', function(e) {
    // Add form click handler.
    e.preventDefault();
    cloneMore('.form-row:last', 'form');
    return false;
});

/******************************************************************************/

$(document).on('click', '.remove-form-row', function(e) {
    // Remove form click handler.
    e.preventDefault();
    deleteForm('form', $(this));
    return false;
});

/******************************************************************************/