import React, { useState } from 'react';
import { useParams, useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CreditCard,
  Phone,
  CheckCircle2,
  AlertCircle,
  Truck,
  Store,
  Lock,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';
import { PRODUCTS, STORE_INFO } from '../data/mockData.ts';
import type {
  CheckoutFormData,
  CheckoutFormErrors,
  OrderSummary,
} from '../types/shop.ts';
import { formatUSD, formatZIG, calculateDeliveryTotal } from '../utils/currency.ts';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.tsx';
import { buildWhatsAppUrl, formatOrderMessage } from '../utils/whatsapp.ts';

export const CheckoutPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();

  const product = PRODUCTS.find((p) => p.id === productId);

  // If no product found, navigate to catalog
  if (!product) {
    return <Navigate to="/catalog" replace />;
  }

  const locationState = (location.state as any) || {};
  const initialSize = locationState.size || product.sizes[0] || 'Standard';
  const initialColor = locationState.color || product.colors[0] || 'Standard';
  const initialQuantity = locationState.quantity ? Number(locationState.quantity) : 1;

  // Multi-step: 1 = Review & Customer Info, 2 = Payment Details, 3 = Processing / Success
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<OrderSummary | null>(null);

  // Form State
  const [formData, setFormData] = useState<CheckoutFormData>({
    paymentMethod: 'ecocash',
    ecocashPhone: '',
    ecocashName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardName: '',
    selectedSize: initialSize,
    selectedColor: initialColor,
    quantity: initialQuantity,
    deliveryOption: 'pickup',
    deliveryAddress: '',
    deliveryCity: 'Harare',
    customerName: '',
    customerPhone: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<CheckoutFormErrors>({});

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Card input auto-formatters
  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (val: string) =>
    val.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');

  // Validate step 1
  const validateStep1 = (): boolean => {
    const errs: CheckoutFormErrors = {};
    if (!formData.customerName.trim()) {
      errs.customerName = 'Please enter your full name';
    }
    if (!formData.customerPhone.trim() || formData.customerPhone.length < 8) {
      errs.customerPhone = 'Please provide a valid phone number (e.g. 077 123 4567)';
    }
    if (formData.deliveryOption === 'delivery' && !formData.deliveryAddress.trim()) {
      errs.deliveryAddress = 'Delivery address is required for Harare home delivery';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate step 2
  const validateStep2 = (): boolean => {
    const errs: CheckoutFormErrors = {};
    if (formData.paymentMethod === 'ecocash') {
      if (!formData.ecocashPhone.trim() || formData.ecocashPhone.replace(/\D/g, '').length < 9) {
        errs.ecocashPhone = 'Valid EcoCash phone number required';
      }
      if (!formData.ecocashName.trim()) {
        errs.ecocashName = 'Account subscriber name required';
      }
    } else {
      const rawCard = formData.cardNumber.replace(/\s/g, '');
      if (rawCard.length < 16) {
        errs.cardNumber = 'Valid 16-digit card number required';
      }
      if (!formData.cardExpiry.includes('/') || formData.cardExpiry.length < 5) {
        errs.cardExpiry = 'Valid expiration (MM/YY) required';
      }
      if (formData.cardCVV.length < 3) {
        errs.cardCVV = '3-digit security code required';
      }
      if (!formData.cardName.trim()) {
        errs.cardName = 'Name on card required';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      customerName: true,
      customerPhone: true,
      deliveryAddress: true,
    });
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      ecocashPhone: true,
      ecocashName: true,
      cardNumber: true,
      cardExpiry: true,
      cardCVV: true,
      cardName: true,
    });

    if (validateStep2()) {
      setCurrentStep(3);
      setIsProcessing(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Generate order ref: HP- + timestamp last 6 digits
      const orderRef = 'HP-' + Date.now().toString().slice(-6);
      const totalUSD = calculateDeliveryTotal(
        product.price * formData.quantity,
        formData.deliveryOption
      );

      const orderSummary: OrderSummary = {
        product,
        selectedSize: formData.selectedSize,
        selectedColor: formData.selectedColor,
        quantity: formData.quantity,
        totalUSD,
        paymentMethod: formData.paymentMethod,
        deliveryOption: formData.deliveryOption,
        deliveryAddress:
          formData.deliveryOption === 'delivery'
            ? `${formData.deliveryAddress}, ${formData.deliveryCity}`
            : undefined,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        orderRef,
        timestamp: new Date().toISOString(),
      };

      // 1.5s simulated network gateway authorization delay
      setTimeout(() => {
        setIsProcessing(false);
        setCompletedOrder(orderSummary);
      }, 1500);
    }
  };

  const subtotalUSD = product.price * formData.quantity;
  const grandTotalUSD = calculateDeliveryTotal(subtotalUSD, formData.deliveryOption);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full bg-[#fafaf9]"
    >
      {/* Step Indicator Header */}
      <div className="mb-8 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#b8860b] block mb-1">
          H & P Secure Checkout
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#064e3b] tracking-tight">
          {currentStep === 1 && 'Step 1: Review & Contact Information'}
          {currentStep === 2 && 'Step 2: Select & Authorize Payment'}
          {currentStep === 3 && (isProcessing ? 'Authorizing Transaction...' : 'Order Confirmation')}
        </h1>

        {/* Progress Bar Pills: Matte Gold Accent (10%) */}
        <div className="flex items-center justify-center gap-3 mt-6 max-w-xs mx-auto">
          <div
            className={`h-2 flex-1 rounded-full transition-colors ${
              currentStep >= 1 ? 'bg-[#c59b27]' : 'bg-stone-200'
            }`}
          />
          <div
            className={`h-2 flex-1 rounded-full transition-colors ${
              currentStep >= 2 ? 'bg-[#c59b27]' : 'bg-stone-200'
            }`}
          />
          <div
            className={`h-2 flex-1 rounded-full transition-colors ${
              currentStep >= 3 ? 'bg-[#c59b27]' : 'bg-stone-200'
            }`}
          />
        </div>
      </div>

      {/* STEP 1: REVIEW & CUSTOMER DETAILS */}
      {currentStep === 1 && (
        <form onSubmit={handleProceedToPayment} className="space-y-8">
          {/* Product Summary Card: Crisp White (60%) */}
          <div className="luxury-card p-6 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div
                className={`w-20 h-20 rounded-2xl ${product.mockImages[0]} flex items-center justify-center text-3xl shrink-0 border border-black/10`}
              >
                {product.category === 'formal-footwear' && '👞'}
                {product.category === 'luxury-sneakers' && '👟'}
                {product.category === 'premium-boots' && '🥾'}
                {product.category === 'designer-clothing' && '👔'}
                {product.category === 'accessories' && '🕶️'}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#065f46]">
                  {product.brand}
                </span>
                <h3 className="font-bold text-stone-900 text-base">{product.name}</h3>
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span>Size: <strong className="text-stone-900">{formData.selectedSize}</strong></span>
                  <span>•</span>
                  <span>Color: <strong className="text-stone-900">{formData.selectedColor}</strong></span>
                  <span>•</span>
                  <span>Qty: <strong className="text-stone-900">{formData.quantity}</strong></span>
                </div>
              </div>
            </div>

            <div className="text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100 flex sm:flex-col justify-between items-center sm:items-end">
              <span className="text-xs text-stone-500">Item Total:</span>
              <div>
                <span className="text-xl font-extrabold text-[#064e3b]">{formatUSD(subtotalUSD)}</span>
                <div className="text-xs text-[#b8860b] font-medium">≈ {formatZIG(subtotalUSD)}</div>
              </div>
            </div>
          </div>

          {/* Delivery Options Toggle */}
          <div className="luxury-card p-6 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#064e3b]">
              Fulfillment Method
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, deliveryOption: 'pickup' })}
                className={`cursor-pointer p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  formData.deliveryOption === 'pickup'
                    ? 'border-[#064e3b] bg-emerald-50/70 text-stone-900 ring-1 ring-[#064e3b]'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <Store className="w-5 h-5 text-[#065f46] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-[#064e3b]">Store Pickup (Free)</div>
                  <div className="text-xs text-stone-500 mt-1">
                    52CW+952 Dolphin 123, Leopold Takawira St, Harare
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 mt-1">
                    Ready for walk-in collection today
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, deliveryOption: 'delivery' })}
                className={`cursor-pointer p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  formData.deliveryOption === 'delivery'
                    ? 'border-[#064e3b] bg-emerald-50/70 text-stone-900 ring-1 ring-[#064e3b]'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <Truck className="w-5 h-5 text-[#065f46] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-[#064e3b]">Harare Doorstep Delivery (+$3)</div>
                  <div className="text-xs text-stone-500 mt-1">
                    Direct door delivery anywhere within Greater Harare
                  </div>
                  <div className="text-xs font-semibold text-[#b8860b] mt-1">
                    Same-day or next-morning dispatch
                  </div>
                </div>
              </button>
            </div>

            {/* Delivery Address fields */}
            {formData.deliveryOption === 'delivery' && (
              <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label htmlFor="deliveryAddress" className="block text-xs font-bold text-stone-700">
                    Street Address / Suburb *
                  </label>
                  <input
                    id="deliveryAddress"
                    type="text"
                    placeholder="e.g. 14 Josiah Chinamano Ave, Avenues"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    onBlur={() => handleBlur('deliveryAddress')}
                    className="luxury-input text-xs border-stone-300"
                  />
                  {touched.deliveryAddress && errors.deliveryAddress && (
                    <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.deliveryAddress}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="deliveryCity" className="block text-xs font-bold text-stone-700">
                    City
                  </label>
                  <input
                    id="deliveryCity"
                    type="text"
                    value={formData.deliveryCity}
                    readOnly
                    className="luxury-input text-xs opacity-75 bg-stone-100 border-stone-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Customer Details Form */}
          <div className="luxury-card p-6 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#064e3b]">
              Customer Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="customerName" className="block text-xs font-bold text-stone-700">
                  Full Name *
                </label>
                <input
                  id="customerName"
                  type="text"
                  placeholder="e.g. Simba Munetsi"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  onBlur={() => handleBlur('customerName')}
                  className="luxury-input text-xs border-stone-300"
                />
                {touched.customerName && errors.customerName && (
                  <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="customerPhone" className="block text-xs font-bold text-stone-700">
                  Phone / WhatsApp Number *
                </label>
                <input
                  id="customerPhone"
                  type="tel"
                  placeholder="e.g. 077 259 1965"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  onBlur={() => handleBlur('customerPhone')}
                  className="luxury-input text-xs border-stone-300"
                />
                {touched.customerPhone && errors.customerPhone && (
                  <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.customerPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Step 1 Order Total & Action: Matte Gold CTA (10%) */}
          <div className="luxury-card p-6 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div>
              <span className="text-xs text-stone-500">Total Due:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#064e3b]">{formatUSD(grandTotalUSD)}</span>
                <span className="text-sm font-bold text-[#b8860b]">
                  ({formatZIG(grandTotalUSD)})
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#c59b27]/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: PAYMENT METHOD SELECTION & AUTHORIZATION */}
      {currentStep === 2 && (
        <form onSubmit={handleConfirmPayment} className="space-y-8">
          {/* Method Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* EcoCash Card */}
            <div
              onClick={() => setFormData({ ...formData, paymentMethod: 'ecocash' })}
              className={`luxury-card p-6 rounded-2xl cursor-pointer border transition-all relative ${
                formData.paymentMethod === 'ecocash'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-600'
                  : 'border-stone-200 bg-white hover:border-stone-300 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-[#065f46] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                {formData.paymentMethod === 'ecocash' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                )}
              </div>
              <h3 className="font-extrabold text-base text-[#064e3b]">Pay with EcoCash</h3>
              <p className="text-xs text-stone-600 mt-1">
                Instant USSD push prompt sent straight to your Econet mobile wallet.
              </p>
              <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                EcoCash Zimbabwe · Dial *151#
              </div>
            </div>

            {/* Visa / Mastercard Card */}
            <div
              onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
              className={`luxury-card p-6 rounded-2xl cursor-pointer border transition-all relative ${
                formData.paymentMethod === 'card'
                  ? 'border-[#064e3b] bg-emerald-50/70 shadow-md ring-2 ring-[#064e3b]'
                  : 'border-stone-200 bg-white hover:border-stone-300 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-300 text-[#064e3b] flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                {formData.paymentMethod === 'card' && (
                  <CheckCircle2 className="w-5 h-5 text-[#064e3b]" />
                )}
              </div>
              <h3 className="font-extrabold text-base text-[#064e3b]">Visa / Mastercard</h3>
              <p className="text-xs text-stone-600 mt-1">
                Secure international payment processing. Ideal for diaspora family orders.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[10px] font-black text-blue-700">
                  VISA
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-[10px] font-black text-amber-700">
                  MASTERCARD
                </span>
              </div>
            </div>
          </div>

          {/* Form details dependent on method */}
          {formData.paymentMethod === 'ecocash' ? (
            <div className="luxury-card p-6 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-[#064e3b]">
                  EcoCash Mobile Wallet Details
                </span>
                <span className="text-xs text-stone-600 font-mono">
                  Amount: {formatUSD(grandTotalUSD)} = {formatZIG(grandTotalUSD)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="ecocashPhone" className="block text-xs font-bold text-stone-700">
                    EcoCash Registered Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                      +263
                    </span>
                    <input
                      id="ecocashPhone"
                      type="tel"
                      placeholder="77 259 1965"
                      value={formData.ecocashPhone}
                      onChange={(e) => setFormData({ ...formData, ecocashPhone: e.target.value })}
                      onBlur={() => handleBlur('ecocashPhone')}
                      className="luxury-input pl-16 text-xs border-stone-300"
                    />
                  </div>
                  {touched.ecocashPhone && errors.ecocashPhone && (
                    <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.ecocashPhone}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="ecocashName" className="block text-xs font-bold text-stone-700">
                    EcoCash Account Subscriber Name *
                  </label>
                  <input
                    id="ecocashName"
                    type="text"
                    placeholder="Full name as shown in EcoCash"
                    value={formData.ecocashName}
                    onChange={(e) => setFormData({ ...formData, ecocashName: e.target.value })}
                    onBlur={() => handleBlur('ecocashName')}
                    className="luxury-input text-xs border-stone-300"
                  />
                  {touched.ecocashName && errors.ecocashName && (
                    <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.ecocashName}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#064e3b] flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>
                  You will receive a USSD prompt on your phone to authorize this payment via EcoCash
                  PIN. Keep your phone unlocked.
                </span>
              </div>
            </div>
          ) : (
            <div className="luxury-card p-6 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-[#064e3b]">
                  Credit / Debit Card Authorization
                </span>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>256-bit SSL Encrypted</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="cardNumber" className="block text-xs font-bold text-stone-700">
                    Card Number (16 Digits) *
                  </label>
                  <input
                    id="cardNumber"
                    type="text"
                    maxLength={19}
                    placeholder="4000 1234 5678 9010"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })
                    }
                    onBlur={() => handleBlur('cardNumber')}
                    className="luxury-input text-xs font-mono border-stone-300"
                  />
                  {touched.cardNumber && errors.cardNumber && (
                    <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="cardExpiry" className="block text-xs font-bold text-stone-700">
                      Expiry (MM/YY) *
                    </label>
                    <input
                      id="cardExpiry"
                      type="text"
                      maxLength={5}
                      placeholder="12/28"
                      value={formData.cardExpiry}
                      onChange={(e) =>
                        setFormData({ ...formData, cardExpiry: formatExpiry(e.target.value) })
                      }
                      onBlur={() => handleBlur('cardExpiry')}
                      className="luxury-input text-xs text-center font-mono border-stone-300"
                    />
                    {touched.cardExpiry && errors.cardExpiry && (
                      <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.cardExpiry}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="cardCVV" className="block text-xs font-bold text-stone-700">
                      Security Code (CVV) *
                    </label>
                    <input
                      id="cardCVV"
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={formData.cardCVV}
                      onChange={(e) =>
                        setFormData({ ...formData, cardCVV: e.target.value.replace(/\D/g, '') })
                      }
                      onBlur={() => handleBlur('cardCVV')}
                      className="luxury-input text-xs text-center font-mono border-stone-300"
                    />
                    {touched.cardCVV && errors.cardCVV && (
                      <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.cardCVV}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="cardName" className="block text-xs font-bold text-stone-700">
                    Cardholder Full Name *
                  </label>
                  <input
                    id="cardName"
                    type="text"
                    placeholder="e.g. S. MUNETSI"
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                    onBlur={() => handleBlur('cardName')}
                    className="luxury-input text-xs uppercase border-stone-300"
                  />
                  {touched.cardName && errors.cardName && (
                    <p className="text-red-600 text-xs flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.cardName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:bg-stone-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Review</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#c59b27] hover:bg-[#b38a1c] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#c59b27]/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Confirm & Authorize {formatUSD(grandTotalUSD)}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: PROCESSING & SUCCESS CONFIRMATION */}
      {currentStep === 3 && (
        <div className="luxury-card p-8 sm:p-12 rounded-3xl bg-white border border-[#c59b27]/40 text-center max-w-2xl mx-auto shadow-xl">
          {isProcessing ? (
            <div className="py-12 space-y-4">
              <LoadingSpinner size="lg" />
              <h3 className="text-xl font-bold text-[#064e3b]">Verifying Payment Gateway...</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Connecting with Harare payment authorization servers. Please do not close or
                refresh this window.
              </p>
            </div>
          ) : completedOrder ? (
            <div className="space-y-6">
              {/* Animated Matte Gold Checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-[#c59b27] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#c59b27]/30"
              >
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </motion.div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#065f46]">
                  Transaction Approved
                </span>
                <h2 className="text-3xl font-black text-[#064e3b] mt-1">Payment Confirmed!</h2>
                <div className="mt-2 inline-block px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-xs font-mono text-[#064e3b]">
                  Order Ref: <strong>{completedOrder.orderRef}</strong>
                </div>
              </div>

              {/* Order Summary Table */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-3">
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500">Item:</span>
                  <span className="font-bold text-stone-900">{completedOrder.product.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500">Size & Color:</span>
                  <span className="font-bold text-stone-900">
                    {completedOrder.selectedSize} · {completedOrder.selectedColor}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500">Payment:</span>
                  <span className="font-bold text-[#064e3b] capitalize">
                    {completedOrder.paymentMethod === 'ecocash' ? 'EcoCash Wallet' : 'Card'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200">
                  <span className="text-stone-500">Fulfillment:</span>
                  <span className="font-bold text-stone-900">
                    {completedOrder.deliveryOption === 'pickup'
                      ? 'Leopold Takawira Showroom Pickup'
                      : completedOrder.deliveryAddress}
                  </span>
                </div>
                <div className="flex justify-between py-1 pt-2 text-sm">
                  <span className="font-bold text-stone-900">Total Paid:</span>
                  <div className="text-right">
                    <span className="font-black text-[#064e3b]">
                      {formatUSD(completedOrder.totalUSD)}
                    </span>
                    <span className="text-xs text-stone-500 block font-normal">
                      ({formatZIG(completedOrder.totalUSD)})
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp & Navigation CTAs */}
              <div className="space-y-3 pt-2">
                <a
                  href={buildWhatsAppUrl(
                    STORE_INFO.whatsappClean,
                    formatOrderMessage(completedOrder)
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-xl bg-[#064e3b] hover:bg-[#043e2e] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#064e3b]/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Order Details to WhatsApp</span>
                </a>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs pt-2">
                  <Link
                    to="/catalog"
                    className="text-[#b8860b] hover:text-[#92400e] font-bold underline"
                  >
                    Continue Shopping
                  </Link>
                  <span className="text-stone-400 hidden sm:inline">•</span>
                  <a
                    href={STORE_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-600 hover:text-stone-900"
                  >
                    View Showroom Location
                  </a>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </motion.div>
  );
};
