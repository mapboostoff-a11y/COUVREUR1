import React, { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../lib/image-utils';
import { cn } from '../../lib/utils';
import { Image as ImageIcon, Upload, X, Check, Crop as CropIcon, RotateCcw } from 'lucide-react';

interface EditableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onUpdate?: (src: string) => void;
  isEditing?: boolean;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  className,
  onUpdate,
  isEditing,
  ...props
}) => {
  const [showModal, setShowModal] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(src);
  const [isCropping, setIsCropping] = useState(false);
  
  // Crop state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result as string);
        setIsCropping(true); // Automatically start cropping for new images
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleApplyCrop = async () => {
    if (previewSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(
          previewSrc,
          croppedAreaPixels
        );
        setPreviewSrc(croppedImage);
        setIsCropping(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSave = () => {
    if (onUpdate && previewSrc) {
      onUpdate(previewSrc);
    }
    setShowModal(false);
  };

  const handleCancel = () => {
    setPreviewSrc(src || '');
    setIsCropping(false);
    setShowModal(false);
  };

  if (!isEditing) {
    return <img src={src} alt={alt} className={className} {...props} />;
  }

  return (
    <>
      <div 
        className={cn("relative group cursor-pointer", className)}
        onClick={(e) => {
          e.preventDefault();
          setShowModal(true);
        }}
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" {...props} />
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border-2 border-primary border-dashed">
          <div className="bg-background p-2 rounded-full shadow-lg">
            <ImageIcon size={20} className="text-primary" />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.stopPropagation()}>
          <div className="bg-background rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border flex justify-between items-center shrink-0">
              <h3 className="font-semibold text-foreground">Edit Image</h3>
              <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative border border-border">
                {previewSrc ? (
                  isCropping ? (
                    <div className="absolute inset-0">
                      <Cropper
                        image={previewSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={16 / 9}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                      />
                    </div>
                  ) : (
                    <img src={previewSrc} alt="Preview" className="w-full h-full object-contain" />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon size={48} className="mb-2" />
                    <span>No Image</span>
                  </div>
                )}
              </div>

              {isCropping && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Zoom</span>
                    <span>{(zoom * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              )}

              {!isCropping && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
                    <input
                      type="text"
                      value={previewSrc || ''}
                      onChange={(e) => setPreviewSrc(e.target.value)}
                      className="w-full rounded-lg border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-background text-muted-foreground">Or upload</span>
                    </div>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-4 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload size={18} />
                    <span>Choose file...</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-muted/50 border-t border-border flex justify-between gap-3 shrink-0">
               <div>
                 {previewSrc && !isCropping && (
                    <button
                      onClick={() => setIsCropping(true)}
                      className="px-4 py-2 text-primary font-medium hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <CropIcon size={18} />
                      Crop
                    </button>
                 )}
                 {isCropping && (
                    <button
                      onClick={() => setIsCropping(false)}
                      className="px-4 py-2 text-muted-foreground font-medium hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                    >
                      <RotateCcw size={18} />
                      Cancel Crop
                    </button>
                 )}
               </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-foreground font-medium hover:bg-muted rounded-lg transition-colors"
                >
                  Cancel
                </button>
                {isCropping ? (
                  <button
                    onClick={handleApplyCrop}
                    className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Check size={18} />
                    Apply Crop
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Check size={18} />
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
