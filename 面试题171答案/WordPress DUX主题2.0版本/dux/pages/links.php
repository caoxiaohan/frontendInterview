<?php 
/**
 * Template name: Links
 * Description:   A links page
 */

get_header();

?>

<div class="container container-page">
	<?php _moloader('mo_pagemenu', false) ?>
	<div class="content">
		<?php while (have_posts()) : the_post(); ?>
		<header class="article-header">
			<h1 class="article-title"><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></h1>
		</header>
		<article class="article-content">
			<?php the_content(); ?>
		</article>
		<?php endwhile;  ?>

		<ul class="plinks">
			<?php 
				$links_cat = _hui('page_links_cat');
				$links = array();
				if( $links_cat ){
					foreach ($links_cat as $key => $value) {
						if( $value ) $links[] = $key;
					}
				}

				$links = implode(',', $links);

				if( !empty($links) ){
					wp_list_bookmarks(array(
						'category' => $links
					)); 
				}
			?>
		</ul>

		<?php comments_template('', true); ?>
	</div>
</div>

<?php

get_footer();