// ⚠️ Remplace par ta vraie clé publique complète (sb_publishable_...)
const SUPABASE_URL = 'https://tktfgstylkhgngvsvtdl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_9UaAbIeARUK2953gkKQ7eQ_QAQF8rYR';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const DEFAULT_INTERVALS_CLOUD = [0, 1, 3, 7, 14, 30];

const Cloud = (() => {
    let _user = null;
    let _listeners = [];
    let _saveTimer = null;

    function getUser() { return _user; }
    function onAuthChange(cb) { _listeners.push(cb); }
    function _notify() { _listeners.forEach(cb => cb(_user)); }

    async function init() {
        const { data } = await sb.auth.getSession();
        _user = data?.session?.user || null;
        sb.auth.onAuthStateChange((event, session) => {
            _user = session?.user || null;
            _notify();
        });
    }

    function signInWithDiscord() {
        sb.auth.signInWithOAuth({
            provider: 'discord',
            options: { redirectTo: window.location.origin + window.location.pathname }
        });
    }

    async function signOut() { await sb.auth.signOut(); }

    // ---- Arbre (State.data) <-> lignes plates (table j_items) ----

    function flattenTree(nodes, parentId, userId, rows = []) {
        nodes.forEach((n, idx) => {
            const row = {
                id: n.id, user_id: userId, parent_id: parentId,
                type: n.type, name: n.name, color: n.color || null,
                position: idx, updated_at: new Date().toISOString(),
            };
            if (n.type === 'folder') {
                row.link = null; row.notes = null; row.j0 = null;
                row.intervals = null; row.custom_intervals = null;
                row.done_tasks = null; row.ratings = null;
                rows.push(row);
                if (n.children?.length) flattenTree(n.children, n.id, userId, rows);
            } else {
                row.link = n.link || null;
                row.notes = n.notes || null;
                row.j0 = n.j0 || null;
                row.intervals = n.intervals || DEFAULT_INTERVALS_CLOUD;
                row.custom_intervals = n.customIntervals || {};
                row.done_tasks = n.doneTasks || [];
                row.ratings = n.ratings || {};
                rows.push(row);
            }
        });
        return rows;
    }

    function buildTree(rows) {
        const nodeMap = new Map();
        rows.forEach(r => {
            const node = { id: r.id, name: r.name, type: r.type, color: r.color || undefined };
            if (r.type === 'folder') {
                node.children = [];
            } else {
                node.link = r.link || null;
                node.notes = r.notes || null;
                node.j0 = r.j0;
                node.intervals = r.intervals || DEFAULT_INTERVALS_CLOUD;
                node.customIntervals = r.custom_intervals || {};
                node.doneTasks = r.done_tasks || [];
                node.ratings = r.ratings || {};
            }
            nodeMap.set(r.id, node);
        });
        const roots = [];
        [...rows].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)).forEach(r => {
            const node = nodeMap.get(r.id);
            if (r.parent_id && nodeMap.has(r.parent_id)) {
                const parent = nodeMap.get(r.parent_id);
                if (!parent.children) parent.children = [];
                parent.children.push(node);
            } else {
                roots.push(node);
            }
        });
        return roots;
    }

    // ---- CRUD ----

    async function loadTree() {
        if (!_user) return [];
        const { data, error } = await sb.from('j_items').select('*').eq('user_id', _user.id);
        if (error) { console.error('Cloud.loadTree', error); toast('Erreur de chargement des données', 'error'); return []; }
        return buildTree(data || []);
    }

    async function _pushTree(tree) {
        if (!_user) return;
        const rows = flattenTree(tree, null, _user.id);

        const { data: existing, error: exErr } = await sb.from('j_items').select('id').eq('user_id', _user.id);
        if (exErr) { console.error('Cloud._pushTree (select)', exErr); return; }

        const existingIds = new Set((existing || []).map(r => r.id));
        const newIds = new Set(rows.map(r => r.id));
        const toDelete = [...existingIds].filter(id => !newIds.has(id));

        if (rows.length) {
            const { error: upErr } = await sb.from('j_items').upsert(rows, { onConflict: 'id' });
            if (upErr) { console.error('Cloud._pushTree (upsert)', upErr); toast('Erreur de sauvegarde cloud', 'error'); return; }
        }
        if (toDelete.length) {
            const { error: delErr } = await sb.from('j_items').delete().in('id', toDelete);
            if (delErr) console.error('Cloud._pushTree (delete)', delErr);
        }
    }

    function saveTree(tree) {
        clearTimeout(_saveTimer);
        _saveTimer = setTimeout(() => { _pushTree(tree); }, 400);
    }

    async function migrateLocalIfNeeded(user) {
        const flag = `fifi_migrated_${user.id}`;
        if (localStorage.getItem(flag)) return;

        const { count, error } = await sb.from('j_items').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
        if (error) { console.error('Cloud.migrateLocalIfNeeded', error); return; }
        if (count && count > 0) { localStorage.setItem(flag, '1'); return; }

        const raw = localStorage.getItem('methodJData');
        if (!raw) { localStorage.setItem(flag, '1'); return; }

        let localTree;
        try { localTree = JSON.parse(raw); } catch { localStorage.setItem(flag, '1'); return; }
        if (!Array.isArray(localTree) || localTree.length === 0) { localStorage.setItem(flag, '1'); return; }

        await _pushTree(localTree);
        localStorage.setItem(flag, '1');
        toast('Données locales migrées vers le cloud ✓', 'success');
    }

    return { init, getUser, onAuthChange, signInWithDiscord, signOut, loadTree, saveTree, migrateLocalIfNeeded };
})();