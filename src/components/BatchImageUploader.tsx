import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, XCircle, Download, Trash2, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { processImage, type ProcessedImage } from '../services/imageProcessor';
import { getCredits, deductCredits, addProcessedImage } from '../services/storageService';

interface ImageItem {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: ProcessedImage;
  error?: string;
}

export default function BatchImageUploader() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [credits, setCredits] = useState(() => getCredits());

  const refreshCredits = () => {
    setCredits(getCredits());
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: ImageItem[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending' as const,
    }));
    
    setImages(prev => [...prev, ...newImages]);
    toast.success(`${acceptedFiles.length} image(s) added`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    disabled: processing,
  });

  const processAll = async () => {
    const pendingImages = images.filter(img => img.status === 'pending');
    
    if (pendingImages.length === 0) {
      toast.error('No pending images to process');
      return;
    }

    if (credits < pendingImages.length) {
      toast.error(`Insufficient credits. Need ${pendingImages.length}, have ${credits}`);
      return;
    }

    setProcessing(true);
    let processedCount = 0;

    for (const image of pendingImages) {
      // Update status to processing
      setImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, status: 'processing' as const } : img
      ));

      try {
        const result = await processImage(image.file);
        
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: 'completed' as const, result } : img
        ));
        
        // Deduct credit and save to history
        if (deductCredits(1)) {
          addProcessedImage(image.file.name, 1);
          processedCount++;
        }
      } catch (error) {
        console.error('Processing error:', error);
        setImages(prev => prev.map(img => 
          img.id === image.id ? { 
            ...img, 
            status: 'failed' as const, 
            error: 'Processing failed' 
          } : img
        ));
      }
    }

    refreshCredits();
    setProcessing(false);
    toast.success(`${processedCount} image(s) processed successfully!`);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const downloadImage = (image: ImageItem) => {
    if (!image.result) return;

    const link = document.createElement('a');
    link.href = image.result.processedUrl;
    link.download = `amazon-ready-${image.file.name}`;
    link.click();
    
    toast.success('Image downloaded!');
  };

  const downloadAll = () => {
    const completed = images.filter(img => img.status === 'completed' && img.result);
    
    completed.forEach((image, index) => {
      setTimeout(() => {
        downloadImage(image);
      }, index * 100);
    });
  };

  const clearAll = () => {
    setImages([]);
    toast.success('All images cleared');
  };

  const pendingCount = images.filter(img => img.status === 'pending').length;
  const completedCount = images.filter(img => img.status === 'completed').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Credits Display */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500">Credits remaining: </span>
          <span className="text-lg font-bold text-green-600">{credits}</span>
        </div>
        {images.length > 0 && (
          <div className="flex gap-2">
            {completedCount > 0 && (
              <button
                onClick={downloadAll}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download All ({completedCount})
              </button>
            )}
            <button
              onClick={clearAll}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${processing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-lg text-blue-600">Drop images here...</p>
        ) : (
          <>
            <p className="text-lg text-gray-700 mb-2">
              Drop product images here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG, WEBP up to 10MB each • Upload multiple images
            </p>
          </>
        )}
      </div>

      {/* Process Button */}
      {pendingCount > 0 && (
        <button
          onClick={processAll}
          disabled={processing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Processing {pendingCount} image(s)...
            </>
          ) : (
            <>
              Process {pendingCount} Image(s)
            </>
          )}
        </button>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(image => (
            <ImageCard
              key={image.id}
              image={image}
              onRemove={() => removeImage(image.id)}
              onDownload={() => downloadImage(image)}
            />
          ))}
        </div>
      )}
    </div>
  );
}


interface ImageCardProps {
  image: ImageItem;
  onRemove: () => void;
  onDownload: () => void;
}

function ImageCard({ image, onRemove, onDownload }: ImageCardProps) {
  const previewUrl = image.result?.processedUrl || URL.createObjectURL(image.file);

  return (
    <div className="relative group bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={previewUrl}
        alt={image.file.name}
        className="w-full h-48 object-cover"
      />
      
      {/* Status Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {image.status === 'pending' && (
          <button
            onClick={onRemove}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
        {image.status === 'processing' && (
          <Loader className="w-8 h-8 text-white animate-spin" />
        )}
        {image.status === 'completed' && (
          <button
            onClick={onDownload}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
        {image.status === 'failed' && (
          <XCircle className="w-8 h-8 text-red-400" />
        )}
      </div>

      {/* Status Badge */}
      <div className="absolute top-2 right-2">
        {image.status === 'completed' && (
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Done
          </div>
        )}
        {image.status === 'processing' && (
          <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Loader className="w-3 h-3 animate-spin" />
            Processing
          </div>
        )}
        {image.status === 'failed' && (
          <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Failed
          </div>
        )}
      </div>

      {/* File Name */}
      <div className="p-2 bg-white">
        <p className="text-xs text-gray-600 truncate">{image.file.name}</p>
      </div>
    </div>
  );
}
