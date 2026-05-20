import { useState, useCallback } from 'react';
import { msg, t } from '@lingui/core/macro';

type DocumentUploadProps = {
  recordId: string;
  recordType: string;
  onUploadComplete?: (documentId: string) => void;
};

export function DocumentUpload({
  recordId,
  recordType,
  onUploadComplete,
}: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('recordId', recordId);
        formData.append('recordType', recordType);

        const response = await fetch('/rest/attachments', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(t`Upload failed`);
        }

        const result = await response.json();
        onUploadComplete?.(result.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : t`Upload failed`);
      } finally {
        setIsUploading(false);
      }
    },
    [recordId, recordType, onUploadComplete],
  );

  return (
    <div>
      <h3>{t`Documents`}</h3>
      <div>
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />
        {isUploading && <span>{t`Uploading...`}</span>}
        {error && <span>{error}</span>}
      </div>
      <div>
        <small>
          {t`Supported formats: PDF, DOC, DOCX, JPG, PNG`}
        </small>
      </div>
    </div>
  );
}
