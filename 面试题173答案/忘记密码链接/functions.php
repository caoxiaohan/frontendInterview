<?php
// Require theme functions
require get_stylesheet_directory() . '/functions-theme.php';

// Customize your functions

/**
* 修复WordPress找回密码提示“抱歉，该key似乎无效”问题
*/
function reset_password_message( $message, $key ) {
    if ( strpos($_POST['user_login'], '@') ) {
    $user_data = get_user_by('email', trim($_POST['user_login']));
} else {
    $login = trim($_POST['user_login']);
    $user_data = get_user_by('login', $login);
}
    $user_login = $user_data->user_login;
    $msg = __('有人要求重设如下帐号的密码：'). "\r\n\r\n";
    $msg .= network_site_url() . "\r\n\r\n";
    $msg .= sprintf(__('用户名：%s'), $user_login) . "\r\n\r\n";
    $msg .= __('若这不是您本人要求的，请忽略本邮件，一切如常。') . "\r\n\r\n";
    $msg .= __('要重置您的密码，请打开下面的链接：'). "\r\n\r\n";
    $msg .= network_site_url("wp-login.php?action=rp&key=$key&login=" . rawurlencode($user_login), 'login') ;
    return $msg;
}
add_filter('retrieve_password_message', reset_password_message, null, 2);
