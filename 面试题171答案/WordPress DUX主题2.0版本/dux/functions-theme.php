<?php

/*error_reporting(E_ALL);
ini_set("display_errors", 1);*/



define( 'THEME_VERSION' , '2.0' );




// require widgets
require_once get_stylesheet_directory() . '/widgets/widget-index.php';





// require functions for admin
if( is_admin() ){
    require_once get_stylesheet_directory() . '/functions-admin.php';
}


// add link manager
add_filter( 'pre_option_link_manager_enabled', '__return_true' );

// delete wp_head code
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'index_rel_link');
remove_action('wp_head', 'start_post_rel_link', 10, 0);
remove_action('wp_head', 'wp_generator');



// WordPress Emoji Delete
remove_action( 'admin_print_scripts' ,	'print_emoji_detection_script');
remove_action( 'admin_print_styles'  ,	'print_emoji_styles');
remove_action( 'wp_head'             ,	'print_emoji_detection_script',	7);
remove_action( 'wp_print_styles'     ,	'print_emoji_styles');
remove_filter( 'the_content_feed'    ,	'wp_staticize_emoji');
remove_filter( 'comment_text_rss'    ,	'wp_staticize_emoji');
remove_filter( 'wp_mail'             ,	'wp_staticize_emoji_for_email');




add_theme_support( 'post-formats', array( 'aside' ) ); 



// post thumbnail
if (function_exists('add_theme_support')) {
	add_theme_support('post-thumbnails');
	set_post_thumbnail_size(220, 150, true );
}

// hide admin bar
add_filter('show_admin_bar', 'hide_admin_bar');
function hide_admin_bar($flag) {
	return false;
}

// no self Pingback
add_action('pre_ping', '_noself_ping');
function _noself_ping(&$links) {
	$home = get_option('home');
	foreach ($links as $l => $link) {
		if (0 === strpos($link, $home)) {
			unset($links[$l]);
		}
	}
}

// reg nav
if (function_exists('register_nav_menus')){
    register_nav_menus( array(
        'nav' => __('网站导航', 'haoui'),
        'topmenu' => __('顶部菜单', 'haoui')
    ));
}

// reg sidebar
if (function_exists('register_sidebar')) {
	$sidebars = array(
		'gheader' => '公共头部',
		'gfooter' => '公共底部',
		'home'    => '首页',
		'cat'     => '分类页',
		'tag'     => '标签页',
		'search'  => '搜索页',
		'single'  => '文章页'
	);
	foreach ($sidebars as $key => $value) {
		register_sidebar(array(
			'name'          => $value,
			'id'            => $key,
			'before_widget' => '<div class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h3>',
			'after_title'   => '</h3>'
		));
	};
}

function _hui($name, $default = false) {
	$option_name = '';

	// Gets option name as defined in the theme
	if ( function_exists( 'optionsframework_option_name' ) ) {
		$option_name = optionsframework_option_name();
	}

	// Fallback option name
	if ( '' == $option_name ) {
		$option_name = get_option( 'stylesheet' );
		$option_name = preg_replace( "/\W/", "_", strtolower( $option_name ) );
	}

	// Get option settings from database
	$options = get_option( $option_name );

	// Return specific option
	if ( isset( $options[$name] ) ) {
		return $options[$name];
	}

	return $default;
}

if( !_hui('gravatar_url') || _hui('gravatar_url') == 'ssl' ){
    add_filter('get_avatar', '_get_ssl2_avatar');
}else if( _hui('gravatar_url') == 'duoshuo' ){
    add_filter('get_avatar', '_duoshuo_get_avatar', 10, 3);
}

//官方Gravatar头像调用ssl头像链接
function _get_ssl2_avatar($avatar) {
    $avatar = preg_replace('/.*\/avatar\/(.*)\?s=([\d]+)&.*/','<img src="https://secure.gravatar.com/avatar/$1?s=$2&d=mm" class="avatar avatar-$2" height="50" width="50">',$avatar);
    return $avatar;
}

//多说官方Gravatar头像调用
function _duoshuo_get_avatar($avatar) {
    $avatar = str_replace(array("www.gravatar.com", "0.gravatar.com", "1.gravatar.com", "2.gravatar.com"), "gravatar.duoshuo.com", $avatar);
    return $avatar;
}









