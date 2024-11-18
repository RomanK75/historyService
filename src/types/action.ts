export interface StockAction {
  plu: number;
  shop_id: number;
  action: string;
  quantity: number;
  order_quantity: number;
  timestamp: Date;
}