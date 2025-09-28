import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Upload, FileText, Check, X, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadStepProps {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface UploadedDocument {
  id: string;
  file: File;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  extractedData?: any;
}

const DocumentUploadStep = ({ data, onNext, onPrevious }: DocumentUploadStepProps) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>(data.documents || []);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const documentTypes = [
    { id: 'form16', name: 'Form 16', description: 'Salary certificate from employer', required: true },
    { id: 'pan', name: 'PAN Card', description: 'Permanent Account Number card', required: true },
    { id: 'aadhaar', name: 'Aadhaar Card', description: 'Government ID document', required: true },
    { id: 'bank_statement', name: 'Bank Statements', description: 'Last 6 months bank statements', required: false },
    { id: 'rent_receipt', name: 'Rent Receipts', description: 'House rent allowance receipts', required: false },
    { id: 'investment_proof', name: 'Investment Proofs', description: 'ELSS, PPF, NPS investment certificates', required: false },
    { id: 'other', name: 'Other Documents', description: 'Any other relevant financial documents', required: false }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newDocuments: UploadedDocument[] = files.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      type: 'other',
      status: 'uploading',
      progress: 0
    }));

    setDocuments(prev => [...prev, ...newDocuments]);

    // Simulate upload and OCR processing
    newDocuments.forEach(doc => {
      simulateUpload(doc);
    });
  };

  const simulateUpload = (doc: UploadedDocument) => {
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setDocuments(prev => prev.map(d => 
        d.id === doc.id 
          ? { ...d, progress: Math.min(d.progress + 10, 100) }
          : d
      ));
    }, 200);

    setTimeout(() => {
      clearInterval(uploadInterval);
      setDocuments(prev => prev.map(d => 
        d.id === doc.id 
          ? { 
              ...d, 
              status: 'processing',
              progress: 100
            }
          : d
      ));

      // Simulate OCR processing
      setTimeout(() => {
        setDocuments(prev => prev.map(d => 
          d.id === doc.id 
            ? { 
                ...d, 
                status: 'completed',
                extractedData: {
                  text: 'Sample extracted text from document',
                  confidence: 0.95,
                  fields: {
                    name: 'John Doe',
                    amount: '50000',
                    date: '2024-01-15'
                  }
                }
              }
            : d
        ));
        toast({
          title: "Document Processed",
          description: `${doc.file.name} has been processed successfully!`,
        });
      }, 2000);
    }, 2000);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const updateDocumentType = (id: string, type: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, type } : doc
    ));
  };

  const getDocumentTypeInfo = (type: string) => {
    return documentTypes.find(dt => dt.id === type) || documentTypes[0];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-4 w-4 animate-pulse" />;
      case 'processing':
        return <FileText className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <Check className="h-4 w-4 text-success" />;
      case 'error':
        return <X className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const requiredDocuments = documentTypes.filter(dt => dt.required);
  const uploadedRequiredDocs = documents.filter(doc => 
    requiredDocuments.some(rd => rd.id === doc.type) && doc.status === 'completed'
  );

  const canProceed = uploadedRequiredDocs.length >= requiredDocuments.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canProceed) {
      onNext({ documents: documents.filter(doc => doc.status === 'completed') });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Upload Your Documents</h3>
          <p className="text-muted-foreground">
            Upload your financial documents for AI-powered analysis and tax optimization.
          </p>
        </div>

        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Required Documents</CardTitle>
            <CardDescription>
              These documents are essential for accurate tax calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requiredDocuments.map(docType => (
                <div key={docType.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{docType.name}</div>
                    <div className="text-sm text-muted-foreground">{docType.description}</div>
                  </div>
                  <Badge variant="destructive">Required</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upload Documents</CardTitle>
            <CardDescription>
              Drag and drop files or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-lg font-medium mb-2">Upload your documents</div>
              <div className="text-sm text-muted-foreground mb-4">
                Supports PDF, JPG, PNG files up to 10MB each
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Documents */}
        {documents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Uploaded Documents</CardTitle>
              <CardDescription>
                {documents.length} document(s) uploaded
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {documents.map(doc => {
                const docTypeInfo = getDocumentTypeInfo(doc.type);
                return (
                  <div key={doc.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getStatusIcon(doc.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{doc.file.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                      
                      {doc.status === 'uploading' && (
                        <div className="mt-2">
                          <Progress value={doc.progress} className="h-2" />
                        </div>
                      )}
                      
                      {doc.status === 'completed' && doc.extractedData && (
                        <div className="mt-2 text-sm text-success">
                          ✓ Data extracted successfully
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={doc.type}
                        onChange={(e) => updateDocumentType(doc.id, e.target.value)}
                        className="text-sm border border-input bg-background rounded px-2 py-1"
                        disabled={doc.status === 'uploading' || doc.status === 'processing'}
                      >
                        {documentTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {!canProceed && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="text-warning font-medium">
              Please upload all required documents to continue
            </div>
            <div className="text-sm text-warning/80 mt-1">
              {requiredDocuments.length - uploadedRequiredDocs.length} more required document(s) needed
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button 
          type="submit" 
          className="flex items-center gap-2"
          disabled={!canProceed}
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default DocumentUploadStep;
