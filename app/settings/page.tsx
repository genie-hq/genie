import { getCurrentUser } from '@/lib/auth-helper';
import DisplayNameInput from './display-name-input';
import SettingItemTab from './settings-tab';

export default async function AccountSettingsPage() {
  const user = await getCurrentUser();

  const displayNameLabel = 'Display Name';
  const displayNameDescription =
    'Your display name is how you appear to others on Genie.';

  return (
    <div className="w-screen flex justify-center mt-4">
      <div className="grid gap-1 md:min-w-max md:max-w-lg">
        <SettingItemTab
          title={displayNameLabel}
          description={displayNameDescription}
        >
          <DisplayNameInput defaultValue={user!?.display_name} />
        </SettingItemTab>
      </div>
    </div>
  );
}
