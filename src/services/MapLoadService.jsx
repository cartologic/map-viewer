import Base from 'ol/layer/Base';
import BasicViewerHelper from 'cartoview-sdk/helpers/BasicViewerHelper';
import KML from 'ol/format/KML';
import { default as SourceImage } from 'ol/source/Image';
import { default as SourceTile } from 'ol/source/Tile';
import { default as SourceVector } from 'ol/source/Vector';
import { default as SourceVectorTile } from 'ol/source/VectorTile';
import StyleHelper from 'cartoview-sdk/helpers/StyleHelper';
import View from 'ol/View';
import axios from 'axios';
import { getCRSFToken } from '../api/utils';
import { all, bbox } from 'ol/loadingstrategy';
import FeaturesHelper from 'cartoview-sdk/helpers/FeaturesHelper';
import GeoJSON from 'ol/format/GeoJSON';
import { get as olProjGet, equivalent as olProjEquivalent } from 'ol/proj';
import { Group, Heatmap, Image, Layer, Tile, Vector, VectorTile } from 'ol/layer'
import {
	BingMaps, CartoDB, Cluster, ImageStatic, ImageCanvas, ImageArcGISRest
	, ImageMapGuide, ImageWMS, Raster, OSM, Source, Stamen, TileDebug,
	TileArcGISRest, TileImage, TileJSON, TileWMS, WMTS, XYZ, Zoomify
	, UTFGrid
} from 'ol/source';


