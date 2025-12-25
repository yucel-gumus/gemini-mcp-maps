import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import * as L from 'leaflet';
import type { MapParams, GeocodingResult } from '../../types';
import { MAP_CONFIG } from '../../constants/config';
import { searchLocation } from '../../services/geocoding.service';

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
            this.map = L.map(mapElement as HTMLElement).setView(
                MAP_CONFIG.defaultCenter,
                MAP_CONFIG.defaultZoom
            );
            L.tileLayer(MAP_CONFIG.tileUrl, {
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

        this.flyToLocation(result, params.location);
        return { success: true };
    }

    private flyToLocation(result: GeocodingResult, originalName: string) {
        if (!this.map) return;

        this.map.setView([result.lat, result.lon], 13);
        L.marker([result.lat, result.lon])
            .bindPopup(`<b>${originalName}</b><br/>${result.displayName}`)
            .addTo(this.markerLayer);
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
