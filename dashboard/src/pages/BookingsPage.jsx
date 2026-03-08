// BookingsPage.jsx
export function BookingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-white mb-2">Bookings</h1>
      <p className="text-[#444] text-sm mb-8">Manage all reservations for tonight and upcoming dates.</p>
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">📋</div>
        <div className="text-white font-bold mb-2">Full Bookings Manager</div>
        <div className="text-[#444] text-sm">Filter by date, table, promoter · Approve / reject · Export guest list</div>
      </div>
    </div>
  );
}
export default BookingsPage;
