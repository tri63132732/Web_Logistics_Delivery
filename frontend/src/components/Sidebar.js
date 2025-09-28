export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 h-screen p-4">
      <ul>
        <li className="mb-2"><a href="/dashboard">Dashboard</a></li>
        <li className="mb-2"><a href="/orders">Orders</a></li>
        <li className="mb-2"><a href="/drivers">Drivers</a></li>
      </ul>
    </aside>
  );
}
