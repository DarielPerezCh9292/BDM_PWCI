<?php
// Componente de navbar moderno reutilizable
// Incluir este archivo en lugar de duplicar el código HTML del navbar

// Detectar desde dónde se está llamando el navbar para ajustar las rutas
$current_dir = dirname($_SERVER['SCRIPT_NAME']);
$is_in_paginas = strpos($current_dir, '/paginas') !== false;

// Ajustar las rutas según la ubicación
if ($is_in_paginas) {
    // Si estamos en la carpeta paginas, usar rutas relativas a paginas/
    $base_path = '../';
    $paginas_path = 'paginas/';
    $procesos_path = '../procesos/';
} else {
    // Si estamos en la raíz, usar rutas completas
    $base_path = '';
    $paginas_path = 'paginas/';
    $procesos_path = 'procesos/';
}
?>
<!-- Navbar con estilo de fútbol para mantener consistencia -->
<nav class="navbar-landing">
    <div class="navbar-container">
        <a class="navbar-brand" href="<?= $base_path . $paginas_path ?>indexx.php">
            <i class="fas fa-futbol"></i> RedSocial
        </a>
        
        <!-- Barra de búsqueda -->
        <div class="search-container">
            <div class="search-box">
                <input type="text" class="search-input" placeholder="Buscar usuarios, publicaciones...">
                <button class="search-btn" type="button">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
        
        <div class="navbar-buttons">
            <a class="nav-link" href="<?= $base_path . $paginas_path ?>indexx.php">
                <i class="fas fa-home"></i> Inicio
            </a>
            <a class="nav-link" href="<?= $base_path . $paginas_path ?>Usuarios.php">
                <i class="fas fa-users"></i> Usuarios
            </a>
            <a class="nav-link" href="<?= $base_path . $paginas_path ?>Perfil.php">
                <i class="fas fa-user"></i> Mi Perfil
            </a>

            <?php if (isset($_SESSION['tipo_usuario']) && $_SESSION['tipo_usuario'] === 'admin'): ?>
                <a class="nav-link" href="<?= $base_path . $paginas_path ?>reportes.php">
                    <i class="fas fa-chart-bar"></i> Reportes
                </a>
                <a class="nav-link" href="<?= $base_path . $paginas_path ?>moderar_publicaciones.php">
                    <i class="fas fa-shield-alt"></i> Moderar
                </a>
            <?php endif; ?>

            <a class="btn btn-logout" href="<?= $procesos_path ?>Logout.php">
                <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </a>
        </div>
    </div>
</nav>
