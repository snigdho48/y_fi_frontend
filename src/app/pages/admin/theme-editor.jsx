import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  GLOBAL_FIELDS,
  SECTION_KEYS,
  SECTION_LABELS,
  createTheme,
  emptyTheme,
  fetchThemeDefaults,
  listThemes,
  removeSectionBackground,
  sectionsForApp,
  setThemeActive,
  updateTheme,
  uploadSectionBackground,
} from "@/lib/theme-api";

function ColorField({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm">
      <span className="text-slate-300">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#191B41"}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="w-24 rounded border border-slate-700 bg-slate-950 px-2 py-1 font-mono text-xs text-white"
        />
      </span>
    </label>
  );
}

function PhonePreview({ theme, section }) {
  const sectionStyle = theme.section_styles?.[section] || {};
  const bg = sectionStyle.background || theme.background_color || theme.scaffold_color;
  const bgImage = sectionStyle.background_image_url;
  const font = sectionStyle.font_color || theme.on_primary_color;
  const heading = sectionStyle.heading_color || theme.accent_color;
  const card = sectionStyle.card_background || "#23244A";
  const btnBg = sectionStyle.button_background || theme.primary_color;
  const btnText = sectionStyle.button_text || theme.on_primary_color;

  return (
    <div className="mx-auto w-[280px] rounded-[2rem] border-4 border-slate-700 bg-black p-2 shadow-2xl">
      <div
        className="overflow-hidden rounded-[1.5rem] bg-cover bg-center"
        style={{
          backgroundColor: bg,
          backgroundImage: bgImage ? `url(${bgImage})` : undefined,
          minHeight: 480,
        }}
      >
        <div className="px-4 pt-8 text-center">
          <div
            className="mx-auto mb-4 h-16 w-16 rounded-2xl"
            style={{ background: theme.primary_color }}
          />
          <p className="text-sm font-semibold" style={{ color: heading }}>
            Connect - Engage - Earn
          </p>
          <p className="mt-2 text-xs uppercase tracking-wide" style={{ color: font }}>
            {SECTION_LABELS[section] || section}
          </p>
        </div>
        <div className="mt-6 px-4">
          <div className="rounded-xl p-4" style={{ background: card }}>
            <p className="text-xs" style={{ color: heading }}>
              Sample metric
            </p>
            <p className="mt-1 text-lg font-bold" style={{ color: font }}>
              ৳ 51.00
            </p>
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-xl py-3 text-sm font-semibold"
            style={{ background: btnBg, color: btnText }}
          >
            Sample button
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ThemeEditor() {
  const [appTarget, setAppTarget] = useState("user");
  const [themes, setThemes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(emptyTheme("user"));
  const [defaults, setDefaults] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sectionNames = useMemo(
    () => sectionsForApp(appTarget),
    [appTarget],
  );

  useEffect(() => {
    if (!sectionNames.includes(activeSection)) {
      setActiveSection(sectionNames[0]);
    }
  }, [sectionNames, activeSection]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setSelectedId(null);
      setStatus("");
      try {
        const d = await fetchThemeDefaults(appTarget);
        setDefaults(d);
        const items = await listThemes(appTarget);
        setThemes(items);
        if (items.length) {
          const active = items.find((t) => t.is_active);
          const selected = active ?? items[0];
          setSelectedId(selected.id);
          setDraft(selected);
        } else {
          setDraft({
            ...emptyTheme(appTarget),
            section_styles: { ...d.default_section_styles },
          });
        }
        setActiveSection(sectionsForApp(appTarget)[0]);
      } catch (e) {
        setStatus(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [appTarget]);

  function patchDraft(patch) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function patchSection(section, key, value) {
    setDraft((prev) => ({
      ...prev,
      section_styles: {
        ...prev.section_styles,
        [section]: {
          ...(prev.section_styles?.[section] || {}),
          [key]: value,
        },
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus("");
    try {
      const allowed = new Set(sectionNames);
      const sectionStyles = Object.fromEntries(
        Object.entries(draft.section_styles || {}).filter(([key]) => allowed.has(key)),
      );
      const payload = {
        name: draft.name,
        app_target: draft.app_target,
        primary_color: draft.primary_color,
        scaffold_color: draft.scaffold_color,
        accent_color: draft.accent_color,
        on_primary_color: draft.on_primary_color,
        background_color: draft.background_color,
        section_styles: sectionStyles,
      };
      let saved;
      if (draft.id) {
        saved = await updateTheme(draft.id, payload);
      } else {
        saved = await createTheme(payload);
      }
      setDraft(saved);
      setSelectedId(saved.id);
      await refreshThemes(saved.id);
      setStatus("Theme saved.");
    } catch (e) {
      setStatus(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function refreshThemes(selectId = selectedId) {
    const items = await listThemes(appTarget);
    setThemes(items);
    if (selectId) {
      const match = items.find((t) => t.id === selectId);
      if (match) {
        setDraft(match);
        setSelectedId(match.id);
      }
    }
    return items;
  }

  async function handleSetActive(themeId, isActive) {
    if (!themeId) {
      setStatus("Save the theme before setting active.");
      return;
    }
    setSaving(true);
    setStatus("");
    try {
      const saved = await setThemeActive(themeId, isActive);
      const items = await refreshThemes(saved.id);
      const hasActive = items.some((t) => t.is_active);
      setStatus(
        isActive
          ? "Theme activated — other themes for this app were deactivated."
          : hasActive
            ? "Theme deactivated."
            : "Theme deactivated — mobile apps will use the default theme.",
      );
    } catch (e) {
      setStatus(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleActiveToggle(checked) {
    await handleSetActive(draft.id, checked);
  }

  async function handleListActiveToggle(themeId, checked, event) {
    event?.stopPropagation();
    await handleSetActive(themeId, checked);
  }

  function handleNew() {
    const base = emptyTheme(appTarget);
    setDraft({
      ...base,
      section_styles: { ...defaults?.default_section_styles },
    });
    setSelectedId(null);
    setActiveSection(sectionNames[0]);
    setStatus("New draft — save to create.");
  }

  async function handleBackgroundUpload(file) {
    if (!draft.id) {
      setStatus("Save the theme before uploading a background image.");
      return;
    }
    setSaving(true);
    setStatus("");
    try {
      const saved = await uploadSectionBackground(draft.id, activeSection, file);
      setDraft(saved);
      setStatus(`Background image set for ${SECTION_LABELS[activeSection] || activeSection}.`);
    } catch (e) {
      setStatus(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleBackgroundRemove() {
    if (!draft.id) return;
    setSaving(true);
    setStatus("");
    try {
      const saved = await removeSectionBackground(draft.id, activeSection);
      setDraft(saved);
      setStatus("Background image removed.");
    } catch (e) {
      setStatus(e.message);
    } finally {
      setSaving(false);
    }
  }

  const hasActiveTheme = themes.some((t) => t.is_active);
  const sectionBgImage = draft.section_styles?.[activeSection]?.background_image_url;

  if (loading) {
    return <p className="text-slate-400">Loading theme studio…</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr_320px]">
      <aside className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <p className="text-xs uppercase text-slate-500">App target</p>
        <div className="mt-2 flex gap-2">
          {["user", "partner"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setAppTarget(t);
                setSelectedId(null);
                setDraft(emptyTheme(t));
              }}
              className={`flex-1 rounded-lg px-2 py-2 text-sm capitalize ${
                appTarget === t
                  ? "bg-lime-500/20 text-lime-300 ring-1 ring-lime-500/40"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs uppercase text-slate-500">Saved themes</p>
          <button type="button" className="text-xs text-lime-400" onClick={handleNew}>
            + New
          </button>
        </div>
        <ul className="mt-2 space-y-1">
          {themes.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(t.id);
                  setDraft(t);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                  selectedId === t.id
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/60"
                }`}
              >
                <input
                  type="checkbox"
                  checked={Boolean(t.is_active)}
                  disabled={saving}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    handleListActiveToggle(t.id, e.target.checked, e)
                  }
                  className="h-4 w-4 shrink-0 cursor-pointer accent-lime-500"
                  aria-label={`Set ${t.name} active`}
                />
                <span className="min-w-0 flex-1 truncate">{t.name}</span>
                {t.is_active ? (
                  <span className="shrink-0 text-xs text-lime-400">active</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
        {!hasActiveTheme && themes.length > 0 ? (
          <p className="mt-3 text-xs text-amber-400/90">
            No active theme — apps use the built-in default palette.
          </p>
        ) : null}
      </aside>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <input
              type="text"
              value={draft.name || ""}
              onChange={(e) => patchDraft({ name: e.target.value })}
              className="bg-transparent text-xl font-semibold text-white outline-none"
            />
            <p className="text-sm text-slate-500">
              Customize colors and per-page backgrounds for the {appTarget} app only.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={Boolean(draft.is_active)}
                disabled={saving || !draft.id}
                onChange={(e) => handleActiveToggle(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-lime-500 disabled:cursor-not-allowed"
              />
              <span>Active theme</span>
            </label>
            {!draft.id ? (
              <span className="text-xs text-slate-500">Save first to activate</span>
            ) : null}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleSave} disabled={saving}>
                Save
              </Button>
            </div>
          </div>
        </div>

        {status ? <p className="mt-3 text-sm text-lime-300">{status}</p> : null}
        {!hasActiveTheme ? (
          <p className="mt-2 text-xs text-slate-500">
            When no theme is active, mobile apps receive the default FreeYFi palette from the API.
          </p>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {GLOBAL_FIELDS.map(({ key, label }) => (
            <ColorField
              key={key}
              label={label}
              value={draft[key]}
              onChange={(v) => patchDraft({ [key]: v })}
            />
          ))}
        </div>

        <div className="mt-8">
          <p className="text-xs uppercase text-slate-500">Section styles ({appTarget} app)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sectionNames.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setActiveSection(s)}
                className={`rounded-full px-3 py-1 text-xs ${
                  activeSection === s
                    ? "bg-lime-500/20 text-lime-300"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {SECTION_LABELS[s] || s}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            <p className="text-sm text-slate-300">Page background image</p>
            <p className="mt-1 text-xs text-slate-500">
              Optional image behind this page. Solid background color shows through transparent areas.
            </p>
            {sectionBgImage ? (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <img
                  src={sectionBgImage}
                  alt=""
                  className="h-20 w-32 rounded-lg border border-slate-700 object-cover"
                />
                <button
                  type="button"
                  onClick={handleBackgroundRemove}
                  disabled={saving}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove image
                </button>
              </div>
            ) : null}
            <label className="mt-3 inline-block cursor-pointer text-sm text-lime-400 hover:text-lime-300">
              {sectionBgImage ? "Replace image" : "Upload image"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                disabled={saving}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleBackgroundUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
            {!draft.id ? (
              <p className="mt-2 text-xs text-amber-400/90">Save theme first to upload images.</p>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {SECTION_KEYS.map((key) => (
              <ColorField
                key={key}
                label={key.replace(/_/g, " ")}
                value={draft.section_styles?.[activeSection]?.[key] || ""}
                onChange={(v) => patchSection(activeSection, key, v)}
              />
            ))}
          </div>
        </div>
      </section>

      <aside className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <p className="mb-4 text-center text-xs uppercase text-slate-500">Live preview</p>
        <PhonePreview theme={draft} section={activeSection} />
        <p className="mt-4 text-center text-xs text-slate-500">
          Previewing section: {SECTION_LABELS[activeSection] || activeSection}
        </p>
      </aside>
    </div>
  );
}
