// Image helper utilities for Pixel-Perfect Image Overlay Tool

class ImageHelpers {
  /**
   * Get image dimensions from a data URL or file
   * @param {string|File} source - Image data URL or File object
   * @returns {Promise<{width: number, height: number}>}
   */
  static getImageDimensions(source) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      if (typeof source === 'string') {
        img.src = source;
      } else if (source instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.readAsDataURL(source);
      } else {
        reject(new Error('Invalid image source'));
      }
    });
  }

  /**
   * Convert file to data URL
   * @param {File} file - File object
   * @returns {Promise<string>}
   */
  static fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File is not an image'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate image file
   * @param {File} file - File object to validate
   * @returns {boolean}
   */
  static isValidImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    return validTypes.includes(file.type) && file.size <= maxSize;
  }

  /**
   * Generate a unique filename
   * @param {string} originalName - Original filename
   * @returns {string}
   */
  static generateUniqueName(originalName) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    
    return `${nameWithoutExt}_${timestamp}_${random}.${extension}`;
  }

  /**
   * Calculate aspect ratio
   * @param {number} width - Image width
   * @param {number} height - Image height
   * @returns {number}
   */
  static getAspectRatio(width, height) {
    return width / height;
  }

  /**
   * Calculate scaled dimensions while maintaining aspect ratio
   * @param {number} originalWidth - Original width
   * @param {number} originalHeight - Original height
   * @param {number} maxWidth - Maximum allowed width
   * @param {number} maxHeight - Maximum allowed height
   * @returns {{width: number, height: number}}
   */
  static getScaledDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
    const aspectRatio = this.getAspectRatio(originalWidth, originalHeight);
    
    let scaledWidth = originalWidth;
    let scaledHeight = originalHeight;
    
    if (scaledWidth > maxWidth) {
      scaledWidth = maxWidth;
      scaledHeight = scaledWidth / aspectRatio;
    }
    
    if (scaledHeight > maxHeight) {
      scaledHeight = maxHeight;
      scaledWidth = scaledHeight * aspectRatio;
    }
    
    return {
      width: Math.round(scaledWidth),
      height: Math.round(scaledHeight)
    };
  }

  /**
   * Format file size in human readable format
   * @param {number} bytes - Size in bytes
   * @returns {string}
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Create a thumbnail from an image
   * @param {string} dataURL - Image data URL
   * @param {number} maxWidth - Maximum thumbnail width
   * @param {number} maxHeight - Maximum thumbnail height
   * @returns {Promise<string>}
   */
  static createThumbnail(dataURL, maxWidth = 100, maxHeight = 100) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const scaled = this.getScaledDimensions(
          img.naturalWidth,
          img.naturalHeight,
          maxWidth,
          maxHeight
        );
        
        canvas.width = scaled.width;
        canvas.height = scaled.height;
        
        ctx.drawImage(img, 0, 0, scaled.width, scaled.height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for thumbnail'));
      };
      
      img.src = dataURL;
    });
  }

  /**
   * Check if two images are the same
   * @param {string} dataURL1 - First image data URL
   * @param {string} dataURL2 - Second image data URL
   * @returns {Promise<boolean>}
   */
  static async areImagesSame(dataURL1, dataURL2) {
    try {
      const [dim1, dim2] = await Promise.all([
        this.getImageDimensions(dataURL1),
        this.getImageDimensions(dataURL2)
      ]);
      
      return dim1.width === dim2.width && dim1.height === dim2.height;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get image metadata
   * @param {File} file - Image file
   * @returns {Promise<Object>}
   */
  static async getImageMetadata(file) {
    const dimensions = await this.getImageDimensions(file);
    const dataURL = await this.fileToDataURL(file);
    
    return {
      name: file.name,
      size: file.size,
      sizeFormatted: this.formatFileSize(file.size),
      type: file.type,
      width: dimensions.width,
      height: dimensions.height,
      aspectRatio: this.getAspectRatio(dimensions.width, dimensions.height),
      dataURL: dataURL,
      lastModified: file.lastModified
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageHelpers;
} else if (typeof window !== 'undefined') {
  window.ImageHelpers = ImageHelpers;
} 