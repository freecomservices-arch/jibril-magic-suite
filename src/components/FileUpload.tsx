import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, GripVertical, FileText, Image, File, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  title?: string;
  description?: string;
  onFilesChange?: (files: UploadedFile[]) => void;
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return Image;
  if (type === 'application/pdf') return FileText;
  return File;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileUpload: React.FC<FileUploadProps> = ({
  accept = 'image/*,.pdf,.docx',
  multiple = true,
  maxFiles = 20,
  title = 'Glissez vos fichiers ici',
  description = 'ou cliquez pour parcourir • JPG, PNG, PDF, DOCX',
  onFilesChange,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = useCallback((file: UploadedFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setFiles(prev => {
        const updated = prev.map(f =>
          f.id === file.id ? { ...f, progress, status: progress >= 100 ? 'done' as const : 'uploading' as const } : f
        );
        onFilesChange?.(updated);
        return updated;
      });
    }, 300 + Math.random() * 400);
  }, [onFilesChange]);

  const addFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).slice(0, maxFiles - files.length).map(f => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      return {
        id,
        name: f.name,
        size: f.size,
        type: f.type,
        preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
        progress: 0,
        status: 'uploading' as const,
      };
    });
    setFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(simulateUpload);
  }, [files.length, maxFiles, simulateUpload]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) URL.revokeObjectURL(file.preview);
      const updated = prev.filter(f => f.id !== id);
      onFilesChange?.(updated);
      return updated;
    });
  }, [onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Reorder via drag
  const handleReorderDragStart = (idx: number) => setDragIndex(idx);
  const handleReorderDrop = (idx: number) => {
    if (dragIndex === null || dragIndex === idx) return;
    setFiles(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(idx, 0, moved);
      onFilesChange?.(updated);
      return updated;
    });
    setDragIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.01]'
            : 'border-border hover:border-primary/40 hover:bg-primary/5'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={e => e.target.files && addFiles(e.target.files)}
        />
        <div className={`mx-auto w-fit rounded-2xl p-4 mb-3 transition-colors ${isDragging ? 'bg-primary/20' : 'bg-primary/10'}`}>
          <Upload className={`h-8 w-8 transition-transform ${isDragging ? 'text-primary scale-110' : 'text-primary/60'}`} />
        </div>
        <h3 className="font-heading text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {files.length > 0 && (
          <p className="text-xs text-primary mt-2 font-medium">{files.length}/{maxFiles} fichiers</p>
        )}
      </div>

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {files.map((file, idx) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <div
                key={file.id}
                draggable
                onDragStart={() => handleReorderDragStart(idx)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleReorderDrop(idx)}
                className={`group relative rounded-lg border bg-card overflow-hidden transition-all ${
                  dragIndex === idx ? 'opacity-50 scale-95' : 'border-border hover:border-primary/30'
                } ${idx === 0 ? 'ring-2 ring-primary/40' : ''}`}
              >
                {/* Thumbnail */}
                <div className="aspect-square relative bg-muted/30 flex items-center justify-center overflow-hidden">
                  {file.preview ? (
                    <img src={file.preview} alt={file.name} className="h-full w-full object-cover" />
                  ) : (
                    <FileIcon className="h-8 w-8 text-muted-foreground/40" />
                  )}

                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <GripVertical className="h-5 w-5 text-background cursor-grab" />
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={e => { e.stopPropagation(); removeFile(file.id); }}
                    className="absolute top-1.5 right-1.5 rounded-full bg-destructive/90 p-1 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>

                  {/* Cover badge */}
                  {idx === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 rounded-md bg-primary/90 px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                      COUVERTURE
                    </span>
                  )}

                  {/* Done indicator */}
                  {file.status === 'done' && (
                    <CheckCircle2 className="absolute top-1.5 left-1.5 h-4 w-4 text-success drop-shadow" />
                  )}
                </div>

                {/* Progress & Name */}
                <div className="p-2">
                  <p className="text-[10px] text-card-foreground truncate font-medium">{file.name}</p>
                  <p className="text-[9px] text-muted-foreground">{formatSize(file.size)}</p>
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="h-1 mt-1.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
