const APP_SHELL_HTML = `
    <aside class="sidebar" id="sidebar">
        <div id="sidebarHandle" style="position:absolute;right:-3px;top:0;bottom:0;width:6px;cursor:col-resize;z-index:20;border-radius:3px;transition:background 0.15s;"></div>
        <div class="sidebar-header">
            <div class="sidebar-title">
                <span class="brand-name">fififi</span>
            </div>
            <div class="sidebar-pulse cs-idle" id="cloudStatusDot" title="État de synchronisation"></div>
        </div>

        <div class="sidebar-search">
            <input type="text" placeholder="Rechercher…" class="search-input" id="searchInput">
            <span class="search-icon">⌕</span>
<button id="searchClear" onclick="clearSearch()" style="display:none;position:absolute;right:20px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--text-3);cursor:pointer;font-size:16px;padding:0;line-height:1;z-index:2;">×</button>
        </div>

        <div class="sidebar-content" id="treeRoot"></div>

        <div id="multiBar" style="display:none;padding:10px 12px;border-top:1px solid var(--accent);background:var(--accent-glow);flex-direction:column;gap:7px;flex-shrink:0">
            <div style="display:flex;align-items:center;justify-content:space-between">
                <span id="multiCount" style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--accent)"></span>
                <button onclick="clearSelection()" style="background:none;border:none;color:var(--text-3);cursor:pointer;font-size:13px" title="Annuler">✕</button>
            </div>
            <div style="display:flex;gap:5px;flex-wrap:wrap">
                <button class="btn btn-ghost" onclick="bulkColor()" style="font-size:11px;padding:4px 9px">🎨 Couleur</button>
                <button class="btn btn-ghost" onclick="bulkExport()" style="font-size:11px;padding:4px 9px">↓ Exporter</button>
                <button class="btn btn-danger" onclick="bulkDelete()" style="font-size:11px;padding:4px 9px">✕ Supprimer</button>
            </div>
        </div>
        <div class="sidebar-footer">
            <button class="btn btn-ghost" onclick="addFolder()">
                <span class="btn-icon">▣</span>
                Dossier
            </button>
            <button class="btn btn-primary" onclick="addCourse()">
                <span class="btn-icon">✷</span>
                Cours
            </button>
        </div>
    </aside>
<div class="sidebar-backdrop" id="sidebarBackdrop" onclick="toggleSidebar()"></div>
    <main class="main">
        <div class="topbar">
            <div class="topbar-left">
                <button class="sidebar-toggle" onclick="toggleSidebar()" title="Toggle sidebar">
                    <span></span><span></span><span></span>
                </button>

                <div class="view-toggle">
                    <button id="weekBtn" class="view-btn active" onclick="switchView('week')">Semaine</button>
                    <button id="monthBtn" class="view-btn" onclick="switchView('month')">Mois</button>
                    <button id="focusBtn" class="view-btn" onclick="switchView('focus')">Focus</button>
                </div>

                <div class="date-nav">
                    <button class="nav-btn" id="navPrev" onclick="nav(-1)">‹</button>
                    <button class="nav-btn nav-today" onclick="goToday()">Auj.</button>
                    <div class="date-label" id="dateLabel"></div>
                    <button class="nav-btn" id="navNext" onclick="nav(1)">›</button>
                    <button class="nav-btn" id="navGoto" onclick="openGotoDatePicker()" title="Aller à une date">📅</button>
                </div>
            </div>

            <div class="toolbar">
                <button class="icon-btn" onclick="undo()" id="undoBtn" title="Annuler (Ctrl+Z)" disabled>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
                </button>
                <button class="icon-btn" onclick="redo()" id="redoBtn" title="Rétablir (Ctrl+Shift+Z)" disabled>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/></svg>
                </button>
                <button class="icon-btn" onclick="openHistoryModal()" title="Historique complet (H)">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
                </button>
                <div class="toolbar-divider"></div>
                <button class="icon-btn" onclick="openSettings()" title="Paramètres">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                </button>
                <button class="icon-btn" onclick="openStats()" title="Statistiques (S)">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
</button>
<div class="toolbar-divider"></div>
                <button class="icon-btn" onclick="syncCourseColors()" title="Sync couleurs cours → dossiers">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                </button>
                <button class="icon-btn" onclick="exportData()" title="Exporter">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </button>
                <button class="icon-btn" onclick="importData()" title="Importer">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
                <div class="toolbar-divider"></div>
                <div class="user-badge" id="userBadge" style="display:none">
                    <img id="userAvatar" class="user-avatar" src="" alt="">
                    <span id="userName" class="user-name"></span>
                    <button class="icon-btn" onclick="Cloud.signOut()" title="Déconnexion">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    </button>
                </div>
            </div>
        </div>
            <div class="status-filter-bar">
    <span>FILTRE</span>
    <button class="sfb-btn active"      onclick="setStatusFilter('all')"     id="sfb-all">Tout</button>
    <button class="sfb-btn"             onclick="setStatusFilter('todo')"    id="sfb-todo">À faire</button>
    <button class="sfb-btn sfb-overdue" onclick="setStatusFilter('overdue')" id="sfb-overdue">En retard</button>
    <button class="sfb-btn sfb-done"    onclick="setStatusFilter('done')"    id="sfb-done">Terminé</button>
    <span id="sfb-count"></span>
</div>
        <div class="calendar-wrapper">
            <div id="calendar" class="calendar week"></div>
        </div>
    </main>

    <div class="modal" id="folderModal">
        <div class="modal-card">
            <div class="modal-header">
                <div class="modal-icon">▣</div>
                <h3 class="modal-title">Nouveau Dossier</h3>
            </div>
            <div class="form-group">
                <label class="form-label">Nom du dossier</label>
                <input type="text" id="folderName" class="form-input" placeholder="Ex: Anatomie">
            </div>
            <div class="form-group">
                <label class="form-label">Couleur</label>
                <div class="color-picker-wrap">
                    <input type="color" id="colorWheel" class="color-wheel-input" value="#6b8cff">
                    <div class="color-palette" id="colorPalette"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-ghost" onclick="closeModal('folderModal')">Annuler</button>
                <button class="btn btn-primary" onclick="submitFolder()">
                    <span class="btn-icon">✷</span>Créer
                </button>
            </div>
        </div>
    </div>

    <div class="modal" id="courseModal">
        <div class="modal-card">
            <div class="modal-header">
                <div class="modal-icon">✷</div>
                <h3 class="modal-title">Nouveau Cours</h3>
            </div>
            <div class="form-group">
                <label class="form-label">Nom du cours</label>
                <input type="text" id="courseName" class="form-input" placeholder="Ex: Le Cœur">
            </div>
            <div class="form-group">
                <label class="form-label">Date J0</label>
                <input type="date" id="courseDate" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">Intervalles (jours)</label>
                <div class="interval-chips-wrap">
                    <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;" id="coursePresetsRow"></div>
                    <div class="interval-active-list" id="courseActiveChips"></div>
                    <div class="interval-add-row">
                        <input type="text" inputmode="numeric" pattern="[0-9]*" class="interval-add-input" id="courseCustomInterval" placeholder="J?">
                        <button class="interval-add-btn" onclick="addCustomInterval('course')">+ Ajouter</button>
                    </div>
                </div>
                <input type="hidden" id="courseIntervals">
                <div class="form-group">
    <label class="form-label">Couleur du cours</label>
    <div class="color-picker-wrap">
        <input type="color" id="courseColorWheel" class="color-wheel-input" value="#6b8cff">
        <div class="color-palette" id="courseColorPalette"></div>
    </div>
</div>
            </div>
            <div class="form-group">
                <label class="form-label">Lien du cours (optionnel)</label>
                <input type="url" id="courseLink" class="form-input" placeholder="https://notion.so/…">
            </div>
            <div class="form-group">
                <label class="form-label">Notes (optionnel)</label>
                <textarea id="courseNotes" class="form-input" placeholder="Résumé, points clés…" rows="3" style="resize:vertical;min-height:64px;font-size:13px;line-height:1.5"></textarea>
            </div>
            <div class="modal-footer">
                <button class="btn btn-ghost" onclick="closeModal('courseModal')">Annuler</button>
                <button class="btn btn-primary" onclick="submitCourse()">
                    <span class="btn-icon">✷</span>Créer
                </button>
            </div>
        </div>
    </div>

    <div class="modal" id="editFolderModal">
        <div class="modal-card">
            <div class="modal-header">
                <div class="modal-icon">▣</div>
                <h3 class="modal-title">Éditer Dossier</h3>
            </div>
            <div class="form-group">
                <label class="form-label">Nom</label>
                <input type="text" id="editFolderName" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">Couleur</label>
                <div class="color-picker-wrap">
                    <input type="color" id="editColorWheel" class="color-wheel-input" value="#6b8cff">
                    <div class="color-palette" id="editColorPalette"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-danger" onclick="deleteFolder()">Supprimer</button>
                <button class="btn btn-ghost" onclick="closeModal('editFolderModal')">Annuler</button>
                <button class="btn btn-primary" onclick="saveEditFolder()">Sauvegarder</button>
            </div>
        </div>
    </div>

    <div class="modal" id="editCourseModal">
        <div class="modal-card" style="width:480px">
            <div class="modal-header">
                <div class="modal-icon">✷</div>
                <h3 class="modal-title">Éditer Cours</h3>
            </div>
            <div class="form-group">
                <label class="form-label">Nom</label>
                <input type="text" id="editCourseName" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">Date J0</label>
                <input type="date" id="editCourseDate" class="form-input">
            </div>
            <div class="form-group">
                <label class="form-label">Intervalles (jours)</label>
                <div class="interval-chips-wrap">
                    <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;" id="editCoursePresetsRow"></div>
                    <div class="interval-active-list" id="editCourseActiveChips"></div>
                    <div class="interval-add-row">
                        <input type="text" inputmode="numeric" pattern="[0-9]*" class="interval-add-input" id="editCourseCustomInterval" placeholder="J?">
                        <button class="interval-add-btn" onclick="addCustomInterval('editCourse')">+ Ajouter</button>
                    </div>
                </div>
                <input type="hidden" id="editCourseIntervals">
                <div class="form-group">
    <label class="form-label">Couleur du cours</label>
    <div class="color-picker-wrap">
        <input type="color" id="editCourseColorWheel" class="color-wheel-input" value="#6b8cff">
        <div class="color-palette" id="editCourseColorPalette"></div>
    </div>
</div>
            </div>
            <div class="form-group">
                <label class="form-label">Lien du cours (optionnel)</label>
                <input type="url" id="editCourseLink" class="form-input" placeholder="https://notion.so/…">
            </div>
            <div class="form-group">
                <label class="form-label">Notes (optionnel)</label>
                <textarea id="editCourseNotes" class="form-input" placeholder="Résumé, points clés…" rows="3" style="resize:vertical;min-height:64px;font-size:13px;line-height:1.5"></textarea>
            </div>
            <div class="modal-footer modal-footer-split">
                <div class="modal-footer-left">
                    <button class="btn btn-danger" onclick="deleteCourse()">Supprimer</button>
                    <button id="removeFromCalBtn" class="btn btn-ghost" onclick="removeCourseFromCalendar()">Retirer du calendrier</button>
                </div>
                <div class="modal-footer-right">
                    <button class="btn btn-ghost" onclick="closeModal('editCourseModal')">Annuler</button>
                    <button class="btn btn-primary" onclick="saveEditCourse()">Sauvegarder</button>
                </div>
            </div>
        </div>
    </div>
<div class="modal" id="statsModal">
    <div class="modal-card">
        <div class="modal-header">
            <div class="modal-icon">◈</div>
            <h3 class="modal-title">Statistiques</h3>
        </div>
        <div id="statsContent"></div>
        <div class="modal-footer">
            <button class="btn btn-ghost" onclick="closeModal('statsModal')">Fermer</button>
        </div>
    </div>
</div>
    <div class="modal" id="historyModal">
        <div class="modal-card" style="width:420px;max-height:80vh;overflow-y:auto">
            <div class="modal-header">
                <div class="modal-icon">↺</div>
                <h3 class="modal-title">Historique</h3>
            </div>
            <div id="historyList"></div>
            <div class="modal-footer">
                <button class="btn btn-ghost" onclick="closeModal('historyModal')">Fermer</button>
            </div>
        </div>
    </div>
<div class="modal" id="timelineModal">
    <div class="modal-card" style="width:500px;max-height:82vh;overflow-y:auto">
        <div class="modal-header">
            <div class="modal-icon" id="timelineIcon" style="width:10px;height:10px;border-radius:50%;margin-right:2px"></div>
            <h3 class="modal-title" id="timelineTitle"></h3>
        </div>
        <div id="timelineContent"></div>
        <div class="modal-footer">
            <button class="btn btn-ghost" onclick="closeModal('timelineModal')">Fermer</button>
        </div>
    </div>
</div>
<div class="modal" id="settingsModal">
    <div class="modal-card" style="width:460px">
        <div class="modal-header">
            <div class="modal-icon">⚙</div>
            <h3 class="modal-title">Paramètres</h3>
        </div>
        <div class="form-group">
            <label class="form-label">Thème</label>
            <div class="view-toggle" style="width:100%">
                <button type="button" class="view-btn" id="themeMode_light" onclick="setThemeMode('light')" style="flex:1">☀ Clair</button>
                <button type="button" class="view-btn" id="themeMode_dark" onclick="setThemeMode('dark')" style="flex:1">● Sombre</button>
                <button type="button" class="view-btn" id="themeMode_auto" onclick="setThemeMode('auto')" style="flex:1">◐ Système</button>
            </div>
            <span class="form-hint">"Système" suit automatiquement le mode clair/sombre de ton appareil.</span>
        </div>
        <div class="form-group">
            <label class="form-label">Tri du calendrier</label>
            <div style="display:flex;align-items:center;gap:8px;margin-top:4px">
                <input type="checkbox" id="sortFolderCheck" onchange="setSortMode(this.checked?'folder':'j')" style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer">
                <label for="sortFolderCheck" style="font-size:13px;color:var(--text-2);cursor:pointer">Trier aussi par matière (sinon uniquement par J croissant)</label>
            </div>
            <span class="form-hint">Le drag &amp; drop dans le calendrier crée un ordre manuel prioritaire. Un ↺ apparaît sur le jour pour réinitialiser.</span>
        </div>
        <div class="form-group">
            <label class="form-label">Cours terminés</label>
            <div style="display:flex;align-items:center;gap:8px;margin-top:4px">
                <input type="checkbox" id="doneToBottomCheck" style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer">
                <label for="doneToBottomCheck" style="font-size:13px;color:var(--text-2);cursor:pointer">Placer les cours validés en bas de chaque jour</label>
            </div>
            <span class="form-hint">Activé par défaut. Les cours cochés glissent en bas pour mieux voir ce qui reste à faire.</span>
        </div>
        <div class="form-group">
    <label class="form-label">Mes profils d'intervalles</label>
    <div id="settingsProfilesList" style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px"></div>
    <button class="interval-add-btn" style="border-style:dashed;color:var(--accent);border-color:rgba(107,140,255,0.4);width:100%;display:flex;align-items:center;justify-content:center;gap:5px" onclick="openProfileEditor()">+ Nouveau profil</button>
    <span class="form-hint">Un profil est indépendant des intervalles par défaut ci-dessous. Applique-le sur un cours via les boutons au-dessus des intervalles, dans la modale de création/édition.</span>
</div>
<div class="form-group">
    <label class="form-label">Intervalles par défaut</label>
    <div id="settingsDefaultChips" style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px"></div>
    <div style="display:flex;gap:6px;align-items:center">
        <input type="text" inputmode="numeric" pattern="[0-9]*" id="settingsAddInterval" class="interval-add-input" placeholder="J?">
        <button class="interval-add-btn" onclick="settingsAddInterval()">+ Ajouter</button>
    </div>
    <span class="form-hint">Ces intervalles sont appliqués à chaque nouveau cours.</span>
</div>
        <div class="modal-footer">
            <button class="btn btn-ghost" onclick="closeModal('settingsModal')">Fermer</button>
            <button class="btn btn-primary" onclick="saveSettings()"><span class="btn-icon">✷</span>Sauvegarder</button>
        </div>
    </div>
</div>

    <div class="modal" id="confirmModal">
        <div class="modal-card" style="width:340px">
            <div class="modal-header">
                <div class="modal-icon" style="color:var(--danger)">⚠</div>
                <h3 class="modal-title" id="confirmTitle">Confirmation</h3>
            </div>
            <p id="confirmMessage" style="color:var(--text-2);font-size:14px;line-height:1.5;margin-bottom:0"></p>
            <div class="modal-footer">
                <button class="btn btn-ghost" id="confirmCancel">Annuler</button>
                <button class="btn btn-danger" id="confirmOk">Supprimer</button>
            </div>
        </div>
    </div>

    <div id="toastContainer"></div>
    <input type="file" id="importFile" style="display: none" accept=".json">
`;

let _shellMounted = false;
function mountAppShell() {
    if (_shellMounted) return;
    _shellMounted = true;
    document.getElementById('appRoot').innerHTML = APP_SHELL_HTML;
    wireStaticListeners();
    wireImportFile();
}
const STORAGE_KEY     = 'methodJData';
const MS_PER_DAY      = 86400000;
const DEFAULT_INTERVALS = [0, 1, 3, 7, 14, 30];
const PRESET_INTERVALS  = [0, 1, 2, 3, 5, 7, 10, 14, 21, 30, 45, 60, 90];
let   _activeIntervals  = new Set(DEFAULT_INTERVALS);
const COLORS = [
    '#06c8e8', '#6366f1', '#22d3a0', '#f0a030',
    '#f05',    '#8b5cf6', '#ec4899', '#64748b'
];

