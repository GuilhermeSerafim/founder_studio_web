import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check } from 'lucide-react';
import getCroppedImg from '@/lib/cropImage';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleCropComplete = useCallback((croppedArea: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const saveCrop = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
      onCancel();
    }
  }, [croppedAreaPixels, imageSrc, onCropComplete, onCancel]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-foreground">Ajustar Foto</h3>
          <button onClick={onCancel} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper area */}
        <div className="relative w-full aspect-square bg-black/10">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controls */}
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-label="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={saveCrop}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Check className="w-4 h-4" /> Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
