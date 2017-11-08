<?php

// require settings and options
define( 'OPTIONS_FRAMEWORK_DIRECTORY', get_template_directory_uri() . '/settings/' );
require_once get_stylesheet_directory() . '/settings/options-framework.php';
require_once get_stylesheet_directory() . '/options.php';

require_once get_stylesheet_directory() . '/settings/update.php';

add_action( 'optionsframework_custom_scripts', 'optionsframework_custom_scripts' );

function optionsframework_custom_scripts() { ?>
	<script type="text/javascript">
	jQuery(document).ready(function() {

		jQuery('#example_showhidden').click(function() {
	  		jQuery('#section-example_text_hidden').fadeToggle(400);
		});

		if (jQuery('#example_showhidden:checked').val() !== undefined) {
			jQuery('#section-example_text_hidden').show();
		}

	});
	</script>

	<?php
}


// editor style
add_editor_style( get_locale_stylesheet_uri() . '/css/editor-style.css' );

// 后台Ctrl+Enter提交评论回复
add_action('admin_footer', '_admin_comment_ctrlenter');
function _admin_comment_ctrlenter() {
	echo '<script type="text/javascript">
        jQuery(document).ready(function($){
            $("textarea").keypress(function(e){
                if(e.ctrlKey&&e.which==13||e.which==10){
                    $("#replybtn").click();
                }
            });
        });
    </script>';
};


function _add_editor_buttons($buttons) {
    $buttons[] = 'fontselect';
    $buttons[] = 'fontsizeselect';
    $buttons[] = 'cleanup';
    $buttons[] = 'styleselect';
    $buttons[] = 'del';
    $buttons[] = 'sub';
    $buttons[] = 'sup';
    $buttons[] = 'copy';
    $buttons[] = 'paste';
    $buttons[] = 'cut';
    $buttons[] = 'image';
    $buttons[] = 'anchor';
    $buttons[] = 'backcolor';
    $buttons[] = 'wp_page';
    $buttons[] = 'charmap';
    return $buttons;
}
add_filter("mce_buttons_2", "_add_editor_buttons");


/* 
 * delete google fonts
 * ====================================================
*/
// Remove Open Sans that WP adds from frontend
if (!function_exists('remove_wp_open_sans')) :
    function remove_wp_open_sans() {
        wp_deregister_style( 'open-sans' );
        wp_register_style( 'open-sans', false );
    }
    add_action('wp_enqueue_scripts', 'remove_wp_open_sans');
 
    // Uncomment below to remove from admin
    // add_action('admin_enqueue_scripts', 'remove_wp_open_sans');
endif;

function remove_open_sans() {    
    wp_deregister_style( 'open-sans' );    
    wp_register_style( 'open-sans', false );    
    wp_enqueue_style('open-sans','');    
}    
add_action( 'init', 'remove_open_sans' );



/* 
 * post meta from
 * ====================================================
*/
$postmeta_from = array(
    array(
        "name" => "fromname_value",
        "std" => "",
        "title" => __('来源名', 'haoui').'：'
    ),
    array(
        "name" => "fromurl_value",
        "std" => "",
        "title" => __('来源网址', 'haoui').'：'
    )
);

if( _hui('post_from_s') ){
    add_action('admin_menu', '_postmeta_from_create');
    add_action('save_post', '_postmeta_from_save');
}

function _postmeta_from() {
    global $post, $postmeta_from;
    foreach($postmeta_from as $meta_box) {
        $meta_box_value = get_post_meta($post->ID, $meta_box['name'], true);
        if($meta_box_value == "")
            $meta_box_value = $meta_box['std'];
        echo'<p>'.$meta_box['title'].'</p>';

        echo '<p><input type="text" style="width:98%" value="'.$meta_box_value.'" name="'.$meta_box['name'].'"></p>';

    }
   
    echo '<input type="hidden" name="post_newmetaboxes_noncename" id="post_newmetaboxes_noncename" value="'.wp_create_nonce( plugin_basename(__FILE__) ).'" />';
}

function _postmeta_from_create() {
    global $theme_name;
    if ( function_exists('add_meta_box') ) {
        add_meta_box( 'postmeta_from_boxes', __('来源', 'haoui'), '_postmeta_from', 'post', 'normal', 'high' );
    }
}

function _postmeta_from_save( $post_id ) {
    global $postmeta_from;
   
    if ( !wp_verify_nonce( isset($_POST['post_newmetaboxes_noncename']) ? $_POST['post_newmetaboxes_noncename'] : '', plugin_basename(__FILE__) ))
        return;
   
    if ( !current_user_can( 'edit_posts', $post_id ))
        return;
                   
    foreach($postmeta_from as $meta_box) {
        $data = $_POST[$meta_box['name']];
        if(get_post_meta($post_id, $meta_box['name']) == "")
            add_post_meta($post_id, $meta_box['name'], $data, true);
        elseif($data != get_post_meta($post_id, $meta_box['name'], true))
            update_post_meta($post_id, $meta_box['name'], $data);
        elseif($data == "")
            delete_post_meta($post_id, $meta_box['name'], get_post_meta($post_id, $meta_box['name'], true));
    }
}







