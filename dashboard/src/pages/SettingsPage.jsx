export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-white mb-2">Settings</h1>
      <p className="text-[#444] text-sm mb-8">Venue profile, payments, notifications, and integrations.</p>
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">⚙️</div>
        <div className="text-white font-bold mb-2">Venue Settings</div>
        <div className="text-[#444] text-sm">Profile · Stripe connect · APNs · Opening hours · Rules & policies</div>
      </div>
    </div>
  );
}
