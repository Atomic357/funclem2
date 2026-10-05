import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, formatNaira } from '../data/products';
import { SmartProductImage } from './SmartProductImage';

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, variant: string | undefined, delta: number) => void;
  onRemoveItem: (productId: string, variant: string | undefined) => void;
  onClearCart: () => void;
  onProceedToWhatsApp: () => void;
}

export const FREE_DELIVERY_THRESHOLD = 60000;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToWhatsApp,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <>
      <div
        id="overlay"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />

      <aside
        id="cartDrawer"
        aria-label="Shopping cart"
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-2xl flex flex-col justify-between"
      >
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-[var(--color-text-subtle)] uppercase block mb-0.5">
              Your Order
            </span>
            <div className="flex items-baseline gap-2">
              <h2 className="font-serif-display text-2xl font-medium text-[var(--color-text-main)]">
                Your Cart
              </h2>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          <button
            id="closeCart"
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="w-9 h-9 rounded-full hover:bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-text-main)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div
            id="emptyCart"
            className="flex-1 p-8 flex flex-col items-center justify-center text-center"
          >
            <div className="w-14 h-14 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center text-[var(--color-text-subtle)] mb-4">
              <ShoppingBag className="w-6 h-6" strokeWidth={1.6} />
            </div>
            <h3 className="font-serif-display text-xl font-medium text-[var(--color-text-main)] mb-1.5">
              Your cart is empty
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] max-w-xs mb-6">
              Add something useful from our collection and it will appear here ready for WhatsApp checkout.
            </p>
            <button
              id="startShopping"
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[var(--color-text-main)] text-[var(--color-surface)] hover:opacity-90 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer shadow-xs"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Free delivery progress bar */}
            <div className="px-6 py-3 bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
              {amountToFreeDelivery === 0 ? (
                <p className="font-semibold text-[var(--color-accent)]">
                  Qualifies for complimentary delivery on your order!
                </p>
              ) : (
                <p>
                  Add{' '}
                  <strong className="text-[var(--color-text-main)] tabular-nums">
                    {formatNaira(amountToFreeDelivery)}
                  </strong>{' '}
                  more for free delivery.
                </p>
              )}
            </div>

            {/* Cart Items */}
            <div
              id="cartItems"
              className="flex-1 overflow-y-auto p-6 divide-y divide-[var(--color-border)]"
            >
              {items.map((item) => {
                const key = `${item.product.id}-${item.variant || 'default'}`;
                return (
                  <div
                    key={key}
                    className="py-4 first:pt-0 last:pb-0 flex gap-4"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-[var(--color-surface-subtle)] shrink-0 border border-[var(--color-border)]">
                      <SmartProductImage
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        type={item.product.id}
                        className="w-full h-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-[var(--color-text-main)] leading-snug truncate">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              onRemoveItem(item.product.id, item.variant)
                            }
                            aria-label={`Remove ${item.product.name}`}
                            className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] p-1 -mr-1 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.variant && (
                          <span className="text-[11px] text-[var(--color-text-subtle)] block mt-0.5">
                            {item.variant}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] h-8 px-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                item.variant,
                                -1
                              )
                            }
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center text-[var(--color-text-main)] hover:bg-[var(--color-surface-subtle)] rounded-md transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold tabular-nums text-[var(--color-text-main)]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                item.variant,
                                1
                              )
                            }
                            aria-label="Increase quantity"
                            className="w-7 h-7 flex items-center justify-center text-[var(--color-text-main)] hover:bg-[var(--color-surface-subtle)] rounded-md transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-semibold text-[var(--color-text-main)] tabular-nums">
                          {formatNaira(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div
              id="cartFooter"
              className="p-6 bg-[var(--color-surface-subtle)] border-t border-[var(--color-border)] space-y-3.5"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                  <span>Delivery estimate</span>
                  <span>
                    {amountToFreeDelivery === 0
                      ? 'Free'
                      : 'Confirmed on WhatsApp'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-xs font-semibold text-[var(--color-text-main)]">
                    Estimated total
                  </span>
                  <strong
                    id="cartTotal"
                    className="text-xl font-semibold text-[var(--color-text-main)] tabular-nums"
                  >
                    {formatNaira(subtotal)}
                  </strong>
                </div>
              </div>

              <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                We’ll confirm availability, delivery timing, and the final amount with you directly on WhatsApp before payment.
              </p>

              <button
                id="whatsappOrder"
                type="button"
                onClick={onProceedToWhatsApp}
                className="w-full h-12 px-5 bg-[var(--color-whatsapp)] hover:opacity-95 text-[#0B2518] text-xs font-bold rounded-xl transition-all flex items-center justify-between shadow-sm cursor-pointer"
              >
                <span className="flex items-center gap-2.5 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-[#0B2518] animate-pulse" />
                  <span>Order on WhatsApp</span>
                </span>
                <ArrowRight className="w-4 h-4 text-[#0B2518]" />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};
