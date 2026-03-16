import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, XCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { processImage, type ProcessedImage } from '../services/imageProcessor';

export default function ImageUploader() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedImage | null>(null);
  const [credits, setCredits] = useState(() => {
    // Temporary localStorage solution (will be replaced with Supabase)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('credits');
      return stored ? parseInt(stored) : 20;
    }
    return 20;
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Check credits
    if (credits <= 0) {
      toast.error('No credits left. Please upgrade to continue.');
      return;
    }

    // Check file size
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const processed = await processImage(file);
      setResult(processed);
      
      // Deduct credit
      const newCredits = credits - 1;
      setCredits(newCredits);
      localStorage.setItem('credits', newCredits.toString());
      
      toast.success('Image processed successfully!');
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setProcessing(false);
    }
  }, [credits]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    disabled: processing || credits <= 0,
  });

  const handleDownload = () => {
    if (!result) return;

    const link = document.createElement('a');
    link.href = result.processedUrl;
    link.download = 'amazon-ready.jpg';
    link.click();
    
    toast.success('Image downloaded!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Credits Display */}
      <div className="text-right mb-4">
        <span className="text-sm text-gray-500">Credits remaining: </span>
        <span className="text-lg font-bold text-green-600">{credits}</span>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${processing || credits <= 0 ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        {isDragActive ? (
          <p className="text-lg text-blue-600">Drop your product image here...</p>
        ) : (
          <>
            <p className="text-lg text-gray-700 mb-2">
              Drop product image here or click to upload
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG, WEBP up to 10MB
            </p>
          </>
        )}
      </div>

      {/* Processing State */}
      {processing && (
        <div className="mt-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your image... ~3 seconds</p>
        </div>
      )}

      {/* Results */}
      {result && !processing && (
        <div className="mt-8 space-y-6">
          {/* Image Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Original</p>
              <img 
                src={result.originalUrl} 
                alt="Original" 
                className="w-full rounded-lg border-2 border-gray-200"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Amazon Ready ✅</p>
              <img 
                src={result.processedUrl} 
                alt="Processed" 
                className="w-full rounded-lg border-2 border-green-500"
              />
            </div>
          </div>

          {/* Compliance Report */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Amazon Compliance Report
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <ComplianceItem 
                label="Pure White Background" 
                value="RGB(255,255,255)" 
                passed={result.compliance.background_white}
              />
              <ComplianceItem 
                label="Resolution" 
                value={result.dimensions} 
                passed={result.compliance.resolution_ok}
              />
              <ComplianceItem 
                label="File Size" 
                value={result.fileSize} 
                passed={result.compliance.file_size_ok}
              />
              <ComplianceItem 
                label="Format" 
                value="JPEG" 
                passed={result.compliance.format_ok}
              />
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Amazon-Ready Image
          </button>
        </div>
      )}
    </div>
  );
}

interface ComplianceItemProps {
  label: string;
  value: string;
  passed: boolean;
}

function ComplianceItem({ label, value, passed }: ComplianceItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">{label}</span>
      <span className={`font-medium flex items-center gap-1 ${passed ? 'text-green-600' : 'text-red-600'}`}>
        {passed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        {value}
      </span>
    </div>
  );
}
