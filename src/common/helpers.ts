function randomNumberWithinRange(min, max) {
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

export function generateOTP() {
  return randomNumberWithinRange(100000, 999999);
}

export function paginateData(items: any[], page?: any) {
  const totalNumber = items.length;
  const totalPages = Math.max(Math.ceil(totalNumber / 20), 1);
  const currentPage = Math.min(Number.parseInt(page, 10) || 1, totalPages);
  return {
    currentPage,
    totalPages,
    data: items.slice(currentPage - 1, currentPage + 20),
  };
}
