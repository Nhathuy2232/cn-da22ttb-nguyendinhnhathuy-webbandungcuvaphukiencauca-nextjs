/**
 * Format price to Vietnamese Dong (VND) format
 * @param price - The price value to format
 * @returns Formatted price string (e.g., "1.500.000₫")
 */
export function formatPrice(price: number | string): string {
  // Convert string to number if needed and remove any decimal values
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Round to nearest integer (VND doesn't use decimals)
  const roundedPrice = Math.round(numPrice);
  
  // Format with dots as thousand separators
  return roundedPrice.toLocaleString('vi-VN') + '₫';
}
