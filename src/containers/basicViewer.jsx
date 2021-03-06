import "@babel/polyfill/noConflict"
import '../css/base.css'
import 'ol/ol.css'
import '../css/popup.css'

import { createMap, fetchMapById, mapJsonSerializer, saveMap, saveMapThumbnail } from '../api'

import BasicViewerHelper from 'cartoview-sdk/helpers/BasicViewerHelper'
import { BasicViewerProvider } from '../context'
import ContentGrid from '../components/ContentGrid'
import FeatureIdentify from '../services/Identify'
import FeaturesHelper from 'cartoview-sdk/helpers/FeaturesHelper'
import FileSaver from 'file-saver'
import LegendService from '../services/Legend'
import MapConfigService from '../services/MapLoadService'
import Mustache from 'mustache'
import Overlay from 'ol/Overlay'
import Map from 'ol/Map'
import Tile from 'ol/layer/Tile'
import View from 'ol/View'
import OSM from 'ol/source/OSM'
import ZoomSlider from 'ol/control/ZoomSlider'
import ScaleLine from 'ol/control/ScaleLine'
import FullScreen from 'ol/control/FullScreen'
import { defaults as defaultControls } from 'ol/control.js';
import React from 'react'
import ReactDOM from 'react-dom'
import { register as registerProj4 } from 'ol/proj/proj4'
import { fromLonLat } from 'ol/proj'
import proj4 from 'proj4'


registerProj4(proj4);

