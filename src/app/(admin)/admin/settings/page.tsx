import { Settings as SettingsIcon, Save } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  // In a real app, these would come from the database or environment
  const currentWhatsApp = process.env.WHATSAPP_PHONE || '201554397756';
  const currentAdminEmail = process.env.ADMIN_EMAIL || 'admin@glowup.com';

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blush rounded-lg text-rose-gold">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-semibold text-charcoal">Store Settings</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
          <h2 className="font-semibold text-charcoal">Store Configurations</h2>
          <p className="text-sm text-neutral-500 mt-1">Manage global settings for your Glow Up store.</p>
        </div>

        <div className="p-6">
          <form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="whatsapp" className="text-sm font-medium text-charcoal">
                  WhatsApp Number for COD
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500 text-sm">+</span>
                  <input
                    id="whatsapp"
                    type="text"
                    className="block w-full rounded-md border border-neutral-300 py-2 pl-7 pr-3 text-sm focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold"
                    defaultValue={currentWhatsApp}
                    disabled
                  />
                </div>
                <p className="text-xs text-neutral-500">
                  Currently configured via environment variable <code>WHATSAPP_PHONE</code>.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-charcoal">
                  Admin Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="block w-full rounded-md border border-neutral-300 py-2 px-3 text-sm focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold"
                  defaultValue={currentAdminEmail}
                  disabled
                />
                <p className="text-xs text-neutral-500">
                  Currently configured via environment variable <code>ADMIN_EMAIL</code>.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="notice" className="text-sm font-medium text-charcoal">
                Store Announcement Bar
              </label>
              <input
                id="notice"
                type="text"
                className="block w-full rounded-md border border-neutral-300 py-2 px-3 text-sm focus:border-rose-gold focus:outline-none focus:ring-1 focus:ring-rose-gold bg-neutral-50"
                placeholder="e.g. Free shipping on orders over $50!"
                disabled
              />
              <p className="text-xs text-neutral-500">
                (Placeholder UI for future dynamic settings expansion)
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex justify-end">
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 rounded-md bg-charcoal px-4 py-2 text-sm font-medium text-white opacity-50 cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
