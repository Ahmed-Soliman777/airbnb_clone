// export interface PaymentStats {
// }
export interface StatusAmount {
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  count: number;
}

export interface DailyPaymentStat {
  date: string;
  statuses: StatusAmount[];
}

export interface PaymentStatsResponse {
  success: boolean;
  data: DailyPaymentStat[];
}
