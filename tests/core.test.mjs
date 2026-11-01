/* Registre Céleste — styles modulaires de base */
:root {
  --bg: #101426;
  --bg-2: #1c2340;
  --blue: #7ec8ff;
  --violet: #b794f6;
  --gold: #ffd98e;
  --text: #e8ecf8;
  --muted: #9aa3c0;
  --danger: #ff8a8a;
  --success: #9be8b7;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.celeste-card {
  background: var(--bg-2);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.22);
  padding: 1rem;
  margin-bottom: 1rem;
}

.celeste-grid {
  display: grid;
  gap: 1rem;
}

.celeste-button {
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  color: var(--text);
  min-height: 44px;
  border-radius: 12px;
  padding: 0.7rem 1rem;
  font-weight: 600;
}

.celeste-button.primary {
  background: linear-gradient(135deg, var(--violet), var(--blue));
  color: #0b0f1e;
  border: none;
}

.celeste-button.danger {
  background: rgba(255,138,138,0.12);
  border-color: rgba(255,138,138,0.35);
  color: var(--danger);
}

.celeste-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  border: 1px solid rgba(255,217,142,0.35);
  color: var(--gold);
  background: rgba(255,217,142,0.09);
}

.celeste-input,
.celeste-textarea,
.celeste-select {
  width: 100%;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(0,0,0,0.22);
  border-radius: 12px;
  color: var(--text);
  padding: 0.8rem 0.9rem;
}

.celeste-input:focus,
.celeste-textarea:focus,
.celeste-select:focus {
  outline: 2px solid var(--blue);
  outline-offset: 1px;
}

@media (min-width: 760px) {
  .celeste-grid.two-columns {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
