export const mockProducts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Tech Gadget ${i + 1}`,
    price: Math.floor(Math.random() * 500) + 50,
    category: i % 3 === 0 ? "Electronics" : i % 3 === 1 ? "Accessories" : "Storage",
    stock: Math.floor(Math.random() * 100),
    status: i % 4 === 0 ? "Inactive" : "Active",
  }));
  
  export const statsData = {
    totalUsers: 1240,
    totalProducts: 50,
    totalOrders: 340,
    revenue: 45000,
  };