import { useState } from "react";
import { Upload, FileText, PieChart, TrendingUp, Download, Calculator, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const TaxOptimizer = () => {
  const [taxRegime, setTaxRegime] = useState("new");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
    toast({
      title: "Files Uploaded",
      description: `${files.length} file(s) uploaded successfully!`,
    });
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    toast({
      title: "Exporting Report",
      description: "Your tax optimization report is being exported...",
    });
    
    setTimeout(() => {
      setIsExporting(false);
      toast({
        title: "Report Exported",
        description: "Your tax optimization report has been exported successfully!",
      });
    }, 2000);
  };

  const handleOptimizeNow = () => {
    setIsOptimizing(true);
    toast({
      title: "Optimizing Taxes",
      description: "AI is analyzing your data to optimize your tax savings...",
    });
    
    setTimeout(() => {
      setIsOptimizing(false);
      toast({
        title: "Optimization Complete",
        description: "Your tax optimization is complete! Check the recommendations below.",
      });
    }, 3000);
  };

  const handleAction = (action: string, amount?: number) => {
    toast({
      title: action,
      description: amount ? `Action initiated for ₹${amount.toLocaleString()}` : "Action initiated successfully!",
    });
  };

  const savingsData = {
    old: { tax: 85000, deductions: 150000, savings: 45000 },
    new: { tax: 78000, deductions: 50000, savings: 52000 }
  };

  const currentRegime = savingsData[taxRegime as keyof typeof savingsData];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gradient-primary">Tax Optimizer</h2>
          <p className="text-muted-foreground">Maximize your tax savings with AI-powered insights</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportReport}
            disabled={isExporting}
            className="btn-mobile"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export Report"}
          </Button>
          <Button 
            className="bg-gradient-primary btn-mobile"
            onClick={handleOptimizeNow}
            disabled={isOptimizing}
          >
            <Zap className="h-4 w-4 mr-2" />
            {isOptimizing ? "Optimizing..." : "Optimize Now"}
          </Button>
        </div>
      </div>

      {/* Tax Regime Switcher */}
      <Card className="bg-gradient-card border-border/50 card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Tax Regime Comparison
          </CardTitle>
          <CardDescription>
            Compare Old vs New tax regime to maximize your savings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Regime Selector */}
            <div className="space-y-4">
              <Select value={taxRegime} onValueChange={setTaxRegime}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="old">Old Tax Regime</SelectItem>
                  <SelectItem value="new">New Tax Regime</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tax Liability</span>
                  <span className="font-semibold">₹{currentRegime.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Deductions</span>
                  <span className="font-semibold text-accent">₹{currentRegime.deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-medium">Total Savings</span>
                  <span className="font-bold text-success">₹{currentRegime.savings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Visual Comparison */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {taxRegime === "new" ? "Better" : "Good"} Choice
                </div>
                <div className="text-sm text-muted-foreground">
                  Saves ₹{(savingsData.new.savings - savingsData.old.savings).toLocaleString()} more
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Old Regime</span>
                  <span>₹{savingsData.old.savings.toLocaleString()}</span>
                </div>
                <Progress value={75} className="h-2" />
                
                <div className="flex justify-between text-sm">
                  <span>New Regime</span>
                  <span>₹{savingsData.new.savings.toLocaleString()}</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload & Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/50 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Document Upload
            </CardTitle>
            <CardDescription>
              Upload bank statements, Form 16, and investment proofs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <div className="text-sm text-muted-foreground mb-4">
                Drag & drop files or click to browse
              </div>
              <input
                type="file"
                multiple
                accept=".pdf,.csv,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Choose Files
                </Button>
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Uploaded Files:</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-secondary rounded">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">{file}</span>
                    <Badge variant="secondary" className="ml-auto">Processing</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Transaction Categories
            </CardTitle>
            <CardDescription>
              AI-categorized transactions for tax optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "House Rent", amount: 120000, progress: 80, eligible: true },
                { category: "Life Insurance", amount: 25000, progress: 50, eligible: true },
                { category: "ELSS Investments", amount: 80000, progress: 53, eligible: true },
                { category: "Health Insurance", amount: 15000, progress: 60, eligible: true },
                { category: "Home Loan EMI", amount: 200000, progress: 100, eligible: true }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">₹{item.amount.toLocaleString()}</span>
                      {item.eligible && (
                        <Badge variant="secondary" className="bg-success/20 text-success">
                          Eligible
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deduction Opportunities */}
      <Card className="bg-gradient-card border-border/50 card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Deduction Gap Analysis
          </CardTitle>
          <CardDescription>
            AI-identified opportunities to maximize your tax savings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="80c" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="80c">Section 80C</TabsTrigger>
              <TabsTrigger value="80d">Section 80D</TabsTrigger>
              <TabsTrigger value="hra">HRA</TabsTrigger>
              <TabsTrigger value="others">Others</TabsTrigger>
            </TabsList>
            
            <TabsContent value="80c" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-primary">₹80,000</div>
                  <div className="text-sm text-muted-foreground">Utilized</div>
                </div>
                <div className="text-center p-4 bg-warning/20 rounded-lg">
                  <div className="text-2xl font-bold text-warning">₹70,000</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
                <div className="text-center p-4 bg-success/20 rounded-lg">
                  <div className="text-2xl font-bold text-success">₹21,000</div>
                  <div className="text-sm text-muted-foreground">Potential Savings</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-accent">Increase ELSS Investment</h4>
                      <p className="text-sm text-muted-foreground">Invest ₹70,000 more in ELSS to maximize 80C</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAction("Invest in ELSS", 70000)}
                    >
                      Invest Now
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="80d" className="space-y-4">
              <div className="p-4 bg-secondary/50 rounded-lg text-center">
                <div className="text-lg text-muted-foreground">Health Insurance Analysis</div>
                <div className="text-sm text-muted-foreground mt-2">Coming soon...</div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxOptimizer;