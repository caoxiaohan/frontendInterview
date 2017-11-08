<?php

get_header();

global $wp_query;
$curauth = $wp_query->get_queried_object();

?>

<section class="container">
	<div class="content-wrap">
	<div class="content">
		<?php 
		$pagedtext = '';
		if( $paged && $paged > 1 ){
			$pagedtext = ' <small>第'.$paged.'页</small>';
		}
		echo '<div class="pagetitle"><h1>'.$curauth->display_name.'的文章</h1>'.$pagedtext.'</div>';
		
		get_template_part( 'excerpt' );
		?>
	</div>
	</div>
	<?php get_sidebar() ?>
</section>

<?php get_footer(); ?>