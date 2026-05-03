/* Tweaks.jsx */
const Tweaks = ({ variant, setVariant, theme, setTheme, accent, setAccent }) => {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const handler = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', handler);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(_) {}
    return () => window.removeEventListener('message', handler);
  }, []);

  const persist = (edits) => {
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*'); } catch(_) {}
  };

  const accents = [
    { v: '#C45A2C', name: 'Ember' },
    { v: '#D97757', name: 'Clay' },
    { v: '#3A7D5E', name: 'Ridge' },
    { v: '#4A6BB3', name: 'Alpine' },
    { v: '#B49A4A', name: 'Brass' },
  ];

  return (
    <div className={`tweaks-panel ${open ? 'is-open' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h4 style={{ margin: 0 }}>Tweaks</h4>
        <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1 }}>×</button>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-label">Hero layout</div>
        <div className="tweaks-seg">
          {[
            { v: 'conservative', l: 'Classic' },
            { v: 'bold', l: 'Bold' },
            { v: 'experimental', l: 'Experimental' },
          ].map(o => (
            <button
              key={o.v}
              className={variant === o.v ? 'is-active' : ''}
              onClick={() => { setVariant(o.v); persist({ hero: o.v }); }}
            >{o.l}</button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-label">Theme</div>
        <div className="tweaks-seg">
          {[
            { v: 'light', l: 'Light' },
            { v: 'dark', l: 'Dark' },
          ].map(o => (
            <button
              key={o.v}
              className={theme === o.v ? 'is-active' : ''}
              onClick={() => { setTheme(o.v); persist({ theme: o.v }); }}
            >{o.l}</button>
          ))}
        </div>
      </div>
      <div className="tweaks-row">
        <div className="tweaks-label">Accent</div>
        <div className="tweaks-swatches">
          {accents.map(a => (
            <button
              key={a.v}
              title={a.name}
              className={accent === a.v ? 'is-active' : ''}
              style={{ background: a.v }}
              onClick={() => { setAccent(a.v); persist({ accent: a.v }); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Tweaks });
