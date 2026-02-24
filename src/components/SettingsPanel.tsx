
'use client';

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell, SearchSlash, History, Palette } from 'lucide-react';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/localStorage';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATION_SETTINGS_KEY = 'localPulseNotificationSettings';
const SEARCH_HISTORY_SETTINGS_KEY = 'localPulseSearchHistorySettings';

const SettingsPanel: FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);


  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [searchHistoryEnabled, setSearchHistoryEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);
    const storedNotificationSetting = getFromLocalStorage(NOTIFICATION_SETTINGS_KEY);
    if (storedNotificationSetting !== null) {
      setNotificationsEnabled(storedNotificationSetting);
    } else {
      saveToLocalStorage(NOTIFICATION_SETTINGS_KEY, true);
    }

    const storedSearchHistorySetting = getFromLocalStorage(SEARCH_HISTORY_SETTINGS_KEY);
    if (storedSearchHistorySetting !== null) {
      setSearchHistoryEnabled(storedSearchHistorySetting);
    } else {
      saveToLocalStorage(SEARCH_HISTORY_SETTINGS_KEY, true);
    }
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    saveToLocalStorage(NOTIFICATION_SETTINGS_KEY, checked);
    setNotificationsEnabled(checked);
    saveToLocalStorage(NOTIFICATION_SETTINGS_KEY, checked);
    console.log(`Notifications ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleSearchHistoryToggle = (checked: boolean) => {
    setSearchHistoryEnabled(checked);
    saveToLocalStorage(SEARCH_HISTORY_SETTINGS_KEY, checked);
    setSearchHistoryEnabled(checked);
    saveToLocalStorage(SEARCH_HISTORY_SETTINGS_KEY, checked);
    console.log(`Search history saving ${checked ? 'enabled' : 'disabled'}`);
    if (!checked) {
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] glass-effect">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">App Settings</DialogTitle>
          <DialogDescription>
            Customize your Local Pulse experience. Changes are saved automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Theme Preference */}
          <div className="flex flex-col space-y-2 p-3 rounded-lg glass-effect">
            <div className="flex items-center space-x-3 mb-2">
              <Palette className="h-5 w-5 text-primary" />
              <Label htmlFor="theme-preference" className="text-base font-medium">Theme Preference</Label>
            </div>
            <div className="flex items-center justify-around space-x-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('light')}
                className="rounded-full flex-1 group"
              >
                <Sun className="h-4 w-4 mr-2 group-hover:text-yellow-500 transition-colors" /> Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('dark')}
                className="rounded-full flex-1 group"
              >
                <Moon className="h-4 w-4 mr-2 group-hover:text-blue-400 transition-colors" /> Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('system')}
                className="rounded-full flex-1"
              >
                System
              </Button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="flex items-center justify-between space-x-2 p-3 rounded-lg glass-effect">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-primary" />
              <Label htmlFor="notifications-enabled" className="text-base font-medium">
                Enable Notifications
              </Label>
            </div>
            <Switch
              id="notifications-enabled"
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationsToggle}
              aria-label="Toggle event notifications"
            />
          </div>
          <p className="text-xs text-muted-foreground px-3 -mt-4">
            Receive updates about new events and important announcements. (This is a mock setting)
          </p>

          {/* Search History Toggle */}
          <div className="flex items-center justify-between space-x-2 p-3 rounded-lg glass-effect">
            <div className="flex items-center space-x-3">
              <History className="h-5 w-5 text-primary" />
              <Label htmlFor="search-history-enabled" className="text-base font-medium">
                Save Search History
              </Label>
            </div>
            <Switch
              id="search-history-enabled"
              checked={searchHistoryEnabled}
              onCheckedChange={handleSearchHistoryToggle}
              aria-label="Toggle search history saving"
            />
          </div>
          <p className="text-xs text-muted-foreground px-3 -mt-4">
            Allow the app to remember your search queries for faster access. (This is a mock setting)
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="rounded-full">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
