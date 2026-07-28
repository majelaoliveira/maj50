async function loadComponent(containerId, file) {

    const response = await fetch(file);

    if (!response.ok) {
        throw new Error(`Erro carregando ${file}`);
    }

    const html = await response.text();

    document.getElementById(containerId).innerHTML = html;
}

async function loadAllComponents() {

    await loadComponent(
        "toolbar-container",
        "assets/components/toolbar/toolbar.html"
    );

    await loadComponent(
        "sidebar-container",
        "assets/components/sidebar/sidebar.html"
    );

    await loadComponent(
        "workspace-container",
        "assets/components/workspace/workspace.html"
    );

    await loadComponent(
        "dashboard-container",
        "assets/components/dashboard/dashboard.html"
    );

    await loadComponent(
        "terminal-container",
        "assets/components/terminal/terminal.html"
    );

}