// require no-category
if( _hui('no_categoty') && !function_exists('no_category_base_refresh_rules') ){

	register_activation_hook(__FILE__, 'no_category_base_refresh_rules');
	add_action('created_category', 'no_category_base_refresh_rules');
	add_action('edited_category', 'no_category_base_refresh_rules');
	add_action('delete_category', 'no_category_base_refresh_rules');
	function no_category_base_refresh_rules() {
	    global $wp_rewrite;
	    $wp_rewrite -> flush_rules();
	}

	register_deactivation_hook(__FILE__, 'no_category_base_deactivate');
	function no_category_base_deactivate() {
	    remove_filter('category_rewrite_rules', 'no_category_base_rewrite_rules');
	    // We don't want to insert our custom rules again
	    no_category_base_refresh_rules();
	}

	// Remove category base
	add_action('init', 'no_category_base_permastruct');
	function no_category_base_permastruct() {
	    global $wp_rewrite, $wp_version;
	    if (version_compare($wp_version, '3.4', '<')) {
	        // For pre-3.4 support
	        $wp_rewrite -> extra_permastructs['category'][0] = '%category%';
	    } else {
	        $wp_rewrite -> extra_permastructs['category']['struct'] = '%category%';
	    }
	}

	// Add our custom category rewrite rules
	add_filter('category_rewrite_rules', 'no_category_base_rewrite_rules');
	function no_category_base_rewrite_rules($category_rewrite) {
	    //var_dump($category_rewrite); // For Debugging

	    $category_rewrite = array();
	    $categories = get_categories(array('hide_empty' => false));
	    foreach ($categories as $category) {
	        $category_nicename = $category -> slug;
	        if ($category -> parent == $category -> cat_ID)// recursive recursion
	            $category -> parent = 0;
	        elseif ($category -> parent != 0)
	            $category_nicename = get_category_parents($category -> parent, false, '/', true) . $category_nicename;
	        $category_rewrite['(' . $category_nicename . ')/(?:feed/)?(feed|rdf|rss|rss2|atom)/?$'] = 'index.php?category_name=$matches[1]&feed=$matches[2]';
	        $category_rewrite['(' . $category_nicename . ')/page/?([0-9]{1,})/?$'] = 'index.php?category_name=$matches[1]&paged=$matches[2]';
	        $category_rewrite['(' . $category_nicename . ')/?$'] = 'index.php?category_name=$matches[1]';
	    }
	    // Redirect support from Old Category Base
	    global $wp_rewrite;
	    $old_category_base = get_option('category_base') ? get_option('category_base') : 'category';
	    $old_category_base = trim($old_category_base, '/');
	    $category_rewrite[$old_category_base . '/(.*)$'] = 'index.php?category_redirect=$matches[1]';

	    //var_dump($category_rewrite); // For Debugging
	    return $category_rewrite;
	}

	// For Debugging
	//add_filter('rewrite_rules_array', 'no_category_base_rewrite_rules_array');
	//function no_category_base_rewrite_rules_array($category_rewrite) {
	//  var_dump($category_rewrite); // For Debugging
	//}

	// Add 'category_redirect' query variable
	add_filter('query_vars', 'no_category_base_query_vars');
	function no_category_base_query_vars($public_query_vars) {
	    $public_query_vars[] = 'category_redirect';
	    return $public_query_vars;
	}

	// Redirect if 'category_redirect' is set
	add_filter('request', 'no_category_base_request');
	function no_category_base_request($query_vars) {
	    //print_r($query_vars); // For Debugging
	    if (isset($query_vars['category_redirect'])) {
	        $catlink = trailingslashit(get_option('home')) . user_trailingslashit($query_vars['category_redirect'], 'category');
	        status_header(301);
	        header("Location: $catlink");
	        exit();
	    }
	    return $query_vars;
	}

}



//由日了狗www.rledog.com分享


