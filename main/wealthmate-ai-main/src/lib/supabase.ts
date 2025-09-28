import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string
  pan_number: string
  aadhaar_number: string
  date_of_birth: string
  address: string
  city: string
  state: string
  pincode: string
  occupation: string
  annual_income: number
  created_at: string
  updated_at: string
}

export interface FinancialGoal {
  id: string
  user_id: string
  goal_type: 'emergency_fund' | 'home_purchase' | 'retirement' | 'education' | 'other'
  goal_name: string
  target_amount: number
  current_amount: number
  target_date: string
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}

export interface CreditScore {
  id: string
  user_id: string
  score: number
  provider: 'cibil' | 'experian' | 'equifax' | 'crif'
  report_date: string
  factors: {
    payment_history: number
    credit_utilization: number
    credit_age: number
    credit_mix: number
    new_credit: number
  }
  created_at: string
}

export interface TaxFiling {
  id: string
  user_id: string
  assessment_year: string
  total_income: number
  tax_paid: number
  refund_received: number
  regime: 'old' | 'new'
  filing_status: 'pending' | 'filed' | 'verified'
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  document_type: 'form16' | 'rent_receipt' | 'investment_proof' | 'bank_statement' | 'pan' | 'aadhaar' | 'other'
  file_name: string
  file_url: string
  file_size: number
  mime_type: string
  extracted_data: any
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  category: 'tax' | 'credit' | 'investment' | 'general'
  is_read: boolean
  action_url?: string
  created_at: string
}

export interface AIChat {
  id: string
  user_id: string
  message: string
  response: string
  context: string
  created_at: string
}
