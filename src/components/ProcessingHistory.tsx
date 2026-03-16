import { History, Calendar, Image as ImageIcon } from 'lucide-react';
import { getProcessingHistory } from '../services/storageService';

export default function ProcessingHistory() {
  const history = getProcessingHistory();

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No processing history yet</p>
        <p className="text-sm text-gray-500 mt-2">Upload your first image to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <History className="w-5 h-5" />
        Processing History ({history.length})
      </h3>

      <div className="space-y-3">
        {history.slice().reverse().map((record) => (
          <div
            key={record.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{record.filename}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(record.processedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-600">
                {record.creditsUsed} credit{record.creditsUsed > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
