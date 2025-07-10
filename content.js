// Pixel-Perfect Image Overlay Tool - Content Script
class PixelOverlayTool {
  constructor() {
    this.overlays = [];
    this.selectedOverlay = null;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.panel = null;
    this.isPanelMinimized = false;
    this.aspectLocked = true; // Default to locked aspect ratio
    
    this.init();
  }

  init() {
    this.createOverlayContainer();
    this.createControlPanel();
    this.loadState();
    this.bindEvents();
  }

  createOverlayContainer() {
    // Create container for all overlays
    this.overlayContainer = document.createElement('div');
    this.overlayContainer.id = 'pixel-overlay-container';
    this.overlayContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999;
    `;
    document.body.appendChild(this.overlayContainer);
  }

  createControlPanel() {
    // Create floating control panel
    this.panel = document.createElement('div');
    this.panel.id = 'pixel-overlay-panel';
    this.panel.innerHTML = `
      <div class="panel-header">
        <span class="panel-title">Pixel Overlay Tool</span>
        <div class="panel-controls">
          <button class="minimize-btn" title="Minimize">−</button>
          <button class="close-btn" title="Close">×</button>
        </div>
      </div>
      <div class="panel-content">
        <div class="upload-section">
          <input type="file" id="image-upload" multiple accept="image/*" style="display: none;">
          <button class="upload-btn">Upload Images</button>
          <div class="drag-drop-area">Drop images here</div>
        </div>
        
        <div class="overlay-list" id="overlay-list">
          <div class="no-overlays">No overlays added yet</div>
        </div>
        
        <div class="controls-section" id="controls-section" style="display: none;">
          <div class="control-group">
            <label>Opacity:</label>
            <input type="range" id="opacity-slider" min="0" max="100" value="100">
            <input type="number" id="opacity-input" min="0" max="100" value="100">
          </div>
          
          <div class="control-group">
            <label>Rotation:</label>
            <input type="number" id="rotation-input" min="0" max="360" value="0" step="1">
            <button id="rotate-left">↶</button>
            <button id="rotate-right">↷</button>
          </div>
          
          <div class="control-group">
            <label>Scale:</label>
            <input type="number" id="scale-input" min="0.1" max="10" value="1" step="0.1">
            <button id="scale-up">+</button>
            <button id="scale-down">−</button>
          </div>
          
          <div class="control-group">
            <label>Dimensions:</label>
            <div class="dimension-inputs">
              <div class="dimension-input">
                <span>W:</span>
                <input type="number" id="width-input" min="1" step="1">
              </div>
              <div class="dimension-input">
                <span>H:</span>
                <input type="number" id="height-input" min="1" step="1">
              </div>
              <button id="lock-aspect" title="Lock/Unlock Aspect Ratio">🔒</button>
            </div>
          </div>
          
          <div class="control-group">
            <label>Flip:</label>
            <button id="flip-horizontal">↔</button>
            <button id="flip-vertical">↕</button>
          </div>
          
          <div class="control-group">
            <label>Position:</label>
            <button id="move-left">←</button>
            <button id="move-up">↑</button>
            <button id="move-down">↓</button>
            <button id="move-right">→</button>
          </div>
          
          <div class="control-group">
            <button id="delete-overlay" class="delete-btn">Delete Selected</button>
          </div>
        </div>
        
        <div class="global-controls">
          <button id="reset-all">Reset All</button>
          <button id="help-btn">Help</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.panel);
    this.injectStyles();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #pixel-overlay-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 300px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        z-index: 1000000;
        pointer-events: auto;
      }
      
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        border-radius: 8px 8px 0 0;
        cursor: move;
      }
      
      .panel-title {
        font-weight: 600;
        color: #333;
      }
      
      .panel-controls button {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 4px;
      }
      
      .panel-controls button:hover {
        background: #e9ecef;
      }
      
      .panel-content {
        padding: 16px;
        max-height: 500px;
        overflow-y: auto;
      }
      
      .upload-section {
        margin-bottom: 16px;
      }
      
      .upload-btn {
        width: 100%;
        padding: 8px 12px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 8px;
      }
      
      .upload-btn:hover {
        background: #0056b3;
      }
      
      .drag-drop-area {
        border: 2px dashed #ccc;
        border-radius: 4px;
        padding: 20px;
        text-align: center;
        color: #666;
        background: #f8f9fa;
        transition: all 0.2s;
      }
      
      .drag-drop-area.dragover {
        border-color: #007bff;
        background: #e3f2fd;
      }
      
      .overlay-list {
        margin-bottom: 16px;
      }
      
      .overlay-item {
        display: flex;
        align-items: center;
        padding: 8px;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .overlay-item:hover {
        background: #f8f9fa;
      }
      
      .overlay-item.selected {
        border-color: #007bff;
        background: #e3f2fd;
      }
      
      .overlay-thumbnail {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 4px;
        margin-right: 8px;
      }
      
      .overlay-info {
        flex: 1;
      }
      
      .overlay-name {
        font-weight: 500;
        margin-bottom: 2px;
      }
      
      .overlay-size {
        font-size: 12px;
        color: #666;
      }
      
      .control-group {
        margin-bottom: 12px;
      }
      
      .control-group label {
        display: block;
        margin-bottom: 4px;
        font-weight: 500;
      }
      
      .control-group input[type="range"] {
        width: 100%;
        margin-bottom: 4px;
      }
      
      .control-group input[type="number"] {
        width: 60px;
        padding: 4px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      
      .control-group button {
        padding: 4px 8px;
        margin: 2px;
        background: #f8f9fa;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .control-group button:hover {
        background: #e9ecef;
      }
      
      .delete-btn {
        background: #dc3545 !important;
        color: white !important;
        border-color: #dc3545 !important;
      }
      
      .delete-btn:hover {
        background: #c82333 !important;
      }
      
      .global-controls {
        display: flex;
        gap: 8px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e9ecef;
      }
      
      .global-controls button {
        flex: 1;
        padding: 8px 12px;
        background: #6c757d;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      .global-controls button:hover {
        background: #5a6268;
      }
      
      .no-overlays {
        text-align: center;
        color: #666;
        font-style: italic;
        padding: 20px;
      }
      
      .minimized .panel-content {
        display: none;
      }
      
      .minimized {
        width: auto;
        min-width: 200px;
      }
    `;
    document.head.appendChild(style);
  }

  bindEvents() {
    // Panel controls
    this.panel.querySelector('.minimize-btn').addEventListener('click', () => this.toggleMinimize());
    this.panel.querySelector('.close-btn').addEventListener('click', () => this.closePanel());
    
    // Upload
    this.panel.querySelector('.upload-btn').addEventListener('click', () => {
      this.panel.querySelector('#image-upload').click();
    });
    
    this.panel.querySelector('#image-upload').addEventListener('change', (e) => {
      this.handleFileUpload(e.target.files);
    });
    
    // Drag and drop
    const dragArea = this.panel.querySelector('.drag-drop-area');
    dragArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      dragArea.classList.add('dragover');
    });
    
    dragArea.addEventListener('dragleave', () => {
      dragArea.classList.remove('dragover');
    });
    
    dragArea.addEventListener('drop', (e) => {
      e.preventDefault();
      dragArea.classList.remove('dragover');
      this.handleFileUpload(e.dataTransfer.files);
    });
    
    // Controls
    this.panel.querySelector('#opacity-slider').addEventListener('input', (e) => {
      this.updateOpacity(parseInt(e.target.value));
    });
    
    this.panel.querySelector('#opacity-input').addEventListener('input', (e) => {
      this.updateOpacity(parseInt(e.target.value));
    });
    
    this.panel.querySelector('#rotation-input').addEventListener('input', (e) => {
      this.updateRotation(parseInt(e.target.value));
    });
    
    this.panel.querySelector('#rotate-left').addEventListener('click', () => {
      this.rotate(-90);
    });
    
    this.panel.querySelector('#rotate-right').addEventListener('click', () => {
      this.rotate(90);
    });
    
    this.panel.querySelector('#flip-horizontal').addEventListener('click', () => {
      this.flip('horizontal');
    });
    
    this.panel.querySelector('#flip-vertical').addEventListener('click', () => {
      this.flip('vertical');
    });
    
    // Scale controls
    this.panel.querySelector('#scale-input').addEventListener('input', (e) => {
      this.updateScale(parseFloat(e.target.value));
    });
    
    this.panel.querySelector('#scale-up').addEventListener('click', () => {
      this.scale(0.1);
    });
    
    this.panel.querySelector('#scale-down').addEventListener('click', () => {
      this.scale(-0.1);
    });
    
    // Dimension controls
    this.panel.querySelector('#width-input').addEventListener('input', (e) => {
      this.updateWidth(parseInt(e.target.value));
    });
    
    this.panel.querySelector('#height-input').addEventListener('input', (e) => {
      this.updateHeight(parseInt(e.target.value));
    });
    
    this.panel.querySelector('#lock-aspect').addEventListener('click', () => {
      this.toggleAspectLock();
    });
    
    // Movement
    this.panel.querySelector('#move-left').addEventListener('click', () => {
      this.moveOverlay(-1, 0);
    });
    
    this.panel.querySelector('#move-up').addEventListener('click', () => {
      this.moveOverlay(0, -1);
    });
    
    this.panel.querySelector('#move-down').addEventListener('click', () => {
      this.moveOverlay(0, 1);
    });
    
    this.panel.querySelector('#move-right').addEventListener('click', () => {
      this.moveOverlay(1, 0);
    });
    
    this.panel.querySelector('#delete-overlay').addEventListener('click', () => {
      this.deleteSelectedOverlay();
    });
    
    this.panel.querySelector('#reset-all').addEventListener('click', () => {
      this.resetAll();
    });
    
    this.panel.querySelector('#help-btn').addEventListener('click', () => {
      this.showHelp();
    });
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (this.selectedOverlay) {
        const shift = e.shiftKey ? 10 : 1;
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            this.moveOverlay(-shift, 0);
            break;
          case 'ArrowRight':
            e.preventDefault();
            this.moveOverlay(shift, 0);
            break;
          case 'ArrowUp':
            e.preventDefault();
            this.moveOverlay(0, -shift);
            break;
          case 'ArrowDown':
            e.preventDefault();
            this.moveOverlay(0, shift);
            break;
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            this.deleteSelectedOverlay();
            break;
          case '+':
          case '=':
            e.preventDefault();
            this.scale(0.1);
            break;
          case '-':
            e.preventDefault();
            this.scale(-0.1);
            break;
        }
      }
    });
    
    // Panel dragging
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    
    this.panel.querySelector('.panel-header').addEventListener('mousedown', (e) => {
      if (e.target.closest('.panel-controls')) return;
      
      isDragging = true;
      dragStart = {
        x: e.clientX - this.panel.offsetLeft,
        y: e.clientY - this.panel.offsetTop
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      this.panel.style.left = (e.clientX - dragStart.x) + 'px';
      this.panel.style.top = (e.clientY - dragStart.y) + 'px';
    };
    
    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }

  handleFileUpload(files) {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.addOverlay(e.target.result, file.name);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  addOverlay(src, name) {
    const overlay = {
      id: Date.now() + Math.random(),
      src,
      name,
      element: null,
      x: 100,
      y: 100,
      opacity: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      scale: 1,
      originalWidth: 0,
      originalHeight: 0,
      aspectRatio: 1,
      isDragging: false,
      dragOffset: { x: 0, y: 0 }
    };
    
    this.createOverlayElement(overlay);
    this.overlays.push(overlay);
    this.selectOverlay(overlay);
    this.updateOverlayList();
    this.saveState();
  }

  createOverlayElement(overlay) {
    const img = document.createElement('img');
    img.src = overlay.src;
    img.draggable = false; // Prevent default browser drag behavior
    img.style.cssText = `
      position: absolute;
      left: ${overlay.x}px;
      top: ${overlay.y}px;
      opacity: ${overlay.opacity / 100};
      transform: rotate(${overlay.rotation}deg) scale(${overlay.scaleX}, ${overlay.scaleY});
      pointer-events: auto;
      cursor: move;
      max-width: 80vw;
      max-height: 80vh;
      z-index: 1000000;
      -webkit-user-drag: none;
      -khtml-user-drag: none;
      -moz-user-drag: none;
      -o-user-drag: none;
      user-drag: none;
    `;
    
    // Make draggable
    img.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent default drag behavior
      e.stopPropagation();
      
      this.selectOverlay(overlay);
      overlay.isDragging = true;
      overlay.dragOffset = {
        x: e.clientX - overlay.x,
        y: e.clientY - overlay.y
      };
      
      const handleMouseMove = (e) => {
        e.preventDefault(); // Prevent default drag behavior
        if (overlay.isDragging) {
          overlay.x = e.clientX - overlay.dragOffset.x;
          overlay.y = e.clientY - overlay.dragOffset.y;
          img.style.left = overlay.x + 'px';
          img.style.top = overlay.y + 'px';
        }
      };
      
      const handleMouseUp = (e) => {
        e.preventDefault(); // Prevent default drag behavior
        overlay.isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        this.saveState();
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectOverlay(overlay);
    });
    
    // Prevent default drag events
    img.addEventListener('dragstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
    
    img.addEventListener('drag', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
    
    img.addEventListener('dragend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
    
    // Get original dimensions when image loads
    img.onload = () => {
      overlay.originalWidth = img.naturalWidth;
      overlay.originalHeight = img.naturalHeight;
      overlay.aspectRatio = overlay.originalWidth / overlay.originalHeight;
      
      // Update dimension inputs if this overlay is selected
      if (this.selectedOverlay === overlay) {
        this.updateDimensionInputs();
      }
    };
    
    overlay.element = img;
    this.overlayContainer.appendChild(img);
  }

  selectOverlay(overlay) {
    this.selectedOverlay = overlay;
    this.updateControls();
    this.updateOverlayList();
  }

  updateControls() {
    const controlsSection = this.panel.querySelector('#controls-section');
    
    if (this.selectedOverlay) {
      controlsSection.style.display = 'block';
      
      this.panel.querySelector('#opacity-slider').value = this.selectedOverlay.opacity;
      this.panel.querySelector('#opacity-input').value = this.selectedOverlay.opacity;
      this.panel.querySelector('#rotation-input').value = this.selectedOverlay.rotation;
      this.panel.querySelector('#scale-input').value = this.selectedOverlay.scale;
      
      // Update dimension inputs
      this.updateDimensionInputs();
      
      // Update lock button state
      const lockBtn = this.panel.querySelector('#lock-aspect');
      lockBtn.textContent = this.aspectLocked ? '🔒' : '🔓';
      lockBtn.title = this.aspectLocked ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked';
    } else {
      controlsSection.style.display = 'none';
    }
  }

  updateOverlayList() {
    const overlayList = this.panel.querySelector('#overlay-list');
    const noOverlays = this.panel.querySelector('.no-overlays');
    
    if (this.overlays.length === 0) {
      overlayList.innerHTML = '<div class="no-overlays">No overlays added yet</div>';
      return;
    }
    
    overlayList.innerHTML = this.overlays.map(overlay => `
      <div class="overlay-item ${overlay === this.selectedOverlay ? 'selected' : ''}" 
           data-id="${overlay.id}">
        <img src="${overlay.src}" class="overlay-thumbnail" alt="${overlay.name}">
        <div class="overlay-info">
          <div class="overlay-name">${overlay.name}</div>
          <div class="overlay-size">${overlay.x}px, ${overlay.y}px</div>
        </div>
      </div>
    `).join('');
    
    // Add click handlers
    overlayList.querySelectorAll('.overlay-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        this.selectOverlay(this.overlays[index]);
      });
    });
  }

  updateOpacity(value) {
    if (!this.selectedOverlay) return;
    
    this.selectedOverlay.opacity = Math.max(0, Math.min(100, value));
    this.selectedOverlay.element.style.opacity = this.selectedOverlay.opacity / 100;
    
    this.panel.querySelector('#opacity-slider').value = this.selectedOverlay.opacity;
    this.panel.querySelector('#opacity-input').value = this.selectedOverlay.opacity;
    
    this.saveState();
  }

  updateRotation(value) {
    if (!this.selectedOverlay) return;
    
    this.selectedOverlay.rotation = value;
    this.updateTransform();
    this.saveState();
  }

  rotate(degrees) {
    if (!this.selectedOverlay) return;
    
    this.selectedOverlay.rotation += degrees;
    this.selectedOverlay.rotation = this.selectedOverlay.rotation % 360;
    if (this.selectedOverlay.rotation < 0) this.selectedOverlay.rotation += 360;
    
    this.panel.querySelector('#rotation-input').value = this.selectedOverlay.rotation;
    this.updateTransform();
    this.saveState();
  }

  flip(direction) {
    if (!this.selectedOverlay) return;
    
    if (direction === 'horizontal') {
      this.selectedOverlay.scaleX *= -1;
    } else {
      this.selectedOverlay.scaleY *= -1;
    }
    
    this.updateTransform();
    this.saveState();
  }

  updateScale(value) {
    if (!this.selectedOverlay) return;
    
    this.selectedOverlay.scale = Math.max(0.1, Math.min(10, value));
    this.panel.querySelector('#scale-input').value = this.selectedOverlay.scale;
    this.updateTransform();
    this.saveState();
  }

  scale(delta) {
    if (!this.selectedOverlay) return;
    
    this.selectedOverlay.scale += delta;
    this.selectedOverlay.scale = Math.max(0.1, Math.min(10, this.selectedOverlay.scale));
    this.panel.querySelector('#scale-input').value = this.selectedOverlay.scale;
    this.updateTransform();
    this.saveState();
  }

  updateDimensionInputs() {
    if (!this.selectedOverlay || !this.selectedOverlay.originalWidth) return;
    
    const currentWidth = Math.round(this.selectedOverlay.originalWidth * this.selectedOverlay.scale);
    const currentHeight = Math.round(this.selectedOverlay.originalHeight * this.selectedOverlay.scale);
    
    this.panel.querySelector('#width-input').value = currentWidth;
    this.panel.querySelector('#height-input').value = currentHeight;
  }

  updateWidth(newWidth) {
    if (!this.selectedOverlay || !this.selectedOverlay.originalWidth) return;
    
    if (this.aspectLocked) {
      // Maintain aspect ratio
      const newHeight = Math.round(newWidth / this.selectedOverlay.aspectRatio);
      this.selectedOverlay.scale = newWidth / this.selectedOverlay.originalWidth;
      this.panel.querySelector('#height-input').value = newHeight;
    } else {
      // Independent scaling
      this.selectedOverlay.scale = newWidth / this.selectedOverlay.originalWidth;
    }
    
    this.panel.querySelector('#scale-input').value = this.selectedOverlay.scale;
    this.updateTransform();
    this.saveState();
  }

  updateHeight(newHeight) {
    if (!this.selectedOverlay || !this.selectedOverlay.originalHeight) return;
    
    if (this.aspectLocked) {
      // Maintain aspect ratio
      const newWidth = Math.round(newHeight * this.selectedOverlay.aspectRatio);
      this.selectedOverlay.scale = newHeight / this.selectedOverlay.originalHeight;
      this.panel.querySelector('#width-input').value = newWidth;
    } else {
      // Independent scaling
      this.selectedOverlay.scale = newHeight / this.selectedOverlay.originalHeight;
    }
    
    this.panel.querySelector('#scale-input').value = this.selectedOverlay.scale;
    this.updateTransform();
    this.saveState();
  }

  toggleAspectLock() {
    this.aspectLocked = !this.aspectLocked;
    const lockBtn = this.panel.querySelector('#lock-aspect');
    lockBtn.textContent = this.aspectLocked ? '🔒' : '🔓';
    lockBtn.title = this.aspectLocked ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked';
  }

  updateTransform() {
    if (!this.selectedOverlay) return;
    
    const transform = `rotate(${this.selectedOverlay.rotation}deg) scale(${this.selectedOverlay.scaleX * this.selectedOverlay.scale}, ${this.selectedOverlay.scaleY * this.selectedOverlay.scale})`;
    this.selectedOverlay.element.style.transform = transform;
  }

  moveOverlay(dx, dy) {
    if (!this.selectedOverlay) return;
    
    this.selectedOverlay.x += dx;
    this.selectedOverlay.y += dy;
    
    this.selectedOverlay.element.style.left = this.selectedOverlay.x + 'px';
    this.selectedOverlay.element.style.top = this.selectedOverlay.y + 'px';
    
    this.updateOverlayList();
    this.saveState();
  }

  deleteSelectedOverlay() {
    if (!this.selectedOverlay) return;
    
    const index = this.overlays.indexOf(this.selectedOverlay);
    if (index > -1) {
      this.overlays.splice(index, 1);
      this.selectedOverlay.element.remove();
      this.selectedOverlay = null;
      this.updateControls();
      this.updateOverlayList();
      this.saveState();
    }
  }

  resetAll() {
    if (confirm('Are you sure you want to remove all overlays?')) {
      this.overlays.forEach(overlay => overlay.element.remove());
      this.overlays = [];
      this.selectedOverlay = null;
      this.updateControls();
      this.updateOverlayList();
      this.saveState();
    }
  }

  toggleMinimize() {
    this.isPanelMinimized = !this.isPanelMinimized;
    this.panel.classList.toggle('minimized', this.isPanelMinimized);
    this.saveState();
  }

  closePanel() {
    this.panel.style.display = 'none';
    // Clear storage for this page when closing
    const storageKey = `pixelOverlayState_${window.location.hostname}${window.location.pathname}`;
    chrome.storage.local.remove([storageKey]);
  }

  showHelp() {
    alert(`Pixel-Perfect Image Overlay Tool

Controls:
• Upload images via button or drag & drop
• Click on overlays to select them
• Drag overlays to reposition
• Use arrow keys to nudge selected overlay (Shift + arrow for 10px)
• Adjust opacity with slider or input
• Rotate with buttons or input field
• Scale with input field or +/- buttons
• Flip horizontally/vertically
• Delete selected overlay with Delete/Backspace key

Keyboard Shortcuts:
• Arrow keys: Move overlay (Shift + arrow for 10px)
• +/- keys: Scale overlay up/down
• Delete/Backspace: Delete selected overlay

The panel can be minimized and repositioned.`);
  }

  destroy() {
    // Remove all overlays
    this.overlays.forEach(overlay => {
      if (overlay.element) {
        overlay.element.remove();
      }
    });
    
    // Remove panel
    if (this.panel) {
      this.panel.remove();
    }
    
    // Remove overlay container
    if (this.overlayContainer) {
      this.overlayContainer.remove();
    }
    
    // Clear arrays
    this.overlays = [];
    this.selectedOverlay = null;
    
    // Clear storage for this page
    const storageKey = `pixelOverlayState_${window.location.hostname}${window.location.pathname}`;
    chrome.storage.local.remove([storageKey]);
  }

  saveState() {
    const state = {
      overlays: this.overlays.map(overlay => ({
        id: overlay.id,
        src: overlay.src,
        name: overlay.name,
        x: overlay.x,
        y: overlay.y,
        opacity: overlay.opacity,
        rotation: overlay.rotation,
        scaleX: overlay.scaleX,
        scaleY: overlay.scaleY,
        scale: overlay.scale,
        originalWidth: overlay.originalWidth,
        originalHeight: overlay.originalHeight,
        aspectRatio: overlay.aspectRatio
      })),
      selectedOverlayId: this.selectedOverlay?.id,
      isPanelMinimized: this.isPanelMinimized,
      aspectLocked: this.aspectLocked,
      panelPosition: {
        left: this.panel.style.left,
        top: this.panel.style.top
      }
    };
    
    // Save state per page using URL as key
    const storageKey = `pixelOverlayState_${window.location.hostname}${window.location.pathname}`;
    chrome.storage.local.set({ [storageKey]: state });
  }

  loadState() {
    // Load state per page using URL as key
    const storageKey = `pixelOverlayState_${window.location.hostname}${window.location.pathname}`;
    chrome.storage.local.get([storageKey], (result) => {
      if (result[storageKey]) {
        const state = result[storageKey];
        
        // Restore overlays
        state.overlays.forEach(overlayData => {
          const overlay = {
            ...overlayData,
            scale: overlayData.scale || 1, // Default to 1 if not saved
            originalWidth: overlayData.originalWidth || 0,
            originalHeight: overlayData.originalHeight || 0,
            aspectRatio: overlayData.aspectRatio || 1,
            element: null,
            isDragging: false,
            dragOffset: { x: 0, y: 0 }
          };
          this.createOverlayElement(overlay);
          this.overlays.push(overlay);
        });
        
        // Restore selection
        if (state.selectedOverlayId) {
          this.selectedOverlay = this.overlays.find(o => o.id === state.selectedOverlayId);
        }
        
        // Restore panel state
        if (state.isPanelMinimized) {
          this.isPanelMinimized = true;
          this.panel.classList.add('minimized');
        }
        
        // Restore aspect lock state
        if (state.aspectLocked !== undefined) {
          this.aspectLocked = state.aspectLocked;
        }
        
        if (state.panelPosition.left && state.panelPosition.top) {
          this.panel.style.left = state.panelPosition.left;
          this.panel.style.top = state.panelPosition.top;
        }
        
        this.updateControls();
        this.updateOverlayList();
      }
    });
  }
}

// Initialize the tool when the page loads
let pixelOverlayTool = null;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    pixelOverlayTool = new PixelOverlayTool();
  });
} else {
  pixelOverlayTool = new PixelOverlayTool();
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkStatus') {
    sendResponse({ isActive: pixelOverlayTool !== null });
  } else if (request.action === 'deactivate') {
    if (pixelOverlayTool) {
      pixelOverlayTool.destroy();
      pixelOverlayTool = null;
    }
    sendResponse({ success: true });
  }
}); 