// head code
add_action('wp_head', '_the_head');
function _the_head() {
	_the_keywords();
	_the_description();
	_post_views_record();
	_the_head_css();
	_the_head_code();
}
function _the_head_code() {
	if (_hui('headcode')) {
		echo "\n<!--HEADER_CODE_START-->\n" . _hui('headcode') . "\n<!--HEADER_CODE_END-->\n";
	}

}
function _the_head_css() {
	$styles = '';

	if (_hui('site_gray')) {
		$styles .= "html{overflow-y:scroll;filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);-webkit-filter: grayscale(100%);}";
	}

	if (_hui('site_width') && _hui('site_width')!=='1200') {
		$styles .= ".container{max-width:"._hui('site_width')."px}";
	}

	$color = '';
	if (_hui('theme_skin') && _hui('theme_skin') !== '45B6F7') {
		$color = _hui('theme_skin');
	}

	if (_hui('theme_skin_custom') && _hui('theme_skin_custom') !== '#45B6F7') {
		$color = substr(_hui('theme_skin_custom'), 1);
	}

	if ($color) {
		$styles .= 'a:hover, .site-navbar li:hover > a, .site-navbar li.active a:hover, .site-navbar a:hover, .search-on .site-navbar li.navto-search a, .topbar a:hover, .site-nav li.current-menu-item > a, .site-nav li.current-menu-parent > a, .site-search-form a:hover, .branding-primary .btn:hover, .title .more a:hover, .excerpt h2 a:hover, .excerpt .meta a:hover, .excerpt-minic h2 a:hover, .excerpt-minic .meta a:hover, .article-content .wp-caption:hover .wp-caption-text, .article-content a, .article-nav a:hover, .relates a:hover, .widget_links li a:hover, .widget_categories li a:hover, .widget_ui_comments strong, .widget_ui_posts li a:hover .text, .widget_ui_posts .nopic .text:hover , .widget_meta ul a:hover, .tagcloud a:hover, .textwidget a:hover, .sign h3, #navs .item li a, .url, .url:hover, .excerpt h2 a:hover span, .widget_ui_posts a:hover .text span, .widget-navcontent .item-01 li a:hover span, .excerpt-minic h2 a:hover span, .relates a:hover span{color: #'.$color.';}.btn-primary, .label-primary, .branding-primary, .post-copyright:hover, .article-tags a, .pagination ul > .active > a, .pagination ul > .active > span, .pagenav .current, .widget_ui_tags .items a:hover, .sign .close-link, .pagemenu li.active a, .pageheader, .resetpasssteps li.active, #navs h2, #navs nav, .btn-primary:hover, .btn-primary:focus, .btn-primary:active, .btn-primary.active, .open > .dropdown-toggle.btn-primary, .tag-clouds a:hover{background-color: #'.$color.';}.btn-primary, .search-input:focus, #bdcs .bdcs-search-form-input:focus, #submit, .plinks ul li a:hover,.btn-primary:hover, .btn-primary:focus, .btn-primary:active, .btn-primary.active, .open > .dropdown-toggle.btn-primary{border-color: #'.$color.';}.search-btn, .label-primary, #bdcs .bdcs-search-form-submit, #submit, .excerpt .cat{background-color: #'.$color.';}.excerpt .cat i{border-left-color:#'.$color.';}@media (max-width: 720px) {.site-navbar li.active a, .site-navbar li.active a:hover, .m-nav-show .m-icon-nav{color: #'.$color.';}}@media (max-width: 480px) {.pagination ul > li.next-page a{background-color:#'.$color.';}}';
	}

	if (_hui('csscode')) {
		$styles .= _hui('csscode');
	}

	if ($styles) {
		echo '<style>' . $styles . '</style>';
	}
}

// foot code
add_action('wp_footer', '_the_footer');
function _the_footer() {
	if (_hui('footcode')) {
		echo "<!--FOOTER_CODE_START-->\n" . _hui('footcode') . "\n<!--FOOTER_CODE_END-->\n";
	}
}

// excerpt length
add_filter('excerpt_length', '_excerpt_length');
function _excerpt_length($length) {
	return 120;
}

// smilies src
add_filter('smilies_src', '_smilies_src', 1, 10);
function _smilies_src($img_src, $img, $siteurl) {
	return get_stylesheet_directory_uri() . '/img/smilies/' . $img;
}

