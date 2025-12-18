'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export function useCart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getCart() as any;
      setCart(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (productId: number, quantity: number = 1) => {
    try {
      const response = await apiClient.addToCart({
        product_id: productId,
        quantity,
      }) as any;
      if (response.success) {
        await fetchCart();
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  const updateItem = async (productId: number, quantity: number) => {
    try {
      const response = await apiClient.updateCartItem(productId, quantity) as any;
      if (response.success) {
        await fetchCart();
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const response = await apiClient.removeCartItem(itemId) as any;
      if (response.success) {
        await fetchCart();
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const response = await apiClient.clearCart() as any;
      if (response.success) {
        await fetchCart();
      }
      return response;
    } catch (err) {
      throw err;
    }
  };

  return {
    cart,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refresh: fetchCart,
  };
}