export let sourceMapping = {
	'BingMaps': BingMaps,
	'CartoDB': CartoDB,
	'Cluster': Cluster,
	'Image': SourceImage,
	'ImageArcGISRest': ImageArcGISRest,
	'ImageCanvas': ImageCanvas,
	'ImageMapGuide': ImageMapGuide,
	'ImageStatic': ImageStatic,
	//	'ImageVector': ImageVector,
	'ImageWMS': ImageWMS,
	'Stamen': Stamen,
	'Raster': Raster,
	'Source': Source,
	'Tile': SourceTile,
	'TileArcGISRest': TileArcGISRest,
	'TileDebug': TileDebug,
	'TileImage': TileImage,
	'TileJSON': TileJSON,
	'TileUTFGrid': UTFGrid,
	'TileWMS': TileWMS,
	'Zoomify': Zoomify,
	'SourceVectorTile': SourceVectorTile,
	'WMTS': WMTS,
	'OSM': OSM,
	'XYZ': XYZ,
	'Vector': SourceVector,

}
let layersMaping = {
	'Tile': Tile,
	'Group': Group,
	'Base': Base,
	'Heatmap': Heatmap,
	'Image': Image,
	'Layer': Layer,
	'Vector': Vector,
	'VectorTile': VectorTile

}
const formatMapping = {
	'geojson': GeoJSON,
	'wfs': GeoJSON,
	'kml': KML
}
class MapConfigService {
	constructor(map, mapJson) {
		this.map = map
		this.config = mapJson
		this.styleHelper = new StyleHelper()
	}
	getLayerClass(layerType) {
		let t = 'Tile'
		switch (layerType) {
			case 'arcgis_msl':
			case 'wms':
			case 'geonode':
				t = 'Tile'
				break
			case 'wfs':
			case 'geojson':
			case 'kml':
				t = 'Vector'
				break

			default:
				break
		}
		return layersMaping[t]
	}
	getSourceClass(layerType) {
		let t = 'Tile'
		switch (layerType) {
			case 'wms':
			case 'geonode':
				t = 'TileWMS'
				break
			case 'wfs':
			case 'geojson':
			case 'kml':
				t = 'Vector'
				break
			case 'arcgis_msl':
				t = 'TileArcGISRest'
				break
			default:
				break
		}
		return sourceMapping[t]
	}
	getSource(layerJson) {
		let s = undefined
		const serverInfo = layerJson.server_info
		const layerURL = layerJson.url
		const layerName = layerJson.name
		const layerProjection = layerJson.projection
		const serverProxy = serverInfo.proxy
		const serverType = serverInfo.type.toLowerCase()
		const layer_type = layerJson.layer_type
		const proxyable = layerJson.proxyable
		const isLocalhost = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
		const sourceClass = this.getSourceClass(layer_type)
		const notWFS = ['geojson', 'kml'].includes(layer_type)
		if (sourceClass === TileWMS) {
			let params = {
				params: { TILED: 'TRUE', serverType, 'LAYERS': [layerName,] },
				url: `${layerURL}`,
				crossOrigin: 'anonymous',
				tileLoadFunction: (tile, src) => {
					const url = proxyable || isLocalhost ? `${serverProxy}${encodeURIComponent(src)}` : src
					tile.getImage().src = url
				}
			}
			s = new sourceClass(params)
		} else if (sourceClass === SourceVector) {
			let source = new sourceClass({
				format: new formatMapping[layer_type](),
				loader: (extent, resolution, projection) => {
					var proj = projection.getCode()
					var uri = notWFS ? layerURL : `${layerURL}?service=wfs&version=2.0.0&request=GetFeature&typeNames=${layerName}&srsName=${proj}&bbox=${extent.join(',')}&outputFormat=application/json`
					var url = proxyable || isLocalhost ? `${serverProxy}${encodeURIComponent(uri)}` : uri
					var onError = () => {
						source.removeLoadedExtent(extent)
					}

					var layerFormat = source.getFormat()
					var options = notWFS ? {
						dataProjection: layerProjection,
						featureProjection: proj
					} : {}
					axios.get(url, {
						headers: { "X-CSRFToken": getCRSFToken() },
					}).then(response => {
						source.addFeatures(
							layerFormat.readFeatures(response.data, options))
					}).catch(error => {
						console.error(error)
						onError()
					})
				},
				strategy: notWFS ? all : bbox
			})
			s = source
		} else if (sourceClass === TileArcGISRest) {
			let source = new sourceClass({
				url: layerURL,
				crossOrigin: 'anonymous',
				tileLoadFunction: (tile, src) => {
					const url = proxyable || isLocalhost ? `${serverProxy}${encodeURIComponent(src)}` : src
					tile.getImage().src = url
				}
			})
			s = source
		}
		return s
	}
	generateLayerFromConfig(layerJson) {
		const layer_type = layerJson.layer_type
		const serverInfo = layerJson.server_info
		const LayerClass = this.getLayerClass(layer_type)
		let layerMetadata = {
			'name': layerJson.name,
			'identifier': layerJson.id,
			'title': layerJson.title,
			'server_url': serverInfo.url,
			'layer_url': layerJson.url,
			'server_proxy': serverInfo.proxy,
			"server_operations": serverInfo.operations,
			'layer_type': layer_type,
			'bbox': layerJson.bounding_box,
			'projection': layerJson.projection === "EPSG:102100" ? "EPSG:3857" : layerJson.projection,

		}
		let layer = new LayerClass({
			source: this.getSource(layerJson)
		})
		if (layer_type === 'wfs') {
			layer.setStyle(this.styleHelper.styleFunction)
		}
		if (layer_type === 'arcgis_msl') {
			let extent = layerJson.bounding_box.map(coord => parseFloat(coord))
			FeaturesHelper.getCRS(layerJson.projection.split(":").pop()).then(newCRS => {
				extent = BasicViewerHelper.reprojectExtent(extent, this.map, layerJson.projection)
				layer.setExtent(extent)
			})

		}

		layer.set('metadata', layerMetadata)

		return layer

	}
	loadLayers(callback = () => { }) {
		var layerConfig = [...this.config.layers].reverse()
		var remove = []
		let map = this.map
		map.getLayers().forEach((lyr) => {
			const metadata = lyr.get('metadata')
			if (metadata && metadata['title'] !== null) {
				remove.push(lyr)
			}
		})
		var i, ii
		for (i = 0, ii = remove.length; i < ii; ++i) {
			map.removeLayer(remove[i])
		}
		for (i = 0, ii = layerConfig.length; i < ii; ++i) {
			var layer = this.generateLayerFromConfig(layerConfig[i])
			if (layer) {
				map.addLayer(layer)
			}

		}
		callback()
	}
	load(callback = () => { }) {
		let map = this.map
		var viewConfig = this.config.view
		const viewProj = viewConfig.projection
		const projCode = viewProj.split(':').pop()
		FeaturesHelper.getCRS(projCode).then(newCRS => {
			var view = map.getView(),
				proj = olProjGet(viewConfig.projection);
			if (proj && !olProjEquivalent(view.getProjection(), proj)) {
				map.setView(new View(viewConfig))
			} else {
				view.setCenter(viewConfig.center)
				if (viewConfig.resolution !== undefined) {
					view.setResolution(viewConfig.resolution);
				} else if (viewConfig.zoom !== undefined) {
					view.setZoom(viewConfig.zoom);
				}
				if (viewConfig.rotation !== undefined) {
					view.setRotation(viewConfig.rotation)
				}
			}
			this.loadLayers(callback)
		})

	}
}
export default MapConfigService