// load script and style
add_action('wp_enqueue_scripts', '_load_scripts');
function _load_scripts() {
	if (!is_admin()) {
		wp_deregister_script('jquery');

		// delete l10n.js
		wp_deregister_script('l10n');

		$purl = get_stylesheet_directory_uri();

		// common css
		_cssloader(array('bootstrap' => $purl.'/css/bootstrap.min.css', 'fontawesome' => $purl.'/css/font-awesome.min.css', 'main' => 'main'));

		// page css
		if (is_page_template('pages/user.php')) {
			_cssloader(array('user' => 'user'));
		}

		
		$jss = array(
            'no' => array(
                'jquery' => $purl.'/js/libs/jquery.min.js',
                'bootstrap' => $purl . '/js/libs/bootstrap.min.js'
            ),
            'baidu' => array(
                'jquery' => 'http://apps.bdimg.com/libs/jquery/1.9.1/jquery.min.js',
                'bootstrap' => 'http://apps.bdimg.com/libs/bootstrap/3.2.0/js/bootstrap.min.js'
            ),
            '360' => array(
                'jquery' => 'http://libs.useso.com/js/jquery/1.9.1/jquery.min.js',
                'bootstrap' => 'http://libs.useso.com/js/bootstrap/3.2.0/js/bootstrap.min.js'
            ),
            'he' => array(
                'jquery' => '//code.jquery.com/jquery-1.9.1.min.js',
                'bootstrap' => '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js'
            )
        );
        wp_register_script( 'jquery', _hui('js_outlink') ? $jss[_hui('js_outlink')]['jquery'] : $purl.'/js/libs/jquery.min.js', false, THEME_VERSION, (_hui('jquery_bom')?true:false) );
        wp_enqueue_script( 'bootstrap', _hui('js_outlink') ? $jss[_hui('js_outlink')]['bootstrap'] : $purl . '/js/libs/bootstrap.min.js', array('jquery'), THEME_VERSION, true );
		_jsloader(array('loader'));
		
        // wp_enqueue_script( '_main', $purl . '/js/main.js', array(), THEME_VERSION, true );


	}
}
function _cssloader($arr) {
	foreach ($arr as $key => $item) {
		$href = $item;
		if (strstr($href, '//') === false) {
			$href = get_stylesheet_directory_uri() . '/css/' . $item . '.css';
		}
		wp_enqueue_style('_' . $key, $href, array(), THEME_VERSION, 'all');
	}
}
function _jsloader($arr) {
	foreach ($arr as $item) {
		wp_enqueue_script('_' . $item, get_stylesheet_directory_uri() . '/js/' . $item . '.js', array(), THEME_VERSION, true);
	}
}

function _get_default_avatar(){
	return get_stylesheet_directory_uri() . '/img/avatar-default.png';
}

function _get_delimiter(){
	return _hui('connector') ? _hui('connector') : '-';
}




function _post_target_blank(){
    return _hui('target_blank') ? ' target="_blank"' : '';
}

function _title() {
	global $new_title;
	if( $new_title ) return $new_title;

	global $paged;

	$html = '';
	$t = trim(wp_title('', false));

	if( (is_single() || is_page()) && get_the_subtitle(false) ){
		$t .= get_the_subtitle(false);
	}

	if ($t) {
		$html .= $t . _get_delimiter();
	}

	$html .= get_bloginfo('name');

	if (is_home()) {
		if ($paged > 1) {
			$html .= _get_delimiter() . '最新发布';
		}else{
			$html .= _get_delimiter() . get_option('blogdescription');
		}
	}

	if ($paged > 1) {
		$html .= _get_delimiter() . '第' . $paged . '页';
	}

	return $html;
}

function get_the_subtitle($span=true){
    global $post;
    $post_ID = $post->ID;
    $subtitle = get_post_meta($post_ID, 'subtitle', true);

    if( !empty($subtitle) ){
    	if( $span ){
        	return ' <span>'.$subtitle.'</span>';
        }else{
        	return ' '.$subtitle;
        }
    }else{
        return false;
    }
}



function _bodyclass() {
	$class = '';

	if( _hui('nav_fixed') ){
		$class .= ' nav_fixed';
	}
	
	if( _hui('list_comments_r') ){
		$class .= ' list-comments-r';
	}

	if ((is_single() || is_page()) && _hui('post_p_indent_s')) {
		$class .= ' p_indent';
	}

	if ((is_single() || is_page()) && comments_open()) {
		$class .= ' comment-open';
	}
	if (is_super_admin()) {
		$class .= ' logged-admin';
	}
	
	$class .= ' site-layout-'.(_hui('layout') ? _hui('layout') : '2');

	if( _hui('list_type')=='text' ){
		$class .= ' list-text';
	}

	if( is_category() ){
		_moloader('mo_is_minicat', false);
		if( mo_is_minicat() ){
			$class .= ' site-minicat';
		}
	}

	return trim($class);
}

function _moloader($name = '', $apply = true) {
	if (!function_exists($name)) {
		include get_stylesheet_directory() . '/modules/' . $name . '.php';
	}

	if ($apply && function_exists($name)) {
		$name();
	}
}


function _the_menu($location = 'nav') {
	echo str_replace("</ul></div>", "", preg_replace("/<div[^>]*><ul[^>]*>/", "", wp_nav_menu(array('theme_location' => $location, 'echo' => false))));
}

