import * as L from 'leaflet'
import "leaflet.markercluster"
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { PickupPoint } from 'src/app/features/pickupPoints/classes/pickupPoint'
import { environment } from 'src/environments/environment'

@Component({
    selector: 'map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})

export class MapComponent {

    //#region variables

    @Input() pickupPoints: PickupPoint[]
    @Output() outputCoordinates = new EventEmitter()

    private bounds = [39.821062382395915, 19.528198242187504, 39.337351150575174, 20.17772605800193]
    private icon = new L.Icon({ iconUrl: 'assets/images/markers/pin.svg', iconAnchor: [0, 60], iconSize: [60, 60] })
    private isInitialized = false
    private map: L.Map

    //#endregion

    //#region public methods

    public onRefreshMap(): void {
        if (!this.isInitialized) {
            this.initMap()
            this.addMarkers()
            setTimeout(() => {
                this.map.invalidateSize()
                this.onZoomToBounds()
                this.mustZoomToMarker()
            }, 1000)
            this.isInitialized = true
        }
    }

    public onZoomIn(): void {
        this.map.setZoom(this.map.getZoom() + 1)
    }

    public onZoomOut(): void {
        this.map.setZoom(this.map.getZoom() - 1)
    }

    public onZoomToBounds(): void {
        this.map.fitBounds([
            [this.bounds[0], this.bounds[1]],
            [this.bounds[2], this.bounds[3]]
        ], { padding: [50, 50] })
    }

    //#endregion

    //#region private methods

    private addMarkers(): void {
        if (this.pickupPoints.length == 1 && this.pickupPoints[0].coordinates != '' && this.isValidCoordinates(this.pickupPoints[0].coordinates)) {
            this.createMarker(this.pickupPoints[0]).addTo(this.map)
        }
        else {
            const clusters = this.createClusters()
            this.pickupPoints.forEach((element, index) => {
                if (element.isActive && element.coordinates != '' && this.isValidCoordinates(element.coordinates)) {
                    clusters.addLayer(this.createMarker(this.pickupPoints[index]))
                }
            })
            clusters.on('clusterclick', (event) => {
                this.map.fitBounds(event.propagatedFrom.getBounds().pad(0.5))
            })
            this.map.addLayer(clusters)
        }
    }

    private createClusters(): L.MarkerClusterGroup {
        return L.markerClusterGroup({
            iconCreateFunction: (cluster) => {
                return L.divIcon({ html: '' + cluster.getChildCount() + '', className: 'leaflet-cluster-orange', iconSize: L.point(40, 40) })
            }, zoomToBoundsOnClick: false
        })
    }

    private createMarker(element: PickupPoint): L.Marker {
        const lat = parseFloat(element.coordinates.split(',')[0])
        const lon = parseFloat(element.coordinates.split(',')[1])
        const marker = L.marker(new L.LatLng(lat, lon), { icon: this.icon, draggable: true })
        marker.bindTooltip(this.customToolTip(element), {
            direction: 'top',
            className: 'leaflet-tooltip',
            permanent: this.pickupPoints.length == 1 ? true : false,
            offset: L.point(0, -50)
        }).openTooltip()
            .on('dragend', () => {
                const emitted = []
                emitted.push(element.id)
                emitted.push(marker.getLatLng().lat + ',' + marker.getLatLng().lng)
                this.outputCoordinates.emit(emitted)
            })
            .on('click', () => this.zoomToMarker(lat, lon))
        return marker
    }

    private customToolTip(element: PickupPoint): string {
        const tooltip =
            '<div id="customTooltip">' +
            '<span id="description">' + element.description + '</span><br/>' +
            '<span id="exactPoint">Exact point: ' + element.exactPoint + '</span><br/>' +
            '<span id="time">Time: ' + element.time + '</span>' +
            '</div>'
        return tooltip
    }

    private createPickupPoint(location: L.LocationEvent): PickupPoint {
        const pickupPoint = new PickupPoint
        pickupPoint.id = this.pickupPoints.length > 0 ? this.pickupPoints[0].id : 0
        pickupPoint.description = this.pickupPoints.length > 0 ? this.pickupPoints[0].description : ''
        pickupPoint.exactPoint = this.pickupPoints.length > 0 ? this.pickupPoints[0].exactPoint : ''
        pickupPoint.time = this.pickupPoints.length > 0 ? this.pickupPoints[0].time : ''
        pickupPoint.coordinates = location.latlng.lat.toString() + ',' + location.latlng.lng.toString()
        return pickupPoint
    }

    private initMap(): void {
        this.map = L.map('map', {
            boxZoom: true,
            zoomControl: false,
            zoomSnap: 0
        })
        const tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + environment.leaflet.token, {
            attribution: '',
            id: 'mapbox/satellite-streets-v11',
            maxZoom: 18,
            tileSize: 512,
            zoomOffset: -1,
        })
        this.map.on('click', (location: L.LocationEvent) => {
            if ((this.pickupPoints.length == 0) || (this.pickupPoints.length == 1 && !this.isValidCoordinates(this.pickupPoints[0].coordinates))) {
                const emitted = []
                const pickupPoint = this.createPickupPoint(location)
                this.map.addLayer(this.createMarker(pickupPoint))
                emitted.push(pickupPoint.id)
                emitted.push(location.latlng.lat.toString() + ',' + location.latlng.lng.toString())
                this.outputCoordinates.emit(emitted)
            }
        })
        tiles.addTo(this.map)
    }

    private isValidCoordinates(coordinates: string): boolean {
        if (coordinates != null) {
            const lat = parseFloat(coordinates.split(',')[0])
            const lon = parseFloat(coordinates.split(',')[1])
            const validCoordinates = (lat >= -90 && lat <= 90) && (lon >= -180 && lon <= 180)
            if (!validCoordinates) {
                return false
            }
            return true
        }
    }

    private mustZoomToMarker(): void {
        if (this.pickupPoints.length == 1) {
            const element = this.pickupPoints[0]
            if (element.coordinates) {
                const lat = parseFloat(element.coordinates.split(',')[0])
                const lon = parseFloat(element.coordinates.split(',')[1])
                this.zoomToMarker(lat, lon)
            }
        }
    }

    private zoomToMarker(lat: number, lon: number): void {
        this.map.setView(new L.LatLng(lat, lon), this.map.getMaxZoom())
    }

    //#endregion

}