class BasicViewer extends React.Component {
    constructor(props) {
        super(props)
        let controls = []
        controls.push(new ScaleLine())
        controls.push(new ZoomSlider())
        controls.push(new FullScreen({ source: "root" }))

        this.state = {
            //map: BasicViewerHelper.getMap(),
            map: new Map({
                controls: defaultControls().extend(controls),
                layers: [
                    new Tile({
                        title: 'OpenStreetMap',
                        source: new OSM()
                    })
                ],
                loadTilesWhileInteracting: true,
                view: new View({
                    center: fromLonLat([0, 0]),
                    minZoom: 1,
                    zoom: 3,
                    maxZoom: 19,
                })
            }),
            featureIdentifyLoading: false,
            featureIdentifyResult: [],
            showPopup: false,
            activeFeature: 0,
            legends: [],
            mapSaving: false,
            mapSavingMessage: null,
            mapLayers: [],
            mouseCoordinates: [0, 0],
            mapLoading: false,
            currentMap: {
                title: "No Title Provided",
                description: "No Description Provided",
                abstract: "No Abstract Provided",
                keywords: [],
                featured_image: null
            },
        }
        window.map = this.state.map
    }
    setStateKey = (key, value, callback = () => { }) => {
        this.setState({ [key]: value }, () => { callback() })
    }
    popupTemplateing = (feature) => {
        const { currentMap } = this.state
        let template = null
        if (currentMap.popup_template && feature) {
            let data = feature.getProperties()
            template = Mustache.render(template, data)
        }
        return template
    }
    changeShowPopup = () => {
        const { showPopup } = this.state
        this.setState({ showPopup: !showPopup })
    }
    nextFeature = () => {
        const { activeFeature } = this.state
        const nextIndex = activeFeature + 1
        this.setState({ activeFeature: nextIndex })
    }
    previousFeature = () => {
        const { activeFeature } = this.state
        const previuosIndex = activeFeature - 1
        this.setState({ activeFeature: previuosIndex })
    }
    exportMap = () => {
        const { map } = this.state
        map.once('postcompose', (event) => {
            let canvas = event.context.canvas
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(canvas.msToBlob(), 'map.png')
            } else {
                canvas.toBlob((blob) => {
                    FileSaver.saveAs(blob, 'map.png')
                })
            }
        })
        map.renderSync()
    }
    getMapThumbnail = () => {
        let imagePromise = new Promise((resolve, reject) => {
            const { map } = this.state
            map.once('postcompose', function (event) {
                var canvas = event.context.canvas;
                canvas.toBlob(function (blob) {
                    var file = new File([blob], 'map.png', { type: 'image/png', lastModified: Date.now() })
                    resolve(file)
                })
            });
            map.renderSync()
        })
        return imagePromise
    }

    save = () => {
        const { currentMap, map, mapLayers } = this.state
        const view = map.getView()
        const projection = view.getProjection().getCode()
        const zoom = view.getZoom()
        const rotation = view.getRotation()
        const center = view.getCenter()
        let layers = []
        let render_options = {
            ordering: {

            }
        }
        for (let index = 0; index < mapLayers.length; index++) {
            const layer = mapLayers[index]
            const metadata = layer.get('metadata')
            if (metadata) {
                layers.push(metadata.identifier)
                render_options.ordering[metadata.identifier] = index
            }
        }
        let savePromises = []
        let data = {
            title: currentMap.title,
            description: currentMap.description,
            abstract: currentMap.abstract,
            keywords: currentMap.keywords,
            projection,
            zoom,
            rotation,
            center,
            layers,
            render_options
        }
        let featured_image = currentMap.featured_image
        let successMessage = "Map has been Saved!"
        let failtureMessage = "Failed to Save Map!"
        if (currentMap.id) {
            savePromises.push(saveMap(currentMap.id, JSON.stringify(data)))
            this.getMapThumbnail().then(thumb => {
                let formdata = new FormData()
                formdata.append('thumbnail', thumb)
                if (featured_image && featured_image instanceof File) {
                    formdata.append('featured_image', featured_image)
                }
                saveMapThumbnail(currentMap.id, formdata).then(resp => {
                    this.setState({ mapSaving: false, mapSavingMessage: successMessage })
                }).catch(err => {
                    console.log(err);
                    this.setState({ mapSaving: false, mapSavingMessage: failtureMessage })
                })
            }).catch(err => {
                console.log(err);
                this.setState({ mapSaving: false, mapSavingMessage: failtureMessage })
            })
        } else {
            createMap(JSON.stringify(data)).then(resp => {
                if (resp.status < 400) {
                    this.setState({ currentMap: resp.data })
                    this.getMapThumbnail().then(thumb => {
                        let formdata = new FormData()
                        formdata.append('thumbnail', thumb)
                        if (featured_image && featured_image instanceof File) {
                            formdata.append('featured_image', featured_image)
                        }
                        savePromises.push(saveMapThumbnail(resp.data.id, formdata))
                        Promise.all(savePromises).then(results => this.setState({ mapSaving: false, mapSavingMessage: successMessage })).catch(err => {
                            console.error(err)
                            this.setState({ mapSaving: false, mapSavingMessage: failtureMessage })
                        })
                    })
                }
            })
        }
    }
    saveMap = () => {
        this.setState({ mapSaving: true }, this.save)
    }
    loadMap = (mapJson) => {
        const { map } = this.state
        let service = new MapConfigService(map, mapJson)
        service.load(() => {
            let layers = map.getLayers().getArray()
            layers = [...layers].reverse().filter(layer => {
                const metadata = layer.get('metadata')
                if (metadata && metadata['name'] !== undefined) {
                    return true
                }
                return false
            })
            this.setState({ mapLayers: layers })
            Promise.all(LegendService.getLegends(map)).then(result => this.setState({ legends: result }))
        })
    }
    componentDidMount() {
        const { map } = this.state
        if (window.mapId) {
            fetchMapById(window.mapId).then(response => {
                let data = response.data
                const transformedData = mapJsonSerializer(data)
                this.setState({ currentMap: data }, () => {
                    this.loadMap(transformedData)
                })
            })
        }
        this.overlay = new Overlay({
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            },
            positioning: 'center-center'
        })
        map.addOverlay(this.overlay)
        map.on('singleclick', (evt) => {
            if (this.overlay) {
                this.overlay.setElement(undefined)
            }
            this.setState({
                featureIdentifyLoading: true,
                activeFeature: 0,
                featureIdentifyResult: [],
                showPopup: false,
                mouseCoordinates: evt.coordinate,
            }, () => this.identify(evt))
        })
    }
    zoomToExtent = (extent, projection = 'EPSG:4326') => {
        let { map } = this.state
        FeaturesHelper.getCRS(projection.split(":").pop()).then(newCRS => {
            const transformedExtent = BasicViewerHelper.reprojectExtent(extent, map, projection)
            BasicViewerHelper.fitExtent(transformedExtent, map)
        })
    }
    addOverlay = (node) => {
        const { activeFeature, featureIdentifyResult, mouseCoordinates } =
            this.state
        let position = mouseCoordinates
        if (featureIdentifyResult && featureIdentifyResult.length > 0) {
            const currentFeature = featureIdentifyResult[activeFeature]
            const geometry = currentFeature.getGeometry()
            position = FeaturesHelper.getGeometryCenter(geometry)
        }
        this.overlay.setElement(node)
        this.overlay.setPosition(position)
    }
    getContextValue = () => {
        return {
            ...this.state,
            nextFeature: this.nextFeature,
            previousFeature: this.previousFeature,
            changeShowPopup: this.changeShowPopup,
            addOverlay: this.addOverlay,
            setStateKey: this.setStateKey,
            zoomToExtent: this.zoomToExtent,
            saveMap: this.saveMap,
            popupTemplateing: this.popupTemplateing,
            exportMap: this.exportMap
        }
    }
    identify = (evt) => {
        const { map } = this.state
        Promise.all(FeatureIdentify.identify(map, evt)).then(featureGroups => {
            let features = []
            for (let g = 0, gg = featureGroups.length; g < gg; g++) {
                const layers = Object.keys(featureGroups[g])
                for (let l = 0, ll = layers.length; l < ll; l++) {
                    const layer = layers[l]
                    let newFeatures = featureGroups[g][layer].map(f => {
                        f.set('layerName', layer)
                        return f
                    })
                    features = [...features, ...newFeatures]
                }
            }
            this.setState({
                featureIdentifyLoading: false,
                activeFeature: 0,
                featureIdentifyResult: features,
                showPopup: true,
            })
        })
    }
    render() {
        return (
            <BasicViewerProvider value={this.getContextValue()}>
                <ContentGrid />
            </BasicViewerProvider>
        )
    }
}
var elem = document.getElementById("basicviewer-app")
if (!elem) {
    elem = document.createElement('div', { "id": "basicviewer-app" })
    document.body.prepend(elem)
}
ReactDOM.render(<BasicViewer />, elem)
if (module.hot) {
    module.hot.accept()
}