function _the_logo() {
	$tag = is_home() ? 'h1' : 'div';
	echo '<' . $tag . ' class="logo"><a href="' . get_bloginfo('url') . '" title="' . get_bloginfo('name') . _get_delimiter() . get_bloginfo('description') . '"><img src="'._hui('logo_src').'">' . get_bloginfo('name') . '</a></' . $tag . '>';
}

function _the_ads($name='', $class=''){
    if( !_hui($name.'_s') ) return;

    if( wp_is_mobile() ){
    	echo '<div class="asb asb-m '.$class.'">'._hui($name.'_m').'</div>';
    }else{
        echo '<div class="asb '.$class.'">'._hui($name).'</div>';
    }
}


function _post_views_record() {
	if (is_singular()) {
		global $post;
		$post_ID = $post->ID;
		if ($post_ID) {
			$post_views = (int) get_post_meta($post_ID, 'views', true);
			if (!update_post_meta($post_ID, 'views', ($post_views + 1))) {
				add_post_meta($post_ID, 'views', 1, true);
			}
		}
	}
}
function _get_post_views($before = '阅读(', $after = ')') {
	global $post;
	$post_ID = $post->ID;
	$views = (int) get_post_meta($post_ID, 'views', true);
	return $before . $views . $after;
}

function _str_cut($str, $start, $width, $trimmarker) {
	$output = preg_replace('/^(?:[\x00-\x7F]|[\xC0-\xFF][\x80-\xBF]+){0,' . $start . '}((?:[\x00-\x7F]|[\xC0-\xFF][\x80-\xBF]+){0,' . $width . '}).*/s', '\1', $str);
	return $output . $trimmarker;
}

function _get_excerpt($limit = 120, $after = '...') {
	$excerpt = get_the_excerpt();
	if (_new_strlen($excerpt) > $limit) {
		return _str_cut(strip_tags($excerpt), 0, $limit, $after);
	} else {
		return $excerpt;
	}
}

function _get_post_comments($before = '评论(', $after = ')') {
	return $before . get_comments_number('0', '1', '%') . $after;
}

function _new_strlen($str,$charset='utf-8') {        
    $n = 0; $p = 0; $c = '';
    $len = strlen($str);
    if($charset == 'utf-8') {
        for($i = 0; $i < $len; $i++) {
            $c = ord($str{$i});
            if($c > 252) {
                $p = 5;
            } elseif($c > 248) {
                $p = 4;
            } elseif($c > 240) {
                $p = 3;
            } elseif($c > 224) {
                $p = 2;
            } elseif($c > 192) {
                $p = 1;
            } else {
                $p = 0;
            }
            $i+=$p;$n++;
        }
    } else {
        for($i = 0; $i < $len; $i++) {
            $c = ord($str{$i});
            if($c > 127) {
                $p = 1;
            } else {
                $p = 0;
        }
            $i+=$p;$n++;
        }
    }        
    return $n;
}

function _get_post_thumbnail($size = 'thumbnail', $class = 'thumb') {
	global $post;
	$r_src = '';
	if (has_post_thumbnail()) {
        $domsxe = get_the_post_thumbnail();
        preg_match_all('/<img.*?(?: |\\t|\\r|\\n)?src=[\'"]?(.+?)[\'"]?(?:(?: |\\t|\\r|\\n)+.*?)?>/sim', $domsxe, $strResult, PREG_PATTERN_ORDER);  
        $images = $strResult[1];
        foreach($images as $src){
        	$r_src = $src;
            break;
        }
	}else{
	    $thumblink = get_post_meta($post->ID, 'thumblink', true);
		if( _hui('thumblink_s') && !empty($thumblink) ){
			$r_src = $thumblink;
		}
		elseif( _hui('thumb_postfirstimg_s') ){
			$content = $post->post_content;  
	        preg_match_all('/<img.*?(?: |\\t|\\r|\\n)?src=[\'"]?(.+?)[\'"]?(?:(?: |\\t|\\r|\\n)+.*?)?>/sim', $content, $strResult, PREG_PATTERN_ORDER);  
	        $images = $strResult[1];

	        foreach($images as $src){
		        if( _hui('thumb_postfirstimg_lastname') ){
		            $filetype = _get_filetype($src);
		            $src = rtrim($src, '.'.$filetype)._hui('thumb_postfirstimg_lastname').'.'.$filetype;
		        }

		        $r_src = $src;
		        break;
	        }
		}
    } 

	if( $r_src ){
		if( _hui('thumbnail_src') ){
    		return sprintf('<img data-src="%s" alt="%s" src="%s" class="thumb">', $r_src, $post->post_title._get_delimiter().get_bloginfo('name'), get_stylesheet_directory_uri().'/img/thumbnail.png');
		}else{
    		return sprintf('<img src="%s" alt="%s" class="thumb">', $r_src, $post->post_title._get_delimiter().get_bloginfo('name'));
		}
    }else{
    	return sprintf('<img data-thumb="default" src="%s" class="thumb">', get_stylesheet_directory_uri().'/img/thumbnail.png');
    }
}



