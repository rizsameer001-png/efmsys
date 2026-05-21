// client/src/pages/settings/ThemeSettings.jsx
import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../api/settings.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const ThemeSettings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    theme: {
      mode: 'light', // light, dark, system
      primaryColor: '#3B82F6', // blue
      secondaryColor: '#10B981', // green
      accentColor: '#8B5CF6', // purple
      dangerColor: '#EF4444', // red
      warningColor: '#F59E0B', // amber
      successColor: '#10B981', // green
      infoColor: '#06B6D4', // cyan
    },
    layout: {
      sidebarCollapsed: false,
      compactMode: false,
      showBreadcrumbs: true,
      showNotifications: true,
      fixedHeader: true,
      boxedLayout: false,
    },
    font: {
      family: 'Inter',
      size: 'medium', // small, medium, large
    },
    animations: {
      enabled: true,
      duration: 'normal', // fast, normal, slow
    },
    customization: {
      roundedCorners: 'medium', // none, small, medium, large
      cardShadow: 'medium', // none, small, medium, large
      borderWidth: 'normal', // thin, normal, thick
    }
  });

  const colorPresets = [
    { name: 'Default Blue', primary: '#3B82F6', secondary: '#10B981', accent: '#8B5CF6' },
    { name: 'Ocean Teal', primary: '#0D9488', secondary: '#14B8A6', accent: '#22D3EE' },
    { name: 'Sunset Orange', primary: '#EA580C', secondary: '#F97316', accent: '#FBBF24' },
    { name: 'Purple Haze', primary: '#7C3AED', secondary: '#A855F7', accent: '#C084FC' },
    { name: 'Forest Green', primary: '#059669', secondary: '#10B981', accent: '#34D399' },
    { name: 'Rose Pink', primary: '#E11D48', secondary: '#F43F5E', accent: '#FDA4AF' }
  ];

  const fontFamilies = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Nunito', label: 'Nunito' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small', class: 'text-sm' },
    { value: 'medium', label: 'Medium', class: 'text-base' },
    { value: 'large', label: 'Large', class: 'text-lg' }
  ];

  const animationDurations = [
    { value: 'fast', label: 'Fast (150ms)', duration: 150 },
    { value: 'normal', label: 'Normal (300ms)', duration: 300 },
    { value: 'slow', label: 'Slow (500ms)', duration: 500 }
  ];

  const roundedOptions = [
    { value: 'none', label: 'None', class: 'rounded-none' },
    { value: 'small', label: 'Small', class: 'rounded-md' },
    { value: 'medium', label: 'Medium', class: 'rounded-lg' },
    { value: 'large', label: 'Large', class: 'rounded-xl' }
  ];

  const shadowOptions = [
    { value: 'none', label: 'None', class: 'shadow-none' },
    { value: 'small', label: 'Small', class: 'shadow-sm' },
    { value: 'medium', label: 'Medium', class: 'shadow-md' },
    { value: 'large', label: 'Large', class: 'shadow-lg' }
  ];

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  const fetchThemeSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsApi.getThemeSettings();
      if (response.data.success) {
        setSettings(response.data.data);
        applyThemeToDocument(response.data.data);
      }
    } catch (error) {
      console.error('Fetch theme settings error:', error);
      showToast('Failed to load theme settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyThemeToDocument = (themeSettings) => {
    // Apply primary color
    document.documentElement.style.setProperty('--primary-color', themeSettings.theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', themeSettings.theme.secondaryColor);
    
    // Apply font family
    document.documentElement.style.fontFamily = themeSettings.font.family;
    
    // Apply dark/light mode
    if (themeSettings.theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleColorChange = (colorType, value) => {
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [colorType]: value
      }
    }));
    document.documentElement.style.setProperty(`--${colorType}-color`, value);
  };

  const handleThemeModeChange = (mode) => {
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        mode
      }
    }));
    
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLayoutChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [key]: value
      }
    }));
  };

  const handleFontChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      font: {
        ...prev.font,
        [key]: value
      }
    }));
    
    if (key === 'family') {
      document.documentElement.style.fontFamily = value;
    }
  };

  const applyPreset = (preset) => {
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        primaryColor: preset.primary,
        secondaryColor: preset.secondary,
        accentColor: preset.accent
      }
    }));
    
    document.documentElement.style.setProperty('--primary-color', preset.primary);
    document.documentElement.style.setProperty('--secondary-color', preset.secondary);
    document.documentElement.style.setProperty('--accent-color', preset.accent);
    
    showToast(`${preset.name} theme applied`, 'success');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await settingsApi.updateThemeSettings(settings);
      if (response.data.success) {
        showToast('Theme settings saved successfully', 'success');
        applyThemeToDocument(settings);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to save theme settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all theme settings to default?')) {
      const defaultSettings = {
        theme: {
          mode: 'light',
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981',
          accentColor: '#8B5CF6',
          dangerColor: '#EF4444',
          warningColor: '#F59E0B',
          successColor: '#10B981',
          infoColor: '#06B6D4',
        },
        layout: {
          sidebarCollapsed: false,
          compactMode: false,
          showBreadcrumbs: true,
          showNotifications: true,
          fixedHeader: true,
          boxedLayout: false,
        },
        font: {
          family: 'Inter',
          size: 'medium',
        },
        animations: {
          enabled: true,
          duration: 'normal',
        },
        customization: {
          roundedCorners: 'medium',
          cardShadow: 'medium',
          borderWidth: 'normal',
        }
      };
      
      setSettings(defaultSettings);
      applyThemeToDocument(defaultSettings);
      showToast('Theme settings reset to default', 'success');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theme Settings</h1>
          <p className="text-gray-500 mt-1">Customize the look and feel of your dashboard</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button onClick={handleSave} isLoading={saving}>
            Save Theme
          </Button>
        </div>
      </div>

      {/* Color Presets */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Color Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="p-3 rounded-lg border hover:shadow-md transition-shadow text-center"
            >
              <div className="flex justify-center gap-1 mb-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.primary }} />
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.secondary }} />
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.accent }} />
              </div>
              <span className="text-sm font-medium">{preset.name}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Theme Mode */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🌓 Theme Mode</h3>
        <div className="flex gap-4">
          <button
            onClick={() => handleThemeModeChange('light')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              settings.theme.mode === 'light' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">☀️</div>
            <div className="font-medium">Light Mode</div>
            <div className="text-sm text-gray-500">Light background, dark text</div>
          </button>
          <button
            onClick={() => handleThemeModeChange('dark')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              settings.theme.mode === 'dark' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">🌙</div>
            <div className="font-medium">Dark Mode</div>
            <div className="text-sm text-gray-500">Dark background, light text</div>
          </button>
          <button
            onClick={() => handleThemeModeChange('system')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              settings.theme.mode === 'system' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">🖥️</div>
            <div className="font-medium">System Default</div>
            <div className="text-sm text-gray-500">Follows system preference</div>
          </button>
        </div>
      </Card>

      {/* Custom Colors */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Custom Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.theme.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="w-12 h-10 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={settings.theme.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.theme.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="w-12 h-10 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={settings.theme.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.theme.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="w-12 h-10 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={settings.theme.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danger Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.theme.dangerColor}
                onChange={(e) => handleColorChange('dangerColor', e.target.value)}
                className="w-12 h-10 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={settings.theme.dangerColor}
                onChange={(e) => handleColorChange('dangerColor', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Preview:</p>
          <div className="flex gap-2 mt-2">
            <button className="px-3 py-1 rounded text-white" style={{ backgroundColor: settings.theme.primaryColor }}>
              Primary
            </button>
            <button className="px-3 py-1 rounded text-white" style={{ backgroundColor: settings.theme.secondaryColor }}>
              Secondary
            </button>
            <button className="px-3 py-1 rounded text-white" style={{ backgroundColor: settings.theme.accentColor }}>
              Accent
            </button>
            <button className="px-3 py-1 rounded text-white" style={{ backgroundColor: settings.theme.dangerColor }}>
              Danger
            </button>
          </div>
        </div>
      </Card>

      {/* Layout Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📐 Layout Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium">Sidebar Collapsed</span>
              <p className="text-xs text-gray-500">Collapse sidebar to icons only</p>
            </div>
            <input
              type="checkbox"
              checked={settings.layout.sidebarCollapsed}
              onChange={(e) => handleLayoutChange('sidebarCollapsed', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium">Compact Mode</span>
              <p className="text-xs text-gray-500">Reduce padding and spacing</p>
            </div>
            <input
              type="checkbox"
              checked={settings.layout.compactMode}
              onChange={(e) => handleLayoutChange('compactMode', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium">Show Breadcrumbs</span>
              <p className="text-xs text-gray-500">Display navigation breadcrumbs</p>
            </div>
            <input
              type="checkbox"
              checked={settings.layout.showBreadcrumbs}
              onChange={(e) => handleLayoutChange('showBreadcrumbs', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium">Fixed Header</span>
              <p className="text-xs text-gray-500">Keep header fixed on scroll</p>
            </div>
            <input
              type="checkbox"
              checked={settings.layout.fixedHeader}
              onChange={(e) => handleLayoutChange('fixedHeader', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium">Boxed Layout</span>
              <p className="text-xs text-gray-500">Limit content width</p>
            </div>
            <input
              type="checkbox"
              checked={settings.layout.boxedLayout}
              onChange={(e) => handleLayoutChange('boxedLayout', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
          </label>
        </div>
      </Card>

      {/* Typography */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">✍️ Typography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
            <select
              value={settings.font.family}
              onChange={(e) => handleFontChange('family', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              style={{ fontFamily: settings.font.family }}
            >
              {fontFamilies.map(font => (
                <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
            <div className="flex gap-2">
              {fontSizes.map(size => (
                <button
                  key={size.value}
                  onClick={() => handleFontChange('size', size.value)}
                  className={`flex-1 px-3 py-2 border rounded-lg transition-all ${size.class} ${
                    settings.font.size === size.value 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <div className="space-y-2">
            <p className="text-2xl font-bold" style={{ fontFamily: settings.font.family }}>Heading 1</p>
            <p className="text-xl font-semibold" style={{ fontFamily: settings.font.family }}>Heading 2</p>
            <p style={{ fontFamily: settings.font.family }}>Regular paragraph text. The quick brown fox jumps over the lazy dog.</p>
            <p className="text-sm text-gray-500" style={{ fontFamily: settings.font.family }}>Small caption text for descriptions and meta information.</p>
          </div>
        </div>
      </Card>

      {/* Animations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ Animations</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium">Enable Animations</span>
              <p className="text-xs text-gray-500">Enable UI transitions and effects</p>
            </div>
            <input
              type="checkbox"
              checked={settings.animations.enabled}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                animations: { ...prev.animations, enabled: e.target.checked }
              }))}
              className="w-4 h-4 rounded border-gray-300"
            />
          </label>
          
          {settings.animations.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Animation Speed</label>
              <div className="flex gap-2">
                {animationDurations.map(anim => (
                  <button
                    key={anim.value}
                    onClick={() => setSettings(prev => ({
                      ...prev,
                      animations: { ...prev.animations, duration: anim.value }
                    }))}
                    className={`flex-1 px-3 py-2 border rounded-lg transition-all ${
                      settings.animations.duration === anim.value 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {anim.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Customization */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Customization</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rounded Corners</label>
            <select
              value={settings.customization.roundedCorners}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                customization: { ...prev.customization, roundedCorners: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {roundedOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Shadow</label>
            <select
              value={settings.customization.cardShadow}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                customization: { ...prev.customization, cardShadow: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {shadowOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Border Width</label>
            <select
              value={settings.customization.borderWidth}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                customization: { ...prev.customization, borderWidth: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="thin">Thin (1px)</option>
              <option value="normal">Normal (2px)</option>
              <option value="thick">Thick (3px)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Preview Card:</p>
          <div className={`bg-white p-4 border ${
            roundedOptions.find(o => o.value === settings.customization.roundedCorners)?.class || 'rounded-lg'
          } ${
            shadowOptions.find(o => o.value === settings.customization.cardShadow)?.class || 'shadow-md'
          } border-gray-200`}>
            <h4 className="font-semibold">Sample Card</h4>
            <p className="text-sm text-gray-500 mt-1">This is how your cards will appear with the current settings.</p>
            <button className="mt-2 px-3 py-1 text-sm text-white rounded" style={{ backgroundColor: settings.theme.primaryColor }}>
              Action Button
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ThemeSettings;