/* 
 * post meta keywords
 * ====================================================
*/
$postmeta_keywords_description = array(
    array(
        "name" => "keywords",
        "std" => "",
        "title" => __('关键字', 'haoui').'：'
    ),
    array(
        "name" => "description",
        "std" => "",
        "title" => __('描述', 'haoui').'：'
        )
);

if( _hui('post_keywords_description_s') ){
    add_action('admin_menu', '_postmeta_keywords_description_create');
    add_action('save_post', '_postmeta_keywords_description_save');
}

function _postmeta_keywords_description() {
    global $post, $postmeta_keywords_description;
    foreach($postmeta_keywords_description as $meta_box) {
        $meta_box_value = get_post_meta($post->ID, $meta_box['name'], true);
        if($meta_box_value == "")
            $meta_box_value = $meta_box['std'];
        echo'<p>'.$meta_box['title'].'</p>';
        if( $meta_box['name'] == 'keywords' ){
            echo '<p><input type="text" style="width:98%" value="'.$meta_box_value.'" name="'.$meta_box['name'].'"></p>';
        }else{
            echo '<p><textarea style="width:98%" name="'.$meta_box['name'].'">'.$meta_box_value.'</textarea></p>';
        }
    }
   
    echo '<input type="hidden" name="post_newmetaboxes_noncename" id="post_newmetaboxes_noncename" value="'.wp_create_nonce( plugin_basename(__FILE__) ).'" />';
}

function _postmeta_keywords_description_create() {
    global $theme_name;
    if ( function_exists('add_meta_box') ) {
        add_meta_box( 'postmeta_keywords_description_boxes', __('自定义关键字和描述', 'haoui'), '_postmeta_keywords_description', 'post', 'normal', 'high' );
    }
}

function _postmeta_keywords_description_save( $post_id ) {
    global $postmeta_keywords_description;
   
    if ( !wp_verify_nonce( $_POST['post_newmetaboxes_noncename'], plugin_basename(__FILE__) ))
        return;
   
    if ( !current_user_can( 'edit_posts', $post_id ))
        return;
                   
    foreach($postmeta_keywords_description as $meta_box) {
        $data = $_POST[$meta_box['name']];
        if(get_post_meta($post_id, $meta_box['name']) == "")
            add_post_meta($post_id, $meta_box['name'], $data, true);
        elseif($data != get_post_meta($post_id, $meta_box['name'], true))
            update_post_meta($post_id, $meta_box['name'], $data);
        elseif($data == "")
            delete_post_meta($post_id, $meta_box['name'], get_post_meta($post_id, $meta_box['name'], true));
    }
}



/* 
 * post meta link
 * ====================================================
*/
$postmeta_link = array(
    array(
        "name" => "link",
        "std" => ""/*,
        "title" => __('直达链接', 'haoui').'：'*/
    )
);

if( _hui('post_link_excerpt_s') || _hui('post_link_single_s') ){
    add_action('admin_menu', '_postmeta_link_create');
    add_action('save_post', '_postmeta_link_save');
}

function _postmeta_link() {
    global $post, $postmeta_link;
    foreach($postmeta_link as $meta_box) {
        $meta_box_value = get_post_meta($post->ID, $meta_box['name'], true);
        if($meta_box_value == "")
            $meta_box_value = $meta_box['std'];
        echo '<p>'.(isset($meta_box['title']) ? $meta_box['title'] : '').'</p>';
        echo '<p><input type="text" style="width:98%" value="'.$meta_box_value.'" name="'.$meta_box['name'].'"></p>';
    }
   
    echo '<input type="hidden" name="post_newmetaboxes_noncename" id="post_newmetaboxes_noncename" value="'.wp_create_nonce( plugin_basename(__FILE__) ).'" />';
}

function _postmeta_link_create() {
    global $theme_name;
    if ( function_exists('add_meta_box') ) {
        add_meta_box( 'postmeta_link_boxes', __('直达链接', 'haoui'), '_postmeta_link', 'post', 'normal', 'high' );
    }
}

function _postmeta_link_save( $post_id ) {
    global $postmeta_link;
   
    if ( !wp_verify_nonce( isset($_POST['post_newmetaboxes_noncename'])?$_POST['post_newmetaboxes_noncename']:'', plugin_basename(__FILE__) ))
        return;
   
    if ( !current_user_can( 'edit_posts', $post_id ))
        return;
                   
    foreach($postmeta_link as $meta_box) {
        $data = $_POST[$meta_box['name']];
        if(get_post_meta($post_id, $meta_box['name']) == "")
            add_post_meta($post_id, $meta_box['name'], $data, true);
        elseif($data != get_post_meta($post_id, $meta_box['name'], true))
            update_post_meta($post_id, $meta_box['name'], $data);
        elseif($data == "")
            delete_post_meta($post_id, $meta_box['name'], get_post_meta($post_id, $meta_box['name'], true));
    }
}










