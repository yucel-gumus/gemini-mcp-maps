import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import * as L from 'leaflet';
import type { MapParams, GeocodingResult } from '../../types';
import { MAP_CONFIG } from '../../constants/config';
import { searchLocation } from '../../services/geocoding.service';
import { getLocationMediaDetails } from '../../services/image.service';

const CUSTOM_PIN_ICON = L.divIcon({
    className: 'custom-pin-wrapper',
    html: `<div class="custom-map-pin"><div class="pin-body"><div class="pin-inner-dot"></div></div></div>`,
    iconSize: MAP_CONFIG.markerSize,
    iconAnchor: MAP_CONFIG.markerAnchor,
    popupAnchor: MAP_CONFIG.popupAnchor
});

@customElement('map-container')
export class MapContainer extends LitElement {
    private map?: L.Map;
    private markerLayer: L.LayerGroup = new L.LayerGroup();

    @state() private lastError: string | null = null;

    createRenderRoot() {
        return this;
    }

    firstUpdated() {
        this.initializeMap();
    }

    private initializeMap() {
        const mapElement = this.querySelector('#map');
        if (mapElement && !this.map) {
            this.map = L.map(mapElement as HTMLElement, {
                minZoom: MAP_CONFIG.minZoom,
                maxZoom: MAP_CONFIG.maxZoom,
            }).setView(
                MAP_CONFIG.defaultCenter,
                MAP_CONFIG.defaultZoom
            );

            L.tileLayer(MAP_CONFIG.tileUrl, {
                minZoom: MAP_CONFIG.minZoom,
                maxZoom: MAP_CONFIG.maxZoom,
                attribution: MAP_CONFIG.attribution,
            }).addTo(this.map);

            this.markerLayer.addTo(this.map);
        }
    }

    async handleMapQuery(params: MapParams): Promise<{ success: boolean; error?: string }> {
        if (!this.map) {
            this.initializeMap();
        }

        this.markerLayer.clearLayers();
        this.lastError = null;

        if (!params.location) {
            return { success: false, error: 'Bu işlem henüz desteklenmiyor.' };
        }

        const result = await searchLocation(params.location);

        if (!result) {
            this.lastError = `"${params.location}" konumunu bulamadım.`;
            return { success: false, error: this.lastError };
        }

        await this.flyToLocation(result, params.location);
        return { success: true };
    }

    private async flyToLocation(result: GeocodingResult, originalName: string) {
        if (!this.map) return;

        this.map.flyTo([result.lat, result.lon], MAP_CONFIG.targetZoom, {
            duration: MAP_CONFIG.flyToDuration
        });

        // Fetch location photo & summary details
        const media = await getLocationMediaDetails(originalName);

        const popupContent = `
            <div class="popup-card">
                ${media.imageUrl ? `<img src="${media.imageUrl}" alt="${originalName}" class="popup-card-image" />` : ''}
                <div class="popup-card-title">${originalName}</div>
                <div class="popup-card-address">${result.displayName}</div>
                ${media.description ? `<div class="popup-card-desc">${media.description}</div>` : ''}
            </div>
        `;

        L.marker([result.lat, result.lon], { icon: CUSTOM_PIN_ICON })
            .bindPopup(popupContent, { closeButton: false })
            .addTo(this.markerLayer)
            .openPopup();
    }

    render() {
        return html`<div id="map" class="main-container"></div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'map-container': MapContainer;
    }
}
