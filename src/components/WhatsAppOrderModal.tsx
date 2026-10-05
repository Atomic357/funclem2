import React, { useState } from 'react';
import {
  X,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { CartItem, FREE_DELIVERY_THRESHOLD } from './CartDrawer';
import {
  formatNaira,
  STORE_WHATSAPP_NUMBER,
  STORE_DISPLAY_PHONE,
} from '../data/products';

export interface ConfirmedOrder {
  orderId: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryArea: string;
  deliveryAddress: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
  items: CartItem[];
  whatsappMessage: string;
}

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderConfirmed: (order: ConfirmedOrder) => void;
}

const DELIVERY_ZONES = [
  { id: 'Lagos Island / Lekki', label: 'Lagos Island / Lekki (Same-Day)', fee: 2500 },
  { id: 'Lagos Mainland', label: 'Lagos Mainland (Same-Day)', fee: 2000 },
  { id: 'Abuja (FCT)', label: 'Abuja FCT (1–2 Days)', fee: 4500 },
  { id: 'Nationwide Courier', label: 'Other States (2–3 Days)', fee: 5500 },
];

export const WhatsAppOrderModal: React.FC<WhatsAppOrderModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderConfirmed,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryArea, setDeliveryArea] = useState(DELIVERY_ZONES[0].id);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || items.length === 0) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const selectedZone =
    DELIVERY_ZONES.find((z) => z.id === deliveryArea) || DELIVERY_ZONES[0];

  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : selectedZone.fee;
  const finalTotal = subtotal + deliveryFee;

  const buildWhatsAppMessage = () => {
    const lines: string[] = [
      'Hello WhatsApp Store, I would like to place an order:',
      '',
      ...items.map(
        (item, idx) =>
          `${idx + 1}. ${item.product.name}${
            item.variant ? ` (${item.variant})` : ''
          } × ${item.quantity} — ${formatNaira(
            item.product.price * item.quantity
          )}`
      ),
      '',
      `Subtotal: ${formatNaira(subtotal)}`,
      `Delivery (${selectedZone.id}): ${
        deliveryFee === 0 ? 'FREE' : formatNaira(deliveryFee)
      }`,
      `Estimated Total: ${formatNaira(finalTotal)}`,
    ];

    if (customerName.trim()) {
      lines.push('', `Name: ${customerName.trim()}`);
    }
    if (customerPhone.trim()) {
      lines.push(`Phone: ${customerPhone.trim()}`);
    }
    if (deliveryAddress.trim()) {
      lines.push(`Delivery Address: ${deliveryAddress.trim()}`);
    }
    if (notes.trim()) {
      lines.push(`Note: ${notes.trim()}`);
    }

    lines.push('', 'Please confirm availability and payment details. Thank you!');
    return lines.join('\n');
  };

  const messageText = buildWhatsAppMessage();
  const whatsappUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    messageText
  )}`;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const confirmed: ConfirmedOrder = {
      orderId: `WA-${randomNum}`,
      createdAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      customerName: customerName.trim() || 'Valued Customer',
      customerPhone: customerPhone.trim() || 'Provided on WhatsApp',
      deliveryArea: selectedZone.id,
      deliveryAddress: deliveryAddress.trim() || selectedZone.id,
      deliveryFee,
      subtotal,
      total: finalTotal,
      items: [...items],
      whatsappMessage: messageText,
    };
    onOrderConfirmed(confirmed);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Complete Order on WhatsApp"
    >
      <div
        className="relative w-full max-w-3xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="px-6 py-4 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[var(--color-whatsapp)] text-[#0B2518] flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-serif-display text-base font-semibold text-[var(--color-text-main)]">
                WhatsApp Order Dispatch
              </h2>
              <p className="text-[11px] text-[var(--color-text-subtle)]">
                Direct Line: {STORE_DISPLAY_PHONE} · Instant confirmation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close WhatsApp checkout"
            className="w-8 h-8 rounded-full hover:bg-[var(--color-border)] flex items-center justify-center text-[var(--color-text-main)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form & Live Message Preview */}
        <form
          onSubmit={handleConfirmOrder}
          className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Left column: Delivery info */}
          <div className="md:col-span-6 space-y-3.5">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] block mb-0.5">
                Step 1 · Delivery Details
              </span>
              <p className="text-xs text-[var(--color-text-muted)]">
                Add your destination so our dispatch team can schedule your delivery.
              </p>
            </div>

            <div>
              <label
                htmlFor="waName"
                className="block text-xs font-semibold text-[var(--color-text-main)] mb-1"
              >
                Your Name
              </label>
              <input
                id="waName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Adebayo Ogunlesi"
                className="w-full h-10 px-3 text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-main)]"
              />
            </div>

            <div>
              <label
                htmlFor="waPhone"
                className="block text-xs font-semibold text-[var(--color-text-main)] mb-1"
              >
                WhatsApp Phone Number
              </label>
              <input
                id="waPhone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. 0803 123 4567"
                className="w-full h-10 px-3 text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-main)]"
              />
            </div>

            <div>
              <label
                htmlFor="waZone"
                className="block text-xs font-semibold text-[var(--color-text-main)] mb-1"
              >
                Delivery Zone
              </label>
              <select
                id="waZone"
                value={deliveryArea}
                onChange={(e) => setDeliveryArea(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-main)] cursor-pointer"
              >
                {DELIVERY_ZONES.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.label} —{' '}
                    {subtotal >= FREE_DELIVERY_THRESHOLD
                      ? 'Free'
                      : formatNaira(zone.fee)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="waAddress"
                className="block text-xs font-semibold text-[var(--color-text-main)] mb-1"
              >
                Address or Landmark
              </label>
              <input
                id="waAddress"
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g. 18 Bourdillon Road, Ikoyi"
                className="w-full h-10 px-3 text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-main)]"
              />
            </div>

            <div>
              <label
                htmlFor="waNotes"
                className="block text-xs font-semibold text-[var(--color-text-main)] mb-1"
              >
                Optional Delivery Instructions
              </label>
              <input
                id="waNotes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please ring bell upon arrival"
                className="w-full h-10 px-3 text-xs bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-main)]"
              />
            </div>
          </div>

          {/* Right column: Live WhatsApp Message Preview */}
          <div className="md:col-span-6 flex flex-col justify-between bg-[var(--color-surface-subtle)] rounded-xl p-4 border border-[var(--color-border)]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
                  Step 2 · Pre-Formatted Message
                </span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-main)] hover:underline cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                      <span className="text-[var(--color-accent)]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[var(--color-surface)] rounded-xl p-3 border border-[var(--color-border)] shadow-2xs">
                <pre className="text-[11px] text-[var(--color-text-main)] whitespace-pre-wrap font-mono-num leading-relaxed max-h-56 overflow-y-auto">
                  {messageText}
                </pre>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--color-border)] space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                <ShieldCheck className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                <span>
                  Confirm first on WhatsApp. Pay via bank transfer or POS on delivery.
                </span>
              </div>

              <button
                type="submit"
                className="w-full h-11 px-4 bg-[var(--color-whatsapp)] hover:opacity-95 text-[#0B2518] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>Send Order to WhatsApp Store</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-9 px-4 bg-[var(--color-surface)] hover:bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] border border-[var(--color-border)] text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Open in external WhatsApp client</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-subtle)]" />
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
