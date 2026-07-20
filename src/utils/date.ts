/**
 * Formats a standard date string (e.g., YYYY-MM-DD) into a elegant Thai Buddhist Era date.
 * If the string is already in a custom Thai text or invalid, it returns the original string.
 */
export function formatThaiDate(dateString: string): string {
  if (!dateString) return '-';
  
  // Try to match standard YYYY-MM-DD
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateString; // Fallback to raw string
  
  const [_, yearStr, monthStr, dayStr] = match;
  const day = parseInt(dayStr, 10);
  const monthIdx = parseInt(monthStr, 10) - 1;
  const year = parseInt(yearStr, 10) + 543; // Convert to Buddhist Era (BE)
  
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  
  if (monthIdx < 0 || monthIdx > 11) return dateString;
  
  return `${day} ${thaiMonths[monthIdx]} ${year}`;
}

export function getShortThaiDateParts(dateString: string): { day: string; month: string } {
  if (!dateString) return { day: '-', month: '-' };
  
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return { day: dateString, month: 'กิจกรรม' };
  
  const [_, yearStr, monthStr, dayStr] = match;
  const day = parseInt(dayStr, 10);
  const monthIdx = parseInt(monthStr, 10) - 1;
  
  const shortMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  
  return {
    day: String(day),
    month: shortMonths[monthIdx] || '-'
  };
}
