export default function RecentActivity() {
  const items = [
    { id: 1, text: 'Created charter: AI Course', time: '2h ago' },
    { id: 2, text: 'Generated UVZ report', time: '1d ago' },
    { id: 3, text: 'Used template: Coaching Pro', time: '3d ago' },
  ];
  return (
    <div className="rounded-xl glass p-4">
      <h3 className="font-medium text-gray-900">Recent activity</h3>
      <ul className="mt-3 space-y-2 text-sm text-gray-700">
        {items.map((i) => (
          <li key={i.id} className="flex items-center justify-between">
            <span>{i.text}</span>
            <span className="text-gray-400">{i.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
