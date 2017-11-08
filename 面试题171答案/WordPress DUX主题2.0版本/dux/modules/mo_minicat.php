<?php 
/**
 * [mo_minicat description]
 * @return html [description]
 */
function mo_minicat(){
	if( !_hui('minicat') ) return;

	$args = array(
	    'ignore_sticky_posts' => 1,
	    'showposts' => 1,
	    'cat' => _hui('minicat')
	);
	query_posts($args);
	while ( have_posts() ) : the_post(); 
		$category = get_the_category();
	    echo '<article class="excerpt-minic excerpt-minic-index">';
	    echo '<h2><a'._post_target_blank().' class="red" href="'.get_category_link($category[0]->term_id ).'">【'.(_hui('minicat_home_title') ? _hui('minicat_home_title') : '今日观点').'】</a> <a href="'.get_permalink().'" title="'.get_the_title().get_the_subtitle(false)._get_delimiter().get_bloginfo('name').'">'.get_the_title().get_the_subtitle().'</a></h2>';
	        echo '<p class="note">'._get_excerpt().'</p>';
	    echo '</article>';
	endwhile; 
	wp_reset_query();
}