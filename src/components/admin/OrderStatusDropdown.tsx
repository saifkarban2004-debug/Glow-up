'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrderStatusDropdown({ 
  orderId, 
  currentStatus 
}: { 
  orderId: string, 
  currentStatus: string 
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsUpdating(true);

    const updatePromise = fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: newStatus }),
    }).then(async (res) => {
      if (!res.ok) throw new Error('Failed to update status');
      router.refresh();
    });

    toast.promise(updatePromise, {
      loading: 'Updating status...',
      success: 'Status updated successfully',
      error: 'Failed to update status',
    });

    try {
      await updatePromise;
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isUpdating}
      className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs font-medium text-neutral-700 shadow-sm focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold disabled:opacity-50"
    >
      {STATUSES.map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  );
}
