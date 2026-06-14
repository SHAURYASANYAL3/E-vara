import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!open) return null;

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'start', justifyContent: 'center', paddingTop: '15vh' }}>
      <div style={{ width: '100%', maxWidth: '640px', borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', padding: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} className="dark:bg-stone-900 dark:border-stone-800 text-stone-900 dark:text-stone-100">
        <Command label="Global Command Palette">
          <Command.Input 
            placeholder="Type a command or search routes..." 
            style={{ width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '16px', outline: 'none', fontSize: '18px' }}
          />
          <Command.List style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <Command.Empty style={{ fontSize: '14px', color: '#6b7280', padding: '8px' }}>No results found.</Command.Empty>
            <Command.Group heading="Navigation" style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', padding: '4px 8px' }}>
              <Command.Item onSelect={() => handleNavigation('/dashboard')} style={{ display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }} className="hover:bg-stone-100 dark:hover:bg-stone-800">Go to Dashboard</Command.Item>
              <Command.Item onSelect={() => handleNavigation('/trust-center')} style={{ display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }} className="hover:bg-stone-100 dark:hover:bg-stone-800">Go to Trust Center</Command.Item>
              <Command.Item onSelect={() => handleNavigation('/analyst-portal')} style={{ display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }} className="hover:bg-stone-100 dark:hover:bg-stone-800">Go to Analyst Portal</Command.Item>
              <Command.Item onSelect={() => handleNavigation('/identity-records')} style={{ display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }} className="hover:bg-stone-100 dark:hover:bg-stone-800">Go to Identity Records</Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
