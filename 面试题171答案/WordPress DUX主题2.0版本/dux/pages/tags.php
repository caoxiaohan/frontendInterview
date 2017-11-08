<?php 
/**
 * Template name: Tags
 * Description:   A tags page
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

		<div class="tag-clouds">
			<?php $tags_list = get_tags('orderby=count&order=DESC');
			if ($tags_list) { 
				foreach($tags_list as $tag) {
					echo '<a href="'.get_tag_link($tag).'">'. $tag->name .'<small>('. $tag->count .')</small></a>';
				} 
			} 
			?>
		</div>
	</div>
</div>

<?php

get_footer();