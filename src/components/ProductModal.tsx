import React, { useState, useEffect } from 'react';
import { X, Check, Minus, Plus, MessageCircle } from 'lucide-react';
import { Product, formatNaira } from '../data/products';
import { SmartProductImage } from './SmartProductImage';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, variant?: string) => void;
  onDirectWhatsApp: (product: Product, quantity: number, variant?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectWhatsApp,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedVariant(product.variants?.[0] || '');
      setActiveImageIndex(0);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && product) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const currentImageUrl =
    product.gallery?.[activeImageIndex] || product.imageUrl;

  return (
    <div
      id="productModal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalName"
    >
      <div
        className="relative w-full max-w-4xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="modalClose"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[var(--color-surface)]/80 hover:bg-[var(--color-surface-subtle)] text-[var(--color-text-main)] flex items-center justify-center transition-colors border border-[var(--color-border)] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Realistic Product Photography & Specs */}
        <div className="md:w-1/2 bg-[var(--color-surface-subtle)] flex flex-col justify-between">
          <div className="aspect-4/3 md:aspect-auto md:h-full relative overflow-hidden flex items-center justify-center">
            <SmartProductImage
              src={currentImageUrl}
              alt={product.name}
              type={product.id}
              className="w-full h-full"
            />
          </div>

          {/* Photo Gallery Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="px-4 py-2 bg-[var(--color-surface)]/90 border-t border-[var(--color-border)] flex items-center gap-2 overflow-x-auto">
              {product.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border transition-all cursor-pointer shrink-0 ${
                    activeImageIndex === idx
                      ? 'ring-2 ring-[var(--color-accent)] border-transparent'
                      : 'border-[var(--color-border)] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} angle ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="p-4 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)] flex items-center justify-between gap-2">
            <span>{product.specs}</span>
            <span className="text-[var(--color-text-main)] font-semibold whitespace-nowrap">
              1-Year Warranty
            </span>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Unboxed Metadata */}
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-subtle)] mb-2">
              <span id="modalCategory">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[var(--color-accent)] font-semibold">
                {product.availability}
              </span>
            </div>

            <h2
              id="modalName"
              className="font-serif-display text-2xl sm:text-[28px] font-medium text-[var(--color-text-main)] leading-tight mb-2"
            >
              {product.name}
            </h2>

            <p
              id="modalTagline"
              className="text-[14px] text-[var(--color-text-muted)] leading-relaxed mb-4"
            >
              {product.tagline}
            </p>

            <div
              id="modalPrice"
              className="text-2xl font-semibold text-[var(--color-text-main)] tabular-nums pb-4 mb-5 border-b border-[var(--color-border)]"
            >
              {formatNaira(product.price)}
            </div>

            {/* Variants if available */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-5">
                <div className="text-xs text-[var(--color-text-subtle)] mb-2">
                  Finish:{' '}
                  <span className="text-[var(--color-text-main)] font-medium">
                    {selectedVariant}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                        selectedVariant === variant
                          ? 'bg-[var(--color-text-main)] text-[var(--color-surface)] border-[var(--color-text-main)] font-medium'
                          : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Why you'll like it */}
            <div className="mb-5">
              <h3 className="text-xs font-semibold tracking-wider text-[var(--color-text-subtle)] uppercase mb-3">
                Why you’ll like it
              </h3>
              <div id="modalBenefits" className="space-y-3">
                {product.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-[var(--color-accent-subtle)] text-[var(--color-accent)] flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5" strokeWidth={2.5} />
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-[var(--color-text-main)]">
                        {benefit.title}
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed mt-0.5">
                        {benefit.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Who it's for */}
            <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] mb-5">
              <span className="text-xs font-semibold text-[var(--color-text-main)] block mb-0.5">
                Who this is useful for
              </span>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {product.bestFor}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[var(--color-border)] space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[var(--color-border)] rounded-xl bg-[var(--color-surface)] h-11 px-1">
                <button
                  id="modalMinus"
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-9 h-9 flex items-center justify-center text-[var(--color-text-main)] hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span
                  id="modalQuantity"
                  className="w-8 text-center text-sm font-semibold tabular-nums text-[var(--color-text-main)]"
                >
                  {quantity}
                </span>
                <button
                  id="modalPlus"
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-9 h-9 flex items-center justify-center text-[var(--color-text-main)] hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                id="modalAdd"
                type="button"
                onClick={() => {
                  onAddToCart(product, quantity, selectedVariant);
                  onClose();
                }}
                className="flex-1 h-11 px-5 bg-[var(--color-text-main)] hover:opacity-90 text-[var(--color-surface)] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-xs"
              >
                <span>Add to Cart</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {formatNaira(product.price * quantity)}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onDirectWhatsApp(product, quantity, selectedVariant);
              }}
              className="w-full h-10 px-4 bg-[var(--color-accent-subtle)] hover:opacity-90 text-[var(--color-accent)] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer border border-[var(--color-border)]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Order this item directly on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