$postmeta_subtitle = array(
    array(
        "name" => "subtitle",
        "std" => ""
    )
);

add_action('admin_menu', 'hui_postmeta_subtitle_create');
add_action('save_post', 'hui_postmeta_subtitle_save');


function hui_postmeta_subtitle() {
    global $post, $postmeta_subtitle;
    foreach($postmeta_subtitle as $meta_box) {
        $meta_box_value = get_post_meta($post->ID, $meta_box['name'], true);
        if($meta_box_value == "")
            $meta_box_value = $meta_box['std'];
        echo'<p>'.(isset($meta_box['title']) ? $meta_box['title'] : '').'</p>';
        echo '<p><input type="text" style="width:98%" value="'.$meta_box_value.'" name="'.$meta_box['name'].'"></p>';
    }
   
    echo '<input type="hidden" name="post_newmetaboxes_noncename" id="post_newmetaboxes_noncename" value="'.wp_create_nonce( plugin_basename(__FILE__) ).'" />';
}

function hui_postmeta_subtitle_create() {
    global $theme_name;
    if ( function_exists('add_meta_box') ) {
        add_meta_box( 'postmeta_subtitle_boxes', __('副标题', 'haoui'), 'hui_postmeta_subtitle', 'post', 'normal', 'high' );
    }
}

function hui_postmeta_subtitle_save( $post_id ) {
    global $postmeta_subtitle;
   
    if ( !wp_verify_nonce( isset($_POST['post_newmetaboxes_noncename'])?$_POST['post_newmetaboxes_noncename']:'', plugin_basename(__FILE__) ))
        return;
   
    if ( !current_user_can( 'edit_posts', $post_id ))
        return;
                   
    foreach($postmeta_subtitle as $meta_box) {
        $data = $_POST[$meta_box['name']];
        if(get_post_meta($post_id, $meta_box['name']) == "")
            add_post_meta($post_id, $meta_box['name'], $data, true);
        elseif($data != get_post_meta($post_id, $meta_box['name'], true))
            update_post_meta($post_id, $meta_box['name'], $data);
        elseif($data == "")
            delete_post_meta($post_id, $meta_box['name'], get_post_meta($post_id, $meta_box['name'], true));
    }
}











$postmeta_thumblink = array(
    array(
        "name" => "thumblink",
        "std" => ""
    )
);

if( _hui('thumblink_s') ){
    add_action('admin_menu', 'hui_postmeta_thumblink_create');
    add_action('save_post', 'hui_postmeta_thumblink_save');
}


function hui_postmeta_thumblink() {
    global $post, $postmeta_thumblink;
    foreach($postmeta_thumblink as $meta_box) {
        $meta_box_value = get_post_meta($post->ID, $meta_box['name'], true);
        if($meta_box_value == "")
            $meta_box_value = $meta_box['std'];
        echo'<p>'.(isset($meta_box['title']) ? $meta_box['title'] : '').'</p>';
        echo '<p><input type="text" style="width:98%" value="'.$meta_box_value.'" name="'.$meta_box['name'].'"></p>';
    }
   
    echo '<input type="hidden" name="post_newmetaboxes_noncename" id="post_newmetaboxes_noncename" value="'.wp_create_nonce( plugin_basename(__FILE__) ).'" />';
}

function hui_postmeta_thumblink_create() {
    global $theme_name;
    if ( function_exists('add_meta_box') ) {
        add_meta_box( 'postmeta_thumblink_boxes', __('外链缩略图地址', 'haoui'), 'hui_postmeta_thumblink', 'post', 'normal', 'high' );
    }
}

function hui_postmeta_thumblink_save( $post_id ) {
    global $postmeta_thumblink;
   
    if ( !wp_verify_nonce( isset($_POST['post_newmetaboxes_noncename'])?$_POST['post_newmetaboxes_noncename']:'', plugin_basename(__FILE__) ))
        return;
   
    if ( !current_user_can( 'edit_posts', $post_id ))
        return;
                   
    foreach($postmeta_thumblink as $meta_box) {
        $data = $_POST[$meta_box['name']];
        if(get_post_meta($post_id, $meta_box['name']) == "")
            add_post_meta($post_id, $meta_box['name'], $data, true);
        elseif($data != get_post_meta($post_id, $meta_box['name'], true))
            update_post_meta($post_id, $meta_box['name'], $data);
        elseif($data == "")
            delete_post_meta($post_id, $meta_box['name'], get_post_meta($post_id, $meta_box['name'], true));
    }
}






