export interface SimResult {
  mobile: string;
  name: string;
  cnic: string;
  address: string;
  table_index: number;
  row_index: number;
}

export interface ApiResponse {
  success: boolean;
  query: string;
  type: string;
  results_count: number;
  results: SimResult[];
  developer: string;
  message: string;
  timestamp: string;
  source: string;
}

export interface SearchState {
  loading: boolean;
  data: ApiResponse | null;
  error: string | null;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  query: string;
  success: boolean;
  resultsCount: number;
  details: string; // JSON stringified results
}