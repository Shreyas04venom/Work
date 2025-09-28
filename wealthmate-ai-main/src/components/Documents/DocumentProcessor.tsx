import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Image, 
  CheckCircle, 
  AlertTriangle, 
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Zap,
  FileCheck,
  Search,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProcessedDocument {
  id: string;
  name: string;
  type: 'form16' | 'bank_statement' | 'investment_proof' | 'rent_receipt' | 'other';
  status: 'processing' | 'completed' | 'error';
  extractedData: any;
  confidence: number;
  uploadDate: string;
  fileSize: string;
}

interface DocumentProcessorProps {
  userId: string;
}

const DocumentProcessor = ({ userId }: DocumentProcessorProps) => {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'form16' | 'bank_statement' | 'investment_proof' | 'rent_receipt' | 'other'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const documentTypes = {
    form16: { name: 'Form 16', color: 'bg-blue-100 text-blue-800', icon: '📄' },
    bank_statement: { name: 'Bank Statement', color: 'bg-green-100 text-green-800', icon: '🏦' },
    investment_proof: { name: 'Investment Proof', color: 'bg-purple-100 text-purple-800', icon: '📈' },
    rent_receipt: { name: 'Rent Receipt', color: 'bg-yellow-100 text-yellow-800', icon: '🏠' },
    other: { name: 'Other', color: 'bg-gray-100 text-gray-800', icon: '📋' }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsProcessing(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const documentId = `doc_${Date.now()}_${i}`;
      
      // Create document entry
      const newDoc: ProcessedDocument = {
        id: documentId,
        name: file.name,
        type: detectDocumentType(file.name),
        status: 'processing',
        extractedData: null,
        confidence: 0,
        uploadDate: new Date().toISOString(),
        fileSize: formatFileSize(file.size)
      };

      setDocuments(prev => [newDoc, ...prev]);

      // Simulate OCR processing
      await processDocument(newDoc, file);
    }

    setIsProcessing(false);
    setUploadProgress(0);
    toast({
      title: "Documents Uploaded",
      description: `${files.length} document(s) uploaded and processing started.`,
    });
  };

  const processDocument = async (doc: ProcessedDocument, file: File) => {
    // Simulate processing time
    const processingTime = Math.random() * 3000 + 2000; // 2-5 seconds
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, processingTime / 10);

    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Simulate extracted data based on document type
      const extractedData = generateExtractedData(doc.type);
      
      setDocuments(prev => 
        prev.map(d => 
          d.id === doc.id 
            ? { 
                ...d, 
                status: 'completed', 
                extractedData, 
                confidence: Math.floor(Math.random() * 20) + 80 // 80-100% confidence
              }
            : d
        )
      );

      toast({
        title: "Document Processed",
        description: `${doc.name} has been successfully processed with ${Math.floor(Math.random() * 20) + 80}% confidence.`,
      });
    }, processingTime);
  };

  const detectDocumentType = (filename: string): ProcessedDocument['type'] => {
    const name = filename.toLowerCase();
    if (name.includes('form16') || name.includes('form-16')) return 'form16';
    if (name.includes('bank') || name.includes('statement')) return 'bank_statement';
    if (name.includes('investment') || name.includes('mutual') || name.includes('sip')) return 'investment_proof';
    if (name.includes('rent') || name.includes('receipt')) return 'rent_receipt';
    return 'other';
  };

  const generateExtractedData = (type: ProcessedDocument['type']) => {
    switch (type) {
      case 'form16':
        return {
          employer: 'ABC Technologies Pvt Ltd',
          pan: 'ABCDE1234F',
          grossSalary: 1200000,
          deductions: {
            section80c: 150000,
            section80d: 25000,
            section80e: 0,
            hra: 180000
          },
          taxDeducted: 85000,
          financialYear: '2023-24'
        };
      
      case 'bank_statement':
        return {
          accountNumber: '****1234',
          bankName: 'HDFC Bank',
          statementPeriod: 'Jan 2024',
          totalCredits: 150000,
          totalDebits: 120000,
          closingBalance: 450000,
          transactions: 45
        };
      
      case 'investment_proof':
        return {
          fundName: 'Axis Bluechip Fund',
          investmentAmount: 50000,
          investmentDate: '2024-01-15',
          folioNumber: 'FOL123456789',
          nav: 45.67,
          units: 1095.45
        };
      
      case 'rent_receipt':
        return {
          landlordName: 'John Smith',
          propertyAddress: '123 Main Street, Mumbai',
          rentAmount: 25000,
          receiptDate: '2024-01-01',
          receiptNumber: 'RCP001234'
        };
      
      default:
        return {
          documentType: 'General Document',
          extractedText: 'Document content extracted successfully',
          confidence: 85
        };
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast({
      title: "Document Deleted",
      description: "Document has been removed from your collection.",
    });
  };

  const downloadDocument = (doc: ProcessedDocument) => {
    toast({
      title: "Download Started",
      description: `Downloading ${doc.name}...`,
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const processingCount = documents.filter(doc => doc.status === 'processing').length;
  const completedCount = documents.filter(doc => doc.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient-primary">Document OCR & Processing</h2>
          <p className="text-muted-foreground">Upload documents for AI-powered data extraction and analysis</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="bg-gradient-primary"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Upload Documents'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                <span className="font-medium">Processing Documents...</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {processingCount} document(s) being processed
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold text-primary">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processed</p>
                <p className="text-2xl font-bold text-success">{completedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-warning">{processingCount}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-warning/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-bold text-accent">
                  {completedCount > 0 
                    ? Math.round(documents.filter(d => d.status === 'completed').reduce((acc, d) => acc + d.confidence, 0) / completedCount)
                    : 0}%
                </p>
              </div>
              <Zap className="h-8 w-8 text-accent/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {Object.entries(documentTypes).map(([key, type]) => (
            <Button
              key={key}
              variant={filterType === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(key as any)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {type.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Document List</TabsTrigger>
          <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first document to get started with AI-powered data extraction.
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center">
                        {doc.type === 'form16' ? <FileText className="h-6 w-6" /> :
                         doc.type === 'bank_statement' ? <FileText className="h-6 w-6" /> :
                         doc.type === 'investment_proof' ? <FileText className="h-6 w-6" /> :
                         <Image className="h-6 w-6" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{doc.name}</h3>
                          <Badge className={documentTypes[doc.type].color}>
                            {documentTypes[doc.type].icon} {documentTypes[doc.type].name}
                          </Badge>
                          <Badge variant={doc.status === 'completed' ? 'default' : 'secondary'}>
                            {doc.status === 'processing' ? 'Processing...' : 
                             doc.status === 'completed' ? 'Completed' : 'Error'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{doc.fileSize}</span>
                          <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                          {doc.status === 'completed' && (
                            <span className="text-success font-medium">
                              {doc.confidence}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {doc.status === 'completed' && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => downloadDocument(doc)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteDocument(doc.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="extracted" className="space-y-4">
          {filteredDocuments.filter(doc => doc.status === 'completed').length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Extracted Data</h3>
                <p className="text-muted-foreground">
                  Process some documents to see extracted data here.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredDocuments
              .filter(doc => doc.status === 'completed')
              .map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-success" />
                      {doc.name} - Extracted Data
                    </CardTitle>
                    <CardDescription>
                      Confidence: {doc.confidence}% | Type: {documentTypes[doc.type].name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <pre className="text-sm overflow-x-auto">
                        {JSON.stringify(doc.extractedData, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentProcessor;
