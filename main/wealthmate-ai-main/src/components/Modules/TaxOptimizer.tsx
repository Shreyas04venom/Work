import { useMemo, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, FileText, PieChart, TrendingUp, Download, Calculator, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Transaction = {
  date?: string;
  description: string;
  amount: number; // positive numbers
  type?: string; // debit/credit or income/expense
  category?: string; // raw category if present in file
  section?: "80C" | "80D" | "HRA" | "Others";
};

type CategorySummary = {
  category: string;
  amount: number;
  eligible: boolean;
  progress: number; // 0-100 relative to cap where applicable
  section: "80C" | "80D" | "HRA" | "Others";
};

const CAPS = {
  "80C": 150000,
  "80D": 25000, // baseline; actual can vary but we keep simple
  HRA: 0, // computed contextually; no fixed cap here for now
};

const TaxOptimizer = () => {
  const [taxRegime, setTaxRegime] = useState("new");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [basicSalary, setBasicSalary] = useState<number>(0);
  const [hraReceived, setHraReceived] = useState<number>(0);
  const [cityType, setCityType] = useState<"metro" | "non-metro">("non-metro");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const readFileAsText = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsText(file);
    });

  const readFileAsArrayBuffer = (file: File) =>
    new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

  // CSV line parser supporting quoted fields and embedded commas
  const parseCSVLine = (line: string): string[] => {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { // escaped quote
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        out.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    out.push(cur.trim());
    return out;
  };

  const parseCSV = (csv: string): Transaction[] => {
    const lines = csv.trim().split(/\r?\n/);
    if (lines.length === 0) return [];
    const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
    const idx = {
      date: headers.indexOf("date"),
      description: headers.indexOf("description"),
      amount: headers.indexOf("amount"),
      type: headers.indexOf("type"),
      category: headers.indexOf("category"),
    };
    const rows = lines.slice(1);
    const txs: Transaction[] = [];
    for (const row of rows) {
      if (!row.trim()) continue;
      const cols = parseCSVLine(row).map(c => c.trim());
      const amountStr = idx.amount >= 0 ? cols[idx.amount] : "0";
      const amount = Number(amountStr.replace(/[^0-9.-]/g, "")) || 0;
      const description = idx.description >= 0 ? cols[idx.description] : "";
      const date = idx.date >= 0 ? cols[idx.date] : undefined;
      const type = idx.type >= 0 ? cols[idx.type] : undefined;
      const category = idx.category >= 0 ? cols[idx.category] : undefined;
      txs.push({ date, description, amount: Math.abs(amount), type, category });
    }
    return txs;
  };

  const categorySummaries: CategorySummary[] = useMemo(() => {
    const byCategory = new Map<string, { amount: number; section: CategorySummary["section"] }>();
    for (const t of transactions) {
      const c = t.category || "Uncategorized";
      const section = t.section || "Others";
      const prev = byCategory.get(c) || { amount: 0, section };
      byCategory.set(c, { amount: prev.amount + t.amount, section });
    }
    const result: CategorySummary[] = [];
    for (const [category, { amount, section }] of byCategory.entries()) {
      const cap = CAPS[section] || 0;
      const progress = cap > 0 ? Math.min(100, Math.round((amount / cap) * 100)) : 0;
      const eligible = section !== "Others";
      result.push({ category, amount, eligible, progress, section });
    }
    return result.sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const deductionMetrics = useMemo(() => {
    const totals = { "80C": 0, "80D": 0, HRA: 0 } as Record<"80C" | "80D" | "HRA", number>;
    for (const t of transactions) {
      if (t.section === "80C" || t.section === "80D" || t.section === "HRA") {
        totals[t.section] += t.amount;
      }
    }
    const used80C = Math.min(totals["80C"], CAPS["80C"]);
    const remaining80C = Math.max(0, CAPS["80C"] - used80C);
    const used80D = Math.min(totals["80D"], CAPS["80D"]);
    const remaining80D = Math.max(0, CAPS["80D"] - used80D);
    const hraPaid = totals["HRA"];

    // Eligible HRA deduction requires salary context; compute if provided
    const percentOfBasic = (cityType === "metro" ? 0.5 : 0.4) * (basicSalary || 0);
    const rentMinusTenPercent = Math.max(0, hraPaid - 0.1 * (basicSalary || 0));
    const eligibleHRA = Math.max(0, Math.min(hraReceived || 0, rentMinusTenPercent, percentOfBasic));

    return {
      used80C,
      remaining80C,
      used80D,
      remaining80D,
      hraPaid,
      eligibleHRA,
      potentialSavings80C: Math.round(remaining80C * 0.3),
      potentialSavings80D: Math.round(remaining80D * 0.3),
    };
  }, [transactions, basicSalary, hraReceived, cityType]);

  const categorizeTransaction = (t: Transaction): Transaction => {
    const desc = (t.description || t.category || "").toLowerCase();
    let section: Transaction["section"] = "Others";
    let category = t.category;
    // Simple keyword-based rules
    if (/\brent\b|lease|landlord|nobroker|payrent|rentpayment/.test(desc)) {
      section = "HRA";
      category = "House Rent";
    } else if (/elss|mutual fund|sip|ppf|nsc|ssy|ulip|tax saver|equity linked/.test(desc)) {
      section = "80C";
      category = category || "ELSS/PPF/NSC/ULIP";
    } else if (/life\s*ins|term\s*ins|lic|hdfc\s*life|sbi\s*life|icici\s*prudential|max\s*life/.test(desc)) {
      section = "80C";
      category = category || "Life Insurance";
    } else if (/health\s*ins|mediclaim|health policy|star health|care health/.test(desc)) {
      section = "80D";
      category = category || "Health Insurance";
    } else if (/home loan|principal emi/.test(desc)) {
      section = "80C";
      category = category || "Home Loan Principal";
    } else if (/interest|roi/.test(desc) && /home loan|housing/.test(desc)) {
      section = "Others"; // 24(b) interest, not under 80C baseline
      category = category || "Home Loan Interest";
    } else if (/tuition|education|school fees|college fees/.test(desc)) {
      section = "80C";
      category = category || "Tuition Fees";
    }
    return { ...t, section, category };
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;
    const syntheticEvent = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
    await handleFileUpload(syntheticEvent);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
    const allTx: Transaction[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      try {
        if (ext === "csv") {
          const text = await readFileAsText(file);
          const parsed = parseCSV(text).map(categorizeTransaction);
          allTx.push(...parsed);
        } else if (ext === "xlsx") {
          const buf = await readFileAsArrayBuffer(file);
          const wb = XLSX.read(new Uint8Array(buf), { type: "array" });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: "" });
          const parsedXlsx: Transaction[] = rows.map((row) => {
            const keys = Object.keys(row);
            const getVal = (k: string) => {
              const match = keys.find((kk) => kk.toLowerCase() === k);
              return match ? row[match] : undefined;
            };
            const amountStr = String(getVal("amount") ?? "0");
            const amount = Number(String(amountStr).replace(/[^0-9.-]/g, "")) || 0;
            return {
              date: getVal("date") ? String(getVal("date")) : undefined,
              description: String(getVal("description") ?? ""),
              amount: Math.abs(amount),
              type: getVal("type") ? String(getVal("type")) : undefined,
              category: getVal("category") ? String(getVal("category")) : undefined,
            };
          });
          const categorized = parsedXlsx.map(categorizeTransaction);
          allTx.push(...categorized);
        } else if (ext === "pdf") {
          toast({
            title: "PDF not supported",
            description: "Parsing PDFs is not available. Use CSV export from your bank.",
          });
        } else {
          toast({
            title: "Unsupported file type",
            description: `File ${file.name} was skipped. Upload CSV for best results.`,
          });
        }
      } catch (e) {
        toast({
          title: "Upload error",
          description: `Failed to process ${file.name}`,
        });
      }
    }

    if (allTx.length > 0) {
      setTransactions(prev => [...prev, ...allTx]);
      toast({
        title: "Files Processed",
        description: `${allTx.length} transaction(s) imported and categorized`,
      });
    } else {
      toast({
        title: "No transactions parsed",
        description: "Please upload CSV files with columns: date, description, amount, type, category",
      });
    }
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    const report = {
      taxRegime,
      transactions,
      categorySummaries,
      deductionMetrics,
      generatedAt: new Date().toISOString(),
    };
    try {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tax-optimizer-report-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({
        title: "Report Exported",
        description: "Downloaded tax optimizer report (JSON)",
      });
    } catch (e) {
      toast({
        title: "Export failed",
        description: "Could not generate report. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleOptimizeNow = () => {
    setIsOptimizing(true);
    const reAnalyzed = transactions.map(categorizeTransaction);
    setTransactions(reAnalyzed);
    setTimeout(() => {
      setIsOptimizing(false);
      toast({
        title: "Optimization Complete",
        description: "Your data was re-analyzed. Review updated gaps and recommendations.",
      });
    }, 800);
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
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <div className="text-sm text-muted-foreground mb-4">
                Drag & drop files or click to browse
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.csv,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Choose Files
              </Button>
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
              {categorySummaries.length === 0 ? (
                <div className="p-4 bg-secondary rounded text-center text-sm text-muted-foreground">
                  No transactions imported yet. Upload CSV to see categories.
                </div>
              ) : (
                categorySummaries.map((item, index) => (
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
                ))
              )}
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
                  <div className="text-2xl font-bold text-primary">₹{deductionMetrics.used80C.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Utilized</div>
                </div>
                <div className="text-center p-4 bg-warning/20 rounded-lg">
                  <div className="text-2xl font-bold text-warning">₹{deductionMetrics.remaining80C.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
                <div className="text-center p-4 bg-success/20 rounded-lg">
                  <div className="text-2xl font-bold text-success">₹{deductionMetrics.potentialSavings80C.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Potential Savings</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-accent">Increase 80C Investments</h4>
                      <p className="text-sm text-muted-foreground">Add eligible investments to fully utilize ₹{deductionMetrics.remaining80C.toLocaleString()} remaining</p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAction("Plan 80C investments", deductionMetrics.remaining80C)}
                    >
                      Plan Now
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="80d" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-primary">₹{deductionMetrics.used80D.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Utilized</div>
                </div>
                <div className="text-center p-4 bg-warning/20 rounded-lg">
                  <div className="text-2xl font-bold text-warning">₹{deductionMetrics.remaining80D.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
                <div className="text-center p-4 bg-success/20 rounded-lg">
                  <div className="text-2xl font-bold text-success">₹{deductionMetrics.potentialSavings80D.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Potential Savings</div>
                </div>
              </div>
              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="text-sm text-muted-foreground">Add or adjust health insurance premiums to utilize remaining 80D benefits.</div>
              </div>
            </TabsContent>

            <TabsContent value="hra" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-primary">₹{deductionMetrics.hraPaid.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Rent Paid (Parsed)</div>
                </div>
                <div className="text-center p-4 bg-success/20 rounded-lg">
                  <div className="text-2xl font-bold text-success">₹{deductionMetrics.eligibleHRA.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Eligible HRA Deduction</div>
                </div>
                <div className="text-center p-4 bg-warning/20 rounded-lg">
                  <div className="text-2xl font-bold text-warning">{cityType === "metro" ? "Metro" : "Non-Metro"}</div>
                  <div className="text-sm text-muted-foreground">City Type</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basic-salary">Basic Salary (Annual)</Label>
                  <Input id="basic-salary" type="number" value={basicSalary || ''} onChange={(e) => setBasicSalary(Number(e.target.value) || 0)} placeholder="e.g., 600000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hra-received">HRA Received (Annual)</Label>
                  <Input id="hra-received" type="number" value={hraReceived || ''} onChange={(e) => setHraReceived(Number(e.target.value) || 0)} placeholder="e.g., 120000" />
                </div>
                <div className="space-y-2">
                  <Label>City Type</Label>
                  <Select value={cityType} onValueChange={(v) => setCityType(v as any)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metro">Metro</SelectItem>
                      <SelectItem value="non-metro">Non-Metro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-3 text-xs text-muted-foreground bg-secondary rounded">
                We calculate HRA as the minimum of HRA received, Rent paid minus 10% of basic salary, and 50% (metro) or 40% (non-metro) of basic salary.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxOptimizer;