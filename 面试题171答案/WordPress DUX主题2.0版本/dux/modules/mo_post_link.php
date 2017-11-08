<?php  
/**
 * [mo_post_link description]
 * @return [type] [description]
 */
function mo_post_link(){
    global $post;
    $post_ID = $post->ID;
    $link = get_post_meta($post_ID, 'link', true);

    if( $link ){
    	echo '<div class="post-linkto"><a class="btn btn-primary'. (!is_single()?' btn-xs':' btn-lg')  .'" href="'. $link .'"'. (_hui('post_link_blank_s')?' target="_blank"':'') . (_hui('post_link_nofollow_s')?' rel="external nofollow"':'') .'>'._hui('post_link_h1') .'</a></div>';
    }
}