const State = {
    data:              [],
    expandedIds:       [],
    currentMonday:     null,
    currentView:       'week',
    editingId:         null,
    selectedColor:     COLORS[0],
    draggedTask:       null,
    draggedNode:       null,
    sidebarCollapsed:  false,
    history:           [],
    historyIndex:      -1,
    searchQuery:       '',
    filterFolderId: null,
    statusFilter:   'all',
    searchCollapsed:   new Set(),
    addingToFolderId:  null,
    dayOrders:         JSON.parse(localStorage.getItem('fififi_dayOrders') || '{}'),
    jFilter:           null,
    saveTimeout:       null,
    sortMode:          localStorage.getItem('fififi_sortMode') || 'j',
    manualOrdered:     new Set(JSON.parse(localStorage.getItem('fififi_manualOrdered') || '[]')),
    doneToBottom:      localStorage.getItem('fififi_doneToBottom') !== 'false',
    defaultIntervals:  JSON.parse(localStorage.getItem('fififi_defaultIntervals') || 'null') || [0,1,3,7,21,45,60,90,120,240],
    selectedIds:       new Set(),
    _pendingDayOrder:  null,
};


(function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
        .ctx-menu {
            position: fixed;
            background: var(--surface-2, #101420);
            border: 1px solid var(--border-2, #222840);
            border-radius: var(--radius, 10px);
            padding: 5px;
            display: none;
            z-index: 10000;
            min-width: 160px;
            box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03);
            animation: ctx-in 0.15s var(--ease-out, cubic-bezier(0.16,1,0.3,1));
        }
        @keyframes ctx-in {
            from { opacity: 0; transform: scale(0.93) translateY(-4px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ctx-menu.visible { display: block; }
        .ctx-item {
            display: flex;
            align-items: center;
            gap: 9px;
            width: 100%;
            padding: 8px 12px;
            background: transparent;
            border: none;
            color: var(--text-2, #8892a8);
            text-align: left;
            cursor: pointer;
            border-radius: 6px;
            font-family: var(--font-body, 'Karla', sans-serif);
            font-size: 13px;
            transition: background 0.12s, color 0.12s;
            white-space: nowrap;
        }
        .ctx-item:hover {
            background: var(--surface-3, #161b28);
            color: var(--text, #dde3f0);
        }
        .ctx-item .ctx-icon {
            font-size: 13px;
            width: 16px;
            text-align: center;
            flex-shrink: 0;
            opacity: 0.7;
        }
        .ctx-sep {
            height: 1px;
            background: var(--border, #1a2035);
            margin: 4px 8px;
        }
        .ctx-item.danger { color: var(--danger, #f05); }
        .ctx-item.danger:hover { background: rgba(255,0,85,0.08); }
        body.ctx-open .task-card { pointer-events: none !important; }
        body.ctx-open .task-card:hover { box-shadow: none !important; }
        body.ctx-open .task-card .task-tooltip { opacity: 0 !important; transition: none !important; }
        .task-card.ctx-active { box-shadow: none !important; }
        .task-card.ctx-active:hover { box-shadow: none !important; }
        .task-card.ctx-active .task-tooltip { opacity: 0 !important; transition: none !important; pointer-events: none; }
        .day-empty {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            font-family: var(--font-mono);
            font-size: 10px;
            color: var(--text-3, #4a5370);
            letter-spacing: 0.05em;
            opacity: 0;
            transition: opacity 0.3s;
            user-select: none;
        }
        .day-column:hover .day-empty { opacity: 1; }
        .task-card.toggling { /* supprimé */ }
        .tree-node .course-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--text-3, #4a5370);
            flex-shrink: 0;
        }
        .tree-node-label {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .save-indicator {
            position: fixed;
            bottom: 18px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--surface-3);
            border: 1px solid var(--border-2);
            color: var(--text-3);
            font-family: var(--font-mono);
            font-size: 10px;
            letter-spacing: 0.06em;
            padding: 4px 10px;
            border-radius: 20px;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            z-index: 500;
        }
        .save-indicator.visible { opacity: 1; }
        .modal-card input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(0.5);
            cursor: pointer;
        }
        .task-card.just-moved {
    animation: card-settle 0.35s var(--ease-spring);
}
@keyframes card-settle {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
}
    .task-card { user-select: none; }
        .topbar-left { display: flex; align-items: center; gap: 14px; }
        .task-card { position: relative; overflow: visible !important; }
        .anki-rating { position:fixed;z-index:9999;background:var(--surface-2);border:1px solid var(--border-2);border-radius:var(--radius);padding:12px 16px;display:flex;flex-direction:column;align-items:center;gap:9px;box-shadow:0 16px 40px rgba(0,0,0,0.5);animation:ctx-in 0.15s var(--ease-out); }
        .anki-rating-label { font-family:var(--font-ui);font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-3); }
        .anki-rating-btns { display:flex;gap:5px; }
        .anki-rating-btn { width:34px;height:34px;border-radius:7px;border:1px solid var(--border);background:var(--surface-3);color:var(--text-2);font-family:var(--font-mono);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.12s; }
        .anki-rating-btn:hover { transform:scale(1.12); }
        .anki-rating-btn[data-r="1"]:hover { background:rgba(224,85,112,0.2);border-color:var(--danger);color:var(--danger); }
        .anki-rating-btn[data-r="2"]:hover { background:rgba(224,150,58,0.2);border-color:var(--warn);color:var(--warn); }
        .anki-rating-btn[data-r="3"]:hover { background:rgba(107,140,255,0.15);border-color:var(--accent);color:var(--accent); }
        .anki-rating-btn[data-r="4"]:hover,.anki-rating-btn[data-r="5"]:hover { background:rgba(74,222,154,0.2);border-color:var(--success);color:var(--success); }
        .task-link-btn { font-size:11px;text-decoration:none;opacity:0.45;transition:opacity 0.15s;line-height:1;cursor:pointer; }
        .task-link-btn:hover { opacity:1; }
        #sidebarHandle:hover, #sidebarHandle:active { background: var(--accent); opacity: 0.7; width: 4px; }
        .profile-row {
            display: flex; align-items: center; gap: 8px;
            padding: 8px 10px; background: var(--surface-2);
            border: 1px solid var(--border); border-radius: var(--radius-sm);
        }
        .profile-row-name { font-family: var(--font-ui); font-size: 12.5px; font-weight: 600; color: var(--text); flex-shrink: 0; }
        .profile-row-preview { font-family: var(--font-mono); font-size: 10.5px; color: var(--text-3); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .history-row {
            display: flex; align-items: center; gap: 9px;
            padding: 9px 10px; border-radius: var(--radius-sm);
            cursor: pointer; transition: background 0.12s; margin-bottom: 2px;
        }
        .history-row:hover { background: var(--surface-2); }
        .history-row.current { background: var(--accent-glow); box-shadow: inset 2px 0 0 var(--accent); }
        .history-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-3); flex-shrink: 0; }
        .history-row.current .history-dot { background: var(--accent); }
        .history-desc { flex: 1; font-size: 12.5px; color: var(--text-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .history-row.current .history-desc { color: var(--text); font-weight: 600; }
        .history-time { font-family: var(--font-mono); font-size: 10px; color: var(--text-3); flex-shrink: 0; }
    `;
    
    document.head.appendChild(s);

    const ind = document.createElement('div');
    ind.id = 'saveIndicator';
    ind.className = 'save-indicator';
    ind.textContent = 'SAUVEGARDÉ';
    document.body.appendChild(ind);
})();

function customConfirm(message, title = 'Confirmation', okLabel = 'Supprimer', cancelLabel = 'Annuler', okClass = 'btn-danger') {
    return new Promise(resolve => {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        const modal = document.getElementById('confirmModal');
        modal.classList.add('open');
        const ok = document.getElementById('confirmOk');
        const cancel = document.getElementById('confirmCancel');
        ok.textContent = okLabel;
        ok.className = 'btn ' + okClass;
        cancel.textContent = cancelLabel;
        const cleanup = (result) => {
            modal.classList.remove('open');
            ok.onclick = null;
            cancel.onclick = null;
            document.removeEventListener('keydown', onKey);
            resolve(result);
        };
        const onKey = e => {
            if (e.key === 'Enter') { e.preventDefault(); cleanup(true); }
            if (e.key === 'Escape') { cleanup(false); }
        };
        document.addEventListener('keydown', onKey);
        ok.onclick = () => cleanup(true);
        cancel.onclick = () => cleanup(false);
    });
}

function uuid() {
    return crypto.randomUUID
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
}

function getMonday(d) {
    const date = new Date(d);
    const day  = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.getFullYear(), date.getMonth(), diff);
}

function dateStr(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function daysDiff(d1, d2) {
    const a = new Date(d1); a.setHours(0,0,0,0);
    const b = new Date(d2); b.setHours(0,0,0,0);
    return Math.round((b - a) / MS_PER_DAY);
}

function parseIntervals(str) {
    return str.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x) && x >= 0);
}

function extractInt(str) {
    const digits = String(str || '').replace(/[^0-9]/g, '');
    return digits ? parseInt(digits, 10) : NaN;
}

function escHtml(s) {
    return s ? s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : '';
}

function deepClone(obj) {
    return typeof structuredClone === 'function'
        ? structuredClone(obj)
        : JSON.parse(JSON.stringify(obj));
}

function el(tag, cls, attrs = {}) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    Object.entries(attrs).forEach(([k, v]) => e[k] = v);
    return e;
}

const _hexFullCache = new Map();
function hexFull(hex) {
    if (_hexFullCache.has(hex)) return _hexFullCache.get(hex);
    const result = hex.replace(/^#([a-f\d])([a-f\d])([a-f\d])$/i, '#$1$1$2$2$3$3');
    _hexFullCache.set(hex, result);
    return result;
}

function getFolderColor(courseId) {
    function search(nodes, targetId) {
        for (const n of nodes) {
            if (n.type === 'folder' && n.children) {
                const found = n.children.find(c => c.id === targetId);
                if (found) return n.color;
                const deeper = search(n.children, targetId);
                if (deeper) return deeper;
            }
        }
        return null;
    }
    return search(State.data, courseId);
}

function toast(msg, type = '') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = { success: '✓', error: '✕', '': '◆' };
    const icon  = icons[type] ?? icons[''];

    const t = el('div', `toast${type ? ' ' + type : ''}`);
    t.innerHTML = `<span style="opacity:0.6;font-size:10px">${icon}</span> ${msg}`;
    container.appendChild(t);

    setTimeout(() => {
        t.style.transition = 'opacity 0.3s, transform 0.3s';
        t.style.opacity = '0';
        t.style.transform = 'translateX(60px)';
        setTimeout(() => t.remove(), 300);
    }, 2200);
}

function flashSaveIndicator() {
    const ind = document.getElementById('saveIndicator');
    if (!ind) return;
    ind.classList.add('visible');
    clearTimeout(ind._timeout);
    ind._timeout = setTimeout(() => ind.classList.remove('visible'), 1200);
}
function clearSearch() {
    const si = document.getElementById('searchInput');
    const clr = document.getElementById('searchClear');
    if (si) { si.value = ''; si.dispatchEvent(new Event('input')); si.focus(); }
    if (clr) clr.style.display = 'none';
}
function applyThemeMode(mode) {
    let isLight;
    if (mode === 'light') isLight = true;
    else if (mode === 'dark') isLight = false;
    else isLight = !!(window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.body.classList.toggle('light', isLight);
}

function getThemeMode() {
    return localStorage.getItem('fififi_themeMode') || (localStorage.getItem('fififi_theme') === 'light' ? 'light' : 'auto');
}

function setThemeMode(mode) {
    localStorage.setItem('fififi_themeMode', mode);
    applyThemeMode(mode);
    renderThemeModeButtons();
}

function renderThemeModeButtons() {
    const mode = getThemeMode();
    ['light', 'dark', 'auto'].forEach(m => {
        const btn = document.getElementById('themeMode_' + m);
        if (btn) btn.classList.toggle('active', m === mode);
    });
}

(function() {
    const mode = getThemeMode();
    localStorage.setItem('fififi_themeMode', mode);
    applyThemeMode(mode);
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (getThemeMode() === 'auto') applyThemeMode('auto');
        });
    }
})();

function toggleSidebar() {
    State.sidebarCollapsed = !State.sidebarCollapsed;
    document.querySelector('.sidebar').classList.toggle('collapsed', State.sidebarCollapsed);
}

let _nodeCache = null;
function buildNodeCache(nodes = State.data, map = new Map()) {
    nodes.forEach(n => { map.set(n.id, n); if (n.children) buildNodeCache(n.children, map); });
    return map;
}
function getNodeCache() {
    if (!_nodeCache) _nodeCache = buildNodeCache();
    return _nodeCache;
}
function invalidateNodeCache() { _nodeCache = null; }

function findNode(nodes, id) {
    const cached = getNodeCache().get(id);
    if (cached !== undefined) return cached || null;
    for (const n of nodes) {
        if (n.id === id) return n;
        if (n.children) { const f = findNode(n.children, id); if (f) return f; }
    }
    return null;
}

function findParent(nodes, targetId, parent = null) {
    for (const n of nodes) {
        if (n.id === targetId) return parent;
        if (n.children) {
            const p = findParent(n.children, targetId, n);
            if (p !== null) return p;
        }
    }
    return null;
}

function removeNode(nodes, id) {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) { nodes.splice(i, 1); return true; }
        if (nodes[i].children && removeNode(nodes[i].children, id)) return true;
    }
    return false;
}
function reorderNode(sourceId, targetId, before) {
    if (sourceId === targetId) return false;
    const source = findNode(State.data, sourceId);
    if (!source) return false;
    const targetParent = findParent(State.data, targetId);
    const targetArr    = targetParent ? (targetParent.children || []) : State.data;
    const targetIdx    = targetArr.findIndex(n => n.id === targetId);
    if (targetIdx === -1) return false;
    if (source.type === 'folder') {
        let check = targetParent;
        while (check) { if (check.id === source.id) return false; check = findParent(State.data, check.id); }
    }
    removeNode(State.data, sourceId);
    const newIdx = targetArr.findIndex(n => n.id === targetId);
    targetArr.splice(newIdx === -1 ? targetArr.length : (before ? newIdx : newIdx + 1), 0, source);
    const _reorderParent = findParent(State.data, targetId);
    const _reorderKey = _reorderParent ? _reorderParent.id : 'root';
    State.manualOrdered.add(_reorderKey);
    localStorage.setItem('fififi_manualOrdered', JSON.stringify([...State.manualOrdered]));
    return true;
}
function moveNode(sourceId, targetId) {
    const source = findNode(State.data, sourceId);
    const target = findNode(State.data, targetId);
    if (!source || !target || source.id === target.id || target.type !== 'folder') return false;

    if (source.type === 'folder') {
        let check = target;
        while (check) {
            if (check.id === source.id) return false;
            check = findParent(State.data, check.id);
        }
    }

    removeNode(State.data, sourceId);
    if (!target.children) target.children = [];
    target.children.push(source);
    State.manualOrdered.delete(target.id);
    localStorage.setItem('fififi_manualOrdered', JSON.stringify([...State.manualOrdered]));
    return true;
}

function moveNodeToParent(nodeId) {
    const node = findNode(State.data, nodeId);
    if (!node) return false;
    const parent = findParent(State.data, nodeId);
    if (!parent) return false;
    const grandParent = findParent(State.data, parent.id);
    const targetArr = grandParent ? (grandParent.children || []) : State.data;
    removeNode(State.data, nodeId);
    const parentIdx = targetArr.findIndex(n => n.id === parent.id);
    targetArr.splice(parentIdx === -1 ? targetArr.length : parentIdx + 1, 0, node);
    return true;
}

function duplicateNode(nodeId) {
    const node = findNode(State.data, nodeId);
    if (!node) return;

    const clone = deepClone(node);
    function regenIds(n) { n.id = uuid(); if (n.children) n.children.forEach(regenIds); }
    regenIds(clone);
    clone.name += ' (copie)';

    const parent = findParent(State.data, nodeId);
    (parent ? parent.children : State.data).push(clone);

    addToHistory(`"${node.name}" dupliqué`);
    save();
    toast('Copié', 'success');
}

function matchesSearch(node, query) {
    if (!query) return true;
    const q = query.toLowerCase();
    if (node.name.toLowerCase().includes(q)) return true;
    if (node.children) return node.children.some(c => matchesSearch(c, q));
    return false;
}

function getAllCourses(data = State.data) {
    const courses = [];
    function traverse(nodes) {
        nodes.forEach(n => {
            if (n.type === 'course') courses.push(n);
            if (n.children) traverse(n.children);
        });
    }
    traverse(data);
    return courses;
}

let _rawTasksCache = null;
function invalidateTasksCache() { _rawTasksCache = null; }

function getRawTasks() {
    if (_rawTasksCache) return _rawTasksCache;
    const tasks = [];
    const colorMap = new Map();
    function buildColorMap(nodes, parentColor) {
        nodes.forEach(n => {
            if (n.type === 'folder') { buildColorMap(n.children || [], n.color || parentColor); }
            else { colorMap.set(n.id, n.color || parentColor || null); }
        });
    }
    buildColorMap(State.data, null);

    function traverse(nodes, path) {
        nodes.forEach(n => {
            if (n.type === 'folder') {
                traverse(n.children || [], path ? path + ' / ' + n.name : n.name);
            } else {
            if (!n.j0) return;
            const intervals       = n.intervals || DEFAULT_INTERVALS;
                const j0              = new Date(n.j0 + 'T00:00:00');
                const customIntervals = n.customIntervals || {};
                const folderColor     = colorMap.get(n.id) || null;
                intervals.forEach(jVal => {
                    const actualJVal = customIntervals[jVal] !== undefined ? customIntervals[jVal] : jVal;
                    const taskDate   = new Date(j0);
                    taskDate.setDate(taskDate.getDate() + actualJVal);
                    tasks.push({
                        id:          n.id,
                        name:        n.name,
                        path:        path || '',
                        dateStr:     dateStr(taskDate),
                        jVal,
                        actualJVal,
                        done:        (n.doneTasks || []).includes(jVal),
                        folderColor: folderColor || null,
                    });
                });
            }
        });
    }
    traverse(State.data, '');
    _rawTasksCache = tasks;
    return tasks;
}

function getAllTasks(skipFilters = false) {
    const tasks = getRawTasks();
    if (State.filterFolderId) {
        const folder = findNode(State.data, State.filterFolderId);
        function containsId(nodes, id) {
            for (const n of nodes) {
                if (n.id === id) return true;
                if (n.children && containsId(n.children, id)) return true;
            }
            return false;
        }
        let _ffbase = folder ? tasks.filter(t => containsId(folder.children || [], t.id)) : tasks;
        if (State.searchQuery.trim()) {
            const _sq = State.searchQuery.trim().toLowerCase();
            _ffbase = _ffbase.filter(t => t.name.toLowerCase().includes(_sq) || t.path.toLowerCase().includes(_sq));
        }
        const _fft = State.jFilter !== null ? _ffbase.filter(t => t.jVal === State.jFilter) : _ffbase;
        return applyStatusFilter(_fft, skipFilters);
    }
    const _sq = State.searchQuery.trim().toLowerCase();
    let _tf = _sq ? tasks.filter(t => t.name.toLowerCase().includes(_sq) || t.path.toLowerCase().includes(_sq)) : tasks;
    const _jft = State.jFilter !== null ? _tf.filter(t => t.jVal === State.jFilter) : _tf;
    return applyStatusFilter(_jft, skipFilters);
}

function addToHistory(description) {
    if (State.historyIndex < State.history.length - 1) {
        State.history = State.history.slice(0, State.historyIndex + 1);
    }
    State.history.push({ description, state: deepClone(State.data), dayOrders: deepClone(State.dayOrders), timestamp: Date.now() });
    if (State.history.length > 100) State.history.shift();
    else State.historyIndex++;
    updateUndoRedoButtons();
}

function undo() {
    if (State.historyIndex <= 0) return;
    State.historyIndex--;
    const snap = State.history[State.historyIndex];
    State.data      = deepClone(snap.state);
    State.dayOrders = deepClone(snap.dayOrders || {});
    localStorage.setItem('fififi_dayOrders', JSON.stringify(State.dayOrders));
    save({ history: false });
    toast('Annulé ← ' + snap.description);
}

function redo() {
    if (State.historyIndex >= State.history.length - 1) return;
    State.historyIndex++;
    const snap = State.history[State.historyIndex];
    State.data      = deepClone(snap.state);
    State.dayOrders = deepClone(snap.dayOrders || {});
    localStorage.setItem('fififi_dayOrders', JSON.stringify(State.dayOrders));
    save({ history: false });
    toast('Rétabli → ' + snap.description);
}

function updateUndoRedoButtons() {
    const u = document.getElementById('undoBtn');
    const r = document.getElementById('redoBtn');
    if (u) {
        u.disabled = State.historyIndex <= 0;
        const act = State.history[State.historyIndex];
        u.title = (act && State.historyIndex > 0) ? `Annuler : ${act.description} (Ctrl+Z)` : 'Annuler (Ctrl+Z)';
    }
    if (r) {
        r.disabled = State.historyIndex >= State.history.length - 1;
        const act = State.history[State.historyIndex + 1];
        r.title = act ? `Rétablir : ${act.description} (Ctrl+Shift+Z)` : 'Rétablir (Ctrl+Shift+Z)';
    }
}

function openHistoryModal() {
    const modal = document.getElementById('historyModal');
    const list  = document.getElementById('historyList');
    if (!modal || !list) return;
    list.innerHTML = '';
    for (let i = State.history.length - 1; i >= 0; i--) {
        const snap = State.history[i];
        const isCurrent = i === State.historyIndex;
        const row = el('div', 'history-row' + (isCurrent ? ' current' : ''));
        const time = new Date(snap.timestamp).toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
        row.innerHTML = `<span class="history-dot"></span><span class="history-desc">${escHtml(snap.description)}</span><span class="history-time">${time}</span>`;
        row.onclick = () => jumpToHistory(i);
        list.appendChild(row);
    }
    modal.classList.add('open');
}

function jumpToHistory(index) {
    if (index < 0 || index >= State.history.length || index === State.historyIndex) { closeModal('historyModal'); return; }
    State.historyIndex = index;
    const snap = State.history[index];
    State.data      = deepClone(snap.state);
    State.dayOrders = deepClone(snap.dayOrders || {});
    localStorage.setItem('fififi_dayOrders', JSON.stringify(State.dayOrders));
    save({ history: false });
    closeModal('historyModal');
    toast('→ ' + snap.description);
}

let _ctxMenu = null;
let _ankiDismiss = null;
let _ankiActiveTask = null;
let _navDragTimer = null;
function getCtxMenu() {
    if (!_ctxMenu) {
        _ctxMenu = el('div', 'ctx-menu');
        _ctxMenu.id = 'contextMenu';
        document.body.appendChild(_ctxMenu);
    }
    return _ctxMenu;
}

function ctxItem(iconText, label, onClick, cls = '') {
    const btn = el('button', `ctx-item${cls ? ' ' + cls : ''}`);
    btn.innerHTML = `<span class="ctx-icon">${iconText}</span>${label}`;
    btn.onclick = (e) => { e.stopPropagation(); hideContextMenu(); onClick(); };
    return btn;
}

function showContextMenu(e, node) {
    e.preventDefault();
    e.stopPropagation();

    const menu = getCtxMenu();
    menu.innerHTML = '';

    menu.appendChild(ctxItem('⧉', 'Dupliquer', () => duplicateNode(node.id)));
    menu.appendChild(ctxItem('↓', 'Exporter', () => exportNode(node)));

    if (node.type === 'folder') {
        const sep = el('div', 'ctx-sep');
        menu.appendChild(sep);
        menu.appendChild(ctxItem('✷', 'Ajouter un cours', () => addCourse(node.id)));
        menu.appendChild(ctxItem('▣', 'Ajouter un sous-dossier', () => addFolder(node.id)));
        menu.appendChild(ctxItem('🎨', 'Couleurs aléatoires (enfants)', () => randomizeChildColors(node.id)));
        menu.appendChild(el('div', 'ctx-sep'));
        const _folderParent = findParent(State.data, node.id);
        if (_folderParent) menu.appendChild(ctxItem('↑', 'Extraire du dossier parent', () => {
            if (moveNodeToParent(node.id)) { addToHistory(`"${node.name}" extrait du dossier`); save({ calendar: false }); toast('Extrait du dossier', 'success'); }
        }));
        menu.appendChild(ctxItem('✎', 'Éditer', () => openEditFolder(node.id)));
        menu.appendChild(ctxItem('✕', 'Supprimer', async () => {
            if (await customConfirm(`Supprimer "${node.name}" et tout son contenu ?`, 'Supprimer le dossier')) {
                addToHistory(`Dossier "${node.name}" supprimé`);
                removeNode(State.data, node.id);
                save();
                toast('Supprimé', 'success');
            }
        }, 'danger'));
    } else {
        const sep = el('div', 'ctx-sep');
        menu.appendChild(sep);
        const _courseParent = findParent(State.data, node.id);
        if (_courseParent) menu.appendChild(ctxItem('↑', 'Extraire du dossier', () => {
            if (moveNodeToParent(node.id)) { addToHistory(`"${node.name}" extrait du dossier`); save({ calendar: false }); toast('Extrait du dossier', 'success'); }
        }));
        menu.appendChild(ctxItem('✎', 'Éditer', () => openEditCourse(node.id)));
        menu.appendChild(ctxItem('✕', 'Supprimer', async () => {
            if (await customConfirm(`Supprimer le cours "${node.name}" ?`, 'Supprimer le cours')) {
                addToHistory(`Cours "${node.name}" supprimé`);
                removeNode(State.data, node.id);
                save();
                toast('Supprimé', 'success');
            }
        }, 'danger'));
    }

    document.querySelectorAll('.task-card.ctx-active').forEach(el => el.classList.remove('ctx-active'));
    document.querySelector('.anki-rating')?.remove();
    document.querySelectorAll('.datepicker-popup.visible').forEach(p => p.classList.remove('visible'));
    const _card = e.currentTarget;
    if (_card) _card.classList.add('ctx-active');
    menu.classList.add('visible');
    document.body.classList.add('ctx-open');
    const mx = Math.min(e.pageX, window.innerWidth  - menu.offsetWidth  - 10);
    const my = Math.min(e.pageY, window.innerHeight - menu.offsetHeight - 10);
    menu.style.left = mx + 'px';
    menu.style.top  = my + 'px';
}

function hideContextMenu() {
    if (_ctxMenu) _ctxMenu.classList.remove('visible');
    document.body.classList.remove('ctx-open');
    document.querySelector('.anki-rating')?.remove();
    setTimeout(() => {
        document.querySelectorAll('.task-card.ctx-active').forEach(el => el.classList.remove('ctx-active'));
    }, 80);
}
document.addEventListener('click', hideContextMenu);
document.addEventListener('contextmenu', hideContextMenu);

document.addEventListener('dragend', () => {
    State.draggedTask = null;
    State.draggedNode = null;
    State._pendingDayOrder = null;
    document.querySelectorAll('.task-placeholder').forEach(p => p.remove());
    clearTimeout(_navDragTimer);
    _navDragTimer = null;
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over, .drop-before, .drop-after').forEach(el => el.classList.remove('drag-over', 'drop-before', 'drop-after'));
});
document.addEventListener('drop', e => e.preventDefault());
document.addEventListener('dragover', e => {
    e.preventDefault();
    if (!State.draggedTask) return;
    const calWrap = document.querySelector('.calendar-wrapper');
    if (!calWrap) return;
    const { left, right, top, bottom } = calWrap.getBoundingClientRect();
    const ZONE = 100;
    if (e.clientX - left < ZONE)
        calWrap.scrollLeft -= (ZONE - (e.clientX - left)) * 0.4;
    else if (right - e.clientX < ZONE)
        calWrap.scrollLeft += (ZONE - (right - e.clientX)) * 0.4;
    if (e.clientY - top < ZONE)
        calWrap.scrollTop -= (ZONE - (e.clientY - top)) * 0.4;
    else if (bottom - e.clientY < ZONE)
        calWrap.scrollTop += (ZONE - (bottom - e.clientY)) * 0.4;
});

function naturalSort(a, b) {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name, 'fr', { numeric: true, sensitivity: 'base' });
}

function getSortedNodes(nodes, containerKey) {
    if (State.manualOrdered.has(containerKey)) return nodes;
    return [...nodes].sort(naturalSort);
}

function renderTree() {
    const root = document.getElementById('treeRoot');
    if (!root) return;

    const q = State.searchQuery.trim().toLowerCase();

    const frag = document.createDocumentFragment();

    if (State.filterFolderId) {
        const node = findNode(State.data, State.filterFolderId);
        if (node) {
            const bar = el('div', 'filter-active-bar');
            bar.innerHTML = `<span>⬡ ${node.name}</span><span title="Retirer le filtre">✕</span>`;
            bar.onclick = () => { State.filterFolderId = null; renderTree(); renderCalendar(); };
            frag.appendChild(bar);
        }
    }

   getSortedNodes(State.data, 'root').forEach(node => {
        if (!q || matchesSearch(node, q))
            frag.appendChild(createTreeNode(node, 0, !!q));
    });

    root.textContent = '';
    root.appendChild(frag);
}

function createTreeNode(node, level, forceExpand = false) {
    const container = el('div');
    const row       = el('div', 'tree-node');
    const expanded = (forceExpand && !State.searchCollapsed.has(node.id)) || State.expandedIds.includes(node.id);

    row.style.paddingLeft = (level * 6 + 4) + 'px';
    row.draggable = true;
    row.dataset.id = node.id;

    row.oncontextmenu = (e) => showContextMenu(e, node);

    row.ondragstart = (e) => {
        State.draggedNode = node;
        row.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    };
    row.ondragend = () => {
        row.classList.remove('dragging');
        State.draggedNode = null;
        document.querySelectorAll('.tree-node.drag-over').forEach(n => n.classList.remove('drag-over'));
    };

    row.ondragover = (e) => {
        if (!State.draggedNode || State.draggedNode.id === node.id) return;
        e.preventDefault();
        const rect  = row.getBoundingClientRect();
        const ratio = (e.clientY - rect.top) / rect.height;
        row.classList.remove('drop-before', 'drop-after', 'drag-over');
        if (node.type === 'folder' && ratio > 0.25 && ratio < 0.75) {
            row.classList.add('drag-over');
            row._dropMode = 'inside';
        } else {
            row.classList.add(ratio <= 0.5 ? 'drop-before' : 'drop-after');
            row._dropMode = ratio <= 0.5 ? 'before' : 'after';
        }
    };
    row.ondragleave = () => row.classList.remove('drag-over', 'drop-before', 'drop-after');
    row.ondrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        row.classList.remove('drag-over', 'drop-before', 'drop-after');
        if (!State.draggedNode || State.draggedNode.id === node.id) return;
        const mode = row._dropMode || 'before';
        if (mode === 'inside' && node.type === 'folder') {
            if (moveNode(State.draggedNode.id, node.id)) {
                addToHistory(`"${State.draggedNode.name}" → "${node.name}"`);
                save({ calendar: false });
                toast('Déplacé', 'success');
            }
        } else {
            if (reorderNode(State.draggedNode.id, node.id, mode === 'before')) {
                addToHistory(`"${State.draggedNode.name}" réordonné`);
                save({ calendar: false });
                toast('Réordonné', 'success');
            }
        }
    };

    if (node.type === 'folder') {
        row.classList.add('is-folder');
        const arrow  = el('span', 'tree-arrow');
        arrow.textContent = expanded ? '▾' : '▸';

        const dot = el('span', 'folder-dot');
        dot.style.background = node.color || COLORS[0];
        dot.style.transition = 'transform 0.2s, box-shadow 0.2s';

        if (State.filterFolderId === node.id) {
    dot.style.boxShadow = `0 0 0 2px var(--bg), 0 0 0 4px ${node.color || COLORS[0]}`;
    dot.style.transform = 'scale(1.3)';
}

        const label = el('span', 'tree-node-label');
        label.textContent = node.name;

        row.appendChild(arrow);
        row.appendChild(dot);
        row.appendChild(label);

        const addCourseBtn = el('button', 'tree-node-edit-btn');
        addCourseBtn.textContent = '+';
        addCourseBtn.title = 'Ajouter un cours';
        addCourseBtn.onclick = (e) => { e.stopPropagation(); addCourse(node.id); };
        row.appendChild(addCourseBtn);

        const addFolderBtn = el('button', 'tree-node-edit-btn');
        addFolderBtn.textContent = '▣';
        addFolderBtn.title = 'Ajouter un sous-dossier';
        addFolderBtn.onclick = (e) => { e.stopPropagation(); addFolder(node.id); };
        row.appendChild(addFolderBtn);

        const editBtn = el('button', 'tree-node-edit-btn');
        editBtn.textContent = '✎';
        editBtn.title = 'Éditer le dossier';
        editBtn.onclick = (e) => { e.stopPropagation(); openEditFolder(node.id); };
        row.appendChild(editBtn);

        const filterBtn = el('button', 'tree-node-edit-btn' + (State.filterFolderId === node.id ? ' active' : ''));
        filterBtn.textContent = '⬡';
        filterBtn.title = 'Filtrer le calendrier sur ce dossier';
        filterBtn.onclick = (e) => {
            e.stopPropagation();
            State.filterFolderId = State.filterFolderId === node.id ? null : node.id;
            renderTree();
            renderCalendar();
        };
        row.appendChild(filterBtn);

        row.onclick = (e) => {
            e.stopPropagation();
            if (State.searchQuery.trim()) {
                if (State.searchCollapsed.has(node.id)) State.searchCollapsed.delete(node.id);
                else State.searchCollapsed.add(node.id);
            } else {
                const idx = State.expandedIds.indexOf(node.id);
                if (idx > -1) State.expandedIds.splice(idx, 1);
                else State.expandedIds.push(node.id);
                localStorage.setItem(STORAGE_KEY + '_expanded', JSON.stringify(State.expandedIds));
            }
            renderTree();
        };

    } else {
        row.classList.add('is-course');
        const dot = el('span', 'course-dot');
        const dotColor = node.color || getFolderColor(node.id);
        if (dotColor) dot.style.background = dotColor;

        const label = el('span', 'tree-node-label');
        label.textContent = node.name;

        const badge = el('span', 'course-badge');
        if (node.j0) {
            const diff = daysDiff(new Date(node.j0 + 'T00:00:00'), new Date());
            badge.textContent = `J${diff}`;
            const todayStr = dateStr(new Date());
            const hasDueToday = (node.intervals || DEFAULT_INTERVALS).some(jVal => {
                const j0d = new Date(node.j0 + 'T00:00:00');
                const custom = (node.customIntervals || {})[jVal];
                const offset = custom !== undefined ? custom : jVal;
                const d2 = new Date(j0d); d2.setDate(d2.getDate() + offset);
                return dateStr(d2) === todayStr && !(node.doneTasks || []).includes(jVal);
            });
            if (hasDueToday) badge.classList.add('due-today');
        } else {
            badge.textContent = 'Sans date';
            badge.classList.add('no-date');
        }

        row.appendChild(dot);
        row.appendChild(label);
        row.appendChild(badge);

        if (State.selectedIds.has(node.id)) row.classList.add('selected');
        row.onclick = (e) => {
            e.stopPropagation();
            if (e.ctrlKey || e.metaKey) {
                if (State.selectedIds.has(node.id)) State.selectedIds.delete(node.id);
                else State.selectedIds.add(node.id);
                updateMultiBar();
                renderTree();
                return;
            }
            if (State.selectedIds.size > 0) { clearSelection(); return; }
            openEditCourse(node.id);
        };
    }

    container.appendChild(row);

    if (node.type === 'folder' && expanded && node.children?.length) {
        const childrenWrapper = el('div', 'tree-children');
        const _sq = State.searchQuery.trim().toLowerCase();
        const _parentMatch = _sq && node.name.toLowerCase().includes(_sq);
        getSortedNodes(node.children, node.id)
            .filter(child => !_sq || _parentMatch || matchesSearch(child, _sq))
            .forEach(child => childrenWrapper.appendChild(createTreeNode(child, level + 1, forceExpand)));
        container.appendChild(childrenWrapper);
    }

    return container;
}

function renderCalendar() {
    const cal = document.getElementById('calendar');
    if (!cal) return;

    cal.className = 'calendar ' + State.currentView;
    

    const tasks = getAllTasks();
    const today = dateStr(new Date());
    const frag  = document.createDocumentFragment();
    const sfb = document.getElementById('sfb-count');
    if (sfb) sfb.textContent = tasks.length || '';

    if (State.currentView === 'week') {
        const end = new Date(State.currentMonday);
        end.setDate(end.getDate() + 6);

        document.getElementById('dateLabel').textContent =
            `${State.currentMonday.toLocaleDateString('fr-FR', {day:'numeric', month:'short'})} — ${end.toLocaleDateString('fr-FR', {day:'numeric', month:'short', year:'numeric'})}`;

        for (let i = 0; i < 7; i++) {
            const d = new Date(State.currentMonday);
            d.setDate(d.getDate() + i);
            const ds = dateStr(d);
            frag.appendChild(createDayColumn(d, ds, ds === today, tasks.filter(t => t.dateStr === ds)));
        }
    } else if (State.currentView === 'focus') {
        const d   = new Date(State.currentMonday);
        const ds  = dateStr(d);
        const todayDs = dateStr(new Date());
        const lbl = d.toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
        document.getElementById('dateLabel').textContent = lbl.charAt(0).toUpperCase() + lbl.slice(1);
        frag.appendChild(createDayColumn(d, ds, ds === todayDs, tasks.filter(t => t.dateStr === ds)));
    } else {
        const month      = State.currentMonday.getMonth();
        const year       = State.currentMonday.getFullYear();
        const firstDay   = new Date(year, month, 1).getDay();
        const startBlanks = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        document.getElementById('dateLabel').textContent =
            new Date(year, month).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

        for (let i = 0; i < startBlanks; i++) {
            const blank = el('div', 'day-column');
            blank.style.opacity = '0.2';
            frag.appendChild(blank);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const d  = new Date(year, month, day);
            const ds = dateStr(d);
            frag.appendChild(createDayColumn(d, ds, ds === today, tasks.filter(t => t.dateStr === ds)));
        }
    }

    cal.innerHTML = '';
    cal.appendChild(frag);
}

function createDayColumn(d, ds, isToday, tasks) {
    const col = el('div', 'day-column' + (isToday ? ' today' : ''));

    col.ondragover = (e) => { e.preventDefault(); if (State.draggedTask && State.draggedTask.dateStr === ds) return; col.classList.add('drag-over'); };
    col.ondragleave = () => col.classList.remove('drag-over');
    col.ondrop = (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');
        if (State.draggedTask) {
            const diff = daysDiff(State.draggedTask.dateStr, ds);
            if (diff !== 0) {
                if (State.draggedTask.jVal === 0) {
                    shiftDate(State.draggedTask.id, diff);
                } else {
                    const _c = findNode(State.data, State.draggedTask.id);
                    if (_c && new Date(ds + 'T00:00:00') < new Date(_c.j0 + 'T00:00:00')) {
                        toast('Impossible avant le J0', 'error');
                    } else {
                        shiftSpecificTask(State.draggedTask.id, State.draggedTask.jVal, diff);
                    }
                }
            } else if (State._pendingDayOrder && State._pendingDayOrder.ds === ds) {
                document.querySelectorAll('.task-placeholder').forEach(p => p.remove());
                addToHistory(`Ordre du ${ds} mis à jour`);
                State.dayOrders[ds] = State._pendingDayOrder.order;
                State._pendingDayOrder = null;
                save();
                toast('Ordre mis à jour', 'success');
            }
        }
    };

    const header = el('div', 'day-header');
    const labelGroup = el('div', 'day-label-group');
    const dayName = el('span', 'day-name');
    dayName.textContent = d.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.','').toUpperCase();
    const dayNum = el('div', 'day-number');
    dayNum.textContent = d.getDate();
    labelGroup.appendChild(dayName);
    labelGroup.appendChild(dayNum);

    const taskCount = el('span', 'day-task-count');
    if (tasks.length > 0) {
        taskCount.textContent = tasks.length;
        if (State.dayOrders[ds]) {
            const resetBtn = el('button');
            resetBtn.title = "Réinitialiser l'ordre manuel";
            resetBtn.textContent = '↺';
            resetBtn.style.cssText = 'background:none;border:none;color:var(--accent);cursor:pointer;font-size:11px;padding:0 0 0 5px;line-height:1;opacity:0.7;vertical-align:middle;';
            resetBtn.onclick = e => { e.stopPropagation(); delete State.dayOrders[ds]; localStorage.setItem('fififi_dayOrders', JSON.stringify(State.dayOrders)); renderCalendar(); };
            taskCount.appendChild(resetBtn);
        }
    }

    header.appendChild(labelGroup);
    header.appendChild(taskCount);
    if (tasks.length > 0) {
        const allDone = tasks.every(t => {
            const course = findNode(State.data, t.id);
            return course && (course.doneTasks || []).includes(t.jVal);
        });
        const checkAll = el('button', `day-check-all${allDone ? ' all-done' : ''}`);
        checkAll.title = allDone ? 'Tout décocher' : 'Tout cocher';
        checkAll.textContent = '✓';
        checkAll.onclick = e => { e.stopPropagation(); checkAllDay(tasks); };
        header.appendChild(checkAll);
    }
    col.appendChild(header);

    const body = el('div', 'day-body');

    if (tasks.length === 0) {
        const empty = el('div', 'day-empty');
        empty.textContent = '·';
        body.appendChild(empty);
    } else {
        const _tk = t => `${t.id}_${t.jVal}`;
        const _dayOrder = State.dayOrders[ds];

        let sorted;
        if (_dayOrder) {
            sorted = [...tasks].sort((a, b) => {
                const ai = _dayOrder.indexOf(_tk(a)), bi = _dayOrder.indexOf(_tk(b));
                if (ai === -1 && bi === -1) return 0;
                if (ai === -1) return 1;
                if (bi === -1) return -1;
                return ai - bi;
            });
        } else if (State.sortMode === 'folder') {
            const grouped = {};
            tasks.forEach(t => { const p = t.path||''; if (!grouped[p]) grouped[p] = []; grouped[p].push(t.actualJVal); });
            const pathPriority = new Map();
            Object.entries(grouped).forEach(([path, jVals]) => {
                const counted = {};
                jVals.forEach(j => counted[j] = (counted[j]||0)+1);
                const uniqueJs = Object.keys(counted).map(Number).sort((a,b)=>a-b);
                const key = [];
                uniqueJs.forEach(j => { key.push(j); key.push(-counted[j]); });
                pathPriority.set(path, key);
            });
            sorted = [...tasks].sort((a, b) => {
                const ka = pathPriority.get(a.path||'') || [];
                const kb = pathPriority.get(b.path||'') || [];
                for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
                    const va = i < ka.length ? ka[i] : Infinity;
                    const vb = i < kb.length ? kb[i] : Infinity;
                    if (va !== vb) return va - vb;
                }
                return a.actualJVal - b.actualJVal;
            });
        } else {
            sorted = [...tasks].sort((a, b) => a.actualJVal - b.actualJVal);
        }

        const _displayed = State.doneToBottom
            ? [...sorted].sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0))
            : sorted;

        _displayed.forEach((t, i) => {
            const card = createTaskCard(t, i, ds, _displayed);
            body.appendChild(card);
        });
    }

    col.appendChild(body);
    return col;
}

function createTaskCard(t, animIndex = 0, ds = null, dayTasks = []) {
    const overdue = !t.done && t.dateStr < dateStr(new Date());
    const _taskKey = `${t.id}_${t.jVal}`;
const _isJustDropped = State._lastDropped === _taskKey;
if (_isJustDropped) State._lastDropped = null;
const card = el('div', 'task-card' + (t.done ? ' done' : '') + (overdue ? ' overdue' : '') + (_isJustDropped ? ' just-dropped' : ''));
    card.dataset.taskKey = _taskKey;
    
    card.draggable = true;

    const cardColor = t.folderColor || 'var(--accent)';
    card.dataset.color = cardColor;
    card.style.setProperty('--card-color', cardColor);

    const styleTag = card.style;
    styleTag.setProperty('--card-color', cardColor);

card.ondragstart = (e) => {
    State.draggedTask = t;
    setTimeout(() => card.classList.add('dragging'), 0);
    e.dataTransfer.effectAllowed = 'move';
};

card.ondragend = () => {
    card.classList.remove('dragging');
    State.draggedTask = null;
    document.querySelectorAll('.task-placeholder').forEach(p => p.remove());
    document.querySelectorAll('.task-card.drag-above, .task-card.drag-below')
        .forEach(c => c.classList.remove('drag-above','drag-below'));
};

card.ondragover = (e) => {
    if (!State.draggedTask || !ds) return;
    if (`${State.draggedTask.id}_${State.draggedTask.jVal}` === `${t.id}_${t.jVal}`) return;
    if (State.draggedTask.dateStr !== ds) return;
    e.preventDefault();
    e.stopPropagation();
    const rect   = card.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
    document.querySelectorAll('.task-placeholder').forEach(p => p.remove());
    const ph = el('div', 'task-placeholder');
    ph.style.height = (card.offsetHeight - 4) + 'px';
    card.parentElement.insertBefore(ph, before ? card : card.nextSibling);
    const _dk2 = `${State.draggedTask.id}_${State.draggedTask.jVal}`;
    const _dk3 = `${t.id}_${t.jVal}`;
    const _tkk2 = x => `${x.id}_${x.jVal}`;
    const _ord2 = dayTasks.map(_tkk2).filter(k => k !== _dk2);
    const _di2  = _ord2.indexOf(_dk3);
    if (_di2 !== -1) {
        _ord2.splice(before ? _di2 : _di2 + 1, 0, _dk2);
        State._pendingDayOrder = { ds, order: _ord2 };
    }
};

card.ondragleave = () => {};

card.ondrop = (e) => {
    e.preventDefault();
    document.querySelectorAll('.task-placeholder').forEach(p => p.remove());
    if (!State.draggedTask || !ds) return;

    if (State.draggedTask.dateStr !== ds) {
        e.stopPropagation();
        const diff = daysDiff(State.draggedTask.dateStr, ds);
        if (diff !== 0) {
            if (State.draggedTask.jVal === 0) {
                shiftDate(State.draggedTask.id, diff);
            } else {
                const _c = findNode(State.data, State.draggedTask.id);
                if (_c && new Date(ds + 'T00:00:00') < new Date(_c.j0 + 'T00:00:00')) {
                    toast('Impossible avant le J0', 'error');
                } else {
                    State._lastDropped = `${State.draggedTask.id}_${State.draggedTask.jVal}`;
                    shiftSpecificTask(State.draggedTask.id, State.draggedTask.jVal, diff);
                }
            }
        }
        return;
    }
    e.stopPropagation();
    const dragKey = `${State.draggedTask.id}_${State.draggedTask.jVal}`;
    const dropKey = `${t.id}_${t.jVal}`;
    if (dragKey === dropKey) return;
    const before = e.clientY < card.getBoundingClientRect().top + card.getBoundingClientRect().height / 2;
    const _tkk = x => `${x.id}_${x.jVal}`;
    let order = dayTasks.map(_tkk).filter(k => k !== dragKey);
    const di = order.indexOf(dropKey);
    if (di === -1) return;
    order.splice(before ? di : di + 1, 0, dragKey);

    const _currentOrder = dayTasks.map(_tkk);
    const _unchanged = _currentOrder.length === order.length && _currentOrder.every((k, i) => k === order[i]);
    if (_unchanged) { State.draggedTask = null; return; }

    addToHistory(`Ordre du ${ds} mis à jour`);
    State.dayOrders[ds] = order;
    State.draggedTask = null;
    save();
    requestAnimationFrame(() => {
        document.querySelectorAll('.task-card').forEach(c => {
            if (c.dataset.taskKey === dragKey) c.classList.add('just-dropped');
        });
    });
};
    card.onclick = () => {
        const ankiPopup = document.querySelector('.anki-rating');
        if (ankiPopup) {
            if (_ankiActiveTask && _ankiActiveTask.id === t.id && _ankiActiveTask.jVal === t.jVal) {
                ankiPopup.remove();
                if (_ankiDismiss) { document.removeEventListener('click', _ankiDismiss); _ankiDismiss = null; }
                _ankiActiveTask = null;
                toggleTask(t.id, t.jVal, card);
            }
            return;
        }
        toggleTask(t.id, t.jVal, card);
    };
    card.oncontextmenu = e => { e.preventDefault(); e.stopPropagation(); showTaskCtxMenu(e, t); };

    const top  = el('div', 'task-top');
const name = el('div', 'task-name');
name.textContent = t.name;
top.appendChild(name);
    card.appendChild(top);

    const course = findNode(State.data, t.id);

    const beforeColor = t.done ? 'var(--success)' : cardColor;
    const isHex   = cardColor && cardColor.startsWith('#');
    const hex6    = isHex ? hexFull(cardColor) : cardColor;
    const bgColor = isHex ? `color-mix(in srgb, ${hex6} 32%, var(--surface))` : 'color-mix(in srgb, #6b8cff 30%, var(--surface))';
    const bdColor = isHex ? hex6 + '45' : 'rgba(107,140,255,0.3)';
    card.style.background = bgColor;
    card.style.border     = 'none';
    const meta  = el('div', 'task-meta');
    const path  = el('span', 'task-path');
    const lastFolder = t.path ? t.path.split(' / ').pop() : '';
    path.textContent = lastFolder;
    path.title = t.path || '';

    const badge = el('span', `task-badge${t.jVal === 0 ? ' j0' : ''}`);
    badge.textContent = `J${t.actualJVal ?? t.jVal}`;
    meta.appendChild(path);
    meta.appendChild(badge);
    if (course?.link) {
        const lb = el('a', 'task-link-btn');
        lb.draggable = false;
        lb.href = course.link; lb.target = '_blank'; lb.rel = 'noopener noreferrer';
        lb.title = 'Ouvrir le cours'; lb.textContent = '🔗';
        lb.onclick = e => e.stopPropagation();
        meta.appendChild(lb);
    }
    card.appendChild(meta);

    return card;
}

function moveCardToBottomAnimated(cardEl, toBottom) {
    const body = cardEl.parentElement;
    if (!body) return;

    const children = [...body.children];
    const rects = new Map();
    children.forEach(c => rects.set(c, c.getBoundingClientRect()));

    if (toBottom) {
        body.appendChild(cardEl);
    } else {
        const origIndex = parseInt(cardEl.dataset.origIndex) || 0;
        const siblings = [...body.children].filter(c => c !== cardEl);
        body.insertBefore(cardEl, siblings[origIndex] || siblings[0] || null);
    }

    children.forEach(c => {
        const oldRect = rects.get(c);
        if (!oldRect) return;
        const dy = oldRect.top - c.getBoundingClientRect().top;
        if (dy === 0) return;
        c.style.transition = 'none';
        c.style.transform = `translateY(${dy}px)`;
        void c.offsetWidth;
        c.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        c.style.transform = '';
        const cleanup = () => {
            c.style.transition = '';
            c.style.transform = '';
            c.style.willChange = '';
        };
        c.addEventListener('transitionend', cleanup, { once: true });
        setTimeout(cleanup, 450);
    });
}

function toggleTask(courseId, jVal, cardEl) {
    const course = findNode(State.data, courseId);
    if (!course) return;
    if (!course.doneTasks) course.doneTasks = [];

    const idx    = course.doneTasks.indexOf(jVal);
    const isDone = idx === -1;
    const actualJVal = (course.customIntervals && course.customIntervals[jVal] !== undefined) ? course.customIntervals[jVal] : jVal;

    if (isDone) {
        course.doneTasks.push(jVal);
    } else {
        course.doneTasks.splice(idx, 1);
        if (course.ratings) delete course.ratings[jVal];
    }

    if (cardEl) {
        cardEl.classList.toggle('done', isDone);
        if (isDone) cardEl.classList.remove('overdue');
        const nameEl = cardEl.querySelector('.task-name');
        if (nameEl) nameEl.style.textDecoration = isDone ? 'line-through' : '';
        const _cc    = cardEl.dataset.color || 'var(--accent)';
        const _isHex = _cc.startsWith('#');
        const _hex6  = _isHex ? hexFull(_cc) : _cc;
        cardEl.style.background = _isHex ? `color-mix(in srgb, ${_hex6} 32%, var(--surface))` : 'color-mix(in srgb, #6b8cff 30%, var(--surface))';
        cardEl.style.border = 'none';

        if (isDone) {
            requestAnimationFrame(() => {
                const _r = cardEl ? cardEl.getBoundingClientRect() : { left: window.innerWidth/2, width:0, bottom: window.innerHeight/2 };
                showAnkiRating(courseId, jVal, { x: _r.left + _r.width / 2, y: _r.bottom }, () => {
                    renderCalendar();
                });
            });
        } else {
        invalidateTasksCache();
        renderCalendar();
    }
    }

    if (!isDone) toast('○ Remis à faire');
    addToHistory(isDone ? `"${course.name}" — J${actualJVal} validé` : `"${course.name}" — J${actualJVal} remis à faire`);
    saveQuiet(courseId);
}
function showAnkiRating(courseId, jVal, anchorEl, onDone) {
    document.querySelector('.anki-rating')?.remove();
    if (_ankiDismiss) { document.removeEventListener('click', _ankiDismiss); _ankiDismiss = null; }
    _ankiActiveTask = { id: courseId, jVal };

    const div  = el('div', 'anki-rating');
    const lbl  = el('div', 'anki-rating-label');
    lbl.textContent = 'Qualité de mémorisation';
    const btns = el('div', 'anki-rating-btns');
    const emo  = ['','😰','😕','😐','😊','🎯'];
    [1,2,3,4,5].forEach(r => {
        const b = el('button', 'anki-rating-btn');
        b.dataset.r = r; b.textContent = r; b.title = emo[r];
        b.onmouseup = (e) => { e.preventDefault(); e.stopPropagation();
            const course = findNode(State.data, courseId);
            if (course) {
                if (!course.ratings) course.ratings = {};
                course.ratings[jVal] = r;
                const actualJVal = (course.customIntervals && course.customIntervals[jVal] !== undefined) ? course.customIntervals[jVal] : jVal;
                addToHistory(`"${course.name}" — J${actualJVal} noté ${r}/5`);
                saveQuiet(courseId);
            }
            div.remove();
            if (_ankiDismiss) { document.removeEventListener('click', _ankiDismiss); _ankiDismiss = null; }
            _ankiActiveTask = null;
            toast(`${emo[r]}  Qualité ${r}/5`, r >= 4 ? 'success' : '');
            if (onDone) onDone();
        };
        btns.appendChild(b);
    });
    div.appendChild(lbl); div.appendChild(btns);
    document.body.appendChild(div);

    const dw = 220, dh = 80;
    let top, left;
    if (anchorEl && anchorEl.getBoundingClientRect) {
        const rect = anchorEl.getBoundingClientRect();
        top  = rect.bottom + 8;
        left = rect.left + rect.width / 2 - dw / 2;
        if (top + dh > window.innerHeight) top = rect.top - dh - 8;
    } else if (anchorEl && anchorEl.x !== undefined) {
        top  = anchorEl.y + 8;
        left = anchorEl.x - dw / 2;
        if (top + dh > window.innerHeight) top = anchorEl.y - dh - 8;
    } else {
        div.style.top = '50%'; div.style.left = '50%';
        div.style.transform = 'translate(-50%,-50%)';
        return;
    }
    div.style.top  = Math.max(8, top) + 'px';
    div.style.left = Math.max(8, Math.min(left, window.innerWidth - dw - 8)) + 'px';

    setTimeout(() => {
        _ankiDismiss = e => {
            if (!div.contains(e.target)) {
                div.remove();
                document.removeEventListener('click', _ankiDismiss);
                _ankiDismiss = null;
                _ankiActiveTask = null;
                if (onDone) onDone();
            }
        };
        document.addEventListener('click', _ankiDismiss);
    }, 120);
}

function showMoveDatePicker(t) {
    const overlay = el('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);';

    const box = el('div');
    box.style.cssText = 'background:var(--surface);border:1px solid var(--border-2);border-radius:var(--radius-lg);padding:20px;display:flex;flex-direction:column;gap:10px;width:300px;box-shadow:0 32px 64px rgba(0,0,0,0.6);animation:modal-in 0.25s var(--ease-spring);';

    const ttl = el('div');
    ttl.style.cssText = 'font-family:var(--font-ui);font-size:13px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:8px;';
    ttl.innerHTML = `<span style="color:var(--accent)">📅</span> <span style="color:var(--accent)">${t.name}</span> — J${t.actualJVal ?? t.jVal}`;

    const hint = el('span', 'form-hint');
    hint.style.marginTop = '0';
    hint.textContent = t.jVal === 0 ? 'Décale tout le cours (change le J0).' : `Déplace uniquement ce J${t.actualJVal ?? t.jVal}, le reste ne bouge pas.`;

    let selectedDate = t.dateStr;

    const selDisplay = el('div');
    selDisplay.style.cssText = 'font-family:var(--font-mono);font-size:12px;color:var(--accent);text-align:center;padding:7px 10px;background:var(--accent-glow);border-radius:7px;border:1px solid rgba(107,140,255,0.25);';
    function updateSel() {
        const d = new Date(selectedDate + 'T00:00:00');
        selDisplay.textContent = d.toLocaleDateString('fr-FR', {weekday:'long',day:'numeric',month:'long',year:'numeric'});
    }
    updateSel();

    const calWrap = el('div');
    let vY, vM;

    function buildCal() {
        const today = new Date(); today.setHours(0,0,0,0);
        const dim   = new Date(vY, vM + 1, 0).getDate();
        const fd    = new Date(vY, vM, 1).getDay();
        const bl    = fd === 0 ? 6 : fd - 1;
        const mlbl  = new Date(vY, vM).toLocaleDateString('fr-FR', {month:'long',year:'numeric'});

        calWrap.innerHTML = '';
        const hdr = el('div');
        hdr.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;';
        const prev = el('button','dp-nav'); prev.textContent = '‹';
        const mspan = el('span','dp-month'); mspan.textContent = mlbl;
        const next = el('button','dp-nav'); next.textContent = '›';
        prev.onclick = e => { e.stopPropagation(); vM--; if(vM<0){vM=11;vY--;} buildCal(); };
        next.onclick = e => { e.stopPropagation(); vM++; if(vM>11){vM=0;vY++;} buildCal(); };
        hdr.appendChild(prev); hdr.appendChild(mspan); hdr.appendChild(next);
        calWrap.appendChild(hdr);

        const grid = el('div','dp-grid');
        ['Lu','Ma','Me','Je','Ve','Sa','Di'].forEach(d => {
            const s = el('span','dp-dow'); s.textContent = d; grid.appendChild(s);
        });
        for (let i = 0; i < bl; i++) grid.appendChild(el('span'));
        for (let d = 1; d <= dim; d++) {
            const date = new Date(vY, vM, d);
            const ds   = `${vY}-${String(vM+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const iT   = date.getTime() === today.getTime();
            const iS   = ds === selectedDate;
            const btn  = el('button', `dp-day${iT?' dp-today':''}${iS?' dp-selected':''}`);
            btn.textContent = d;
            btn.onclick = e => { e.stopPropagation(); selectedDate = ds; updateSel(); buildCal(); };
            grid.appendChild(btn);
        }
        calWrap.appendChild(grid);

        const foot2 = el('div','dp-footer');
        const todayBtn = el('button','dp-today-btn'); todayBtn.textContent = "Aujourd'hui";
        todayBtn.onclick = e => { e.stopPropagation(); const td=new Date(); vY=td.getFullYear();vM=td.getMonth(); selectedDate=dateStr(td); updateSel(); buildCal(); };
        foot2.appendChild(todayBtn); calWrap.appendChild(foot2);
    }

    const initD = new Date(selectedDate + 'T00:00:00');
    vY = initD.getFullYear(); vM = initD.getMonth();
    buildCal();

    const footer = el('div');
    footer.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;padding-top:10px;border-top:1px solid var(--border);margin-top:4px;';
    const cancel  = el('button','btn btn-ghost'); cancel.textContent = 'Annuler';
    const confirm = el('button','btn btn-primary'); confirm.innerHTML = '<span class="btn-icon">↗</span>Déplacer';
    cancel.onclick  = () => { document.removeEventListener('keydown', esc); overlay.remove(); };
    confirm.onclick = () => {
        if (!selectedDate || selectedDate === t.dateStr) { document.removeEventListener('keydown', esc); overlay.remove(); return; }
        const diff = daysDiff(t.dateStr, selectedDate);
        if (t.jVal === 0) shiftDate(t.id, diff); else shiftSpecificTask(t.id, t.jVal, diff);
        document.removeEventListener('keydown', esc);
        overlay.remove();
    };
    footer.appendChild(cancel); footer.appendChild(confirm);

    box.appendChild(ttl); box.appendChild(hint); box.appendChild(selDisplay);
    box.appendChild(calWrap); box.appendChild(footer);
    overlay.appendChild(box);
    function esc(e) { if (e.key === 'Escape') { document.removeEventListener('keydown', esc); overlay.remove(); } }
    overlay.onclick = e => { if (e.target === overlay) { document.removeEventListener('keydown', esc); overlay.remove(); } };
    document.addEventListener('keydown', esc);
    document.body.appendChild(overlay);
}

function showTaskCtxMenu(e, t) {
    const menu = getCtxMenu(); menu.innerHTML = '';
    const course = findNode(State.data, t.id);
    const _pos = { x: e.pageX, y: e.pageY };
    menu.appendChild(ctxItem(t.done ? '○' : '✓', t.done ? 'Marquer à faire' : 'Marquer terminé', () => {
        const wasDone = t.done;
        toggleTask(t.id, t.jVal, null);
        if (!wasDone) {
            toast('✓ Révision validée', 'success');
            setTimeout(() => showAnkiRating(t.id, t.jVal, _pos), 250);
        }
        renderCalendar();
    }));
    menu.appendChild(el('div', 'ctx-sep'));
    menu.appendChild(ctxItem('📅', 'Déplacer à une date…', () => showMoveDatePicker(t)));
    if (course?.link) menu.appendChild(ctxItem('🔗', 'Ouvrir le cours', () => window.open(course.link, '_blank')));
    menu.appendChild(ctxItem('⭐', 'Évaluer la mémorisation', () => showAnkiRating(t.id, t.jVal, _pos)));
    menu.appendChild(ctxItem('◈', 'Voir la timeline', () => openCourseTimeline(t.id)));
    menu.appendChild(ctxItem('✎', 'Éditer le cours', () => openEditCourse(t.id)));
    menu.appendChild(el('div', 'ctx-sep'));
    menu.appendChild(ctxItem('◌', 'Retirer du calendrier', () => {
    const course = findNode(State.data, t.id);
    if (!course) return;
    course.j0 = null;
    course.doneTasks = [];
    course.customIntervals = {};
    course.ratings = {};
    addToHistory(`"${t.name}" retiré du calendrier`);
    save();
    toast('Retiré du calendrier', 'success');
}));
    menu.classList.add('visible');
    document.body.classList.add('ctx-open');
    const mx = Math.min(e.pageX, window.innerWidth - menu.offsetWidth - 10);
    const my = Math.min(e.pageY, window.innerHeight - menu.offsetHeight - 10);
    menu.style.left = mx + 'px'; menu.style.top = my + 'px';
}

function shiftDate(courseId, days) {
    const course = findNode(State.data, courseId);
    if (!course) return;
    const d = new Date(course.j0 + 'T00:00:00');
    d.setDate(d.getDate() + days);
    course.j0 = dateStr(d);
    addToHistory(`"${course.name}" — J0 décalé de ${days > 0 ? '+' : ''}${days}j`);
    save();
    toast(`J0 → ${days > 0 ? '+' : ''}${days}j`, 'success');
}

function shiftSpecificTask(courseId, jVal, days) {
    const course = findNode(State.data, courseId);
    if (!course) return;
    if (!course.customIntervals) course.customIntervals = {};
    const current    = course.customIntervals[jVal] !== undefined ? course.customIntervals[jVal] : jVal;
    const newInterval = current + days;
    if (newInterval < 0) { toast('Impossible avant le J0', 'error'); return; }
    course.customIntervals[jVal] = newInterval;
    addToHistory(`"${course.name}" — J${current} → J${newInterval}`);
    save();
    toast(`J${current} → J${newInterval}`, 'success');
}

function initDatePicker(inputId) {
    const input = document.getElementById(inputId);
    if (!input || input._dpInited) return;
    input._dpInited = true;

    const wrapper = el('div', 'datepicker-wrap');
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    input.style.display = 'none';

    const display = el('div', 'datepicker-display form-input');
    wrapper.appendChild(display);

    const popup = el('div', 'datepicker-popup');
    wrapper.appendChild(popup);

    let vY, vM;

    function updateDisplay() {
    if (input.value) {
        const d = new Date(input.value + 'T00:00:00');
        const today = new Date(); today.setHours(0,0,0,0);
        const diff = Math.round((d - today) / 86400000);
        let badge = '';
        if (diff === 0)
            badge = `<span style="font-size:10px;padding:2px 7px;border-radius:4px;background:var(--accent-glow);color:var(--accent);font-family:var(--font-mono);font-weight:700;margin-left:7px;border:1px solid rgba(107,140,255,0.3)">Aujourd'hui</span>`;
        else if (diff > 0)
            badge = `<span style="font-size:10px;padding:2px 7px;border-radius:4px;background:rgba(74,222,154,0.1);color:var(--success);font-family:var(--font-mono);font-weight:700;margin-left:7px;border:1px solid rgba(74,222,154,0.3)">+${diff}j</span>`;
        else
            badge = `<span style="font-size:10px;padding:2px 7px;border-radius:4px;background:rgba(224,150,58,0.1);color:var(--warn);font-family:var(--font-mono);font-weight:700;margin-left:7px;border:1px solid rgba(224,150,58,0.3)">${diff}j</span>`;
        display.innerHTML = `<span>${d.toLocaleDateString('fr-FR', {weekday:'short', day:'numeric', month:'long', year:'numeric'})}</span>${badge}`;
    } else {
        display.innerHTML = `<span style="color:var(--text-3)">Choisir une date…</span>`;
    }
}
    input._dpRefresh = updateDisplay;

    function build() {
        const today = new Date(); today.setHours(0,0,0,0);
        const sel   = input.value ? new Date(input.value + 'T00:00:00') : null;
        const dim   = new Date(vY, vM + 1, 0).getDate();
        const fd    = new Date(vY, vM, 1).getDay();
        const bl    = fd === 0 ? 6 : fd - 1;
        const mlbl  = new Date(vY, vM).toLocaleDateString('fr-FR', {month:'long', year:'numeric'});

        let h = `<div class="dp-header">
            <button class="dp-nav dp-prev">‹</button>
            <span class="dp-month">${mlbl}</span>
            <button class="dp-nav dp-next">›</button>
        </div><div class="dp-grid">
            <span class="dp-dow">Lu</span><span class="dp-dow">Ma</span><span class="dp-dow">Me</span>
            <span class="dp-dow">Je</span><span class="dp-dow">Ve</span><span class="dp-dow">Sa</span><span class="dp-dow">Di</span>`;

        for (let i = 0; i < bl; i++) h += `<span></span>`;
        for (let d = 1; d <= dim; d++) {
            const date = new Date(vY, vM, d);
            const ds   = `${vY}-${String(vM+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const iT   = date.getTime() === today.getTime();
            const iS   = sel && date.getTime() === sel.getTime();
            h += `<button class="dp-day${iT?' dp-today':''}${iS?' dp-selected':''}" data-val="${ds}">${d}</button>`;
        }
        h += `</div><div class="dp-footer"><button class="dp-today-btn">Aujourd'hui</button><button class="dp-clear-btn">Aucune date</button></div>`;

        popup.innerHTML = h;
        popup.querySelector('.dp-prev').onclick = e => { e.stopPropagation(); vM--; if(vM<0){vM=11;vY--;} build(); };
        popup.querySelector('.dp-next').onclick = e => { e.stopPropagation(); vM++; if(vM>11){vM=0;vY++;} build(); };
        popup.querySelector('.dp-today-btn').onclick = e => {
            e.stopPropagation();
            const t = new Date(); vY = t.getFullYear(); vM = t.getMonth();
            input.value = dateStr(t); updateDisplay(); popup.classList.remove('visible'); build();
        };
        popup.querySelector('.dp-clear-btn').onclick = e => {
            e.stopPropagation();
            input.value = ''; updateDisplay(); popup.classList.remove('visible'); build();
        };
        popup.querySelectorAll('.dp-day').forEach(b => {
            b.onclick = e => { e.stopPropagation(); input.value = b.dataset.val; updateDisplay(); popup.classList.remove('visible'); build(); };
        });
    }

    display.onclick = e => {
        e.stopPropagation();
        const s = input.value ? new Date(input.value + 'T00:00:00') : new Date();
        vY = s.getFullYear(); vM = s.getMonth();
        document.querySelectorAll('.datepicker-popup.visible').forEach(p => p !== popup && p.classList.remove('visible'));
        build();
        popup.classList.toggle('visible');
    };

    document.addEventListener('click', (e) => { if (!wrapper.contains(e.target)) popup.classList.remove('visible'); }, { passive: true });
    updateDisplay();
}
function renderIntervalChips(containerId, inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const prefix     = containerId.startsWith('edit') ? 'editCourse' : 'course';
    const activeList = document.getElementById(prefix + 'ActiveChips');

    if (activeList) {
        activeList.innerHTML = '';
        [..._activeIntervals].sort((a,b) => a-b).forEach(val => {
            const chip = el('div', 'interval-chip-active');
            chip.innerHTML = `J${val}`;
            chip.title = 'Cliquer pour retirer';
            chip.onclick = () => {
                _activeIntervals.delete(val);
                syncIntervalInput(inputId);
                renderIntervalChips(containerId, inputId);
            };
            activeList.appendChild(chip);
        });
    }
    syncIntervalInput(inputId);
    const _prefix = containerId.startsWith('editCourse') ? 'editCourse' : 'course';
    renderPresets(_prefix);
}

function syncIntervalInput(inputId) {
    const input = document.getElementById(inputId);
    if (input) input.value = [..._activeIntervals].sort((a,b) => a-b).join(',');
}

function addCustomInterval(prefix) {
    const inputEl = document.getElementById(prefix + 'CustomInterval');
    const val     = extractInt(inputEl?.value);
    if (isNaN(val) || val < 0 || val > 999) return;
    _activeIntervals.add(val);
    inputEl.value = '';
    const containerId = prefix + 'IntervalChips';
    const inputId     = prefix + 'Intervals';
    renderIntervalChips(containerId, inputId);
}

function openModal(id) {
    document.getElementById(id).classList.add('open');

    if (id === 'courseModal') {
        const _dp = document.getElementById('courseDate');
        _dp.value = '';
        initDatePicker('courseDate');
        if (_dp._dpRefresh) _dp._dpRefresh();
        renderPresets('course');
        renderIntervalChips('courseIntervalChips', 'courseIntervals');
        setTimeout(() => document.getElementById('courseName').focus(), 50);
    }
    if (id === 'editCourseModal') {
        initDatePicker('editCourseDate');
        renderPresets('editCourse');
    }
    if (id === 'folderModal') {
        setTimeout(() => document.getElementById('folderName').focus(), 50);
    }
    if (id === 'folderModal' || id === 'editFolderModal') {
        renderColorPalette(id === 'folderModal' ? 'colorPalette' : 'editColorPalette');
    }
    if (id === 'courseModal') {
        renderColorPalette('courseColorPalette');
    }
    if (id === 'editCourseModal') {
        renderColorPalette('editCourseColorPalette');
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    const card = modal.querySelector('.modal-card');
    if (card) {
        card.style.transition = 'opacity 0.15s, transform 0.15s';
        card.style.opacity    = '0';
        card.style.transform  = 'scale(0.95) translateY(8px)';
    }
    setTimeout(() => {
        modal.classList.remove('open');
        if (card) { card.style.opacity = ''; card.style.transform = ''; }
    }, 150);
}

function renderColorPalette(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const wheelMap = {
        'colorPalette':         'colorWheel',
        'editColorPalette':     'editColorWheel',
        'courseColorPalette':   'courseColorWheel',
        'editCourseColorPalette': 'editCourseColorWheel',
    };
    const wheelId = wheelMap[containerId] || 'colorWheel';
    const wheel   = document.getElementById(wheelId);
    if (wheel) {
        wheel.value   = State.selectedColor;
        wheel.oninput = () => { State.selectedColor = wheel.value; renderColorPalette(containerId); };
    }

    container.innerHTML = '';
    COLORS.forEach(color => {
        const opt = el('div', `color-opt${color === State.selectedColor ? ' selected' : ''}`);
        opt.style.background = color;
        opt.title   = color;
        opt.onclick = () => {
            State.selectedColor = color;
            if (wheel) wheel.value = color;
            renderColorPalette(containerId);
        };
        container.appendChild(opt);
    });
}

function getUserProfiles() {
    return JSON.parse(localStorage.getItem('fififi_profiles') || '[]');
}
function saveUserProfile(name, intervals) {
    const profiles = getUserProfiles();
    const idx = profiles.findIndex(p => p.name === name);
    if (idx > -1) profiles[idx].intervals = intervals;
    else profiles.push({ name, intervals });
    localStorage.setItem('fififi_profiles', JSON.stringify(profiles));
}
function deleteUserProfile(name) {
    localStorage.setItem('fififi_profiles', JSON.stringify(getUserProfiles().filter(p => p.name !== name)));
}
function updateUserProfile(oldName, newName, intervals) {
    const profiles = getUserProfiles();
    const idx = profiles.findIndex(p => p.name === oldName);
    if (idx === -1) return false;
    profiles[idx] = { name: newName, intervals };
    localStorage.setItem('fififi_profiles', JSON.stringify(profiles));
    return true;
}
function applyPreset(presetName, prefix) {
    const profile = getUserProfiles().find(p => p.name === presetName);
    if (!profile) return;
    _activeIntervals = new Set(profile.intervals);
    renderIntervalChips((prefix||'course')+'IntervalChips', (prefix||'course')+'Intervals');
}

function getActiveProfileName() {
    const current = [..._activeIntervals].sort((a,b) => a-b).join(',');
    return getUserProfiles().find(p =>
        [...p.intervals].sort((a,b) => a-b).join(',') === current
    )?.name || null;
}

function renderPresets(prefix) {
    const row = document.getElementById(prefix + 'PresetsRow');
    if (!row) return;
    row.innerHTML = '';
    const profiles = getUserProfiles();
    if (!profiles.length) return;
    const activeName = getActiveProfileName();
    profiles.forEach(profile => {
        const btn = el('button', 'preset-profile-btn' + (profile.name === activeName ? ' profile-active' : ''));
        btn.innerHTML = `<span style="font-size:10px;opacity:0.6">◈</span>${profile.name}`;
        btn.title = profile.intervals.map(v => 'J'+v).join(', ');
        btn.onclick = e => { e.preventDefault(); applyPreset(profile.name, prefix); };
        row.appendChild(btn);
    });
}

function syncCourseColors() {
    function apply(nodes, parentColor) {
        nodes.forEach(n => {
            if (n.type === 'folder') {
                apply(n.children || [], n.color || parentColor);
            } else if (n.type === 'course' && parentColor) {
                n.color = parentColor;
            }
        });
    }
    apply(State.data, null);
    addToHistory('Couleurs synchronisées');
    save();
    toast('Couleurs synchronisées avec les dossiers ✓', 'success');
}

function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360;
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = x => Math.round(255 * x).toString(16).padStart(2, '0');
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function generateDistinctColors(n) {
    if (n <= 0) return [];
    const step = 360 / n;
    const startHue = Math.random() * 360;
    const colors = [];
    for (let i = 0; i < n; i++) {
        const jitter = (Math.random() - 0.5) * step * 0.3;
        const hue = startHue + i * step + jitter;
        const sat = 62 + Math.random() * 18;
        const light = 54 + Math.random() * 10;
        colors.push(hslToHex(hue, sat, light));
    }
    return colors;
}

function randomizeChildColors(folderId) {
    const folder = findNode(State.data, folderId);
    if (!folder || !folder.children || !folder.children.length) {
        toast("Ce dossier n'a pas de sous-éléments", 'error');
        return;
    }
    const colors = generateDistinctColors(folder.children.length);
    folder.children.forEach((child, i) => { child.color = colors[i]; });
    addToHistory(`Couleurs aléatoires pour les enfants de "${folder.name}"`);
    save();
    toast('Couleurs randomisées ✓', 'success');
}

let _settingsIntervals = new Set();

function openSettings() {
    renderThemeModeButtons();
    renderSettingsPresets();
    const chk = document.getElementById('sortFolderCheck');
    if (chk) chk.checked = State.sortMode === 'folder';
    const dtbChk = document.getElementById('doneToBottomCheck');
    if (dtbChk) { dtbChk.checked = State.doneToBottom; dtbChk.onchange = () => { State.doneToBottom = dtbChk.checked; }; }
    _settingsIntervals = new Set(State.defaultIntervals);
    renderSettingsChips();
    document.getElementById('settingsModal').classList.add('open');
}

function setSortMode(mode) {
    State.sortMode = mode;
    const chk = document.getElementById('sortFolderCheck');
    if (chk) chk.checked = mode === 'folder';
}

function renderSettingsPresets() {
    const row = document.getElementById('settingsProfilesList');
    if (!row) return;
    row.innerHTML = '';
    const profiles = getUserProfiles();
    if (!profiles.length) {
        const empty = el('span');
        empty.style.cssText = 'font-size:11px;color:var(--text-3);font-style:italic;padding:4px 2px;';
        empty.textContent = 'Aucun profil enregistré pour le moment.';
        row.appendChild(empty);
        return;
    }
    profiles.forEach(profile => {
        const card = el('div', 'profile-row');
        card.innerHTML = `
            <span class="profile-row-name">${escHtml(profile.name)}</span>
            <span class="profile-row-preview">${profile.intervals.slice().sort((a,b)=>a-b).map(v => 'J'+v).join(' · ')}</span>
        `;
        const editBtn = el('button', 'tree-node-edit-btn');
        editBtn.textContent = '✎';
        editBtn.title = 'Éditer';
        editBtn.style.opacity = '1';
        editBtn.onclick = () => openProfileEditor(profile.name);
        const delBtn = el('button', 'tree-node-edit-btn');
        delBtn.textContent = '✕';
        delBtn.title = 'Supprimer';
        delBtn.style.opacity = '1';
        delBtn.style.color = 'var(--danger)';
        delBtn.onclick = async () => {
            if (await customConfirm(`Supprimer le profil "${profile.name}" ?`, 'Supprimer le profil')) {
                deleteUserProfile(profile.name);
                renderSettingsPresets();
                toast('Profil supprimé', 'success');
            }
        };
        card.appendChild(editBtn);
        card.appendChild(delBtn);
        row.appendChild(card);
    });
}

function openProfileEditor(profileName = null) {
    const existing = profileName ? getUserProfiles().find(p => p.name === profileName) : null;
    let workingSet = new Set(existing ? existing.intervals : []);

    const overlay = el('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(5,7,11,0.85);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;animation:modal-bg-in 0.2s ease;';

    const box = el('div');
    box.style.cssText = 'background:var(--surface);border:1px solid var(--border-2);border-radius:var(--radius-lg);padding:24px;width:380px;max-width:92vw;box-shadow:0 32px 64px rgba(0,0,0,0.6);animation:modal-in 0.3s var(--ease-spring);position:relative;';
    box.innerHTML = `
        <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(to right,transparent,var(--accent),transparent);border-radius:var(--radius-lg) var(--radius-lg) 0 0;opacity:0.5;"></div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
            <span style="font-size:18px;color:var(--accent)">◈</span>
            <h3 style="font-family:var(--font-ui);font-size:16px;font-weight:700;color:var(--text);letter-spacing:-0.02em;">${existing ? 'Éditer le profil' : 'Nouveau profil'}</h3>
        </div>
        <div style="margin-bottom:16px;">
            <label style="display:block;font-family:var(--font-ui);font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:7px;">Nom du profil</label>
            <input id="peNameInput" class="form-input" placeholder="Ex: Médecine intensif…" value="${existing ? escHtml(existing.name) : ''}" style="width:100%;">
        </div>
        <div style="margin-bottom:8px;">
            <label style="display:block;font-family:var(--font-ui);font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:7px;">Intervalles (jours)</label>
            <div id="pePresetsRow" style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;"></div>
            <div id="peActiveList" class="interval-active-list"></div>
            <div class="interval-add-row" style="margin-top:8px;">
                <input type="text" inputmode="numeric" pattern="[0-9]*" id="peCustomInput" class="interval-add-input" placeholder="J?">
                <button class="interval-add-btn" id="peAddBtn">+ Ajouter</button>
            </div>
        </div>
        <div style="display:flex;gap:8px;justify-content:space-between;padding-top:16px;margin-top:12px;border-top:1px solid var(--border);">
            <div>${existing ? `<button class="btn btn-danger" id="peDeleteBtn">Supprimer</button>` : ''}</div>
            <div style="display:flex;gap:8px;">
                <button class="btn btn-ghost" id="peCancelBtn">Annuler</button>
                <button class="btn btn-primary" id="peSaveBtn"><span class="btn-icon">✷</span>Sauvegarder</button>
            </div>
        </div>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    function renderPePresets() {
        const rowEl = box.querySelector('#pePresetsRow');
        rowEl.innerHTML = '';
        PRESET_INTERVALS.forEach(val => {
            const chip = el('button', 'interval-chip' + (workingSet.has(val) ? ' active' : ''));
            chip.type = 'button';
            chip.textContent = 'J' + val;
            chip.onclick = () => {
                if (workingSet.has(val)) workingSet.delete(val); else workingSet.add(val);
                renderPePresets(); renderPeActive();
            };
            rowEl.appendChild(chip);
        });
    }
    function renderPeActive() {
        const list = box.querySelector('#peActiveList');
        list.innerHTML = '';
        [...workingSet].sort((a,b) => a-b).forEach(val => {
            const chip = el('div', 'interval-chip-active');
            chip.innerHTML = `J${val}`;
            chip.title = 'Cliquer pour retirer';
            chip.onclick = () => { workingSet.delete(val); renderPePresets(); renderPeActive(); };
            list.appendChild(chip);
        });
    }
    renderPePresets(); renderPeActive();

    const nameInput = box.querySelector('#peNameInput');
    const customInput = box.querySelector('#peCustomInput');
    box.querySelector('#peAddBtn').onclick = () => {
        const val = extractInt(customInput.value);
        if (isNaN(val) || val < 0 || val > 999) return;
        workingSet.add(val);
        customInput.value = '';
        renderPePresets(); renderPeActive();
    };
    customInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); box.querySelector('#peAddBtn').click(); }
    });

    const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
    const onKey = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    overlay.onclick = e => { if (e.target === overlay) close(); };
    box.querySelector('#peCancelBtn').onclick = close;

    if (existing) {
        box.querySelector('#peDeleteBtn').onclick = async () => {
            if (await customConfirm(`Supprimer le profil "${existing.name}" ?`, 'Supprimer le profil')) {
                deleteUserProfile(existing.name);
                toast('Profil supprimé', 'success');
                close();
                renderSettingsPresets();
            }
        };
    }

    box.querySelector('#peSaveBtn').onclick = async () => {
        const name = nameInput.value.trim();
        if (!name) { nameInput.focus(); nameInput.style.borderColor = 'var(--danger)'; return; }
        if (workingSet.size === 0) { toast('Au moins un intervalle requis', 'error'); return; }
        const intervals = [...workingSet].sort((a,b) => a-b);

        const collision = getUserProfiles().find(p => p.name === name && (!existing || p.name !== existing.name));
        if (collision) {
            const ok = await customConfirm(`Un profil nommé "${name}" existe déjà. Le remplacer ?`, 'Profil existant', 'Remplacer', 'Annuler', 'btn-primary');
            if (!ok) return;
            deleteUserProfile(collision.name);
        }

        if (existing) {
            updateUserProfile(existing.name, name, intervals);
        } else {
            saveUserProfile(name, intervals);
        }
        toast(existing ? 'Profil mis à jour' : '"' + name + '" sauvegardé', 'success');
        close();
        renderSettingsPresets();
    };

    setTimeout(() => nameInput.focus(), 50);
}

function renderSettingsChips() {
    const wrap = document.getElementById('settingsDefaultChips');
    if (!wrap) return;
    wrap.innerHTML = '';
    [..._settingsIntervals].sort((a,b) => a-b).forEach(v => {
        const chip = el('div', 'interval-chip-active');
        chip.innerHTML = `J${v}`;
        chip.onclick = () => { _settingsIntervals.delete(v); renderSettingsChips(); };
        wrap.appendChild(chip);
    });
}

function settingsAddInterval() {
    const inp = document.getElementById('settingsAddInterval');
    const v = extractInt(inp?.value);
    if (isNaN(v) || v < 0) return;
    _settingsIntervals.add(v);
    inp.value = '';
    renderSettingsChips();
}

function saveSettings() {
    const sortChk = document.getElementById('sortFolderCheck');
    if (sortChk) State.sortMode = sortChk.checked ? 'folder' : 'j';
    const dtbChk = document.getElementById('doneToBottomCheck');
    if (dtbChk) State.doneToBottom = dtbChk.checked;
    State.defaultIntervals = [..._settingsIntervals].sort((a,b) => a-b);
    localStorage.setItem('fififi_sortMode', State.sortMode);
    localStorage.setItem('fififi_doneToBottom', State.doneToBottom ? 'true' : 'false');
    localStorage.setItem('fififi_defaultIntervals', JSON.stringify(State.defaultIntervals));
    closeModal('settingsModal');
    renderCalendar();
    toast('Paramètres sauvegardés', 'success');
}

function updateMultiBar() {
    const bar   = document.getElementById('multiBar');
    const count = document.getElementById('multiCount');
    if (!bar || !count) return;
    const n = State.selectedIds.size;
    bar.style.display = n > 0 ? 'flex' : 'none';
    count.textContent = `${n} cours sélectionné${n > 1 ? 's' : ''}`;
}

function clearSelection() {
    State.selectedIds.clear();
    updateMultiBar();
    renderTree();
}

async function bulkDelete() {
    const n = State.selectedIds.size;
    if (!n || !await customConfirm(`Supprimer ${n} cours ?`, 'Suppression multiple')) return;
    State.selectedIds.forEach(id => removeNode(State.data, id));
    State.selectedIds.clear();
    addToHistory(`${n} cours supprimés`);
    save();
    updateMultiBar();
    toast(`${n} cours supprimés`, 'success');
}

function bulkColor() {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = '#6b8cff';
    input.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(input);
    input.click();
    const n = State.selectedIds.size;
    input.oninput = () => {
        const color = input.value;
        State.selectedIds.forEach(id => {
            const c = findNode(State.data, id);
            if (c) c.color = color;
        });
        save();
        toast('Couleurs mises à jour', 'success');
    };
    input.onchange = () => {
        addToHistory(`${n} cours recolorés`);
        input.remove();
    };
}

function bulkExport() {
    const items = [...State.selectedIds].map(id => findNode(State.data, id)).filter(Boolean);
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const a = el('a');
    a.href = URL.createObjectURL(blob);
    a.download = `selection-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`${items.length} cours exportés`, 'success');
}

function getNextRootColor() {
    const used = State.data.filter(n => n.type === 'folder').map(n => n.color);
    return COLORS.find(c => !used.includes(c)) || COLORS[State.data.filter(n => n.type === 'folder').length % COLORS.length];
}
function addFolder(parentId = null) {
    State.addingToFolderId = parentId || State.filterFolderId || null;
    const parent = State.addingToFolderId ? findNode(State.data, State.addingToFolderId) : null;
    State.selectedColor = parent ? parent.color : getNextRootColor();
    document.getElementById('folderName').value = '';
    openModal('folderModal');
}

function submitFolder() {
    const name = document.getElementById('folderName').value.trim();
    if (!name) { toast('Nom requis', 'error'); return; }

    const _fTarget = State.addingToFolderId
        ? (() => { const f = findNode(State.data, State.addingToFolderId); return (f && f.children) ? f.children : State.data; })()
        : State.data;
    State.addingToFolderId = null;
    _fTarget.push({ id: uuid(), name, type: 'folder', color: State.selectedColor, children: [] });
    closeModal('folderModal');
    addToHistory(`Dossier "${name}" créé`);
    save({ calendar: false });
    toast('Dossier créé', 'success');

}
function addCourse(parentId = null) {
    State.addingToFolderId = parentId || State.filterFolderId || null;
    const parent = State.addingToFolderId ? findNode(State.data, State.addingToFolderId) : null;
    State.selectedColor = parent ? parent.color : (COLORS[0]);
    _activeIntervals = new Set(State.defaultIntervals);
    document.getElementById('courseName').value = '';
    const _di = document.getElementById('courseDate');
    _di.value = '';
    openModal('courseModal');
    setTimeout(() => { if (_di._dpRefresh) _di._dpRefresh(); }, 0);
}

function submitCourse() {
    const name      = document.getElementById('courseName').value.trim();
    const date      = document.getElementById('courseDate').value;
    const intervals = document.getElementById('courseIntervals').value;
    if (!name) { toast('Nom requis', 'error'); return; }
    if (parseIntervals(intervals).length === 0) { toast('Au moins un intervalle requis', 'error'); return; }
    const _cTarget = State.addingToFolderId
        ? (() => { const f = findNode(State.data, State.addingToFolderId); return (f && f.children) ? f.children : State.data; })()
        : State.data;
    State.addingToFolderId = null;
    _cTarget.push({
        id:              uuid(),
        name,
        type:            'course',
        j0:              date || null,
        color:           State.selectedColor,
        link:            document.getElementById('courseLink').value.trim() || null,
        notes:           document.getElementById('courseNotes').value.trim() || null,
        intervals:       parseIntervals(intervals),
        doneTasks:       [],
        customIntervals: {},
        ratings:         {},
    });
    const _usedProfile = getActiveProfileName();
    if (_usedProfile) localStorage.setItem('fififi_lastProfileName', _usedProfile);
    closeModal('courseModal');
    addToHistory(`Cours "${name}" créé`);
    save();
    toast(date ? 'Cours créé' : 'Cours créé sans date — ajoute-le au calendrier plus tard', 'success');
}

function openEditFolder(id) {
    State.editingId    = id;
    const folder       = findNode(State.data, id);
    if (!folder) return;
    State.selectedColor = folder.color || COLORS[0];
    document.getElementById('editFolderName').value = folder.name;
    openModal('editFolderModal');
}

function folderHasCourses(folder) {
    function check(nodes) {
        return nodes.some(n => n.type === 'course' || (n.type === 'folder' && check(n.children || [])));
    }
    return check(folder.children || []);
}

function saveEditFolder() {
    const folder = findNode(State.data, State.editingId);
    if (!folder) return;
    folder.name  = document.getElementById('editFolderName').value.trim();
    const colorChanged = folder.color !== State.selectedColor;
    folder.color = State.selectedColor;
    closeModal('editFolderModal');
    addToHistory(`Dossier "${folder.name}" modifié`);
    save();
    if (colorChanged) {
        if (!folderHasCourses(folder)) { toast('Dossier modifié', 'success'); return; }
        customConfirm(
            'Propager la nouvelle couleur à tous les cours de ce dossier ?',
            'Propagation de couleur',
            'Propager',
            'Non merci',
            'btn-primary'
        ).then(ok => {
            if (!ok) return;
            (folder.children || []).forEach(n => {
                if (n.type === 'course') n.color = State.selectedColor;
            });
            addToHistory('Couleurs propagées');
            save();
            toast('Couleurs propagées', 'success');
        });
    } else {
        toast('Dossier modifié', 'success');
    }
}

async function deleteFolder() {
    const folder = findNode(State.data, State.editingId);
    if (!folder) return;
    if (!await customConfirm(`Supprimer "${folder.name}" et tout son contenu ?`, 'Supprimer le dossier')) return;
    addToHistory(`Dossier "${folder.name}" supprimé`);
    removeNode(State.data, State.editingId);
    closeModal('editFolderModal');
    save();
    toast('Supprimé', 'success');
}
function removeCourseFromCalendar() {
    const course = findNode(State.data, State.editingId);
    if (!course) return;
    course.j0 = null;
    course.doneTasks = [];
    course.customIntervals = {};
    course.ratings = {};
    closeModal('editCourseModal');
    addToHistory(`"${course.name}" retiré du calendrier`);
    save();
    toast('Retiré du calendrier', 'success');
}
function openEditCourse(id) {
    State.editingId = id;
    const course    = findNode(State.data, id);
    if (!course) return;

    document.getElementById('editCourseName').value = course.name;
    document.getElementById('editCourseDate').value = course.j0 || '';

    initDatePicker('editCourseDate');
    const dp = document.getElementById('editCourseDate');
    if (dp._dpRefresh) dp._dpRefresh();
    State.selectedColor = course.color || getFolderColor(id) || COLORS[0];
    document.getElementById('editCourseLink').value  = course.link  || '';
    document.getElementById('editCourseNotes').value = course.notes || '';
    const removeBtn = document.getElementById('removeFromCalBtn');
if (removeBtn) removeBtn.style.display = course.j0 ? '' : 'none';
    _activeIntervals = new Set(course.intervals || DEFAULT_INTERVALS);
    renderIntervalChips('editCourseIntervalChips', 'editCourseIntervals');

    openModal('editCourseModal');
}

function saveEditCourse() {
    const course = findNode(State.data, State.editingId);
    if (!course) return;
    const newDate = document.getElementById('editCourseDate').value || null;
    if (course.j0 && !newDate) {
        course.doneTasks = [];
        course.customIntervals = {};
        course.ratings = {};
    }
    course.name      = document.getElementById('editCourseName').value.trim();
    course.j0        = newDate;
    course.intervals = parseIntervals(document.getElementById('editCourseIntervals').value);
    course.color     = State.selectedColor;
    course.link      = document.getElementById('editCourseLink').value.trim() || null;
    course.notes     = document.getElementById('editCourseNotes').value.trim() || null;
    closeModal('editCourseModal');
    addToHistory(`Cours "${course.name}" modifié`);
    save();
    toast('Modifié', 'success');
}

async function deleteCourse() {
    const course = findNode(State.data, State.editingId);
    if (!course) return;
    if (!await customConfirm(`Supprimer le cours "${course.name}" ?`, 'Supprimer le cours')) return;
    addToHistory(`Cours "${course.name}" supprimé`);
    removeNode(State.data, State.editingId);
    closeModal('editCourseModal');
    save();
    toast('Supprimé', 'success');
}


function nav(dir) {
    if (State.currentView === 'focus') {
        State.currentMonday.setDate(State.currentMonday.getDate() + dir);
        localStorage.setItem('fififi_focusDate', dateStr(State.currentMonday));
        renderCalendar();
        return;
    }
    if (State.currentView === 'week') {
        State.currentMonday.setDate(State.currentMonday.getDate() + dir * 7);
    } else {
        State.currentMonday.setMonth(State.currentMonday.getMonth() + dir);
    }
    renderCalendar();
}

function goToday() {
    if (State.currentView === 'focus') {
        const _fd = new Date(); _fd.setHours(0,0,0,0);
        State.currentMonday = _fd;
        localStorage.setItem('fififi_focusDate', dateStr(State.currentMonday));
        renderCalendar();
        return;
    }
    if (State.currentView === 'week') {
        State.currentMonday = getMonday(new Date());
    } else {
        const n = new Date();
        State.currentMonday = new Date(n.getFullYear(), n.getMonth(), 1);
    }
    renderCalendar();
    if (State.currentView === 'month') {
        requestAnimationFrame(() => {
            const todayCol = document.querySelector('.day-column.today');
            if (todayCol) todayCol.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
}

function goToDate(ds) {
    const d = new Date(ds + 'T00:00:00');
    if (State.currentView === 'month') {
        State.currentMonday = new Date(d.getFullYear(), d.getMonth(), 1);
    } else if (State.currentView === 'focus') {
        d.setHours(0,0,0,0);
        State.currentMonday = d;
        localStorage.setItem('fififi_focusDate', ds);
    } else {
        State.currentMonday = getMonday(d);
    }
    renderCalendar();
}

let _gotoDismiss = null;
function openGotoDatePicker() {
    document.querySelector('.goto-date-popup')?.remove();
    if (_gotoDismiss) { document.removeEventListener('click', _gotoDismiss); _gotoDismiss = null; }

    const btn = document.getElementById('navGoto');
    if (!btn) return;

    const popup = el('div', 'datepicker-popup goto-date-popup visible');
    popup.style.position = 'fixed';
    document.body.appendChild(popup);

    let vY, vM;
    const base = new Date(State.currentMonday);
    vY = base.getFullYear(); vM = base.getMonth();

    const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

    function build() {
        const today = new Date(); today.setHours(0,0,0,0);
        const dim   = new Date(vY, vM + 1, 0).getDate();
        const fd    = new Date(vY, vM, 1).getDay();
        const bl    = fd === 0 ? 6 : fd - 1;
        const mlbl  = new Date(vY, vM).toLocaleDateString('fr-FR', {month:'long', year:'numeric'});

        let h = `<div class="dp-quickjump">
            <select class="dp-jump-month">${MONTHS_FR.map((m,i) => `<option value="${i}"${i===vM?' selected':''}>${m}</option>`).join('')}</select>
            <input type="text" inputmode="numeric" pattern="[0-9]*" class="dp-jump-year" value="${vY}" maxlength="4" placeholder="Année">
            <button class="dp-quickjump-btn">Aller</button>
        </div>`;

        h += `<div class="dp-header">
            <button class="dp-nav dp-pyear" title="Année précédente">«</button>
            <button class="dp-nav dp-prev" title="Mois précédent">‹</button>
            <span class="dp-month">${mlbl}</span>
            <button class="dp-nav dp-next" title="Mois suivant">›</button>
            <button class="dp-nav dp-nyear" title="Année suivante">»</button>
        </div><div class="dp-grid">
            <span class="dp-dow">Lu</span><span class="dp-dow">Ma</span><span class="dp-dow">Me</span>
            <span class="dp-dow">Je</span><span class="dp-dow">Ve</span><span class="dp-dow">Sa</span><span class="dp-dow">Di</span>`;

        for (let i = 0; i < bl; i++) h += `<span></span>`;
        for (let d = 1; d <= dim; d++) {
            const date = new Date(vY, vM, d);
            const val  = `${vY}-${String(vM+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const iT   = date.getTime() === today.getTime();
            h += `<button class="dp-day${iT?' dp-today':''}" data-val="${val}">${d}</button>`;
        }
        h += `</div><div class="dp-footer"><button class="dp-today-btn">Aujourd'hui</button></div>`;

        popup.innerHTML = h;

        const jumpTo = () => {
            const my = parseInt(popup.querySelector('.dp-jump-year').value.replace(/[^0-9]/g, ''), 10);
            const mm = parseInt(popup.querySelector('.dp-jump-month').value, 10);
            if (isNaN(my) || my < 1) return;
            vY = my; vM = mm; build();
        };

        popup.querySelector('.dp-quickjump-btn').onclick = e => { e.stopPropagation(); jumpTo(); };
        popup.querySelector('.dp-jump-year').onkeydown = e => { if (e.key === 'Enter') { e.stopPropagation(); jumpTo(); } };
        popup.querySelector('.dp-jump-year').onclick = e => e.stopPropagation();
        popup.querySelector('.dp-jump-month').onclick = e => e.stopPropagation();

        popup.querySelector('.dp-pyear').onclick = e => { e.stopPropagation(); vY--; build(); };
        popup.querySelector('.dp-nyear').onclick = e => { e.stopPropagation(); vY++; build(); };
        popup.querySelector('.dp-prev').onclick  = e => { e.stopPropagation(); vM--; if(vM<0){vM=11;vY--;} build(); };
        popup.querySelector('.dp-next').onclick  = e => { e.stopPropagation(); vM++; if(vM>11){vM=0;vY++;} build(); };
        popup.querySelector('.dp-today-btn').onclick = e => {
            e.stopPropagation();
            goToDate(dateStr(new Date()));
            popup.remove();
        };
        popup.querySelectorAll('.dp-day').forEach(b => {
            b.onclick = e => { e.stopPropagation(); goToDate(b.dataset.val); popup.remove(); };
        });
    }
    build();

    const rect = btn.getBoundingClientRect();
    popup.style.top  = (rect.bottom + 6) + 'px';
    popup.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 270)) + 'px';

    setTimeout(() => {
        _gotoDismiss = e => {
            if (!popup.contains(e.target) && e.target !== btn) {
                popup.remove();
                document.removeEventListener('click', _gotoDismiss);
                _gotoDismiss = null;
            }
        };
        document.addEventListener('click', _gotoDismiss);
    }, 50);
}

function switchView(view) {
    State.currentView = view;
    localStorage.setItem('fififi_view', view);
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(view + 'Btn').classList.add('active');

    if (view === 'month') {
        const n = new Date();
        State.currentMonday = new Date(n.getFullYear(), n.getMonth(), 1);
    } else if (view === 'focus') {
        const _fd = new Date(); _fd.setHours(0,0,0,0);
        State.currentMonday = _fd;
    } else {
        State.currentMonday = getMonday(new Date());
    }
    renderCalendar();
}

function exportData() {
    const blob = new Blob([JSON.stringify(State.data, null, 2)], { type: 'application/json' });
    const a = el('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `method-j-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Exporté', 'success');
}

function exportNode(node) {
    const blob = new Blob([JSON.stringify(node, null, 2)], { type: 'application/json' });
    const a = el('a');
    a.href     = URL.createObjectURL(blob);
    a.download = `${node.name.replace(/\s+/g,'-')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`"${node.name}" exporté`, 'success');
}

function importData() { document.getElementById('importFile').click(); }

function mergeData(importedData) {
    function nodeExists(nodes, node) {
        return nodes.some(n => n.name === node.name && n.type === node.type);
    }
    function mergeNodes(existing, incoming) {
        let added = 0;
        incoming.forEach(n => {
            if (!nodeExists(existing, n)) {
                const cloned = deepClone(n);
                function regenIds(x) { x.id = uuid(); if (x.children) x.children.forEach(regenIds); }
                regenIds(cloned);
                existing.push(cloned);
                added++;
            } else if (n.type === 'folder' && n.children) {
                const ex = existing.find(x => x.name === n.name && x.type === 'folder');
                if (ex) added += mergeNodes(ex.children || [], n.children);
            }
        });
        return added;
    }
    const items = Array.isArray(importedData) ? importedData : [importedData];
    return mergeNodes(State.data, items);
}

function wireImportFile() {
    document.getElementById('importFile').onchange = function (e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
            try {
                const data  = JSON.parse(evt.target.result);
                const count = mergeData(data);
                if (count > 0) {
                    addToHistory(`${count} élément(s) importé(s)`);
                    save();
                    toast(`${count} élément(s) importé(s)`, 'success');
                } else {
                    toast('Aucun nouvel élément (doublons ignorés)');
                }
            } catch {
                toast('Erreur de fichier JSON', 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };
}

function saveQuiet(courseId) {
    invalidateNodeCache();
    invalidateTasksCache();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(State.data));
    localStorage.setItem(STORAGE_KEY + '_expanded', JSON.stringify(State.expandedIds));
    flashSaveIndicator();
    if (courseId) {
        const node   = findNode(State.data, courseId);
        const parent = findParent(State.data, courseId);
        if (node) {
            const siblings = parent ? (parent.children || []) : State.data;
            Cloud.saveNode(node, parent ? parent.id : null, siblings.indexOf(node));
        }
    }
    clearTimeout(_treeRenderTimer);
    _treeRenderTimer = setTimeout(() => {
        const today = dateStr(new Date());
        const hasBadgeChange = getAllCourses().some(c => {
            return (c.intervals || DEFAULT_INTERVALS).some(jVal => {
                const j0d = new Date(c.j0 + 'T00:00:00');
                const offset = (c.customIntervals || {})[jVal] !== undefined ? c.customIntervals[jVal] : jVal;
                const d2 = new Date(j0d); d2.setDate(d2.getDate() + offset);
                return dateStr(d2) === today;
            });
        });
        if (hasBadgeChange) renderTree();
    }, 1000);
}
let _treeRenderTimer = null;
let _saveTimer = null;
let _toggleUndoTimer = null;

let _renderRafId = null;
function scheduleRender(tree, calendar) {
    cancelAnimationFrame(_renderRafId);
    _renderRafId = requestAnimationFrame(() => {
        if (tree)     renderTree();
        if (calendar) renderCalendar();
        updateUndoRedoButtons();
    });
}

function save(opts = {}) {
    const { tree = true, calendar = true, history = true } = opts;
    invalidateNodeCache();
    invalidateTasksCache();
    scheduleRender(tree, calendar);
    flashSaveIndicator();

    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => {
        try {
            Cloud.saveTree(State.data);
            localStorage.setItem(STORAGE_KEY + '_expanded', JSON.stringify(State.expandedIds));
            localStorage.setItem('fififi_dayOrders', JSON.stringify(State.dayOrders));
            if (history) {
                const trimmed = State.history.slice(-60);
                const dropped = State.history.length - trimmed.length;
                const trimmedIndex = Math.max(-1, Math.min(State.historyIndex - dropped, trimmed.length - 1));
                localStorage.setItem(STORAGE_KEY + '_history', JSON.stringify({
                    history: trimmed,
                    index:   trimmedIndex,
                }));
            }
        } catch(e) {
            console.warn('Save failed:', e);
        }
    }, 300);
}

function loadLocalPrefs() {
    const expanded = localStorage.getItem(STORAGE_KEY + '_expanded');
    const history  = localStorage.getItem(STORAGE_KEY + '_history');
    if (expanded) State.expandedIds = JSON.parse(expanded);
    if (history) {
        const h = JSON.parse(history);
        State.history      = h.history || [];
        State.historyIndex = h.index   ?? -1;
    }
}

function wireStaticListeners() {
    document.querySelectorAll('.modal').forEach(modal => {
        let _mdOnBackdrop = false;
        modal.addEventListener('mousedown', (e) => {
            _mdOnBackdrop = e.target === modal;
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal && _mdOnBackdrop) closeModal(modal.id);
        });
    });

    document.getElementById('courseCustomInterval')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); addCustomInterval('course'); }
    });
    document.getElementById('editCourseCustomInterval')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); addCustomInterval('editCourse'); }
    });
    document.getElementById('settingsAddInterval')?.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); settingsAddInterval(); }
    });
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let debounce;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(() => {
                const _raw = searchInput.value;
                const _clr = document.getElementById('searchClear'); if (_clr) _clr.style.display = _raw ? 'block' : 'none';
                const _jm  = _raw.trim().match(/^j:(\d+)$/i);
                if (_jm) { State.jFilter = parseInt(_jm[1]); State.searchQuery = ''; }
                else     { State.jFilter = null; State.searchQuery = _raw; }
                State.searchCollapsed = new Set();
                renderTree();
                renderCalendar();
            }, 0);
        });
    }
}

document.addEventListener('keydown', e => {
    const mod = e.ctrlKey || e.metaKey;

    if (mod && e.key === 'k') { e.preventDefault(); const _si = document.getElementById('searchInput'); if (_si) { _si.focus(); _si.select(); } return; }
    if (mod && !e.shiftKey && e.key === 'z') { e.preventDefault(); undo(); return; }
    if (mod &&  e.shiftKey && e.key === 'z') { e.preventDefault(); redo(); return; }
    if (mod && e.key === 'y')                { e.preventDefault(); redo(); return; }

    const active = document.activeElement;
    const typing = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');

    if (!typing) {
        if (e.key === 'n' || e.key === 'N') { addCourse();  return; }
        if (e.key === 'f' || e.key === 'F') { addFolder();  return; }
        if (e.key === 't' || e.key === 'T') { goToday();    return; }
        if (e.key === 'ArrowLeft')           { nav(-1);      return; }
        if (e.key === 'ArrowRight')          { nav(1);       return; }
        if (e.key === 'b' || e.key === 'B') { toggleSidebar(); return; }
        if (e.key === 's' || e.key === 'S') { openStats();   return; }
        if (e.key === 'h' || e.key === 'H') { openHistoryModal(); return; }
    }

    if (e.key === 'Escape') {
        hideContextMenu();
        document.querySelectorAll('.modal.open').forEach(m => {
            const id = m.id;
            closeModal(id);
        });
    }

    if (e.key === 'Enter' && !e.shiftKey && document.activeElement?.tagName !== 'TEXTAREA') {
        if (document.getElementById('folderModal').classList.contains('open'))     submitFolder();
        if (document.getElementById('courseModal').classList.contains('open'))     submitCourse();
        if (document.getElementById('editFolderModal').classList.contains('open')) saveEditFolder();
        if (document.getElementById('editCourseModal').classList.contains('open')) saveEditCourse();
    }
});

function isOverdue(task) {
    return !task.done && task.dateStr < dateStr(new Date());
}

function applyStatusFilter(tasks, skip = false) {
    if (skip || State.statusFilter === 'all') return tasks;
    const today = dateStr(new Date());
    if (State.statusFilter === 'todo')    return tasks.filter(t => !t.done && t.dateStr >= today);
    if (State.statusFilter === 'overdue') return tasks.filter(t => !t.done && t.dateStr < today);
    if (State.statusFilter === 'done')    return tasks.filter(t => t.done);
    return tasks;
}

function setStatusFilter(status) {
    State.statusFilter = status;
    document.querySelectorAll('.sfb-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('sfb-' + status);
    if (btn) btn.classList.add('active');
    renderCalendar();
}

function checkAllDay(tasks) {
    const undone = tasks.filter(t => {
        const course = findNode(State.data, t.id);
        return course && !(course.doneTasks || []).includes(t.jVal);
    });
    if (undone.length > 0) {
        undone.forEach(t => {
            const course = findNode(State.data, t.id);
            if (!course) return;
            if (!course.doneTasks) course.doneTasks = [];
            if (!course.doneTasks.includes(t.jVal)) course.doneTasks.push(t.jVal);
        });
        addToHistory(`${undone.length} révision(s) cochée(s) — ${tasks[0]?.dateStr || ''}`);
        save();
        toast(`${undone.length} révision(s) cochée(s) ✓`, 'success');
    } else {
        tasks.forEach(t => {
            const course = findNode(State.data, t.id);
            if (!course || !course.doneTasks) return;
            course.doneTasks = course.doneTasks.filter(j => j !== t.jVal);
        });
        addToHistory(`${tasks.length} révision(s) décochée(s) — ${tasks[0]?.dateStr || ''}`);
        save();
        toast(`${tasks.length} révision(s) décochée(s)`, 'success');
    }
}

function isInFolder(courseId, folderId) {
    const folder = findNode(State.data, folderId);
    if (!folder || !folder.children) return false;
    function contains(nodes, id) {
        for (const n of nodes) {
            if (n.id === id) return true;
            if (n.children && contains(n.children, id)) return true;
        }
        return false;
    }
    return contains(folder.children, courseId);
}

function openCourseTimeline(courseId) {
    const course = findNode(State.data, courseId);
    if (!course) return;
    if (!course.j0) { toast("Ce cours n'a pas encore de date — ajoute un J0 pour voir sa timeline", 'error'); return; }
    const titleEl   = document.getElementById('timelineTitle');
    const iconEl    = document.getElementById('timelineIcon');
    const content   = document.getElementById('timelineContent');
    if (!titleEl || !content) return;

    titleEl.textContent = course.name;
    if (iconEl) { iconEl.style.background = course.color || 'var(--accent)'; }

    const intervals = course.intervals || DEFAULT_INTERVALS;
    const j0 = new Date(course.j0 + 'T00:00:00');
    const today = dateStr(new Date());
    const RE = ['','😰','😕','😐','😊','🎯'];
    const RL = ['','Pas du tout','Difficile','Moyen','Bien','Parfait'];
    const RC = ['','var(--danger)','var(--warn)','var(--text-2)','var(--accent)','var(--success)'];

    let html = `<div style="margin-bottom:14px;padding:9px 12px;background:var(--surface-2);border:1px solid var(--border);border-left:3px solid ${course.color||'var(--accent)'};border-radius:0 var(--radius) var(--radius) 0;font-size:12px;color:var(--text-2);">
        J0 — ${j0.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
    </div>`;
    intervals.forEach(jVal => {
        const custom = (course.customIntervals||{})[jVal];
        const offset = custom !== undefined ? custom : jVal;
        const d = new Date(j0); d.setDate(d.getDate() + offset);
        const ds = dateStr(d);
        const isDone    = (course.doneTasks||[]).includes(jVal);
        const rating    = course.ratings?.[jVal];
        const isOverdue = !isDone && ds < today;
        const isFuture  = ds > today && !isDone;
        const statusColor = isDone ? 'var(--success)' : isOverdue ? 'var(--danger)' : isFuture ? 'var(--text-3)' : 'var(--accent)';
        const statusIcon  = isDone ? '✓' : isOverdue ? '!' : '○';

        html += `<div style="display:flex;align-items:stretch;gap:0;margin-bottom:5px;">
            <div style="width:68px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:7px 5px;background:${rating?`${RC[rating]}15`:'var(--surface-2)'};border:1px solid ${rating?`${RC[rating]}40`:'var(--border)'};border-radius:8px 0 0 8px;border-right:none;">
                ${rating
                    ? `<span style="font-size:16px;line-height:1">${RE[rating]}</span><span style="font-family:var(--font-mono);font-size:9px;color:${RC[rating]};font-weight:800">${RL[rating]}</span><span style="font-family:var(--font-mono);font-size:9px;color:${RC[rating]};opacity:0.6">${rating}/5</span>`
                    : `<span style="font-size:12px;color:var(--text-3)">—</span>`}
            </div>
            <div style="flex:1;padding:7px 12px;background:var(--surface-2);border:1px solid var(--border);border-left:none;border-right:none;display:flex;align-items:center;gap:10px;">
                <span style="font-family:var(--font-mono);font-size:12px;font-weight:800;color:${course.color||'var(--accent)'};min-width:28px">J${offset}</span>
                <span style="font-size:11px;color:var(--text-2)">${d.toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}</span>
                ${isOverdue?`<span style="font-size:9px;color:var(--danger);background:rgba(224,85,112,0.1);border:1px solid rgba(224,85,112,0.3);padding:1px 5px;border-radius:4px;font-family:var(--font-mono)">EN RETARD</span>`:''}
                ${isFuture?`<span style="font-size:9px;color:var(--text-3);font-family:var(--font-mono)">à venir</span>`:''}
            </div>
            <div style="width:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--surface-2);border:1px solid var(--border);border-left:none;border-radius:0 8px 8px 0;">
                <span style="font-size:13px;color:${statusColor};font-weight:700">${statusIcon}</span>
            </div>
        </div>`;
    });

    if (course.notes) {
        html += `<div style="margin-top:12px;padding:10px 13px;background:var(--surface-2);border:1px solid var(--border);border-left:3px solid ${course.color||'var(--accent)'};border-radius:0 var(--radius) var(--radius) 0;">
            <div style="font-family:var(--font-ui);font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--text-3);margin-bottom:5px">Notes</div>
            <div style="font-size:12px;color:var(--text-2);line-height:1.6;white-space:pre-wrap">${escHtml(course.notes)}</div>
        </div>`;
    }

    content.innerHTML = html;
    document.getElementById('timelineModal').classList.add('open');
}

function openStats() {
    const modal   = document.getElementById('statsModal');
    const content = document.getElementById('statsContent');
    if (!modal || !content) return;

    const allTasks = getAllTasks(true);
    const today    = dateStr(new Date());
    const total    = allTasks.length;
    let done = 0, overdue = 0, dueToday = 0;
    const courses = [], folders = [];
    allTasks.forEach(t => {
        if (t.done) done++;
        else if (t.dateStr < today) overdue++;
        else if (t.dateStr === today) dueToday++;
    });
    function _collectStats(nodes) {
        nodes.forEach(n => {
            if (n.type === 'folder') { folders.push(n); _collectStats(n.children || []); }
            else if (n.type === 'course') courses.push(n);
        });
    }
    _collectStats(State.data);
    const pct = total > 0 ? Math.round(done / total * 100) : 0;

    const heatData = {};
    allTasks.filter(t => t.done).forEach(t => {
        heatData[t.dateStr] = (heatData[t.dateStr] || 0) + 1;
    });

    let html = `<div class="stats-grid">
        <div class="stat-card">
            <span class="stat-label">Complétion</span>
            <span class="stat-value">${pct}%</span>
            <span class="stat-sub">${done} / ${total} révisions</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">En retard</span>
            <span class="stat-value" style="color:var(--warn)">${overdue}</span>
            <span class="stat-sub">révisions manquées</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Aujourd'hui</span>
            <span class="stat-value" style="color:var(--accent)">${dueToday}</span>
            <span class="stat-sub">révisions restantes</span>
        </div>
        <div class="stat-card">
            <span class="stat-label">Cours actifs</span>
            <span class="stat-value">${courses.length}</span>
            <span class="stat-sub">${folders.length} dossier(s)</span>
        </div>
    </div>`;

    if (folders.length) {
        html += `<div class="stats-sep">Par dossier</div>`;
        folders.forEach(f => {
            const ft = allTasks.filter(t => isInFolder(t.id, f.id));
            const fd = ft.filter(t => t.done).length;
            const fp = ft.length > 0 ? Math.round(fd / ft.length * 100) : 0;
            html += `<div class="folder-stat">
                <div class="folder-stat-dot" style="background:${f.color || COLORS[0]}"></div>
                <span class="folder-stat-name" title="${f.name}">${f.name}</span>
                <div class="folder-stat-bar">
                    <div class="folder-stat-fill" style="width:${fp}%;background:${f.color || COLORS[0]}"></div>
                </div>
                <span class="folder-stat-pct">${fp}%</span>
            </div>`;
        });
    }

    const ratedCourses = courses.filter(c => c.ratings && Object.keys(c.ratings).length > 0);
    if (ratedCourses.length > 0) {
        html += `<div class="stats-sep">Historique de mémorisation</div>`;
        const ratingColors = {1:'var(--danger)',2:'var(--warn)',3:'var(--text-2)',4:'var(--accent)',5:'var(--success)'};
        const ratingLabels = {1:'Pas du tout',2:'Difficile',3:'Moyen',4:'Bien',5:'Parfait'};
        ratedCourses.forEach(c => {
            const ivs = c.intervals || DEFAULT_INTERVALS;
            html += `<div style="margin-bottom:12px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:10px 13px;">
                <div style="display:flex;align-items:center;gap:7px;margin-bottom:9px;">
                    <span style="width:7px;height:7px;border-radius:50%;background:${c.color||COLORS[0]};flex-shrink:0;display:inline-block"></span>
                    <span style="font-size:13px;font-weight:600;color:var(--text)">${c.name}</span>
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">`;
            ivs.forEach(jVal => {
                const r    = c.ratings?.[jVal];
                const done = (c.doneTasks||[]).includes(jVal);
                if (!done && !r) return;
                const offset = (c.customIntervals||{})[jVal] !== undefined ? c.customIntervals[jVal] : jVal;
                const col  = r ? ratingColors[r] : 'var(--text-3)';
                const ico  = r ? ['','😰','😕','😐','😊','🎯'][r] : '✓';
                const lbl  = r ? ratingLabels[r] : 'Fait';
                html += `<div title="J${offset} — ${lbl}" style="display:flex;flex-direction:column;align-items:center;gap:2px;padding:5px 8px;background:var(--surface-3);border:1px solid ${col}35;border-radius:8px;min-width:46px;cursor:default;">
                    <span style="font-family:var(--font-mono);font-size:10px;font-weight:700;color:${col}">J${offset}</span>
                    <span style="font-size:15px;line-height:1">${ico}</span>
                </div>`;
            });
            html += `</div>`;
            if (c.notes) html += `<div style="margin-top:8px;font-size:11px;color:var(--text-2);border-top:1px solid var(--border);padding-top:7px;line-height:1.5;font-style:italic">${escHtml(c.notes)}</div>`;
            html += `</div>`;
        });
    }

    html += `<div class="stats-sep">Activité · 16 semaines</div>
             <div class="heatmap-wrap"><div class="heatmap-grid" id="heatmapGrid"></div></div>`;

    content.innerHTML = html;
    buildHeatmap(heatData);
    modal.classList.add('open');
}

function buildHeatmap(data) {
    const grid = document.getElementById('heatmapGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const WEEKS    = 16;
    const today    = new Date(); today.setHours(0,0,0,0);
    const todayStr = dateStr(today);
    const start    = new Date(today);
    start.setDate(today.getDate() - WEEKS * 7 + 1);
    const dow = start.getDay() === 0 ? 6 : start.getDay() - 1;
    start.setDate(start.getDate() - dow);

    for (let w = 0; w < WEEKS; w++) {
        const col = el('div', 'heatmap-col');
        for (let d = 0; d < 7; d++) {
            const date = new Date(start);
            date.setDate(start.getDate() + w * 7 + d);
            const ds   = dateStr(date);
            const n    = Math.min(data[ds] || 0, 4);
            const cell = el('div', 'heatmap-cell');
            cell.dataset.n = n;
            cell.title = `${ds} · ${data[ds] || 0} révision(s)`;
            if (ds > todayStr) cell.style.opacity = '0.15';
            col.appendChild(cell);
        }
        grid.appendChild(col);
    }
}

function initApp() {
    localStorage.setItem('fififi_dayOrders', JSON.stringify(State.dayOrders));
    State.currentMonday = getMonday(new Date());

    if (window.innerWidth <= 900) {
        State.sidebarCollapsed = true;
        document.querySelector('.sidebar')?.classList.add('collapsed');
    }

    const _savedView = localStorage.getItem('fififi_view');
    if (_savedView) {
        State.currentView = _savedView;
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        const _vb = document.getElementById(_savedView + 'Btn');
        if (_vb) _vb.classList.add('active');
        if (_savedView === 'month') {
            const _n = new Date();
            State.currentMonday = new Date(_n.getFullYear(), _n.getMonth(), 1);
        } else if (_savedView === 'focus') {
            const _saved = localStorage.getItem('fififi_focusDate');
            const _fd = _saved ? new Date(_saved + 'T00:00:00') : new Date();
            _fd.setHours(0,0,0,0);
            State.currentMonday = _fd;
        }
    }
    renderTree();
    renderCalendar();
    updateUndoRedoButtons();

    ['navPrev','navNext'].forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener('dragover', e => {
            if (!State.draggedTask) return;
            e.preventDefault();
            btn.style.background = 'var(--surface-3)';
            if (!_navDragTimer) _navDragTimer = setTimeout(() => {
                nav(btnId === 'navPrev' ? -1 : 1);
                _navDragTimer = null;
            }, 750);
        });
        btn.addEventListener('dragleave', () => { btn.style.background=''; clearTimeout(_navDragTimer); _navDragTimer = null; });
        btn.addEventListener('drop',      () => { btn.style.background=''; clearTimeout(_navDragTimer); _navDragTimer = null; });
    });

    if (State.history.length === 0) {
        State.history.push({ description: 'État initial', state: deepClone(State.data), timestamp: Date.now() });
        State.historyIndex = 0;
    }

    (function() {
        const handle  = document.getElementById('sidebarHandle');
        const sidebar = document.getElementById('sidebar');
        if (!handle || !sidebar) return;
        const saved = localStorage.getItem('fififi_sidebarW');
        if (saved) document.documentElement.style.setProperty('--sidebar-w', saved + 'px');
        let startX, startW;
        handle.addEventListener('mousedown', e => {
            e.preventDefault();
            startX = e.clientX;
            startW = sidebar.getBoundingClientRect().width;
            document.body.style.cursor     = 'col-resize';
            document.body.style.userSelect = 'none';
            const onMove = e => {
                const w = Math.min(520, Math.max(160, startW + e.clientX - startX));
                document.documentElement.style.setProperty('--sidebar-w', w + 'px');
            };
            const onUp = e => {
                const w = Math.min(520, Math.max(160, startW + e.clientX - startX));
                document.documentElement.style.setProperty('--sidebar-w', w + 'px');
                localStorage.setItem('fififi_sidebarW', Math.round(w));
                document.body.style.cursor     = '';
                document.body.style.userSelect = '';
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup',   onUp);
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup',   onUp);
        });
    })();

    console.log('%Fififi ready ✷', 'color:#06c8e8;font-family:monospace;font-weight:bold;font-size:14px');
}

function updateUserBadge(user) {
    const badge  = document.getElementById('userBadge');
    const avatar = document.getElementById('userAvatar');
    const name   = document.getElementById('userName');
    if (!badge) return;
    if (!user) { badge.style.display = 'none'; return; }
    const meta = user.user_metadata || {};
    avatar.src = meta.avatar_url || '';
    name.textContent = meta.full_name || meta.name || meta.preferred_username || user.email || 'Compte';
    badge.style.display = 'flex';
}

let _appStarted = false;
async function startAppForUser(user) {
    if (_appStarted) return;
    _appStarted = true;
    await Cloud.migrateLocalIfNeeded(user);
    State.data = await Cloud.loadTree();
    loadLocalPrefs();
    initApp();
}

function updateCloudStatusDot(status) {
    const dot = document.getElementById('cloudStatusDot');
    if (!dot) return;
    dot.classList.remove('cs-idle', 'cs-saving', 'cs-saved', 'cs-error');
    if (status === 'saving')      { dot.classList.add('cs-saving'); dot.title = 'Synchronisation en cours…'; }
    else if (status === 'error')  { dot.classList.add('cs-error');  dot.title = 'Erreur de synchronisation — clique pour réessayer'; }
    else if (status === 'saved')  { dot.classList.add('cs-saved');  dot.title = 'Synchronisé avec le cloud'; }
    else                          { dot.classList.add('cs-idle');   dot.title = 'En attente'; }
}

let _statusWired = false;
function wireCloudStatus() {
    if (_statusWired) return;
    _statusWired = true;
    Cloud.onStatusChange(updateCloudStatusDot);
    document.getElementById('cloudStatusDot')?.addEventListener('click', () => Cloud.retry());
}

async function handleAuthenticated(user) {
    mountAppShell();
    wireCloudStatus();
    document.getElementById('authGate')?.classList.remove('open');
    updateUserBadge(user);
    await startAppForUser(user);
}

async function boot() {
    await Cloud.init();

    Cloud.onAuthChange(async (user) => {
        if (user) {
            await handleAuthenticated(user);
        } else {
            updateUserBadge(null);
            if (_appStarted) {
                location.reload();
            } else {
                document.getElementById('authGate')?.classList.add('open');
            }
        }
    });

    const user = Cloud.getUser();
    if (user) {
        await handleAuthenticated(user);
    } else {
        document.getElementById('authGate')?.classList.add('open');
    }
}

document.addEventListener('DOMContentLoaded', boot);