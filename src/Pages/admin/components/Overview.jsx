// src/pages/admin/components/Overview.jsx
import StatsCards        from './StatsCards';
import MiniCalendar      from './MiniCalendar';
import RecentReservations from './RecentReservations';

export default function Overview({ reservations, users, farm }) {
  return (
    <div className="space-y-6">
      <StatsCards reservations={reservations} users={users} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MiniCalendar reservations={reservations} />
        <RecentReservations reservations={reservations} />
      </div>
    </div>
  );
}