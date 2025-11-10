import { initUI } from '../ui.js';

describe('UI Module', () => {
  let mockSettingsIcon, mockSettingsPanel, mockDarkModeToggle;
  let mockLocalStorage;

  beforeEach(() => {
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        clear: jest.fn(() => { store = {}; })
      };
    })();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    mockLocalStorage = localStorageMock;

    document.body.innerHTML = `
      <div id="settings-icon"></div>
      <div id="settings-panel"></div>
      <input type="checkbox" id="dark-mode-toggle" />
    `;

    mockSettingsIcon = document.getElementById('settings-icon');
    mockSettingsPanel = document.getElementById('settings-panel');
    mockDarkModeToggle = document.getElementById('dark-mode-toggle');

    document.documentElement.setAttribute('data-theme', '');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initUI', () => {
    test('initializes without errors', () => {
      expect(() => initUI()).not.toThrow();
    });

    test('loads dark mode preference from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('true');
      initUI();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('darkMode');
    });

    test('sets dark mode when localStorage has true', () => {
      mockLocalStorage.getItem.mockReturnValue('true');
      initUI();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(mockDarkModeToggle.checked).toBe(true);
    });

    test('does not set dark mode when localStorage has false', () => {
      mockLocalStorage.getItem.mockReturnValue('false');
      initUI();
      expect(document.documentElement.getAttribute('data-theme')).toBe('');
      expect(mockDarkModeToggle.checked).toBe(false);
    });

    test('does not set dark mode when localStorage is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      initUI();
      expect(document.documentElement.getAttribute('data-theme')).toBe('');
      expect(mockDarkModeToggle.checked).toBe(false);
    });
  });

  describe('Settings Panel Toggle', () => {
    test('toggles settings panel visibility on icon click', () => {
      initUI();
      
      expect(mockSettingsPanel.classList.contains('visible')).toBe(false);
      
      mockSettingsIcon.click();
      expect(mockSettingsPanel.classList.contains('visible')).toBe(true);
      
      mockSettingsIcon.click();
      expect(mockSettingsPanel.classList.contains('visible')).toBe(false);
    });

    test('closes settings panel when clicking outside', () => {
      initUI();
      
      mockSettingsIcon.click();
      expect(mockSettingsPanel.classList.contains('visible')).toBe(true);
      
      document.body.click();
      expect(mockSettingsPanel.classList.contains('visible')).toBe(false);
    });

    test('does not close settings panel when clicking inside', () => {
      initUI();
      
      mockSettingsIcon.click();
      expect(mockSettingsPanel.classList.contains('visible')).toBe(true);
      
      mockSettingsPanel.click();
      expect(mockSettingsPanel.classList.contains('visible')).toBe(true);
    });

    test('settings icon click stops propagation', () => {
      initUI();
      
      const event = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
      
      mockSettingsIcon.dispatchEvent(event);
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    test('settings panel click stops propagation', () => {
      initUI();
      
      const event = new MouseEvent('click', { bubbles: true });
      const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');
      
      mockSettingsPanel.dispatchEvent(event);
      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe('Dark Mode Toggle', () => {
    test('enables dark mode when toggle is checked', () => {
      mockLocalStorage.getItem.mockReturnValue('false');
      initUI();
      
      mockDarkModeToggle.checked = true;
      mockDarkModeToggle.dispatchEvent(new Event('change'));
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', true);
    });

    test('disables dark mode when toggle is unchecked', () => {
      mockLocalStorage.getItem.mockReturnValue('true');
      initUI();
      
      mockDarkModeToggle.checked = false;
      mockDarkModeToggle.dispatchEvent(new Event('change'));
      
      expect(document.documentElement.getAttribute('data-theme')).toBe('');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', false);
    });

    test('saves dark mode preference to localStorage', () => {
      initUI();
      
      mockDarkModeToggle.checked = true;
      mockDarkModeToggle.dispatchEvent(new Event('change'));
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('darkMode', true);
    });
  });

  describe('DOM Elements', () => {
    test('requires settings icon element', () => {
      document.body.innerHTML = `
        <div id="settings-panel"></div>
        <input type="checkbox" id="dark-mode-toggle" />
      `;
      
      expect(() => initUI()).toThrow();
    });

    test('requires settings panel element', () => {
      document.body.innerHTML = `
        <div id="settings-icon"></div>
        <input type="checkbox" id="dark-mode-toggle" />
      `;
      
      expect(() => initUI()).toThrow();
    });

    test('requires dark mode toggle element', () => {
      document.body.innerHTML = `
        <div id="settings-icon"></div>
        <div id="settings-panel"></div>
      `;
      
      expect(() => initUI()).toThrow();
    });
  });
});
