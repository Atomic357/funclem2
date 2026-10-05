import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Send,
  PackageCheck,
  Clock,
  MapPin,
  Copy,
  Check,
} from 'lucide-react';
import { ConfirmedOrder } from './WhatsAppOrderModal';
import { formatNaira, STORE_DISPLAY_PHONE } from '../data/products';

interface OrderReceiptModalProps {
  order: ConfirmedOrder | null;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'customer' | 'store';
  text: string;
  time: string;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  order,
  onClose,
}) => {
  const [followUpInput, setFollowUpInput] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  if (!order) return null;

  const initialThread: ChatMessage[] = [
    {
      id: 'initial-order',
      sender: 'customer',
      text: order.whatsappMessage,
      time: order.createdAt,
    },
    {
      id: 'store-reply',
      sender: 'store',
      text: `Hello ${order.customerName}! We've received your order #${order.orderId} (${formatNaira(
        order.total
      )}). All items are verified in stock and assigned to our dispatch team. Feel free to reply here if you have any questions!`,
      time: order.createdAt,
    },
    ...messages,
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = followUpInput.trim();
    if (!trimmed) return;

    const now = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'customer',
      text: trimmed,
      time: now,
    };

    let autoReplyText =
      'Acknowledged! Our dispatch rider will call your phone number approximately 15 minutes before arrival.';
    if (trimmed.toLowerCase().includes('pay') || trimmed.toLowerCase().includes('transfer')) {
      autoReplyText =
        'You can pay via direct mobile bank transfer or use a debit card POS terminal with the rider.';
    } else if (trimmed.toLowerCase().includes('time') || trimmed.toLowerCase().includes('when')) {
      autoReplyText = `For ${order.deliveryArea}, parcels go out on the morning and afternoon courier runs today.`;
    }

    const storeMsg: ChatMessage = {
      id: `store-${Date.now() + 1}`,
      sender: 'store',
      text: autoReplyText,
      time: now,
    };

    setMessages((prev) => [...prev, userMsg, storeMsg]);
    setFollowUpInput('');
  };

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order.orderId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Order Confirmation and Live WhatsApp Thread"
    >
      <div
        className="relative w-full max-w-3xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[var(--color-text-main)] text-[var(--color-surface)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-lg font-medium">
                  Order #{order.orderId} Confirmed
                </h2>
                <button
                  type="button"
                  onClick={handleCopyOrderId}
                  className="text-xs opacity-75 hover:opacity-100 inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedId ? (
                    <Check className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-xs opacity-75">
                Dispatch Desk · WhatsApp Support ({STORE_DISPLAY_PHONE})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order confirmation"
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-current transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Receipt Summary */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-accent)]">
                <PackageCheck className="w-4 h-4" />
                <span>Items Reserved & Verified</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--color-border)] text-xs">
                <div className="flex items-start gap-2 text-[var(--color-text-muted)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-text-main)] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[var(--color-text-main)]">Destination:</strong>{' '}
                    {order.deliveryAddress} ({order.deliveryArea})
                  </span>
                </div>
                <div className="flex items-start gap-2 text-[var(--color-text-muted)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--color-text-main)] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[var(--color-text-main)]">Status:</strong> Rider
                    assignment in progress
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] block">
                Receipt Summary
              </span>
              <div className="divide-y divide-[var(--color-border)] text-xs">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-2 flex items-center justify-between gap-2"
                  >
                    <span className="text-[var(--color-text-main)]">
                      {item.quantity}× {item.product.name}
                      {item.variant ? ` (${item.variant})` : ''}
                    </span>
                    <span className="font-medium tabular-nums text-[var(--color-text-main)]">
                      {formatNaira(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[var(--color-border)] space-y-1 text-xs">
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{formatNaira(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Delivery</span>
                  <span className="tabular-nums">
                    {order.deliveryFee === 0
                      ? 'Free'
                      : formatNaira(order.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[var(--color-text-main)] pt-1">
                  <span>Total Due</span>
                  <span className="tabular-nums">{formatNaira(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live WhatsApp Dispatch Thread */}
          <div className="md:col-span-7 flex flex-col justify-between bg-[var(--color-surface-subtle)] rounded-xl border border-[var(--color-border)] overflow-hidden">
            <div className="px-4 py-2.5 bg-[#0B2518] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                <span className="text-xs font-semibold">
                  WhatsApp Store Dispatch Desk
                </span>
              </div>
              <span className="text-[11px] text-white/80">Online</span>
            </div>

            <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
              {initialThread.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'customer' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                      msg.sender === 'customer'
                        ? 'bg-[var(--color-whatsapp)] text-[#0B2518] font-medium'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-main)] border border-[var(--color-border)]'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="block text-[10px] text-current opacity-70 text-right mt-1 tabular-nums">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-2.5 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex items-center gap-2"
            >
              <input
                type="text"
                value={followUpInput}
                onChange={(e) => setFollowUpInput(e.target.value)}
                placeholder="Message dispatch desk..."
                className="flex-1 h-9 px-3 text-xs bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] rounded-lg border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)]"
              />
              <button
                type="submit"
                className="h-9 px-3.5 bg-[var(--color-text-main)] text-[var(--color-surface)] hover:opacity-90 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <span>Reply</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
