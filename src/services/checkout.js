// Shared checkout for the platform gateway (Razorpay or Cashfree).
// The API decides the provider; this opens the matching SDK and returns the
// payload the backend's /verify endpoint expects.

function loadScript(id, src) {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) { resolve(); return; }
    const s = document.createElement('script');
    s.id = id;
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Could not load the payment SDK'));
    document.body.appendChild(s);
  });
}

/**
 * Open checkout for an order returned by the API.
 * Resolves with the verify payload, or null if the user cancelled.
 * Rejects with an Error (message suitable for a toast) if payment failed.
 */
export async function openCheckout(order, { name, description, image, color = '#2563EB' } = {}) {
  if (order.provider === 'cashfree') {
    await loadScript('cashfree-script', 'https://sdk.cashfree.com/js/v3/cashfree.js');
    const cashfree = window.Cashfree({ mode: order.cashfree_env === 'PROD' ? 'production' : 'sandbox' });
    const result = await cashfree.checkout({ paymentSessionId: order.payment_session_id, redirectTarget: '_modal' });
    if (result?.error) {
      // Closing the modal reports an error too — treat as cancel unless a payment was attempted.
      if (result.paymentDetails) throw new Error(result.error.message || 'Payment failed');
      return null;
    }
    return { cashfree_order_id: order.order_id };
  }

  await loadScript('razorpay-script', 'https://checkout.razorpay.com/v1/checkout.js');
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: order.razorpay_key,
      amount: Math.round(Number(order.amount) * 100),
      currency: order.currency || 'INR',
      name,
      description,
      image,
      order_id: order.order_id,
      prefill: order.prefill || {},
      theme: { color },
      handler: (resp) =>
        resolve({
          razorpay_order_id: resp.razorpay_order_id,
          razorpay_payment_id: resp.razorpay_payment_id,
          razorpay_signature: resp.razorpay_signature,
        }),
      modal: { ondismiss: () => resolve(null) },
    });
    rzp.on('payment.failed', (r) => reject(new Error(r?.error?.description || 'Payment failed')));
    rzp.open();
  });
}