function _get_filetype($filename) {
    $exten = explode('.', $filename);
    return end($exten);
}

function _get_attachment_id_from_src($link) {
	global $wpdb;
	$link = preg_replace('/-\d+x\d+(?=\.(jpg|jpeg|png|gif)$)/i', '', $link);
	return $wpdb->get_var("SELECT ID FROM {$wpdb->posts} WHERE guid='$link'");
}



//关键字
function _the_keywords() {
	global $new_keywords;
	if( $new_keywords ) {
		echo "<meta name=\"keywords\" content=\"{$new_keywords}\">\n";
		return;
	}

	global $s, $post;
	$keywords = '';
	if (is_singular()) {
		if (get_the_tags($post->ID)) {
			foreach (get_the_tags($post->ID) as $tag) {
				$keywords .= $tag->name . ', ';
			}
		}
		foreach (get_the_category($post->ID) as $category) {
			$keywords .= $category->cat_name . ', ';
		}
		$keywords = substr_replace($keywords, '', -2);
		$the = trim(get_post_meta($post->ID, 'keywords', true));
		if ($the) {
			$keywords = $the;
		}
	} elseif (is_home()) {
		$keywords = _hui('keywords');
	} elseif (is_tag()) {
		$keywords = single_tag_title('', false);
	} elseif (is_category()) {
		$cat = get_query_var('cat');
		$thecat = get_category($cat);
		$slug = $thecat->slug;
		$keywords = single_cat_title('', false);
	} elseif (is_search()) {
		$keywords = esc_html($s, 1);
	} else {
		$keywords = trim(wp_title('', false));
	}
	if ($keywords) {
		echo "<meta name=\"keywords\" content=\"{$keywords}\">\n";
	}
}

//网站描述
function _the_description() {
	global $new_description;
	if( $new_description ){
		echo "<meta name=\"description\" content=\"$new_description\">\n";
		return;
	}

	global $s, $post;
	$description = '';
	$blog_name = get_bloginfo('name');
	if (is_singular()) {
		if (!empty($post->post_excerpt)) {
			$text = $post->post_excerpt;
		} else {
			$text = $post->post_content;
		}
		$description = trim(str_replace(array("\r\n", "\r", "\n", "　", " "), " ", str_replace("\"", "'", strip_tags($text))));
		if (!($description)) {
			$description = $blog_name . "-" . trim(wp_title('', false));
		}

		$the = trim(get_post_meta($post->ID, 'description', true));
		if ($the) {
			$description = $the;
		}
	} elseif (is_home()) {
		$description = _hui('description');
	} elseif (is_tag()) {
		$description = $blog_name . "'" . single_tag_title('', false) . "'";
	} elseif (is_category()) {
		$description = trim(strip_tags(category_description()));
	} elseif (is_archive()) {
		$description = $blog_name . "'" . trim(wp_title('', false)) . "'";
	} elseif (is_search()) {
		$description = $blog_name . ": '" . esc_html($s, 1) . "' 的搜索結果";
	} else {
		$description = $blog_name . "'" . trim(wp_title('', false)) . "'";
	}
	$description = mb_substr($description, 0, 180, 'utf-8');
	echo "<meta name=\"description\" content=\"$description\">\n";
}

function _get_time_ago($ptime) {
	$ptime = strtotime($ptime);
	$etime = time() - $ptime;
	if ($etime < 1) {
		return '刚刚';
	}

	$interval = array(
		12 * 30 * 24 * 60 * 60 => '年前 (' . date('Y-m-d', $ptime) . ')',
		30 * 24 * 60 * 60 => '个月前 (' . date('m-d', $ptime) . ')',
		7 * 24 * 60 * 60 => '周前 (' . date('m-d', $ptime) . ')',
		24 * 60 * 60 => '天前',
		60 * 60 => '小时前',
		60 => '分钟前',
		1 => '秒前',
	);
	foreach ($interval as $secs => $str) {
		$d = $etime / $secs;
		if ($d >= 1) {
			$r = round($d);
			return $r . $str;
		}
	};
}

