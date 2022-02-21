import '../css/main.scss'
import { start } from './fn';

const AppView = () => {
    document.body.innerHTML = `
    <div class="header">
        <label for="fileSelector" class="fileSelector">
            Upload a photo
            <input type="file" id="fileSelector" accept="image/jpeg, image/png, image/gif" />
        </label>

        <label for="upload" class="fileSelector">
            Upload a config
            <input type="file" id="upload" accept="application/JSON" />
        </label>

        <div>
            Scale:
            <input type="range" id="zoomSlider" min="1" max="2" step="0.1" value="1" disabled />
        </div>

        <button id="download" class="button" disabled>Download</button>
    </div>

    <canvas id="editorCanvas" class="editorCanvas"></canvas>
    `;

    start();
}

AppView();
