import { z } from 'zod';

export const MercadoPagoWebhookTopicSchema = z.enum([
  'payment',
  'merchant_order',
]);

export type MercadoPagoWebhookTopic = z.infer<typeof MercadoPagoWebhookTopicSchema>;

export interface MercadoPagoPaymentData {
  id: string;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled' | 'refunded';
  payment_type_id: string;
  transaction_amount: number;
  external_reference?: string;
}

export interface MercadoPagoWebhookPayload {
  id: number;
  topic: string;
  application_id: number;
  action: string;
  data: {
    id: string;
  };
}