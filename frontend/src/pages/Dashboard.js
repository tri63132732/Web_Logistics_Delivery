import MainLayout from "../layouts/MainLayout";

export default function Dashboard() {
  const mockOrders = [
    { id: 1, orderNumber: "ORD001", status: "Pending" },
    { id: 2, orderNumber: "ORD002", status: "Delivered" },
  ];

  return (
    <MainLayout>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {mockOrders.map((order) => (
            <tr key={order.id}>
              <td className="border p-2">{order.orderNumber}</td>
              <td className="border p-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MainLayout>
  );
}