function _get_user_avatar($user_id = '') {
	if (!$user_id) {
		return false;
	}

	$avatar = get_user_meta($user_id, 'avatar');
	if ($avatar) {
		return $avatar;
	} else {
		return false;
	}
}

function _get_the_avatar($user_id = '', $user_email = '', $src = false, $size = 50) {
	$user_avtar = _get_user_avatar($user_id);
	if ($user_avtar) {
		$attr = 'data-src';
		if ($src) {
			$attr = 'src';
		}

		return '<img class="avatar avatar-' . $size . ' photo" width="' . $size . '" height="' . $size . '" ' . $attr . '="' . $user_avtar . '">';
	} else {
		$avatar = get_avatar($user_email, $size, _get_default_avatar());
		if ($src) {
			return $avatar;
		} else {
			return str_replace(' src=', ' data-src=', $avatar);
		}
	}
}


//评论回应邮件通知
add_action('comment_post', '_comment_mail_notify');
function _comment_mail_notify($comment_id) {
	$admin_notify = '1';// admin 要不要收回复通知 ( '1'=要 ; '0'=不要 )
	$admin_email = get_bloginfo('admin_email');// $admin_email 可改为你指定的 e-mail.
	$comment = get_comment($comment_id);
	$comment_author_email = trim($comment->comment_author_email);
	$parent_id = $comment->comment_parent ? $comment->comment_parent : '';
	global $wpdb;
	if ($wpdb->query("Describe {$wpdb->comments} comment_mail_notify") == '') {
		$wpdb->query("ALTER TABLE {$wpdb->comments} ADD COLUMN comment_mail_notify TINYINT NOT NULL DEFAULT 0;");
	}

	if (($comment_author_email != $admin_email && isset($_POST['comment_mail_notify'])) || ($comment_author_email == $admin_email && $admin_notify == '1')) {
		$wpdb->query("UPDATE {$wpdb->comments} SET comment_mail_notify='1' WHERE comment_ID='$comment_id'");
	}

	$notify = $parent_id ? get_comment($parent_id)->comment_mail_notify : '0';
	$spam_confirmed = $comment->comment_approved;
	if ($parent_id != '' && $spam_confirmed != 'spam' && $notify == '1') {
		$wp_email = 'no-reply@' . preg_replace('#^www\.#', '', strtolower($_SERVER['SERVER_NAME']));// e-mail 发出点, no-reply 可改为可用的 e-mail.
		$to = trim(get_comment($parent_id)->comment_author_email);
		$subject = 'Hi，您在 [' . get_option("blogname") . '] 的留言有人回复啦！';

		$letter = (object) array(
			'author' => trim(get_comment($parent_id)->comment_author),
			'post' => get_the_title($comment->comment_post_ID),
			'comment' => trim(get_comment($parent_id)->comment_content),
			'replyer' => trim($comment->comment_author),
			'reply' => trim($comment->comment_content),
			'link' => htmlspecialchars(get_comment_link($parent_id)),
			'sitename' => get_option('blogname')
		);

		$message = '
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse"><tbody><tr><td><table width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:collapse"><tbody><tr><td><table width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td width="73" align="left" valign="top" style="border-top:1px solid #d9d9d9;border-left:1px solid #d9d9d9;border-radius:5px 0 0 0"></td><td valign="top" style="border-top:1px solid #d9d9d9"><div style="font-size:14px;line-height:10px"><br><br><br><br></div><div style="font-size:18px;line-height:18px;color:#444;font-family:Microsoft Yahei">Hi, ' . $letter->author . '<br><br><br></div><div style="font-size:14px;line-height:22px;color:#444;font-weight:bold;font-family:Microsoft Yahei">您在' . $letter->sitename . '《' . $letter->post . '》的评论：</div><div style="font-size:14px;line-height:10px"><br></div><div style="font-size:14px;line-height:22px;color:#666;font-family:Microsoft Yahei">&nbsp; &nbsp;&nbsp; &nbsp; ' . $letter->comment . '</div><div style="font-size:14px;line-height:10px"><br><br></div><div style="font-size:14px;line-height:22px;color:#5DB408;font-weight:bold;font-family:Microsoft Yahei">' . $letter->replyer . ' 回复您：</div><div style="font-size:14px;line-height:10px"><br></div><div style="font-size:14px;line-height:22px;color:#666;font-family:Microsoft Yahei">&nbsp; &nbsp;&nbsp; &nbsp; ' . $letter->reply . '</div><div style="font-size:14px;line-height:10px"><br><br><br><br></div><div style="text-align:center"><a href="' . $letter->link . '" target="_blank" style="text-decoration:none;color:#fff;display:inline-block;line-height:44px;font-size:18px;background-color:#61B3E6;border-radius:3px;font-family:Microsoft Yahei">&nbsp; &nbsp;&nbsp; &nbsp;点击查看回复&nbsp; &nbsp;&nbsp; &nbsp;</a><br><br></div></td><td width="65" align="left" valign="top" style="border-top:1px solid #d9d9d9;border-right:1px solid #d9d9d9;border-radius:0 5px 0 0"></td></tr><tr><td style="border-left:1px solid #d9d9d9">&nbsp;</td><td align="left" valign="top" style="color:#999"><div style="font-size:8px;line-height:14px"><br><br></div><div style="min-height:1px;font-size:1px;line-height:1px;background-color:#e0e0e0">&nbsp;</div><div style="font-size:12px;line-height:20px;width:425px;font-family:Microsoft Yahei"><br><a href="' . _hui('letter_link_1') . '" target="_blank" style="text-decoration:underline;color:#61B3E6;font-family:Microsoft Yahei">' . _hui('letter_text_1') . '</a><br><a href="' . _hui('letter_link_2') . '" target="_blank" style="text-decoration:underline;color:#61B3E6;font-family:Microsoft Yahei">' . _hui('letter_text_2') . '</a><br>此邮件由' . $letter->sitename . '系统自动发出，请勿回复！</div></td><td style="border-right:1px solid #d9d9d9">&nbsp;</td></tr><tr><td colspan="3" style="border-bottom:1px solid #d9d9d9;border-right:1px solid #d9d9d9;border-left:1px solid #d9d9d9;border-radius:0 0 5px 5px"><div style="min-height:42px;font-size:42px;line-height:42px">&nbsp;</div></td></tr></tbody></table></td></tr><tr><td><div style="min-height:42px;font-size:42px;line-height:42px">&nbsp;</div></td></tr></tbody></table></td></tr></tbody></table>';

		$from = "From: \"" . get_option('blogname') . "\" <$wp_email>";
		$headers = "$from\nContent-Type: text/html; charset=" . get_option('blog_charset') . "\n";
		wp_mail($to, $subject, $message, $headers);
		//echo 'mail to ', $to, '<br/> ' , $subject, $message; // for testing
	}
}

