'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function PaymentStatusDropdown({
  orderId,
  isPaid,
}: {
  orderId: string;
  isPaid: boolean;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIsPaid = e.target.value === 'true';
    setIsUpdating(true);

    const updatePromise = fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, isPaid: newIsPaid }),
    }).then(async (res) => {
      if (!res.ok) throw new Error('Failed to update payment status');
      router.refresh();
    });

    toast.promise(updatePromise, {
      loading: 'Updating payment...',
      success: newIsPaid ? 'Marked as Paid ✓' : 'Marked as Unpaid',
      error: 'Failed to update payment status',
    });

    try {
      await updatePromise;
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={isPaid ? 'true' : 'false'}
      onChange={handleChange}
      disabled={isUpdating}
      className={`rounded-md border px-2 py-1 text-xs font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-rose-gold disabled:opacity-50 ${
        isPaid
          ? 'border-green-300 bg-green-50 text-green-700'
          : 'border-red-300 bg-red-50 text-red-700'
      }`}
    >
      <option value="false">Unpaid</option>
      <option value="true">Paid</option>
    </select>
  );
}