//自动勾选
add_action('comment_form', '_comment_add_checkbox');
function _comment_add_checkbox() {
	echo '<label for="comment_mail_notify" class="checkbox inline hide" style="padding-top:0"><input type="checkbox" name="comment_mail_notify" id="comment_mail_notify" value="comment_mail_notify" checked="checked"/>有人回复时邮件通知我</label>';
}

//文章（包括feed）末尾加版权说明
// add_filter('the_content', '_post_copyright');
function _post_copyright($content) {
	_moloader('mo_is_minicat', false);

	if ( !is_page() && !mo_is_minicat() ) {
		if (_hui('ads_post_footer_s')) {
			$content .= '<p class="asb-post-footer"><b>AD：</b><strong>【' . _hui('ads_post_footer_pretitle') . '】</strong><a'.(_hui('ads_post_footer_link_blank')?' target="_blank"':'').' href="' . _hui('ads_post_footer_link') . '">' . _hui('ads_post_footer_title') . '</a></p>';
		}

		if( _hui('post_copyright_s') ){
			$content .= '<p class="post-copyright">' . _hui('post_copyright') . '<a href="' . get_bloginfo('url') . '">' . get_bloginfo('name') . '</a> &raquo; <a href="' . get_permalink() . '">' . get_the_title() . '</a></p>';
		}
	}

	return $content;
}





function curPageURL() {
    $pageURL = 'http';

    if (isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on") 
    {
        $pageURL .= "s";
    }
    $pageURL .= "://";

    if ($_SERVER["SERVER_PORT"] != "80" && $_SERVER["HTTPS"] != "on") 
    {
        $pageURL .= $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"];
    } 
    else 
    {
        $pageURL .= $_SERVER["SERVER_NAME"] . $_SERVER["REQUEST_URI"];
    }
    return $pageURL;
}


